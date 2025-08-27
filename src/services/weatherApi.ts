import axios, { AxiosError, type AxiosResponse } from 'axios';
import type { WeatherResponse, ApiError, WeatherApiConfig } from '../types/weather';

class WeatherApiService {
  private config: WeatherApiConfig;
  private axiosInstance;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_WEATHER_API_KEY || 'b4aee53d9f3841a5be0123646252608',
      baseUrl: 'https://api.weatherapi.com/v1',
      units: 'celsius'
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 10000,
      params: {
        key: this.config.apiKey
      }
    });

    // Request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`Making API request to: ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API response received:`, response.status);
        return response;
      },
      (error: AxiosError) => {
        console.error('Response error:', error);
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: AxiosError): ApiError {
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

  private validateApiKey(): void {
    if (!this.config.apiKey) {
      throw new Error('Weather API key is required. Please set VITE_WEATHER_API_KEY environment variable.');
    }
  }

  private sanitizeCityName(cityName: string): string {
    return cityName.trim().replace(/[^a-zA-Z\s,.-]/g, '');
  }

  async getCurrentWeather(cityName: string): Promise<WeatherResponse> {
    this.validateApiKey();
    
    if (!cityName || cityName.trim().length === 0) {
      throw new Error('City name is required');
    }

    const sanitizedCityName = this.sanitizeCityName(cityName);
    
    if (sanitizedCityName.length === 0) {
      throw new Error('Invalid city name format');
    }

    try {
      const response = await this.axiosInstance.get<WeatherResponse>('/current.json', {
        params: {
          q: sanitizedCityName,
          aqi: 'no' // We don't need air quality data for this app
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherResponse> {
    this.validateApiKey();

    if (!lat || !lon || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new Error('Invalid coordinates provided');
    }

    try {
      const response = await this.axiosInstance.get<WeatherResponse>('/current.json', {
        params: {
          q: `${lat},${lon}`,
          aqi: 'no'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      throw error;
    }
  }

  async getForecast(cityName: string, days: number = 1): Promise<WeatherResponse> {
    this.validateApiKey();
    
    if (!cityName || cityName.trim().length === 0) {
      throw new Error('City name is required');
    }

    const sanitizedCityName = this.sanitizeCityName(cityName);
    
    if (sanitizedCityName.length === 0) {
      throw new Error('Invalid city name format');
    }

    // Limit days to valid range (1-10)
    const validDays = Math.min(Math.max(days, 1), 10);

    try {
      const response = await this.axiosInstance.get<WeatherResponse>('/forecast.json', {
        params: {
          q: sanitizedCityName,
          days: validDays,
          aqi: 'no',
          alerts: 'no'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  }

  getWeatherIconUrl(iconCode: string): string {
    // WeatherAPI.com provides full URLs for icons
    if (iconCode.startsWith('http')) {
      return iconCode;
    }
    // If it's just the icon path, prepend the base URL
    return `https:${iconCode}`;
  }

  formatTemperature(temp: number): string {
    if (this.config.units === 'fahrenheit') {
      return `${Math.round(temp)}°F`;
    }
    return `${Math.round(temp)}°C`;
  }

  formatWindSpeed(speed: number): string {
    // WeatherAPI provides wind speed in kph and mph
    // We'll use kph as default since it's metric
    return `${Math.round(speed)} km/h`;
  }

  formatPressure(pressure: number): string {
    // WeatherAPI provides pressure in mb (millibars)
    return `${Math.round(pressure)} mb`;
  }

  formatVisibility(visibility: number): string {
    // WeatherAPI provides visibility in km
    return `${Math.round(visibility)} km`;
  }

  formatTime(timeString: string): string {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  }

  // Helper method to get current temperature based on units
  getCurrentTemp(weatherData: WeatherResponse): number {
    return this.config.units === 'fahrenheit' 
      ? weatherData.current.temp_f 
      : weatherData.current.temp_c;
  }

  // Helper method to get feels like temperature
  getFeelsLikeTemp(weatherData: WeatherResponse): number {
    return this.config.units === 'fahrenheit' 
      ? weatherData.current.feelslike_f 
      : weatherData.current.feelslike_c;
  }

  // Helper method to get min/max temperatures from forecast
  getMinMaxTemp(weatherData: WeatherResponse): { min: number; max: number } {
    if (!weatherData.forecast?.forecastday?.[0]) {
      // If no forecast data, use current temp for both
      const currentTemp = this.getCurrentTemp(weatherData);
      return { min: currentTemp, max: currentTemp };
    }

    const today = weatherData.forecast.forecastday[0].day;
    return this.config.units === 'fahrenheit'
      ? { min: today.mintemp_f, max: today.maxtemp_f }
      : { min: today.mintemp_c, max: today.maxtemp_c };
  }

  // Helper method to get sunrise/sunset from forecast
  getSunTimes(weatherData: WeatherResponse): { sunrise: string; sunset: string } {
    if (!weatherData.forecast?.forecastday?.[0]?.astro) {
      return { sunrise: '--:--', sunset: '--:--' };
    }

    const astro = weatherData.forecast.forecastday[0].astro;
    return {
      sunrise: astro.sunrise,
      sunset: astro.sunset
    };
  }
}

// Export singleton instance
export const weatherApiService = new WeatherApiService();
export default weatherApiService;