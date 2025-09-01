import { Box, Typography, Chip } from "@mui/material";
import type { WeatherResponse } from "@Types/weather";

import { getLocationDisplayString } from "@Utils/weatherUtils";
import { createWeatherCardHeaderStyles } from "./WeatherCardHeader.styles";

interface WeatherCardHeaderProps {
  location: WeatherResponse['location'];
  condition: WeatherResponse['current']['condition'];
  isDay: boolean;
}

export function WeatherCardHeader({
  location,
  condition,
  isDay,
}: WeatherCardHeaderProps) {
  const styles = createWeatherCardHeaderStyles(isDay);

  return (
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
        label={condition.text}
        sx={styles.conditionChipStyles}
      />
    </Box>
  );
}
