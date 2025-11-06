/**
 * Task types matching backend API response
 */

export interface TaskStatus {
  id: number;
  name: string;
  order: number;
}

export interface TaskAssignedUser {
  id: number;
  email: string;
  provider: string;
  socialId: string | null;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
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
