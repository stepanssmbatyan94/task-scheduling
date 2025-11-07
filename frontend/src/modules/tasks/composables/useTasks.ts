/**
 * Composable for fetching and managing tasks
 */

import { computed } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { fetchTasksApi, updateTaskApi } from '../task-api';
import { useTaskStatuses } from './useTaskStatuses';
import type { Task, TasksResponse } from '../task-type';
import type { KanbanItem, Lane } from '../components/types';

const TASKS_QUERY_KEY = ['tasks'] as const;
const TASKS_QUERY_PARAMS = { limit: -1 } as const;

/**
 * Formats status name for display (capitalize and replace hyphens)
 */
const formatStatusName = (statusName: string): string => {
  return statusName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Transforms backend Task to frontend KanbanItem
 */
const transformTaskToKanbanItem = (task: Task): KanbanItem => {
  return {
    id: task.id,
    status: task.status.name, // Use status name directly as slug
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
 * Composable for fetching tasks and task statuses from API
 */
export function useTasks() {
  const queryClient = useQueryClient();
  const tasksQueryKey = [...TASKS_QUERY_KEY, TASKS_QUERY_PARAMS] as const;

  // Fetch task statuses using the composable
  const {
    taskStatuses,
    isLoading: isLoadingStatuses,
    isError: isErrorStatuses,
    error: errorStatuses
  } = useTaskStatuses();

  // Fetch tasks
  const {
    data: tasksData,
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
    error: errorTasks,
    refetch: refetchTasks
  } = useQuery({
    queryKey: tasksQueryKey,
    queryFn: () => fetchTasksApi(TASKS_QUERY_PARAMS),
    staleTime: 30000
  });

  const {
    mutateAsync: updateTaskStatus,
    isPending: isUpdatingTaskStatus,
    isError: isUpdatingTaskStatusError,
    error: updateTaskStatusError
  } = useMutation<
    Task,
    unknown,
    {
      id: Task['id'];
      statusId: number | string;
      statusName: string;
    },
    { previousData?: TasksResponse }
  >({
    mutationFn: ({ id, statusId }) =>
      updateTaskApi(id, {
        status: {
          id: statusId
        }
      }),
    onMutate: async ({ id, statusId, statusName }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      const previousData = queryClient.getQueryData<TasksResponse>(tasksQueryKey);

      if (previousData) {
        const updatedData: TasksResponse = {
          ...previousData,
          data: previousData.data.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: {
                    ...task.status,
                    id: +statusId,
                    name: statusName
                  }
                }
              : task
          )
        };

        queryClient.setQueryData(tasksQueryKey, updatedData);
      }

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(tasksQueryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    }
  });

  const tasks = computed<Task[]>(() => {
    return tasksData.value?.data || [];
  });

  const kanbanItems = computed<KanbanItem[]>(() => {
    return tasks.value.map(transformTaskToKanbanItem);
  });

  // Create lanes from task statuses API, ordered by status.order
  const lanes = computed<Lane[]>(() => {
    return taskStatuses.value
      .map((status) => ({
        name: formatStatusName(status.name),
        slug: status.name // Use status name as slug
      }))
      .sort((a, b) => {
        const statusA = taskStatuses.value.find((s) => s.name === a.slug);
        const statusB = taskStatuses.value.find((s) => s.name === b.slug);
        return (statusA?.order || 0) - (statusB?.order || 0);
      });
  });

  // Combined loading state
  const isLoading = computed(() => {
    return isLoadingStatuses.value || isLoadingTasks.value;
  });

  // Combined error state
  const isError = computed(() => {
    return isErrorStatuses.value || isErrorTasks.value;
  });

  // Combined error object
  const error = computed(() => {
    return errorStatuses.value || errorTasks.value;
  });

  return {
    tasks,
    kanbanItems,
    lanes,
    taskStatuses,
    isLoading,
    isError,
    error,
    refetch: refetchTasks,
    updateTaskStatus,
    isUpdatingTaskStatus,
    isUpdatingTaskStatusError,
    updateTaskStatusError
  };
}
