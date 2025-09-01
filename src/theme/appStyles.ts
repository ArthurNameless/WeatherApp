import type { SxProps, Theme } from "@mui/material";

import { colorHelpers, colors } from './colors';

export const getAppStyles = (darkMode: boolean) => {
  const mode = darkMode ? 'dark' : 'light';
  
  return {
    mainContainer: {
      minHeight: "100vh",
      width: "100%",
      background: colorHelpers.mainGradient(mode),
    } as SxProps<Theme>,

    contentContainer: {
      py: 4,
      maxWidth: 600,
      margin: "auto",
      border: `2px solid ${colors.ui.border}`,
      borderRadius: 8,
    } as SxProps<Theme>,

    headerTitle: (darkMode: boolean) => ({
      fontWeight: 700,
      background: colorHelpers.headerGradient(darkMode ? 'dark' : 'light'),
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textAlign: "center",
      mb: 1,
    } as SxProps<Theme>),

    headerContainer: {
      textAlign: "center",
      mb: 4,
    } as SxProps<Theme>,

    mainContentContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 3,
    } as SxProps<Theme>,

    darkModeToggle: {
      position: "fixed",
      bottom: 24,
      right: 24,
    } as SxProps<Theme>,

    snackbarAnchor: {
      vertical: "bottom" as const,
      horizontal: "center" as const,
    },
  };
};
