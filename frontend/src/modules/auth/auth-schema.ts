import { i18n } from '@/locales';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: i18n.global.t('login.validation.email') })
    .email({ message: i18n.global.t('login.validation.email') })
    .trim(),
  password: z
    .string({ required_error: i18n.global.t('login.validation.password') })
    .min(1, { message: i18n.global.t('login.validation.password') })
    .trim()
});
