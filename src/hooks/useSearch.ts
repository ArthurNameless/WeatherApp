import { useState, useCallback } from 'react';

import type { WeatherResponse, ApiError } from '@Types/weather';
import { getForecast } from '@Services/weatherApi';

interface UseSearchState {
  data: WeatherResponse | null;
  loading: boolean;
  error: ApiError | null;
  locationError: string | null;
}

interface UseSearchReturn extends UseSearchState {
  handleSearch: (cityName: string) => Promise<void>;
  clearError: () => void;
  clearData: () => void;
}

export function useSearch(): UseSearchReturn {
  const [state, setState] = useState<UseSearchState>({
    data: null,
    loading: false,
    error: null,
    locationError: null
  });

  const clearError = () => {
    setState(prev => ({
      ...prev,
      error: null,
      locationError: null
    }));
  };

  const clearData = () => {
    setState({
      data: null,
      loading: false,
      error: null,
      locationError: null
    });
  };

  const handleSearch = useCallback(async (cityName: string) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      locationError: null
    }));

    try {
      // Get forecast data to include sunrise/sunset and min/max temps
      const forecastData = await getForecast(cityName, 1);

      setState(prev => ({
        ...prev,
        data: forecastData,
        loading: false
      }));
    } catch (error) {
      console.error("Search failed:", error);
      setState(prev => ({
        ...prev,
        data: null,
        loading: false,
        error: error as ApiError
      }));
    }
  }, []);

  return {
    ...state,
    handleSearch,
    clearError,
    clearData
  };
}
