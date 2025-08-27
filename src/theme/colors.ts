// Color System for Weather App
// Centralized color definitions for consistent theming across the application

export const colors = {
  // Primary colors
  primary: {
    light: '#1976d2',
    dark: '#90caf9',
  },
  
  // Secondary colors
  secondary: {
    light: '#dc004e',
    dark: '#f48fb1',
  },
  
  // Background colors
  background: {
    default: {
      light: '#f5f5f5',
      dark: '#121212',
    },
    paper: {
      light: '#ffffff',
      dark: '#1e1e1e',
    },
    gradient: {
      main: {
        light: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        dark: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      },
      header: {
        light: 'linear-gradient(45deg, #1976d2, #dc004e)',
        dark: 'linear-gradient(45deg, #90caf9, #f48fb1)',
      },
    },
  },
  
  // Weather card colors
  weather: {
    card: {
      day: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      night: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
    },
    overlay: {
      primary: 'rgba(255,255,255,0.2)',
      secondary: 'rgba(255,255,255,0.1)',
      text: {
        primary: 'rgba(255,255,255,0.9)',
        secondary: 'rgba(255,255,255,0.8)',
        muted: 'rgba(255,255,255,0.7)',
        subtle: 'rgba(255,255,255,0.6)',
      },
    },
  },
  
  // Common UI colors
  ui: {
    white: '#ffffff',
    border: 'rgb(126, 124, 124)',
    link: {
      default: '#646cff',
      hover: {
        light: '#747bff',
        dark: '#535bf2',
      },
    },
    button: {
      background: {
        light: '#f9f9f9',
        dark: '#1a1a1a',
      },
      border: {
        hover: '#646cff',
      },
    },
    text: {
      light: '#213547',
      dark: '#ffffff',
    },
  },
  
  // Utility function to get color based on theme mode
  getColor: (colorPath: string, mode: 'light' | 'dark' = 'light') => {
    const keys = colorPath.split('.');
    let current: any = colors;
    
    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        return colorPath; // Return original if path not found
      }
    }
    
    // If the current value is an object with light/dark keys, return the appropriate one
    if (typeof current === 'object' && current.light && current.dark) {
      return current[mode];
    }
    
    return current;
  },
} as const;

// Type definitions for color paths
export type ColorMode = 'light' | 'dark';

// Helper functions for common color operations
export const colorHelpers = {
  // Get primary color for current mode
  primary: (mode: ColorMode) => colors.primary[mode],
  
  // Get secondary color for current mode
  secondary: (mode: ColorMode) => colors.secondary[mode],
  
  // Get background color for current mode
  background: (mode: ColorMode) => colors.background.default[mode],
  
  // Get paper color for current mode
  paper: (mode: ColorMode) => colors.background.paper[mode],
  
  // Get main gradient for current mode
  mainGradient: (mode: ColorMode) => colors.background.gradient.main[mode],
  
  // Get header gradient for current mode
  headerGradient: (mode: ColorMode) => colors.background.gradient.header[mode],
  
  // Get weather card gradient based on time of day
  weatherCardGradient: (isDay: boolean) => 
    isDay ? colors.weather.card.day : colors.weather.card.night,
  
  // Get text color for current mode
  textColor: (mode: ColorMode) => colors.ui.text[mode],
  
  // Get link hover color for current mode
  linkHover: (mode: ColorMode) => colors.ui.link.hover[mode],
  
  // Get button background for current mode
  buttonBackground: (mode: ColorMode) => colors.ui.button.background[mode],
};

export default colors;
