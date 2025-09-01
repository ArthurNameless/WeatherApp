import type { SxProps, Theme } from '@mui/material/styles';
import { colorHelpers, colors } from '@Theme/colors';

export const createWeatherCardStyles = (isDay: boolean) => {
  const cardStyles: SxProps<Theme> = {
    borderRadius: 3,
    background: colorHelpers.weatherCardGradient(isDay),
    color: colors.ui.white,
    overflow: 'visible',
    position: 'relative'
  };

  const cardContentStyles: SxProps<Theme> = {
    p: 3
  };

  const dividerStyles: SxProps<Theme> = {
    backgroundColor: colors.weather.overlay.primary,
    mb: 3
  };

  const detailsGridStyles: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
    gap: 2
  };

  const detailItemBoxStyles: SxProps<Theme> = {
    textAlign: 'center'
  };

  const detailIconStyles: SxProps<Theme> = {
    fontSize: 24,
    mb: 1,
    color: colors.weather.overlay.text.muted
  };

  const detailLabelStyles: SxProps<Theme> = {
    color: colors.weather.overlay.text.muted
  };

  const detailValueStyles: SxProps<Theme> = {
    fontWeight: 600
  };

  const detailSubtextStyles: SxProps<Theme> = {
    color: colors.weather.overlay.text.subtle
  };

  return {
    cardStyles,
    cardContentStyles,
    dividerStyles,
    detailsGridStyles,
    detailItemBoxStyles,
    detailIconStyles,
    detailLabelStyles,
    detailValueStyles,
    detailSubtextStyles
  };
};
