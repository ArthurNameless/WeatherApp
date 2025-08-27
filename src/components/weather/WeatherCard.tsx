import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar
} from '@mui/material';
import {
  Thermostat,
  Air,
  Visibility,
  WaterDrop,
  Speed,
  WbSunny,
  NightsStay,
  Cloud
} from '@mui/icons-material';
import type { WeatherResponse } from '../../types/weather';
import { weatherApiService } from '../../services/weatherApi';

interface WeatherCardProps {
  weatherData: WeatherResponse;
  showDetails?: boolean;
}

export function WeatherCard({ weatherData, showDetails = true }: WeatherCardProps) {
  const {
    location,
    current
  } = weatherData;

  const iconUrl = weatherApiService.getWeatherIconUrl(current.condition.icon);
  const isDay = current.is_day === 1;
  const { min: minTemp, max: maxTemp } = weatherApiService.getMinMaxTemp(weatherData);
  const { sunrise, sunset } = weatherApiService.getSunTimes(weatherData);

  const formatDate = (localtime: string) => {
    try {
      const date = new Date(localtime);
      return date.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return new Date().toLocaleDateString();
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        background: isDay
          ? 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
          : 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
        color: 'white',
        overflow: 'visible',
        position: 'relative'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'white' }}>
              {location.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {location.region && location.region !== location.name ? `${location.region}, ` : ''}{location.country} • {formatDate(location.localtime)}
            </Typography>
          </Box>
          <Chip
            label={current.condition.text}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
              backdropFilter: 'blur(10px)'
            }}
          />
        </Box>

        {/* Main Weather Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={iconUrl}
            alt={current.condition.text}
            sx={{
              width: 80,
              height: 80,
              mr: 3,
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          />
          <Box>
            <Typography variant="h2" component="div" sx={{ fontWeight: 300, lineHeight: 1 }}>
              {weatherApiService.formatTemperature(weatherApiService.getCurrentTemp(weatherData))}
            </Typography>
            <Typography variant="h6" sx={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.9)' }}>
              {current.condition.text}
            </Typography>
          </Box>
        </Box>

        {/* Temperature Range */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Thermostat sx={{ color: 'rgba(255,255,255,0.7)' }} />
            <Typography variant="body1">
              Feels like {weatherApiService.formatTemperature(weatherApiService.getFeelsLikeTemp(weatherData))}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            H: {weatherApiService.formatTemperature(maxTemp)} 
            L: {weatherApiService.formatTemperature(minTemp)}
          </Typography>
        </Box>

        {showDetails && (
          <>
            <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mb: 3 }} />

            {/* Weather Details Grid */}
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                gap: 2 
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Air sx={{ fontSize: 24, mb: 1, color: 'rgba(255,255,255,0.7)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Wind Speed
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {weatherApiService.formatWindSpeed(current.wind_kph)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {current.wind_dir}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <WaterDrop sx={{ fontSize: 24, mb: 1, color: 'rgba(255,255,255,0.7)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Humidity
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {current.humidity}%
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Speed sx={{ fontSize: 24, mb: 1, color: 'rgba(255,255,255,0.7)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Pressure
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {weatherApiService.formatPressure(current.pressure_mb)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Visibility sx={{ fontSize: 24, mb: 1, color: 'rgba(255,255,255,0.7)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Visibility
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {weatherApiService.formatVisibility(current.vis_km)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Cloud sx={{ fontSize: 24, mb: 1, color: 'rgba(255,255,255,0.7)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Cloud Cover
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {current.cloud}%
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <WbSunny sx={{ fontSize: 24, mb: 1, color: 'rgba(255,255,255,0.7)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  UV Index
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {current.uv}
                </Typography>
              </Box>

              {/* Show sunrise/sunset only if forecast data is available */}
              {weatherData.forecast?.forecastday?.[0]?.astro && (
                <>
                  <Box sx={{ textAlign: 'center' }}>
                    <WbSunny sx={{ fontSize: 24, mb: 1, color: 'rgba(255,255,255,0.7)' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Sunrise
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {sunrise}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <NightsStay sx={{ fontSize: 24, mb: 1, color: 'rgba(255,255,255,0.7)' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Sunset
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {sunset}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}