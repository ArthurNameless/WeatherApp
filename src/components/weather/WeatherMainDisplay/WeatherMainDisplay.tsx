import { Box, Typography, Avatar } from "@mui/material";
import type { WeatherResponse } from "@Types/weather";

import {
  getWeatherIconUrl,
  formatTemperature,
  getCurrentTemp,
} from "@Services/weatherApi";
import { createWeatherMainDisplayStyles } from "./WeatherMainDisplay.styles";

interface WeatherMainDisplayProps {
  current: WeatherResponse['current'];
  weatherData: WeatherResponse;
  isDay: boolean;
}

export function WeatherMainDisplay({
  current,
  weatherData,
  isDay,
}: WeatherMainDisplayProps) {
  const iconUrl = getWeatherIconUrl(current.condition.icon);
  const styles = createWeatherMainDisplayStyles(isDay);

  return (
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
  );
}
