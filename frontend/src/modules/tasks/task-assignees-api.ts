import { Http } from '@/services/Http';

import type { AssignableUser } from './task-type';

const USERS_ENDPOINT = 'users';

export async function fetchAssignableUsersApi(): Promise<AssignableUser[]> {
  const response = await Http.get<SuccessResponse<AssignableUser[]>>(
    USERS_ENDPOINT,
    { limit: -1 }
  );

  return response?.data || [];
}
