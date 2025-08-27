import { createTheme } from "@mui/material";
import { colorHelpers } from './colors';

export const createAppTheme = (darkMode: boolean) => {
  const mode = darkMode ? 'dark' : 'light';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: colorHelpers.primary(mode),
      },
      secondary: {
        main: colorHelpers.secondary(mode),
      },
      background: {
        default: colorHelpers.background(mode),
        paper: colorHelpers.paper(mode),
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  });
};
