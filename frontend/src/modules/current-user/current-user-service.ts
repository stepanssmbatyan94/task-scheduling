import { fetchCurrentUserApi } from './current-user-api';
import type { CurrentUser } from './current-user-type';
import { Permission } from '@/constants';

const ADMIN_ROLE_ID = 1;
const ADMIN_ROLE_NAME = 'admin';

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const user = await fetchCurrentUserApi();

  const roleId = Number(user?.role?.id);
  const roleName = user?.role?.name?.toString().toLowerCase();
  const isAdmin =
    roleId === ADMIN_ROLE_ID || roleName === ADMIN_ROLE_NAME;

  return {
    user,
    authorities: isAdmin ? Object.values(Permission) : []
  };
}
