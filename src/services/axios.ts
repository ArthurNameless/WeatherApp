import axios, { AxiosError, type AxiosResponse, type AxiosInstance } from 'axios';
import type { ApiError, WeatherApiConfig } from '@Types/weather';

// Configuration
const config: WeatherApiConfig = {
  apiKey: import.meta.env.VITE_WEATHER_API_KEY,
  baseUrl: 'https://api.weatherapi.com/v1',
  units: 'celsius'
};

// Helper function to handle API errors
const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const errorData = data as any;
    
    switch (status) {
      case 400:
        return {
          message: errorData?.error?.message || 'Bad request. Please check your input.',
          code: 'BAD_REQUEST',
          status
        };
      case 401:
        return {
          message: 'Invalid API key. Please check your configuration.',
          code: 'INVALID_API_KEY',
          status
        };
      case 403:
        return {
          message: 'API key quota exceeded or access forbidden.',
          code: 'ACCESS_FORBIDDEN',
          status
        };
      case 404:
        return {
          message: 'Location not found. Please check the spelling and try again.',
          code: 'LOCATION_NOT_FOUND',
          status
        };
      case 429:
        return {
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          status
        };
      case 500:
        return {
          message: 'Weather service is temporarily unavailable.',
          code: 'SERVER_ERROR',
          status
        };
      default:
        return {
          message: errorData?.error?.message || 'An unexpected error occurred.',
          code: 'API_ERROR',
          status
        };
    }
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error. Please check your internet connection.',
      code: 'NETWORK_ERROR'
    };
  } else {
    // Request setup error
    return {
      message: 'Failed to make request. Please try again.',
      code: 'REQUEST_ERROR'
    };
  }
}

// Create axios instance with configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.baseUrl,
  timeout: 10000,
  params: {
    key: config.apiKey
  }
});

// Setup interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API response received:`, response.status);
    return response;
  },
  (error: AxiosError) => {
    console.error('Response error:', error);
    return Promise.reject(handleApiError(error));
  }
);

// Export the instance and config for direct access
export { axiosInstance, config };