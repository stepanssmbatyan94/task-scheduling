/**
 * Composable for fetching and managing tasks
 */

import { computed } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { fetchTasksApi, updateTaskApi, createTaskApi } from '../task-api';
import { useTaskStatuses } from './useTaskStatuses';
import type {
  AssignableUser,
  CreateTaskPayload,
  Task,
  TaskAssignedUser,
  TasksResponse
} from '../task-type';
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

  const {
    mutateAsync: assignTaskUser,
    isPending: isAssigningTaskUser,
    isError: isAssigningTaskUserError,
    error: assignTaskUserError
  } = useMutation<
    Task,
    unknown,
    {
      id: Task['id'];
      user: AssignableUser | null;
    },
    { previousData?: TasksResponse }
  >({
    mutationFn: ({ id, user }) =>
      updateTaskApi(id, {
        assignedUser: user
          ? {
              id: user.id
            }
          : null
      }),
    onMutate: async ({ id, user }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      const previousData = queryClient.getQueryData<TasksResponse>(tasksQueryKey);

      if (previousData) {
        const updatedData: TasksResponse = {
          ...previousData,
          data: previousData.data.map((task) =>
            task.id === id
              ? {
                  ...task,
                  assignedUser: user
                    ? ({
                        id: user.id,
                        email: user.email ?? null,
                        firstName: user.firstName ?? null,
                        lastName: user.lastName ?? null,
                        photo: user.photo ?? undefined,
                        provider: task.assignedUser?.provider,
                        socialId: task.assignedUser?.socialId,
                        createdAt: task.assignedUser?.createdAt,
                        updatedAt: task.assignedUser?.updatedAt,
                        deletedAt: task.assignedUser?.deletedAt
                      } as TaskAssignedUser)
                    : null
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
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TasksResponse | undefined>(tasksQueryKey, (previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          data: previous.data.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    }
  });

  const {
    mutateAsync: createTask,
    isPending: isCreatingTask,
    isError: isCreatingTaskError,
    error: createTaskError
  } = useMutation<
    Task,
    unknown,
    CreateTaskPayload,
    { previousData?: TasksResponse }
  >({
    mutationFn: (payload) => createTaskApi(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      const previousData = queryClient.getQueryData<TasksResponse>(tasksQueryKey);
      return { previousData };
    },
    onSuccess: (createdTask) => {
      queryClient.setQueryData<TasksResponse | undefined>(tasksQueryKey, (previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          data: [createdTask, ...previous.data]
        };
      });
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

  const kanbanItems = computed<KanbanItem[]>(() => {
    return tasks.value.map(transformTaskToKanbanItem);
  });

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

  const isLoading = computed(() => {
    return isLoadingStatuses.value || isLoadingTasks.value;
  });

  const isError = computed(() => {
    return isErrorStatuses.value || isErrorTasks.value;
  });

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
    updateTaskStatusError,
    createTask,
    isCreatingTask,
    isCreatingTaskError,
    createTaskError,
    assignTaskUser,
    isAssigningTaskUser,
    isAssigningTaskUserError,
    assignTaskUserError
  };
}
