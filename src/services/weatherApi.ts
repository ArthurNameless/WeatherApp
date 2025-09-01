import type { WeatherResponse } from '@Types/weather';
import { axiosInstance, config } from './axios';

// Helper function to sanitize city names
const sanitizeCityName = (cityName: string): string => {
  return cityName.trim().replace(/[^a-zA-Z\s,.-]/g, '');
};

// API Functions
export const getCurrentWeather = async (cityName: string): Promise<WeatherResponse> => {
  
  if (!cityName || cityName.trim().length === 0) {
    throw new Error('City name is required');
  }

  const sanitizedCityName = sanitizeCityName(cityName);
  
  if (sanitizedCityName.length === 0) {
    throw new Error('Invalid city name format');
  }

  try {
    const response = await axiosInstance.get<WeatherResponse>('/current.json', {
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



export const getForecast = async (cityName: string, days: number = 1): Promise<WeatherResponse> => {
  
  if (!cityName || cityName.trim().length === 0) {
    throw new Error('City name is required');
  }

  const sanitizedCityName = sanitizeCityName(cityName);
  
  if (sanitizedCityName.length === 0) {
    throw new Error('Invalid city name format');
  }

  // Limit days to valid range (1-10)
  const validDays = Math.min(Math.max(days, 1), 10);

  try {
    const response = await axiosInstance.get<WeatherResponse>('/forecast.json', {
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

// Utility Functions
export const getWeatherIconUrl = (iconCode: string): string => {
  // WeatherAPI.com provides full URLs for icons
  if (iconCode.startsWith('http')) {
    return iconCode;
  }
  // If it's just the icon path, prepend the base URL
  return `https:${iconCode}`;
}

export const formatTemperature = (temp: number): string => {
  if (config.units === 'fahrenheit') {
    return `${Math.round(temp)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export const formatWindSpeed = (speed: number): string => {
  // WeatherAPI provides wind speed in kph and mph
  // We'll use kph as default since it's metric
  return `${Math.round(speed)} km/h`;
}

export const formatPressure = (pressure: number): string => {
  // WeatherAPI provides pressure in mb (millibars)
  return `${Math.round(pressure)} mb`;
}

export const formatVisibility = (visibility: number): string => {
  // WeatherAPI provides visibility in km
  return `${Math.round(visibility)} km`;
}

export const formatTime = (timeString: string): string => {
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

// Helper function to get current temperature based on units
export const getCurrentTemp = (weatherData: WeatherResponse): number => {
  return config.units === 'fahrenheit' 
    ? weatherData.current.temp_f 
    : weatherData.current.temp_c;
}

// Helper function to get feels like temperature
export const getFeelsLikeTemp = (weatherData: WeatherResponse): number => {
  return config.units === 'fahrenheit' 
    ? weatherData.current.feelslike_f 
    : weatherData.current.feelslike_c;
}

// Helper function to get min/max temperatures from forecast
export const getMinMaxTemp = (weatherData: WeatherResponse): { min: number; max: number } => {
  if (!weatherData.forecast?.forecastday?.[0]) {
    // If no forecast data, use current temp for both
    const currentTemp = getCurrentTemp(weatherData);
    return { min: currentTemp, max: currentTemp };
  }

  const today = weatherData.forecast.forecastday[0].day;
  return config.units === 'fahrenheit'
    ? { min: today.mintemp_f, max: today.maxtemp_f }
    : { min: today.mintemp_c, max: today.maxtemp_c };
}

// Helper function to get sunrise/sunset from forecast
export const getSunTimes = (weatherData: WeatherResponse): { sunrise: string; sunset: string } => {
  if (!weatherData.forecast?.forecastday?.[0]?.astro) {
    return { sunrise: '--:--', sunset: '--:--' };
  }

  const astro = weatherData.forecast.forecastday[0].astro;
  return {
    sunrise: astro.sunrise,
    sunset: astro.sunset
  };
}

// For backward compatibility, export all functions as a single object
export const weatherApi = {
  getCurrentWeather,
  getForecast,
  getWeatherIconUrl,
  formatTemperature,
  formatWindSpeed,
  formatPressure,
  formatVisibility,
  formatTime,
  getCurrentTemp,
  getFeelsLikeTemp,
  getMinMaxTemp,
  getSunTimes
};

export default weatherApi;