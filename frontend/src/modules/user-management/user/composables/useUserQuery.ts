import { AppRoute } from '@/constants';
import router from '@/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { userQueryKeys } from '../query-keys';
import { createUser, deleteUser, fetchUserById, fetchUsers, updateUser } from '../user-service';
import type { CreateUserForm, EditUserForm } from '../user-type';

export function useUsersQuery() {
  return useQuery({
    queryKey: userQueryKeys.users,
    queryFn: ({ signal }) => fetchUsers(signal)
  });
}

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: userQueryKeys.user(id),
    queryFn: ({ signal }) => fetchUserById(id, signal)
  });
}

export function useUserFormQuery(id: string) {
  return useQuery({
    queryKey: userQueryKeys.user(id),
    queryFn: ({ signal }) => fetchUserById(id, signal),
    select: (user): EditUserForm => {
      const roleId = user?.role?.id;
      const statusId = user?.status?.id;

      return {
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        email: user?.email ?? '',
        password: undefined,
        roleId: roleId != null ? Number(roleId) : '',
        statusId: statusId != null ? Number(statusId) : null
      };
    }
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateUserForm) => createUser(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.users });
      router.push({ name: AppRoute.USER });
    }
  });
}

export function useUpdateUserMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: EditUserForm) => updateUser(values, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.users });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.user(id) });
      router.push({ name: AppRoute.USER });
    }
  });
}

export function useDeleteUserMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.users });
      router.push({ name: AppRoute.USER });
    }
  });
}
