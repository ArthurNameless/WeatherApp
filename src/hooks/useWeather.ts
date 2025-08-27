import { useState, useCallback } from 'react';
import type { WeatherResponse, ApiError } from '@Types/weather';
import { getCurrentWeather, getCurrentWeatherByCoords } from '@Services/weatherApi';

interface UseWeatherState {
  data: WeatherResponse | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseWeatherReturn extends UseWeatherState {
  fetchWeather: (cityName: string) => Promise<void>;
  fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>;
  clearError: () => void;
  clearData: () => void;
}

export function useWeather(): UseWeatherReturn {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    loading: false,
    error: null
  });

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const clearData = () => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  };

  const fetchWeather = useCallback(async (cityName: string) => {
    if (!cityName.trim()) {
      setState(prev => ({
        ...prev,
        error: {
          message: 'Please enter a city name',
          code: 'VALIDATION_ERROR'
        }
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const weatherData = await getCurrentWeather(cityName);
      setState({
        data: weatherData,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as ApiError
      });
    }
  }, []);

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const weatherData = await getCurrentWeatherByCoords(lat, lon);
      setState({
        data: weatherData,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as ApiError
      });
    }
  }, []);

  return {
    ...state,
    fetchWeather,
    fetchWeatherByCoords,
    clearError,
    clearData
  };
}
