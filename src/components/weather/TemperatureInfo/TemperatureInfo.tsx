import { Box, Typography } from "@mui/material";
import { Thermostat } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import type { WeatherResponse } from "@Types/weather";
import {
  formatTemperature,
  getFeelsLikeTemp,
  getMinMaxTemp,
} from "@Services/weatherApi";
import { createTemperatureInfoStyles } from "./TemperatureInfo.styles";

interface TemperatureInfoProps {
  weatherData: WeatherResponse;
  isDay: boolean;
}

export function TemperatureInfo({
  weatherData,
  isDay,
}: TemperatureInfoProps) {
  const { t } = useTranslation();
  const { min: minTemp, max: maxTemp } = getMinMaxTemp(weatherData);
  const styles = createTemperatureInfoStyles(isDay);

  return (
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
  );
}
