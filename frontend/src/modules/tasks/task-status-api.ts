import { Http } from '@/services/Http';
import type {
  TaskStatus,
  CreateTaskStatusForm,
  UpdateTaskStatusForm
} from './task-status-type';
import type { SuccessResponse } from '@/types/global';

const API_ENDPOINT = 'task-statuses';

export async function fetchTaskStatusesApi(): Promise<
  SuccessResponse<TaskStatus[]>
> {
  const response = await Http.get<SuccessResponse<TaskStatus[]>>(
    API_ENDPOINT
  );
  return response as SuccessResponse<TaskStatus[]>;
}

export async function fetchTaskStatusByIdApi(
  id: string | number
): Promise<SuccessResponse<TaskStatus>> {
  const response = await Http.get<SuccessResponse<TaskStatus>>(
    `${API_ENDPOINT}/${id}`
  );
  return response as SuccessResponse<TaskStatus>;
}

export async function createTaskStatusApi(
  values: CreateTaskStatusForm
): Promise<SuccessResponse<TaskStatus>> {
  return await Http.post<SuccessResponse<TaskStatus>>(API_ENDPOINT, values);
}

export async function updateTaskStatusApi(
  values: UpdateTaskStatusForm,
  id: string | number
): Promise<SuccessResponse<TaskStatus>> {
  return await Http.put<SuccessResponse<TaskStatus>>(
    `${API_ENDPOINT}/${id}`,
    values
  );
}

export async function deleteTaskStatusApi(
  id: string | number
): Promise<void> {
  return await Http.delete<void>(`${API_ENDPOINT}/${id}`);
}
