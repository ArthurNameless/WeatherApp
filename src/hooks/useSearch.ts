import { useState, useCallback } from 'react';

import type { WeatherResponse, ApiError } from '@Types/weather';
import { getForecast } from '@Services/weatherApi';
import { useSearchHistory } from '@Hooks/useSearchHistory';

interface UseSearchState {
  data: WeatherResponse | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseSearchReturn extends UseSearchState {
  handleSearch: (cityName: string) => Promise<void>;
  clearError: () => void;
  clearData: () => void;
  // history API re-exposed from useSearchHistory
  searchHistory: ReturnType<typeof useSearchHistory>['searchHistory'];
  removedItems: ReturnType<typeof useSearchHistory>['removedItems'];
  addToHistory: ReturnType<typeof useSearchHistory>['addToHistory'];
  removeFromHistory: ReturnType<typeof useSearchHistory>['removeFromHistory'];
  restoreItem: ReturnType<typeof useSearchHistory>['restoreItem'];
  clearHistory: ReturnType<typeof useSearchHistory>['clearHistory'];
  getHistoryItem: ReturnType<typeof useSearchHistory>['getHistoryItem'];
}

export function useSearch(): UseSearchReturn {
  const [state, setState] = useState<UseSearchState>({
    data: null,
    loading: false,
    error: null
  });

  // wire up history hook
  const {
    searchHistory,
    removedItems,
    addToHistory,
    removeFromHistory,
    restoreItem,
    clearHistory,
    getHistoryItem,
  } = useSearchHistory();

  const clearError = () => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  };

  const clearData = () => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  };

  const handleSearch = useCallback(async (cityName: string) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      // Get forecast data to include sunrise/sunset and min/max temps
      const forecastData = await getForecast(cityName, 1);

      setState(prev => ({
        ...prev,
        data: forecastData,
        loading: false
      }));

      // Persist successful searches to history
      try {
        addToHistory(
          forecastData.location.name,
          forecastData.location.country,
          forecastData.location.region,
          forecastData
        );
      } catch {
        // non-fatal: history persistence shouldn't block UI
      }
    } catch (error) {
      console.error("Search failed:", error);
      setState(prev => ({
        ...prev,
        data: null,
        loading: false,
        error: error as ApiError
      }));
    }
  }, [addToHistory]);

  return {
    ...state,
    handleSearch,
    clearError,
    clearData,
    // expose history
    searchHistory,
    removedItems,
    addToHistory,
    removeFromHistory,
    restoreItem,
    clearHistory,
    getHistoryItem,
  };
}
