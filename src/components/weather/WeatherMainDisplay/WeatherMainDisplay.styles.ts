import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from '@Theme/colors';

export const createWeatherMainDisplayStyles = (_isDay: boolean) => {
  const mainWeatherBoxStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    mb: 3
  };

  const weatherIconStyles: SxProps<Theme> = {
    width: 80,
    height: 80,
    mr: 3,
    backgroundColor: colors.weather.overlay.secondary,
    backdropFilter: 'blur(10px)'
  };

  const temperatureStyles: SxProps<Theme> = {
    fontWeight: 300,
    lineHeight: 1
  };

  const conditionTextStyles: SxProps<Theme> = {
    textTransform: 'capitalize',
    color: colors.weather.overlay.text.primary
  };

  return {
    mainWeatherBoxStyles,
    weatherIconStyles,
    temperatureStyles,
    conditionTextStyles
  };
};
