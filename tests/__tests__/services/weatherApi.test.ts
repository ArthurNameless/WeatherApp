import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getForecast,
  formatTemperature,
  formatWindSpeed,
  formatPressure,
  formatVisibility,
  getWeatherIconUrl,
  formatTime,
  getCurrentTemp,
  getFeelsLikeTemp,
  getMinMaxTemp,
  getSunTimes
} from '@Services/weatherApi';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('WeatherApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock axios.create to return a mock instance
    const mockAxiosInstance = {
      get: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    };
    (mockedAxios.create as any).mockReturnValue(mockAxiosInstance);
  });

  describe('getCurrentWeather', () => {
    it('should fetch weather data successfully', async () => {
      const mockWeatherData = {
        location: {
          name: 'London',
          region: 'City of London, Greater London',
          country: 'United Kingdom',
          lat: 51.52,
          lon: -0.11,
          tz_id: 'Europe/London',
          localtime_epoch: 1609459200,
          localtime: '2021-01-01 12:00'
        },
        current: {
          last_updated_epoch: 1609459200,
          last_updated: '2021-01-01 12:00',
          temp_c: 20.0,
          temp_f: 68.0,
          is_day: 1,
          condition: {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
            code: 1000
          },
          wind_mph: 7.2,
          wind_kph: 11.5,
          wind_degree: 230,
          wind_dir: 'SW',
          pressure_mb: 1013.0,
          pressure_in: 29.91,
          precip_mm: 0.0,
          precip_in: 0.0,
          humidity: 60,
          cloud: 0,
          feelslike_c: 18.0,
          feelslike_f: 64.4,
          vis_km: 10.0,
          vis_miles: 6.0,
          uv: 5.0,
          gust_mph: 8.3,
          gust_kph: 13.3
        }
      };

      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.get = vi.fn().mockResolvedValue({ data: mockWeatherData });

      const result = await getCurrentWeather('London');
      
      expect(result).toEqual(mockWeatherData);
    });

    it('should handle API errors correctly', async () => {
      const mockAxiosInstance = mockedAxios.create();
      const mockError = {
        response: {
          status: 400,
          data: { 
            error: { 
              message: 'Parameter q is missing.' 
            } 
          }
        }
      };
      mockAxiosInstance.get = vi.fn().mockRejectedValue(mockError);

      await expect(getCurrentWeather('InvalidCity')).rejects.toMatchObject({
        message: 'Parameter q is missing.',
        code: 'BAD_REQUEST',
        status: 400
      });
    });

    it('should throw error for empty city name', async () => {
      await expect(getCurrentWeather('')).rejects.toThrow('City name is required');
    });

    it('should sanitize city name input', async () => {
      const mockWeatherData = { 
        location: { name: 'London' },
        current: { temp_c: 20 }
      };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.get = vi.fn().mockResolvedValue({ data: mockWeatherData });

      await expect(getCurrentWeather('London123!@#')).rejects.toThrow('Invalid city name format');
    });
  });

  describe('getCurrentWeatherByCoords', () => {
    it('should fetch weather data by coordinates successfully', async () => {
      const mockWeatherData = {
        location: {
          name: 'London',
          lat: 51.52,
          lon: -0.11
        },
        current: {
          temp_c: 20.0,
          condition: { text: 'Sunny' }
        }
      };

      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.get = vi.fn().mockResolvedValue({ data: mockWeatherData });

      const result = await getCurrentWeatherByCoords(51.52, -0.11);
      
      expect(result).toEqual(mockWeatherData);
    });

    it('should throw error for invalid coordinates', async () => {
      await expect(getCurrentWeatherByCoords(91, 0)).rejects.toThrow('Invalid coordinates provided');
      await expect(getCurrentWeatherByCoords(0, 181)).rejects.toThrow('Invalid coordinates provided');
    });
  });

  describe('getForecast', () => {
    it('should fetch forecast data successfully', async () => {
      const mockForecastData = {
        location: {
          name: 'London',
          country: 'United Kingdom'
        },
        current: {
          temp_c: 20.0,
          condition: { text: 'Sunny' }
        },
        forecast: {
          forecastday: [{
            date: '2021-01-01',
            day: {
              maxtemp_c: 25.0,
              mintemp_c: 15.0,
              condition: { text: 'Sunny' }
            },
            astro: {
              sunrise: '07:48 AM',
              sunset: '04:08 PM'
            }
          }]
        }
      };

      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.get = vi.fn().mockResolvedValue({ data: mockForecastData });

      const result = await getForecast('London', 1);
      
      expect(result).toEqual(mockForecastData);
    });

    it('should limit days to valid range', async () => {
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.get = vi.fn().mockResolvedValue({ data: {} });

      await getForecast('London', 15); // Should be limited to 10
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/forecast.json', {
        params: {
          q: 'London',
          days: 10, // Should be limited to 10
          aqi: 'no',
          alerts: 'no'
        }
      });
    });
  });

  describe('utility methods', () => {
    it('should format temperature correctly', () => {
      expect(formatTemperature(20.7)).toBe('21°C');
      expect(formatTemperature(-5.3)).toBe('-5°C');
    });

    it('should format wind speed correctly', () => {
      expect(formatWindSpeed(11.5)).toBe('12 km/h');
      expect(formatWindSpeed(0)).toBe('0 km/h');
    });

    it('should format pressure correctly', () => {
      expect(formatPressure(1013.25)).toBe('1013 mb');
    });

    it('should format visibility correctly', () => {
      expect(formatVisibility(10.5)).toBe('11 km');
    });

    it('should generate correct weather icon URL', () => {
      const iconUrl = getWeatherIconUrl('//cdn.weatherapi.com/weather/64x64/day/113.png');
      expect(iconUrl).toBe('https://cdn.weatherapi.com/weather/64x64/day/113.png');
    });

    it('should handle full icon URLs', () => {
      const fullUrl = 'https://cdn.weatherapi.com/weather/64x64/day/113.png';
      const iconUrl = getWeatherIconUrl(fullUrl);
      expect(iconUrl).toBe(fullUrl);
    });

    it('should format time correctly', () => {
      const timeString = '2021-01-01 15:30';
      const formattedTime = formatTime(timeString);
      expect(formattedTime).toMatch(/\d{1,2}:\d{2}/); // Should match time format
    });
  });

  describe('helper methods', () => {
    const mockWeatherData = {
      location: { name: 'London' },
      current: {
        temp_c: 20.0,
        temp_f: 68.0,
        feelslike_c: 18.0,
        feelslike_f: 64.4
      },
      forecast: {
        forecastday: [{
          day: {
            maxtemp_c: 25.0,
            maxtemp_f: 77.0,
            mintemp_c: 15.0,
            mintemp_f: 59.0
          },
          astro: {
            sunrise: '07:48 AM',
            sunset: '04:08 PM'
          }
        }]
      }
    };

    it('should get current temperature', () => {
      expect(getCurrentTemp(mockWeatherData as any)).toBe(20.0);
    });

    it('should get feels like temperature', () => {
      expect(getFeelsLikeTemp(mockWeatherData as any)).toBe(18.0);
    });

    it('should get min/max temperatures from forecast', () => {
      const { min, max } = getMinMaxTemp(mockWeatherData as any);
      expect(min).toBe(15.0);
      expect(max).toBe(25.0);
    });

    it('should get sunrise/sunset times', () => {
      const { sunrise, sunset } = getSunTimes(mockWeatherData as any);
      expect(sunrise).toBe('07:48 AM');
      expect(sunset).toBe('04:08 PM');
    });

    it('should handle missing forecast data', () => {
      const dataWithoutForecast = {
        current: { temp_c: 20.0, temp_f: 68.0 }
      };
      
      const { min, max } = getMinMaxTemp(dataWithoutForecast as any);
      expect(min).toBe(20.0);
      expect(max).toBe(20.0);

      const { sunrise, sunset } = getSunTimes(dataWithoutForecast as any);
      expect(sunrise).toBe('--:--');
      expect(sunset).toBe('--:--');
    });
  });
});