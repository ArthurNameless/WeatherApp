import { resources, defaultNS } from './index';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['en'];
  }
}

export type TranslationKey = keyof (typeof resources)['en']['translation'];
