import { useState, useCallback, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import {
  ThemeProvider,
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
import { SearchBox } from "@Components/common/SearchBox";
import { WeatherCard } from "@Components/weather/WeatherCard";
import { SearchHistory } from "@Components/common/SearchHistory";
import { useWeather } from "@Hooks/useWeather";
import { useSearchHistory } from "@Hooks/useSearchHistory";
import { weatherApiService } from "@Services/weatherApi";
import { createAppTheme } from "@Theme/theme";
import { getAppStyles } from "@Theme/appStyles";
import { syncCSSColors } from "@Theme/colorSync";
import type {
  SearchHistoryItem,
  WeatherResponse,
  ApiError,
} from "@Types/weather";

function App() {
  const { t } = useTranslation();
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

  // Sync CSS colors when dark mode changes
  useEffect(() => {
    syncCSSColors(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const theme = createAppTheme(darkMode);
  const styles = getAppStyles(darkMode);

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
      setLocationError(t('search.errors.geolocationNotSupported'));
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
          setLocationError(t('search.errors.locationFailed'));
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(t('search.errors.permissionDenied'));
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(t('search.errors.positionUnavailable'));
            break;
          case error.TIMEOUT:
            setLocationError(t('search.errors.timeout'));
            break;
          default:
            setLocationError(t('search.errors.unknownLocationError'));
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
      setSnackbarMessage(t('notifications.itemRemoved'));
      setSnackbarOpen(true);
    },
    [removeFromHistory]
  );

  const handleHistoryItemRestore = useCallback(
    (itemId: string) => {
      restoreItem(itemId);
      setSnackbarMessage(t('notifications.itemRestored'));
      setSnackbarOpen(true);
    },
    [restoreItem]
  );

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setSnackbarMessage(t('notifications.historyCleared'));
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
      <Box sx={styles.mainContainer}>
        <Container maxWidth="lg" sx={styles.contentContainer}>
          {/* Header */}
          <Box sx={styles.headerContainer}>
            <Typography
              variant="h2"
              component="h1"
              sx={styles.headerTitle(darkMode)}
            >
              {t('app.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {t('app.subtitle')}
            </Typography>
          </Box>

          <Box sx={styles.mainContentContainer}>
            {/* Search Section */}
            <SearchBox
              onSearch={handleSearch}
              onLocationSearch={handleLocationSearch}
              loading={currentLoading}
              error={currentError?.message || locationError}
              placeholder={t('search.placeholder')}
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
            aria-label={t('app.darkModeToggle')}
            onClick={toggleDarkMode}
            sx={styles.darkModeToggle}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </Fab>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={styles.snackbarAnchor}
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
