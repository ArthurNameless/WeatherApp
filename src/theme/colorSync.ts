import { colors, type ColorMode } from './colors';

/**
 * Utility to sync CSS custom properties with TypeScript color system
 * This allows CSS to use colors defined in the TypeScript color system
 */
export const syncCSSColors = (mode: ColorMode = 'light') => {
  const root = document.documentElement;
  
  // Update CSS custom properties based on current theme mode
  root.style.setProperty('--color-link-default', colors.ui.link.default);
  root.style.setProperty('--color-link-hover-light', colors.ui.link.hover.light);
  root.style.setProperty('--color-link-hover-dark', colors.ui.link.hover.dark);
  root.style.setProperty('--color-button-bg-light', colors.ui.button.background.light);
  root.style.setProperty('--color-button-bg-dark', colors.ui.button.background.dark);
  root.style.setProperty('--color-button-border-hover', colors.ui.button.border.hover);
  root.style.setProperty('--color-text-light', colors.ui.text.light);
  root.style.setProperty('--color-bg-light', colors.background.paper.light);
  
  // Set current mode-specific colors
  root.style.setProperty('--current-text-color', colors.ui.text[mode]);
  root.style.setProperty('--current-bg-color', colors.background.default[mode]);
  root.style.setProperty('--current-paper-color', colors.background.paper[mode]);
  root.style.setProperty('--current-primary-color', colors.primary[mode]);
  root.style.setProperty('--current-secondary-color', colors.secondary[mode]);
};

/**
 * Initialize CSS color synchronization
 * Call this when the app starts or when theme changes
 */
export const initializeCSSColors = () => {
  // Detect initial theme preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  syncCSSColors(prefersDark ? 'dark' : 'light');
  
  // Listen for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    syncCSSColors(e.matches ? 'dark' : 'light');
  });
};

export default syncCSSColors;
