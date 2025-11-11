import { Http } from '@/services/Http';
import type { User } from './user-type';

const API_ENDPOINT = 'users';

export async function fetchUsersApi(signal?: AbortSignal) {
  return Http.get<{ data: User[]; hasNextPage: boolean }>(
    API_ENDPOINT,
    { limit: -1 },
    {
      signal
    }
  );
}

export async function fetchUserByIdApi(id: string | number, signal?: AbortSignal) {
  return Http.get<User>(`${API_ENDPOINT}/${id}`, undefined, {
    signal
  });
}

export async function createUserApi(payload: unknown) {
  return Http.post<User>(API_ENDPOINT, payload);
}

export async function updateUserApi(id: string | number, payload: unknown) {
  return Http.patch<User>(`${API_ENDPOINT}/${id}`, payload);
}

export async function deleteUserApi(id: string | number) {
  return Http.delete<void>(`${API_ENDPOINT}/${id}`);
}
