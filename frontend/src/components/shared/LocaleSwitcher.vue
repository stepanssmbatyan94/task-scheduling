<template>
  <label class="locale-switcher">
    <span class="sr-only">{{ t('locale.' + selectedLocale) }}</span>
    <select v-model="selectedLocale" class="locale-select">
      <option
        v-for="language in languages"
        :key="language.value"
        :value="language.value"
      >
        {{ t(`locale.${language.value}`) }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { LANGUAGES } from '@/locales/constants';
import { setLocale } from '@/services/app-service';

const { locale, t } = useI18n();

const languages = LANGUAGES;

const selectedLocale = computed({
  get: () => locale.value,
  set: (value: string) => {
    locale.value = value;
    setLocale(value);
  }
});
</script>

<style scoped>
.locale-switcher {
  display: inline-flex;
  align-items: center;
}

.locale-select {
  appearance: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.3rem 1.75rem 0.3rem 0.75rem;
  background-color: #ffffff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.25rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 20 20\"><path stroke=\"%236b7280\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M6 8l4 4 4-4\"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  background-size: 0.75rem 0.75rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.locale-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
}

.locale-select:hover {
  border-color: #9ca3af;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
