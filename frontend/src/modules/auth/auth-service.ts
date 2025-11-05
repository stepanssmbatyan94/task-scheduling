import { AppRoute } from '@/constants';
import router from '@/router';

import { loginApi, logoutApi, refreshTokenApi } from './auth-api';
import type { LoginForm, LoginSuccessResponse } from './auth-type';
import { destroySensitiveInfo, getRefreshToken, saveToken } from './auth-util';
import { useCurrentUserStore } from '../current-user/current-user-store';

export async function loginWithCredential({ email, password }: LoginForm): Promise<LoginSuccessResponse> {
  try {
    const response = await loginApi({
      email: email.trim(),
      password: password.trim()
    });

    const { token, refreshToken: refreshTokenValue, tokenExpires } = response.data;

    saveToken(token, refreshTokenValue, tokenExpires.toString());

    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? 'Unable to login. Please try again.';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
}

export async function refreshToken(): Promise<boolean> {
  try {
    if (!getRefreshToken()) {
      throw new Error('Missing refresh token');
    }

    const response = await refreshTokenApi();
    const { token, refreshToken: newRefreshToken, tokenExpires } = response.data;

    saveToken(token, newRefreshToken, tokenExpires.toString());

    return true;
  } catch {
    const currentUserStore = useCurrentUserStore();
    currentUserStore.setCurrentUser({
      user: undefined,
      authorities: []
    });
    destroySensitiveInfo();
    router.push({ name: AppRoute.LOGIN });
    return false;
  }
}

export async function logout(): Promise<void> {
  const currentUserStore = useCurrentUserStore();
  try {
    await logoutApi();
  } finally {
    currentUserStore.setCurrentUser({
      user: undefined,
      authorities: []
    });
    destroySensitiveInfo();
    router.push({ name: AppRoute.LOGIN });
  }
}
