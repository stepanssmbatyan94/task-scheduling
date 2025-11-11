<template>
  <PageBreadcrumb :items="breadcrumbItems" />
  <PageTitle :name="t('user.list')" :show-back-button="false">
    <template v-if="hasPermission(Permission.CREATE_USER)" #actionButton>
      <AddNewButton :path="AppRoute.USER_CREATE" :label="t('user.addNew')" />
    </template>
  </PageTitle>

  <PageContent>
    <Card>
      <DataTable :loading="isLoading" :data-source="formattedUsers" :columns>
        <template #fullName="{ row: user }">
          <div class="flex items-center gap-3">
            <UserAvatar />
            <div class="flex flex-col">
              <span class="font-medium">{{ user.fullName }}</span>
              <span class="text-xs text-gray-500">{{ user.email ?? t('tasks.unassigned') }}</span>
            </div>
          </div>
        </template>

        <template #role="{ row: user }">
          {{ user.roleName }}
        </template>

        <template #status="{ row: user }">
          <UserStatus :status="user.status" />
        </template>

        <template #actions="{ row: user }">
          <div class="flex gap-2">
            <Button
              v-if="hasPermission(Permission.VIEW_USER_DETAILS)"
              :label="t('view')"
              icon="pi pi-eye"
              as="router-link"
              :to="{ name: AppRoute.USER_DETAILS, params: { id: user.id } }"
            />
            <Button
              v-if="hasPermission(Permission.EDIT_USER)"
              :label="t('edit')"
              icon="pi pi-pen-to-square"
              as="router-link"
              :to="{ name: AppRoute.USER_EDIT, params: { id: user.id } }"
            />
          </div>
        </template>
      </DataTable>
    </Card>
  </PageContent>
</template>

<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { computed, onUnmounted } from 'vue';

import {
  AddNewButton,
  Button,
  Card,
  DataTable,
  PageBreadcrumb,
  PageTitle,
  UserAvatar
} from '@/components';
import PageContent from '@/components/shared/PageContent.vue';
import { useTranslation } from '@/composables';
import { AppRoute, Permission } from '@/constants';
import type { BreadcrumbItemProps, ColumnProps } from '@/types';

import { useAuth } from '@/modules/auth/useAuth';
import UserStatus from '../components/UserStatus.vue';
import { useUsersQuery } from '../composables/useUserQuery';
import { userQueryKeys } from '../query-keys';
import type { User } from '../user-type';

type TableUser = User & {
  fullName: string;
  roleName: string;
};

const queryClient = useQueryClient();
const { t } = useTranslation();
const { hasPermission } = useAuth();

const breadcrumbItems = computed<BreadcrumbItemProps[]>(() => [
  {
    title: t('user.list')
  }
]);

const columns = computed<ColumnProps<TableUser>[]>(() => [
  {
    key: 'fullName',
    title: t('fullName'),
    minWidth: 200
  },
  {
    key: 'role',
    title: t('role.label'),
    minWidth: 140
  },
  {
    key: 'status',
    title: t('status'),
    minWidth: 120
  },
  {
    key: 'actions',
    title: t('actions'),
    minWidth: 140
  }
]);

const { data, isLoading } = useUsersQuery();

const formattedUsers = computed<TableUser[]>(() => {
  return (data.value ?? []).map((user) => {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    return {
      ...user,
      fullName: fullName || user.email || t('user.label'),
      roleName: user.role?.name ?? t('role.label')
    };
  });
});

onUnmounted(() => {
  queryClient.cancelQueries({ queryKey: userQueryKeys.users });
});
</script>

<style scoped></style>
