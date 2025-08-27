import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  Thermostat,
} from "@mui/icons-material";

import type { WeatherResponse } from "@Types/weather";
import {
  getWeatherIconUrl,
  formatTemperature,
  getCurrentTemp,
  getFeelsLikeTemp,
  getMinMaxTemp,
  getSunTimes,
} from "@Services/weatherApi";
import { getLocationDisplayString } from "@Utils/weatherUtils";
import { createWeatherCardStyles } from "./WeatherCard.styles";
import { WeatherDetails } from "./WeatherDetails";

interface WeatherCardProps {
  weatherData: WeatherResponse;
  showDetails?: boolean;
}

export function WeatherCard({
  weatherData,
  showDetails = true,
}: WeatherCardProps) {
  const { t } = useTranslation();
  const { location, current } = weatherData;

  const iconUrl = getWeatherIconUrl(current.condition.icon);
  const isDay = current.is_day === 1;
  const { min: minTemp, max: maxTemp } = getMinMaxTemp(weatherData);
  const { sunrise, sunset } = getSunTimes(weatherData);

  const styles = createWeatherCardStyles(isDay);

  return (
    <Card elevation={3} sx={styles.cardStyles}>
      <CardContent sx={styles.cardContentStyles}>
        {/* Header */}
        <Box sx={styles.headerBoxStyles}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={styles.locationNameStyles}
            >
              {location.name}
            </Typography>
            <Typography variant="subtitle1" sx={styles.locationSubtitleStyles}>
              {getLocationDisplayString(location)}
            </Typography>
          </Box>
          <Chip
            label={current.condition.text}
            sx={styles.conditionChipStyles}
          />
        </Box>

        {/* Main Weather Info */}
        <Box sx={styles.mainWeatherBoxStyles}>
          <Avatar
            src={iconUrl}
            alt={current.condition.text}
            sx={styles.weatherIconStyles}
          />
          <Box>
            <Typography
              variant="h2"
              component="div"
              sx={styles.temperatureStyles}
            >
              {formatTemperature(getCurrentTemp(weatherData))}
            </Typography>
            <Typography variant="h6" sx={styles.conditionTextStyles}>
              {current.condition.text}
            </Typography>
          </Box>
        </Box>

        {/* Temperature Range */}
        <Box sx={styles.temperatureRangeBoxStyles}>
          <Box sx={styles.feelsLikeBoxStyles}>
            <Thermostat sx={styles.thermostatIconStyles} />
            <Typography variant="body1">
              {t("weather.feelsLike")}{" "}
              {formatTemperature(getFeelsLikeTemp(weatherData))}
            </Typography>
          </Box>
          <Typography variant="body1" sx={styles.temperatureRangeTextStyles}>
            {t("weather.high")} {formatTemperature(maxTemp)}
            {t("weather.low")} {formatTemperature(minTemp)}
          </Typography>
        </Box>

        {/* Weather Details Grid */}
        <WeatherDetails
          current={current}
          weatherData={weatherData}
          sunrise={sunrise}
          sunset={sunset}
          showDetails={showDetails}
          styles={{
            dividerStyles: styles.dividerStyles,
            detailsGridStyles: styles.detailsGridStyles,
            detailItemBoxStyles: styles.detailItemBoxStyles,
            detailIconStyles: styles.detailIconStyles,
            detailLabelStyles: styles.detailLabelStyles,
            detailValueStyles: styles.detailValueStyles,
            detailSubtextStyles: styles.detailSubtextStyles,
          }}
        />
      </CardContent>
    </Card>
  );
}
