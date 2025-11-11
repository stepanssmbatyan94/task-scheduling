<template>
  <Tag v-if="state" :severity="state.severity" :label="state.label" :icon="state.icon" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Tag } from '@/components';
import { useTranslation } from '@/composables';
import type { TagProps } from '@/types';

type UserStatusProps = {
  status?: {
    id: number | string;
    name?: string | null;
  } | null;
};

const props = defineProps<UserStatusProps>();
const { t } = useTranslation();

const normalizedStatus = computed(() =>
  props.status?.name?.toString().toLowerCase() ?? ''
);

const userStatus = computed<Record<string, TagProps>>(() => ({
  active: {
    label: t('active'),
    icon: 'pi pi-check',
    severity: 'success'
  },
  inactive: {
    label: t('deactivated'),
    icon: 'pi pi-times',
    severity: 'danger'
  }
}));

const state = computed(() => userStatus.value[normalizedStatus.value]);
</script>

<style scoped></style>
