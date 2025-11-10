interface LanguageType {
  value: string;
  label: string;
  icon?: string;
}

export enum Locales {
  EN = 'en',
  RU = 'ru'
}

export const LOCALE_KEYS = [Locales.EN, Locales.RU];

export const LANGUAGES: LanguageType[] = [
  {
    value: Locales.EN,
    label: 'English'
  },
  {
    value: Locales.RU,
    label: 'Русский'
  }
];
