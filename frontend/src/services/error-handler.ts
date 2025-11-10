import type { AxiosError } from 'axios';

import { toast } from 'vue3-toastify';

import { i18n } from '@/locales';

type StructuredError = {
  status?: number;
  message?: string;
  errors?: Record<string, unknown>;
};

const DEFAULT_FALLBACK_KEY = 'errors.generic';

const extractFirstErrorValue = (
  errors: Record<string, unknown> | undefined
): string | undefined => {
  if (!errors) {
    return undefined;
  }

  for (const value of Object.values(errors)) {
    if (!value) {
      continue;
    }

    if (Array.isArray(value)) {
      const candidate = value.find((item): item is string => typeof item === 'string');
      if (candidate) {
        return candidate;
      }
      continue;
    }

    if (typeof value === 'string') {
      return value;
    }
  }

  return undefined;
};

const isAxiosLikeError = (candidate: unknown): candidate is AxiosError =>
  typeof candidate === 'object' && candidate !== null && 'isAxiosError' in candidate;

const resolveFallbackMessage = (fallbackKey: string, t: typeof i18n.global.t, te: typeof i18n.global.te) =>
  te(fallbackKey) ? (t(fallbackKey) as string) : fallbackKey;

const normalizeTranslationKey = (rawKey: string | undefined) => {
  if (!rawKey) {
    return undefined;
  }

  const trimmed = rawKey.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.replace(/\s/g, '');
};

const resolveTranslationKey = (
  rawKey: string | undefined,
  te: typeof i18n.global.te
): string | undefined => {
  const normalizedKey = normalizeTranslationKey(rawKey);

  if (!normalizedKey) {
    return undefined;
  }

  const namespacedKey = `errors.${normalizedKey}`;

  if (te(namespacedKey)) {
    return namespacedKey;
  }

  return undefined;
};

const resolveTranslationFromAxios = (
  error: AxiosError,
  te: typeof i18n.global.te
): string | undefined => {
  const data = error.response?.data as StructuredError | undefined;
  if (!data) {
    return undefined;
  }

  const errorCode = extractFirstErrorValue(data.errors);
  if (errorCode) {
    const translationKey = resolveTranslationKey(errorCode, te);
    if (translationKey) {
      return translationKey;
    }
  }

  return resolveTranslationKey(data.message, te);
};

const resolveTranslationKeyFromError = (
  error: unknown,
  te: typeof i18n.global.te
): string | undefined => {
  if (!isAxiosLikeError(error)) {
    return undefined;
  }

  return resolveTranslationFromAxios(error, te);
};

const resolvePlainMessage = (error: unknown): string | undefined => {
  if (isAxiosLikeError(error)) {
    const data = error.response?.data as StructuredError | undefined;
    if (data?.message && data.message.trim().length > 0) {
      return data.message;
    }

    return typeof error.message === 'string' && error.message.trim().length > 0
      ? error.message
      : undefined;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const candidateMessage = (error as Record<string, unknown>).message;
    if (typeof candidateMessage === 'string') {
      return candidateMessage;
    }
  }

  if (typeof error === 'string') {
    return error;
  }

  return undefined;
};

const resolveErrorMessage = (error: unknown, fallbackKey: string): string => {
  const { t, te } = i18n.global;

  const translationKey = resolveTranslationKeyFromError(error, te);
  if (translationKey) {
    return t(translationKey) as string;
  }

  const plainMessage = resolvePlainMessage(error);
  if (plainMessage) {
    return plainMessage;
  }

  return resolveFallbackMessage(fallbackKey, t, te);
};

export const handleApiError = (error: unknown, fallbackKey = DEFAULT_FALLBACK_KEY) => {
  const message = resolveErrorMessage(error, fallbackKey);
  toast.error(message);
};
