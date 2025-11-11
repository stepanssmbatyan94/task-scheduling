import { createI18n } from 'vue-i18n';

import en from './en';
import ru from './ru';

import { getLocale } from '@/services/app-service';
import { LOCALE_KEYS, Locales } from './constants';

export type MessageSchema = typeof en;
export const messages = {
  [Locales.EN]: en,
  [Locales.RU]: ru
};

export const i18n = createI18n<[MessageSchema], string>({
  legacy: false,
  globalInjection: true,

  locale: getLocale() ?? Locales.EN,
  fallbackLocale: Locales.EN,
  availableLocales: LOCALE_KEYS,

  messages
});
