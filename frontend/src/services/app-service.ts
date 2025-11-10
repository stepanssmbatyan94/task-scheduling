import { System } from '@/constants';
import { Locales } from '@/locales/constants';

export const getLocale = (): string => {
  const stored = localStorage.getItem(System.Locale);

  return stored || Locales.EN;
};

export const setLocale = (locale: string): void => {
  localStorage.setItem(System.Locale, locale);
};
