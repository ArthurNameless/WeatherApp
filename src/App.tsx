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
import { useSearch } from "@Hooks/useSearch";
import { useSearchHistory } from "@Hooks/useSearchHistory";
import { createAppTheme } from "@Theme/theme";
import { getAppStyles } from "@Theme/appStyles";
import { syncCSSColors } from "@Theme/colorSync";
import type {
  SearchHistoryItem,
} from "@Types/weather";

function App() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const {
    data: weatherData,
    loading,
    error: weatherError,
    locationError,
    handleSearch,
    handleLocationSearch,
  } = useSearch();

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
    [removeFromHistory, t]
  );

  const handleHistoryItemRestore = useCallback(
    (itemId: string) => {
      restoreItem(itemId);
      setSnackbarMessage(t('notifications.itemRestored'));
      setSnackbarOpen(true);
    },
    [restoreItem, t]
  );

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setSnackbarMessage(t('notifications.historyCleared'));
    setSnackbarOpen(true);
  }, [clearHistory, t]);

  // Add successful search to history
  useEffect(() => {
    if (weatherData) {
      addToHistory(
        weatherData.location.name,
        weatherData.location.country,
        weatherData.location.region,
        weatherData
      );
    }
  }, [weatherData, addToHistory]);

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
              loading={loading}
              error={weatherError?.message || locationError}
              placeholder={t('search.placeholder')}
            />

            {/* Weather Display */}
            {weatherData && (
              <WeatherCard weatherData={weatherData} />
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
