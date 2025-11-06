import { Http } from '@/services/Http';
import type { TasksResponse } from './task-type';

const API_ENDPOINT = 'tasks';

export async function fetchTasksApi(params?: {
  limit?: number;
  page?: number;
  filters?: Record<string, any>;
  sort?: Record<string, any>;
}): Promise<TasksResponse> {
  const queryParams: Record<string, any> = {};

  if (params?.limit !== undefined) {
    queryParams.limit = params.limit;
  }

  if (params?.page !== undefined) {
    queryParams.page = params.page;
  }

  if (params?.filters) {
    queryParams.filters = JSON.stringify(params.filters);
  }

  if (params?.sort) {
    queryParams.sort = JSON.stringify(params.sort);
  }

  const response = await Http.get<TasksResponse>(API_ENDPOINT, queryParams);
  return response as TasksResponse;
}
