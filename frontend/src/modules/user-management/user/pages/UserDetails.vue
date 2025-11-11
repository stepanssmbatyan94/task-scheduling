<template>
  <PageBreadcrumb :items="breadcrumbItems" />
  <PageTitle :name="pageTitle">
    <template v-if="hasPermission(Permission.EDIT_USER)" #actionButton>
      <div class="flex gap-2">
        <EditButton :path="editPath" :label="t('user.edit')" />
        <Button
          severity="danger"
          icon="pi pi-trash"
          :label="t('delete')"
          :loading="isDeleting"
          @click="handleDelete"
        />
      </div>
    </template>
  </PageTitle>

  <PageContent>
    <UserDetailsInfo :user="data" />

    <PageContentSection :title="t('personalInfo')">
      <Descriptions :fields>
        <template #status>
          <UserStatus :status="data?.status" />
        </template>
      </Descriptions>
    </PageContentSection>
  </PageContent>
</template>

<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

import {
  Button,
  Descriptions,
  EditButton,
  PageBreadcrumb,
  PageContent,
  PageContentSection,
  PageTitle
} from '@/components';
import { useTranslation } from '@/composables';
import { AppRoute, Permission } from '@/constants';
import { useAuth } from '@/modules/auth/useAuth';
import type { BreadcrumbItemProps, DescriptionsFieldProps } from '@/types';
import UserDetailsInfo from '../components/UserDetailsInfo.vue';
import UserStatus from '../components/UserStatus.vue';
import { useDeleteUserMutation, useUserQuery } from '../composables/useUserQuery';
import { userQueryKeys } from '../query-keys';

const queryClient = useQueryClient();
const { t } = useTranslation();
const { params } = useRoute();
const { hasPermission } = useAuth();

const breadcrumbItems = computed<BreadcrumbItemProps[]>(() => [
  {
    title: t('user.list'),
    to: AppRoute.USER
  },
  {
    title: t('details')
  }
]);

const userId = params.id as string;

const { data } = useUserQuery(userId);
const { mutate: deleteUser, isPending: isDeleting } = useDeleteUserMutation(userId);

const editPath = computed(() => {
  const user = data.value;
  if (!user) {
    return '';
  }
  return AppRoute.USER_EDIT.replace(':id', String(user.id));
});

const fields = computed((): DescriptionsFieldProps[] => {
  const user = data.value;
  if (!user) {
    return [];
  }

  return [
    {
      label: t('personalInfo'),
      fields: [
        {
          label: t('fullName'),
          value: [user.firstName, user.lastName].filter(Boolean).join(' ') || '-'
        },
        {
          label: t('email'),
          value: user.email ?? '-'
        },
        {
          label: t('role.label'),
          value: user.role?.name ?? t('role.label')
        },
        {
          slotName: 'status',
          label: t('status')
        }
      ]
    }
  ];
});

const pageTitle = computed(() => {
  const user = data.value;
  if (!user) {
    return t('user.details');
  }
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  return fullName || user.email || t('user.details');
});

onUnmounted(() => {
  queryClient.cancelQueries({
    queryKey: userQueryKeys.user(params.id as string)
  });
});

const handleDelete = () => {
  if (!data.value) {
    return;
  }

  const confirmed = window.confirm(t('user.confirmDelete'));
  if (!confirmed) {
    return;
  }

  deleteUser();
};
</script>

<style scoped></style>
