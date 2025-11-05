import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { refreshToken } from '@/modules/auth/auth-service';
import { getAccessToken, getBearerToken, getRefreshToken } from '@/modules/auth/auth-util';
import { env } from './env';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers = config.headers ?? {};
    const token = getAccessToken();
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Return the response as-is
  },
  async (error) => {
    const originalRequestConfig = (error.config ?? {}) as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error?.response?.status;

    if (status === 401 && getRefreshToken() && !originalRequestConfig._retry) {
      originalRequestConfig._retry = true;

      const didRefresh = await refreshToken();

      if (didRefresh) {
        originalRequestConfig.headers = originalRequestConfig.headers ?? {};
        originalRequestConfig.headers['Authorization'] = getBearerToken();

        return axiosInstance(originalRequestConfig);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
