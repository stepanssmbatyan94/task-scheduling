export type UserRole = {
  id: number | string;
  name?: string | null;
};

export type UserStatus = {
  id: number | string;
  name?: string | null;
};

export type User = {
  id: number;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role?: UserRole | null;
  status?: UserStatus | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: number | string;
  statusId?: number | string | null;
};

export type EditUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roleId: number | string;
  statusId?: number | string | null;
};
