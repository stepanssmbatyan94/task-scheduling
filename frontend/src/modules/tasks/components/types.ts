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
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    profileImageUrl?: string;
    photo?: {
      path?: string;
    };
  };
  endDate?: string;
  startDate?: string;
  [key: string]: any;
}

export interface KanbanBoardProps {
  items: KanbanItem[];
  lanes: Lane[];
}

export interface KanbanEmits {
  'item-updated': [item: KanbanItem, newStatus: string];
  'item-clicked': [item: KanbanItem];
}

