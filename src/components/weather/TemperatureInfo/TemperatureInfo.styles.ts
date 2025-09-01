import type { SxProps, Theme } from '@mui/material/styles';

import { colors } from '@Theme/colors';

export const createTemperatureInfoStyles = (_isDay: boolean) => {
  const temperatureRangeBoxStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    mb: 3,
    gap: 2
  };

  const feelsLikeBoxStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1
  };

  const thermostatIconStyles: SxProps<Theme> = {
    color: colors.weather.overlay.text.muted
  };

  const temperatureRangeTextStyles: SxProps<Theme> = {
    color: colors.weather.overlay.text.muted
  };

  return {
    temperatureRangeBoxStyles,
    feelsLikeBoxStyles,
    thermostatIconStyles,
    temperatureRangeTextStyles
  };
};
