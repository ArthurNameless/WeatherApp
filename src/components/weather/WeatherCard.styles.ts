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
    headerBoxStyles,
    locationNameStyles,
    locationSubtitleStyles,
    conditionChipStyles,
    mainWeatherBoxStyles,
    weatherIconStyles,
    temperatureStyles,
    conditionTextStyles,
    temperatureRangeBoxStyles,
    feelsLikeBoxStyles,
    thermostatIconStyles,
    temperatureRangeTextStyles,
    dividerStyles,
    detailsGridStyles,
    detailItemBoxStyles,
    detailIconStyles,
    detailLabelStyles,
    detailValueStyles,
    detailSubtextStyles
  };
};
