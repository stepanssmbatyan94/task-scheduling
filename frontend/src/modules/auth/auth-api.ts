import axios from '@/config/axios';
import { env } from '@/config/env';
import { mockReponse } from '@/mock-response-data';

import type { LoginForm, LoginResponse, LoginSuccessResponse } from './auth-type';
import { getBearerToken, getRefreshToken } from './auth-util';

export async function loginApi(payload: LoginForm) {
  if (env.MOCK_API === 'true') {
    return { data: mockReponse.login } as { data: LoginSuccessResponse };
  }

  return axios.post<LoginSuccessResponse>('auth/email/login', payload);
}

export async function refreshTokenApi() {
  if (env.MOCK_API === 'true') {
    const { token, refreshToken, tokenExpires } = mockReponse.login;
    return {
      data: { token, refreshToken, tokenExpires }
    } as { data: LoginResponse };
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('Missing refresh token');
  }

  return axios.post<LoginResponse>(
    'auth/refresh',
    undefined,
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    }
  );
}

export async function logoutApi() {
  if (env.MOCK_API === 'true') {
    return Promise.resolve();
  }

  return axios.post('auth/logout', undefined, {
    headers: {
      Authorization: getBearerToken()
    }
  });
}
