import type { AxiosRequestConfig } from 'axios';
import queryString from 'query-string';

import axios from '@/config/axios';

export class Http {
  private static getError = (error: unknown) => {
    type AxiosErrorLike = {
      code?: string;
      message?: string;
      response?: {
        data?: unknown;
        status: number;
        statusText: string;
      };
    };

    const axiosError = error as AxiosErrorLike | undefined;

    if (axiosError?.code === 'ERR_CANCELED') {
      console.log('Request aborted:', axiosError.message ?? 'unknown reason');
      return;
    }

    if (axiosError?.response) {
      const { data, status, statusText } = axiosError.response;
      throw data !== '' && data !== undefined
        ? data
        : { message: `${status} ${statusText}` };
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(String(error));
  };

  static async get<T = unknown>(
    url: string,
    queryParams?: Record<string, unknown> | undefined,
    config?: AxiosRequestConfig
  ) {
    try {
      if (queryParams) {
        const query = queryString.stringify(queryParams);
        url = url.indexOf('?') == -1 ? `${url}?${query}` : `${url}&${query}`;
      }
      const res = await axios.get<T>(url, config);
      return res?.data;
    } catch (error: unknown) {
      Http.getError(error);
    }
  }

  static async post<T = unknown, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ) {
    try {
      const res = await axios.post<T>(url, data, config);
      return res?.data;
    } catch (error: unknown) {
      Http.getError(error);
    }
  }

  static async put<T = unknown, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ) {
    try {
      const res = await axios.put<T>(url, data, config);
      return res?.data;
    } catch (error: unknown) {
      Http.getError(error);
    }
  }

  static async patch<T = unknown, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ) {
    try {
      const res = await axios.patch<T>(url, data, config);
      return res?.data;
    } catch (error: unknown) {
      Http.getError(error);
    }
  }

  static async delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    try {
      const res = await axios.delete<T>(url, config);
      return res?.data;
    } catch (error: unknown) {
      Http.getError(error);
    }
  }
}
