import type { AssignableUser } from '../task-type';

/**
 * Shared types and interfaces for Kanban components
 */

export interface Lane {
  name: string;
  slug: string;
}

export interface KanbanItem {
  id?: string | number;
  status: string;
  summary?: string;
  title?: string;
  description?: string;
  assignedUser?: {
    id: number | string;
    firstName: string | null;
    lastName: string | null;
    email?: string | null;
    profileImageUrl?: string;
    photo?: {
      path?: string;
    };
  };
  endDate?: string;
  startDate?: string;
  [key: string]: unknown;
}

export interface KanbanBoardProps {
  items: KanbanItem[];
  lanes: Lane[];
  assignableUsers: AssignableUser[];
  isLoadingAssignableUsers: boolean;
  isErrorAssignableUsers: boolean;
}

export interface KanbanEmits {
  'item-updated': [item: KanbanItem, newStatus: string];
  'item-clicked': [item: KanbanItem];
  'assign-user': [item: KanbanItem, user: AssignableUser | null];
}

