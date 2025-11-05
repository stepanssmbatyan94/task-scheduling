import { fetchCurrentUserApi } from './current-user-api';
import type { CurrentUser } from './current-user-type';

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const user = await fetchCurrentUserApi();
  return {
    user,
    authorities: []
  };
}
