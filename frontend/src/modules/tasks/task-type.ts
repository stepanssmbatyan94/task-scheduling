/**
 * Task types matching backend API response
 */

export interface TaskStatus {
  id: number;
  name: string;
  order: number;
}

export interface TaskAssignedUser {
  id: number | string;
  email: string | null;
  profileImageUrl?: string | null;
  provider?: string | null;
  socialId?: string | null;
  firstName: string | null;
  lastName: string | null;
  photo?: {
    path?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  assignedUser: TaskAssignedUser | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TasksResponse {
  data: Task[];
  hasNextPage: boolean;
}

export interface CreateTaskPayload {
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  assignedUser: {
    id: number | string;
  };
  status: {
    id: number | string;
  };
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  assignedUser?:
    | {
        id: number | string;
      }
    | null;
  status?:
    | {
        id: number | string;
      }
    | null;
}

export interface AssignableUser {
  id: number | string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  photo?: {
    path?: string;
  } | null;
  role?: {
    id: number | string;
    name?: string | null;
    nameEn?: string | null;
  } | null;
}
