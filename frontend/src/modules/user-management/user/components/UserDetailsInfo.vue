<template>
  <Card class="flex">
    <div class="p-2">
      <UserAvatar class="!h-32 !w-32" />
    </div>

    <section class="p-4 w-auto min-w-72">
      <section class="flex items-center">
        <h2 class="text-lg font-medium">
          {{ fullName }}
        </h2>
      </section>

      <section class="mt-2 flex flex-col gap-y-1">
        <p class="flex flex-row gap-x-6">
          <span class="w-20">{{ t('email') }}</span>
          <span>{{ user?.email ?? '-' }}</span>
        </p>
        <p class="flex flex-row gap-x-6">
          <span class="w-20">{{ t('role.label') }}</span>
          <span>{{ roleLabel }}</span>
        </p>
        <p class="flex flex-row gap-x-6">
          <span class="w-20">{{ t('status') }}</span>
          <span>
            <UserStatus :status="user?.status" />
          </span>
        </p>
      </section>
    </section>
  </Card>
</template>

<script setup lang="ts">
import { Card, UserAvatar } from '@/components';
import { useTranslation } from '@/composables';
import type { User } from '../user-type';
import UserStatus from './UserStatus.vue';

type UserDetailsInfoProps = {
  user: User | undefined;
};

import { computed } from 'vue';

const props = defineProps<UserDetailsInfoProps>();

const { t } = useTranslation();

const fullName = computed(() => {
  const parts = [props.user?.firstName, props.user?.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : t('user.label');
});

const roleLabel = computed(() => props.user?.role?.name ?? t('role.label'));
</script>

<style scoped></style>
