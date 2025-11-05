import { useQuery } from '@tanstack/vue-query';
import { fetchCurrentUser } from '../current-user-service';
import type { CurrentUser } from '../current-user-type';
import { currentUserQueryKeys } from '../query-keys';

export function useCurrentUserQuery() {
  return useQuery<CurrentUser>({
    queryKey: currentUserQueryKeys.currentUser,
    queryFn: fetchCurrentUser
  });
}
