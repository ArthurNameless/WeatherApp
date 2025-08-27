import { useState, useCallback, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  Alert,
  Snackbar,
  Fab,
  useMediaQuery,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { SearchBox } from "./components/common/SearchBox";
import { WeatherCard } from "./components/weather/WeatherCard";
import { SearchHistory } from "./components/common/SearchHistory";
import { useWeather } from "./hooks/useWeather";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { weatherApiService } from "./services/weatherApi";
import type {
  SearchHistoryItem,
  WeatherResponse,
  ApiError,
} from "./types/weather";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const {
    data: weatherData,
    loading,
    error: weatherError,
    clearError,
  } = useWeather();

  // Local state setter for direct forecast API calls
  const [localWeatherData, setLocalWeatherData] =
    useState<WeatherResponse | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<ApiError | null>(null);

  // Use local state if available, otherwise use hook state
  const currentWeatherData = localWeatherData || weatherData;
  const currentLoading = localLoading || loading;
  const currentError = localError || weatherError;

  const {
    searchHistory,
    removedItems,
    addToHistory,
    removeFromHistory,
    restoreItem,
    clearHistory,
  } = useSearchHistory();

  // Initialize dark mode based on system preference
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2",
      },
      secondary: {
        main: darkMode ? "#f48fb1" : "#dc004e",
      },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  });

  const handleSearch = useCallback(
    async (cityName: string) => {
      clearError();
      setLocationError(null);
      setLocalError(null);
      setLocalLoading(true);

      try {
        // Get forecast data to include sunrise/sunset and min/max temps
        const forecastData = await weatherApiService.getForecast(cityName, 1);

        // Update the local weather state with forecast data
        setLocalWeatherData(forecastData);
        setLocalLoading(false);
      } catch (error) {
        console.error("Search failed:", error);
        setLocalWeatherData(null);
        setLocalLoading(false);
        setLocalError(error as ApiError);
      }
    },
    [clearError]
  );

  const handleLocationSearch = useCallback(() => {
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLocalLoading(true);
          setLocalError(null);
          const forecastData = await weatherApiService.getForecast(
            `${position.coords.latitude},${position.coords.longitude}`,
            1
          );
          setLocalWeatherData(forecastData);
          setLocalLoading(false);
        } catch (error) {
          setLocalLoading(false);
          setLocalError(error as ApiError);
          setLocationError("Failed to fetch weather for your location");
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied by user");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError(
              "An unknown error occurred while retrieving location"
            );
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  const handleHistoryItemClick = useCallback(
    (item: SearchHistoryItem) => {
      handleSearch(item.cityName);
    },
    [handleSearch]
  );

  const handleHistoryItemRemove = useCallback(
    (itemId: string) => {
      removeFromHistory(itemId);
      setSnackbarMessage("Item removed from history");
      setSnackbarOpen(true);
    },
    [removeFromHistory]
  );

  const handleHistoryItemRestore = useCallback(
    (itemId: string) => {
      restoreItem(itemId);
      setSnackbarMessage("Item restored to history");
      setSnackbarOpen(true);
    },
    [restoreItem]
  );

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setSnackbarMessage("Search history cleared");
    setSnackbarOpen(true);
  }, [clearHistory]);

  // Add successful search to history
  useEffect(() => {
    if (currentWeatherData) {
      addToHistory(
        currentWeatherData.location.name,
        currentWeatherData.location.country,
        currentWeatherData.location.region,
        currentWeatherData
      );
    }
  }, [currentWeatherData, addToHistory]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",

          background: darkMode
            ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4, maxWidth: 600, margin: "auto", border: "2px solid rgb(126, 124, 124)", borderRadius: 8 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                background: darkMode
                  ? "linear-gradient(45deg, #90caf9, #f48fb1)"
                  : "linear-gradient(45deg, #1976d2, #dc004e)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
                mb: 1,
              }}
            >
              Weather Forecast
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Get current weather information for any city worldwide
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Search Section */}
            <SearchBox
              onSearch={handleSearch}
              onLocationSearch={handleLocationSearch}
              loading={currentLoading}
              error={currentError?.message || locationError}
              placeholder="Enter city name (e.g., London, Tokyo, New York)"
            />

            {/* Weather Display */}
            {currentWeatherData && (
              <WeatherCard weatherData={currentWeatherData} />
            )}

            {/* Search History */}
            <SearchHistory
              searchHistory={searchHistory}
              removedItems={removedItems}
              onItemClick={handleHistoryItemClick}
              onItemRemove={handleHistoryItemRemove}
              onItemRestore={handleHistoryItemRestore}
              onClearHistory={handleClearHistory}
            />
          </Box>

          {/* Dark Mode Toggle */}
          <Fab
            color="primary"
            aria-label="toggle dark mode"
            onClick={toggleDarkMode}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
            }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </Fab>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
