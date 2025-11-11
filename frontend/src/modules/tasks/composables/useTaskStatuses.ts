/**
 * Composable for fetching and managing task statuses
 */

import { computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import {
  fetchTaskStatusesApi,
  fetchTaskStatusByIdApi,
  createTaskStatusApi,
  updateTaskStatusApi,
  deleteTaskStatusApi
} from '../task-status-api';
import type {
  TaskStatus,
  CreateTaskStatusForm,
  UpdateTaskStatusForm
} from '../task-status-type';

const QUERY_KEY = ['task-statuses'];

/**
 * Composable for fetching all task statuses
 */
export function useTaskStatuses() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => fetchTaskStatusesApi(),
    staleTime: 30_000,
    refetchOnMount: 'always'
  });

  const taskStatuses = computed<TaskStatus[]>(() => {
    return data.value as TaskStatus[];
  });

  return {
    taskStatuses,
    isLoading,
    isError,
    error,
    refetch
  };
}

/**
 * Composable for fetching a single task status by ID
 */
export function useTaskStatus(id: string | number) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => fetchTaskStatusByIdApi(id),
    enabled: !!id
  });

  const taskStatus = computed<TaskStatus | null>(() => {
    return data.value as TaskStatus | null;
  });

  return {
    taskStatus,
    isLoading,
    isError,
    error,
    refetch
  };
}

/**
 * Composable for creating a task status
 */
export function useCreateTaskStatus() {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (values: CreateTaskStatusForm) =>
      createTaskStatusApi(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    }
  });

  return {
    createTaskStatus: mutate,
    isCreating: isPending,
    isError,
    error
  };
}

/**
 * Composable for updating a task status
 */
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({
      id,
      values
    }: {
      id: string | number;
      values: UpdateTaskStatusForm;
    }) => updateTaskStatusApi(values, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    }
  });

  return {
    updateTaskStatus: mutate,
    isUpdating: isPending,
    isError,
    error
  };
}

/**
 * Composable for deleting a task status
 */
export function useDeleteTaskStatus() {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (id: string | number) => deleteTaskStatusApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    }
  });

  return {
    deleteTaskStatus: mutate,
    isDeleting: isPending,
    isError,
    error
  };
}
