import {
  createUserApi,
  deleteUserApi,
  fetchUserByIdApi,
  fetchUsersApi,
  updateUserApi
} from './user-api';
import type { CreateUserForm, EditUserForm, User } from './user-type';

const mapEntityById = (id: number | string | null | undefined) =>
  id != null ? { id: +id } : undefined;

export async function fetchUsers(signal?: AbortSignal) {
  const res = await fetchUsersApi(signal);
  return res?.data ?? [];
}

export async function fetchUserById(id: string, signal?: AbortSignal) {
  const res = await fetchUserByIdApi(id, signal);
  return res ?? ({} as User);
}

export async function createUser(values: CreateUserForm) {
  const payload = {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    password: values.password,
    role: mapEntityById(values.roleId),
    status: mapEntityById(values.statusId)
  };

  return createUserApi(payload);
}

export async function updateUser(values: EditUserForm, id: string) {
  const payload: Record<string, unknown> = {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    role: mapEntityById(values.roleId),
    status: mapEntityById(values.statusId)
  };

  if (values.password) {
    payload.password = values.password;
  }

  return updateUserApi(id, payload);
}

export async function deleteUser(id: string) {
  return deleteUserApi(id);
}
