import type { SxProps, Theme } from '@mui/material/styles';

import { colors } from '@Theme/colors';

export const createWeatherCardHeaderStyles = (_isDay: boolean) => {
  const headerBoxStyles: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2
  };

  const locationNameStyles: SxProps<Theme> = {
    fontWeight: 700,
    color: 'white'
  };

  const locationSubtitleStyles: SxProps<Theme> = {
    color: colors.weather.overlay.text.secondary
  };

  const conditionChipStyles: SxProps<Theme> = {
    backgroundColor: colors.weather.overlay.primary,
    color: colors.ui.white,
    fontWeight: 600,
    backdropFilter: 'blur(10px)'
  };

  return {
    headerBoxStyles,
    locationNameStyles,
    locationSubtitleStyles,
    conditionChipStyles
  };
};
