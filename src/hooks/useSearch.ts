import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
  handleLocationSearch: () => void;
  clearError: () => void;
  clearData: () => void;
}

export function useSearch(): UseSearchReturn {
  const { t } = useTranslation();
  
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

  const handleLocationSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      locationError: null
    }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        locationError: t('search.errors.geolocationNotSupported')
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setState(prev => ({
            ...prev,
            loading: true,
            error: null
          }));

          const forecastData = await getForecast(
            `${position.coords.latitude},${position.coords.longitude}`,
            1
          );

          setState(prev => ({
            ...prev,
            data: forecastData,
            loading: false
          }));
        } catch (error) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error as ApiError,
            locationError: t('search.errors.locationFailed')
          }));
        }
      },
      (error) => {
        let locationError: string;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            locationError = t('search.errors.permissionDenied');
            break;
          case error.POSITION_UNAVAILABLE:
            locationError = t('search.errors.positionUnavailable');
            break;
          case error.TIMEOUT:
            locationError = t('search.errors.timeout');
            break;
          default:
            locationError = t('search.errors.unknownLocationError');
            break;
        }

        setState(prev => ({
          ...prev,
          locationError
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, [t]);

  return {
    ...state,
    handleSearch,
    handleLocationSearch,
    clearError,
    clearData
  };
}
