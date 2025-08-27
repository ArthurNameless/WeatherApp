import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colorHelpers, colors } from '@Theme/colors';
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
import type { WeatherResponse } from '@Types/weather';
import { weatherApiService } from '@Services/weatherApi';

interface WeatherCardProps {
  weatherData: WeatherResponse;
  showDetails?: boolean;
}

export function WeatherCard({ weatherData, showDetails = true }: WeatherCardProps) {
  const { t } = useTranslation();
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
        background: colorHelpers.weatherCardGradient(isDay),
        color: colors.ui.white,
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
            <Typography variant="subtitle1" sx={{ color: colors.weather.overlay.text.secondary }}>
              {location.region && location.region !== location.name ? `${location.region}, ` : ''}{location.country} • {formatDate(location.localtime)}
            </Typography>
          </Box>
          <Chip
            label={current.condition.text}
            sx={{
              backgroundColor: colors.weather.overlay.primary,
              color: colors.ui.white,
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
              backgroundColor: colors.weather.overlay.secondary,
              backdropFilter: 'blur(10px)'
            }}
          />
          <Box>
            <Typography variant="h2" component="div" sx={{ fontWeight: 300, lineHeight: 1 }}>
              {weatherApiService.formatTemperature(weatherApiService.getCurrentTemp(weatherData))}
            </Typography>
            <Typography variant="h6" sx={{ textTransform: 'capitalize', color: colors.weather.overlay.text.primary }}>
              {current.condition.text}
            </Typography>
          </Box>
        </Box>

        {/* Temperature Range */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Thermostat sx={{ color: colors.weather.overlay.text.muted }} />
            <Typography variant="body1">
              {t('weather.feelsLike')} {weatherApiService.formatTemperature(weatherApiService.getFeelsLikeTemp(weatherData))}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: colors.weather.overlay.text.muted }}>
            {t('weather.high')} {weatherApiService.formatTemperature(maxTemp)} 
            {t('weather.low')} {weatherApiService.formatTemperature(minTemp)}
          </Typography>
        </Box>

        {showDetails && (
          <>
            <Divider sx={{ backgroundColor: colors.weather.overlay.primary, mb: 3 }} />

            {/* Weather Details Grid */}
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                gap: 2 
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Air sx={{ fontSize: 24, mb: 1, color: colors.weather.overlay.text.muted }} />
                <Typography variant="body2" sx={{ color: colors.weather.overlay.text.muted }}>
                  {t('weather.details.windSpeed')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {weatherApiService.formatWindSpeed(current.wind_kph)}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.weather.overlay.text.subtle }}>
                  {current.wind_dir}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <WaterDrop sx={{ fontSize: 24, mb: 1, color: colors.weather.overlay.text.muted }} />
                <Typography variant="body2" sx={{ color: colors.weather.overlay.text.muted }}>
                  {t('weather.details.humidity')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {current.humidity}%
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Speed sx={{ fontSize: 24, mb: 1, color: colors.weather.overlay.text.muted }} />
                <Typography variant="body2" sx={{ color: colors.weather.overlay.text.muted }}>
                  {t('weather.details.pressure')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {weatherApiService.formatPressure(current.pressure_mb)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Visibility sx={{ fontSize: 24, mb: 1, color: colors.weather.overlay.text.muted }} />
                <Typography variant="body2" sx={{ color: colors.weather.overlay.text.muted }}>
                  {t('weather.details.visibility')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {weatherApiService.formatVisibility(current.vis_km)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Cloud sx={{ fontSize: 24, mb: 1, color: colors.weather.overlay.text.muted }} />
                <Typography variant="body2" sx={{ color: colors.weather.overlay.text.muted }}>
                  {t('weather.details.cloudCover')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {current.cloud}%
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <WbSunny sx={{ fontSize: 24, mb: 1, color: colors.weather.overlay.text.muted }} />
                <Typography variant="body2" sx={{ color: colors.weather.overlay.text.muted }}>
                  {t('weather.details.uvIndex')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {current.uv}
                </Typography>
              </Box>

              {/* Show sunrise/sunset only if forecast data is available */}
              {weatherData.forecast?.forecastday?.[0]?.astro && (
                <>
                  <Box sx={{ textAlign: 'center' }}>
                    <WbSunny sx={{ fontSize: 24, mb: 1, color: colors.weather.overlay.text.muted }} />
                    <Typography variant="body2" sx={{ color: colors.weather.overlay.text.muted }}>
                      {t('weather.details.sunrise')}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {sunrise}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <NightsStay sx={{ fontSize: 24, mb: 1, color: colors.weather.overlay.text.muted }} />
                    <Typography variant="body2" sx={{ color: colors.weather.overlay.text.muted }}>
                      {t('weather.details.sunset')}
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