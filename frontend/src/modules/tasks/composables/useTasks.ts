/**
 * Composable for fetching and managing tasks
 */

import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { fetchTasksApi } from '../task-api';
import type { Task } from '../task-type';
import type { KanbanItem, Lane } from '../components/types';

/**
 * Maps backend task status names to frontend lane slugs
 */
const statusToLaneSlug = (statusName: string): string => {
  const mapping: Record<string, string> = {
    backlog: 'backlog',
    todo: 'todo',
    'in-progress': 'in-progress',
    done: 'done',
    blocked: 'blocked'
  };
  return mapping[statusName] || statusName;
};

/**
 * Transforms backend Task to frontend KanbanItem
 */
const transformTaskToKanbanItem = (task: Task): KanbanItem => {
  return {
    id: task.id,
    status: statusToLaneSlug(task.status.name),
    title: task.title,
    summary: task.title, // For compatibility
    description: task.description || undefined,
    assignedUser: task.assignedUser
      ? {
          id: task.assignedUser.id,
          firstName: task.assignedUser.firstName,
          lastName: task.assignedUser.lastName,
          email: task.assignedUser.email
        }
      : undefined,
    startDate: task.startDate || undefined,
    endDate: task.endDate || undefined
  };
};

/**
 * Composable for fetching tasks from API
 */
export function useTasks() {
  const {
    data: tasksData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['tasks', { limit: -1 }],
    queryFn: () => fetchTasksApi({ limit: -1 }),
    staleTime: 30000 // 30 seconds
  });

  const tasks = computed<Task[]>(() => {
    return tasksData.value?.data || [];
  });

  const kanbanItems = computed<KanbanItem[]>(() => {
    return tasks.value.map(transformTaskToKanbanItem);
  });

  const lanes = computed<Lane[]>(() => {
    // Get unique statuses from tasks, ordered by status.order
    const statusMap = new Map<string, { name: string; order: number }>();

    tasks.value.forEach((task) => {
      const slug = statusToLaneSlug(task.status.name);
      if (!statusMap.has(slug)) {
        statusMap.set(slug, {
          name: task.status.name.charAt(0).toUpperCase() + task.status.name.slice(1).replace('-', ' '),
          order: task.status.order
        });
      }
    });

    // Convert to array and sort by order
    return Array.from(statusMap.entries())
      .map(([slug, { name }]) => ({ name, slug }))
      .sort((a, b) => {
        const orderA = statusMap.get(a.slug)?.order || 0;
        const orderB = statusMap.get(b.slug)?.order || 0;
        return orderA - orderB;
      });
  });

  return {
    tasks,
    kanbanItems,
    lanes,
    isLoading,
    isError,
    error,
    refetch
  };
}
