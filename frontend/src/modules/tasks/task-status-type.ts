/**
 * Task status types matching backend API response
 */

export interface TaskStatus {
  id: number;
  name: string;
  order: number;
}

export interface CreateTaskStatusForm {
  name: string;
  order: number;
}

export interface UpdateTaskStatusForm {
  name?: string;
  order?: number;
}
