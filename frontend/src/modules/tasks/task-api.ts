import { Http } from '@/services/Http';
import type { Task, TasksResponse, UpdateTaskPayload } from './task-type';

const API_ENDPOINT = 'tasks';

export async function fetchTasksApi(params?: {
  limit?: number;
  page?: number;
  filters?: Record<string, unknown>;
  sort?: Record<string, unknown>;
}): Promise<TasksResponse> {
  const queryParams: Record<string, unknown> = {};

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

export async function updateTaskApi(
  id: string | number,
  values: UpdateTaskPayload
): Promise<Task> {
  const response = await Http.patch<Task, UpdateTaskPayload>(`${API_ENDPOINT}/${id}`, values);
  return response as Task;
}
