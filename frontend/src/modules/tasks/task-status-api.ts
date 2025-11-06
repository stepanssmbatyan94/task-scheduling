import { Http } from '@/services/Http';
import type {
  TaskStatus,
  CreateTaskStatusForm,
  UpdateTaskStatusForm
} from './task-status-type';

const API_ENDPOINT = 'task-statuses';

export async function fetchTaskStatusesApi(): Promise<
  TaskStatus[] | SuccessResponse<TaskStatus[]>
> {
  const response = await Http.get<TaskStatus[] | SuccessResponse<TaskStatus[]>>(
    API_ENDPOINT
  );
  return response as TaskStatus[] | SuccessResponse<TaskStatus[]>;
}

export async function fetchTaskStatusByIdApi(
  id: string | number
): Promise<TaskStatus | SuccessResponse<TaskStatus>> {
  const response = await Http.get<TaskStatus | SuccessResponse<TaskStatus>>(
    `${API_ENDPOINT}/${id}`
  );
  return response as TaskStatus | SuccessResponse<TaskStatus>;
}

export async function createTaskStatusApi(
  values: CreateTaskStatusForm
): Promise<TaskStatus | SuccessResponse<TaskStatus>> {
  const response = await Http.post<TaskStatus | SuccessResponse<TaskStatus>>(
    API_ENDPOINT,
    values
  );
  return response as TaskStatus | SuccessResponse<TaskStatus>;
}

export async function updateTaskStatusApi(
  values: UpdateTaskStatusForm,
  id: string | number
): Promise<TaskStatus | SuccessResponse<TaskStatus>> {
  const response = await Http.put<TaskStatus | SuccessResponse<TaskStatus>>(
    `${API_ENDPOINT}/${id}`,
    values
  );
  return response as TaskStatus | SuccessResponse<TaskStatus>;
}

export async function deleteTaskStatusApi(
  id: string | number
): Promise<void> {
  return await Http.delete<void>(`${API_ENDPOINT}/${id}`);
}
