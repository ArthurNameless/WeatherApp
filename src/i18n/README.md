# Internationalization (i18n) Setup

This project uses `react-i18next` for internationalization support.

## Structure

```
src/i18n/
├── index.ts          # i18n configuration and initialization
├── types.ts          # TypeScript type definitions for translations
├── locales/
│   └── en.json       # English translations (default)
└── README.md         # This file
```

## Adding a New Language

1. Create a new translation file in `locales/` directory (e.g., `es.json` for Spanish)
2. Copy the structure from `en.json` and translate all values
3. Import the new translation file in `index.ts`
4. Add the new language to the `resources` object

Example for adding Spanish:

```typescript
// In index.ts
import es from './locales/es.json';

export const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
} as const;
```

## Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('app.subtitle')}</p>
    </div>
  );
}
```

## Translation Keys

All translation keys are typed for better developer experience. The types are automatically generated from the English translation file.

## Language Detection

The app automatically detects the user's preferred language from:
1. localStorage (if previously selected)
2. Browser navigator language
3. HTML lang attribute

The detected language falls back to English if the preferred language is not available.
