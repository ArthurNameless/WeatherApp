# Color System Documentation

This document describes the centralized color system implemented in the Weather App.

## Structure

```
src/theme/
├── colors.ts         # Main color definitions and utilities
├── colorSync.ts      # CSS custom properties synchronization
├── theme.ts          # Material-UI theme configuration
├── appStyles.ts      # Application-specific styles
└── README.md         # This documentation
```

## Color System (`colors.ts`)

### Organization

Colors are organized into logical groups:

- **Primary/Secondary**: Main brand colors with light/dark variants
- **Background**: App backgrounds, paper surfaces, and gradients
- **Weather**: Weather card specific colors and overlays
- **UI**: Common interface elements (links, buttons, text, borders)

### Usage

```typescript
import { colors, colorHelpers } from '@Theme/colors';

// Direct access
const primaryColor = colors.primary.light;
const weatherOverlay = colors.weather.overlay.primary;

// Helper functions
const primaryColor = colorHelpers.primary('light');
const cardGradient = colorHelpers.weatherCardGradient(true); // true = day time
```

### Helper Functions

- `colorHelpers.primary(mode)` - Get primary color for theme mode
- `colorHelpers.secondary(mode)` - Get secondary color for theme mode
- `colorHelpers.background(mode)` - Get background color for theme mode
- `colorHelpers.paper(mode)` - Get paper color for theme mode
- `colorHelpers.mainGradient(mode)` - Get main background gradient
- `colorHelpers.headerGradient(mode)` - Get header text gradient
- `colorHelpers.weatherCardGradient(isDay)` - Get weather card gradient
- `colorHelpers.textColor(mode)` - Get text color for theme mode

## CSS Integration (`colorSync.ts`)

The color system integrates with CSS through custom properties that are automatically synchronized.

### CSS Custom Properties

Available CSS variables:
- `--color-link-default`
- `--color-link-hover-light`
- `--color-link-hover-dark`
- `--color-button-bg-light`
- `--color-button-bg-dark`
- `--color-button-border-hover`
- `--color-text-light`
- `--color-bg-light`
- `--current-text-color`
- `--current-bg-color`
- `--current-paper-color`
- `--current-primary-color`
- `--current-secondary-color`

### Usage in CSS

```css
.my-element {
  color: var(--current-text-color);
  background-color: var(--current-bg-color);
  border-color: var(--color-button-border-hover);
}
```

## Material-UI Integration (`theme.ts`)

The Material-UI theme automatically uses colors from the centralized system:

```typescript
import { colorHelpers } from './colors';

export const createAppTheme = (darkMode: boolean) => {
  const mode = darkMode ? 'dark' : 'light';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: colorHelpers.primary(mode),
      },
      // ... other colors
    },
  });
};
```

## Application Styles (`appStyles.ts`)

App-specific styles use the color system for consistency:

```typescript
import { colorHelpers, colors } from './colors';

export const getAppStyles = (darkMode: boolean) => {
  const mode = darkMode ? 'dark' : 'light';
  
  return {
    mainContainer: {
      background: colorHelpers.mainGradient(mode),
    },
    // ... other styles
  };
};
```

## Adding New Colors

1. **Add to color system** (`colors.ts`):
   ```typescript
   export const colors = {
     // existing colors...
     newCategory: {
       newColor: {
         light: '#somecolor',
         dark: '#anothercolor',
       },
     },
   };
   ```

2. **Add helper function** (if needed):
   ```typescript
   export const colorHelpers = {
     // existing helpers...
     newColorHelper: (mode: ColorMode) => colors.newCategory.newColor[mode],
   };
   ```

3. **Add CSS custom property** (if needed for CSS usage):
   ```typescript
   // In colorSync.ts
   export const syncCSSColors = (mode: ColorMode = 'light') => {
     // existing properties...
     root.style.setProperty('--new-color', colors.newCategory.newColor[mode]);
   };
   ```

## Best Practices

1. **Use helpers over direct access** when possible for better maintainability
2. **Always consider both light and dark modes** when adding colors
3. **Use semantic naming** that describes the purpose, not the appearance
4. **Test color combinations** for accessibility and contrast
5. **Document new colors** and their intended usage
6. **Use TypeScript** for type safety and better developer experience

## Migration from Hardcoded Colors

When updating existing components:

1. **Identify hardcoded colors** in the component
2. **Find or create equivalent** in the color system
3. **Replace with color system reference**:
   ```typescript
   // Before
   sx={{ color: 'rgba(255,255,255,0.7)' }}
   
   // After
   sx={{ color: colors.weather.overlay.text.muted }}
   ```
4. **Test in both light and dark modes**

## Color Accessibility

- All color combinations are designed to meet WCAG accessibility guidelines
- Test color contrast ratios when adding new colors
- Consider users with color vision deficiencies
- Ensure sufficient contrast between text and background colors
