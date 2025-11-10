import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import '@/assets/styles/main.css';

import App from './App.vue';
import { i18n } from './locales';
import router from './router';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retryOnMount: false,
        retry: false
      }
    }
  }
};

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VueQueryPlugin, vueQueryPluginOptions);
app.use(ElementPlus);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.use(Vue3Toastify, {
  autoClose: 4000,
  position: 'top-right',
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light'
} as ToastContainerOptions);
app.mount('#app');
