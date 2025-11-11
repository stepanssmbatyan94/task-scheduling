export const AppRoute = {
  UNAUTHORIZE: '/unauthorize',

  LOGIN: '/login',

  USER: '/users',
  USER_CREATE: '/users/create',
  USER_DETAILS: '/users/:id',
  USER_EDIT: '/users/:id/edit',

  ROLE: '/user-management/roles',
  ROLE_CREATE: '/user-management/roles/create',
  ROLE_DETAILS: '/user-management/roles/:id',
  ROLE_EDIT: '/user-management/roles/:id/edit',

  TASKS: '/tasks'
} as const;
