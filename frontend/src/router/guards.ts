import { AppRoute } from '@/constants';
import { getAccessToken } from '@/modules/auth/auth-util';
import type { RouteLocationNormalized } from 'vue-router';

export function requiresAuth(to: RouteLocationNormalized) {
  if (to.meta.requiresAuth) {
    if (!getAccessToken()) {
      return { name: AppRoute.LOGIN, query: { redirect: to.fullPath } };
    }
  }
}
