import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { fetchAssignableUsersApi } from '../task-assignees-api';
import type { AssignableUser } from '../task-type';

const QUERY_KEY = ['assignable-users'] as const;

export function useAssignableUsers() {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchAssignableUsersApi,
    staleTime: 60_000,
    refetchOnMount: 'always'
  });
  const assignableUsers = computed<AssignableUser[]>(() => data.value ?? []);

  return {
    assignableUsers,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  };
}
