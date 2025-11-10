<template>
  <Dialog
    :visible="visible"
    modal
    :style="{ width: '520px' }"
    @update:visible="onVisibilityChange"
  >
    <template #header>
      <div class="task-view-header">
        <span class="task-view-header__title">{{ headerTitle }}</span>
        <Button
          type="button"
          icon="pi pi-pencil"
          text
          :label="t('edit')"
          @click="emitEdit"
        />
      </div>
    </template>

    <div class="task-view-content">
      <div class="task-view-section">
        <span class="task-view-section__label">{{ t('tasks.fields.title') }}</span>
        <p class="task-view-section__value">{{ task?.title || '—' }}</p>
      </div>
      <div class="task-view-section">
        <span class="task-view-section__label">{{ t('tasks.fields.description') }}</span>
        <p class="task-view-section__value">{{ displayDescription }}</p>
      </div>
      <div class="task-view-section">
        <span class="task-view-section__label">{{ t('tasks.fields.assignedUser') }}</span>
        <p class="task-view-section__value">{{ assignedUserName }}</p>
      </div>
      <div class="task-view-section task-view-section--grid">
        <div>
          <span class="task-view-section__label">{{ t('tasks.fields.startDate') }}</span>
          <p class="task-view-section__value">{{ formatDate(task?.startDate) }}</p>
        </div>
        <div>
          <span class="task-view-section__label">{{ t('tasks.fields.endDate') }}</span>
          <p class="task-view-section__value">{{ formatDate(task?.endDate) }}</p>
        </div>
        <div>
          <span class="task-view-section__label">{{ t('tasks.fields.status') }}</span>
          <p class="task-view-section__value">{{ statusName }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        type="button"
        severity="secondary"
        :label="t('close')"
        @click="emitClose"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Dialog from 'primevue/dialog';

import { Button } from '@/components';
import { useTranslation } from '@/composables';
import type { AssignableUser, Task, TaskStatus } from '../../task-type';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    task: Task | null;
    statuses: TaskStatus[];
    assignableUsers: AssignableUser[];
  }>(),
  {
    statuses: () => [],
    assignableUsers: () => []
  }
);

const emit = defineEmits<{
  close: [];
  edit: [];
}>();

const { t } = useTranslation();

const headerTitle = computed(() => {
  if (!props.task) {
    return t('tasks.details');
  }

  return props.task.title || t('tasks.details');
});

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const assignedUserName = computed(() => {
  if (!props.task?.assignedUser) {
    return t('tasks.assignment.noAssignee');
  }

  return formatUserDisplayName(props.task.assignedUser);
});

const statusName = computed(() => {
  if (!props.task?.status) {
    return t('tasks.fields.status');
  }

  const status = props.statuses.find((item) => item.id === props.task?.status.id);
  return status ? formatStatusName(status.name) : formatStatusName(props.task.status.name);
});

const displayDescription = computed(() => props.task?.description?.trim() || '—');

const formatStatusName = (statusName: string): string => {
  return statusName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatUserDisplayName = (user: AssignableUser): string => {
  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName;
  }

  if (user.email) {
    return user.email;
  }

  return t('tasks.assignment.noAssignee');
};

const onVisibilityChange = (isVisible: boolean) => {
  if (!isVisible) {
    emitClose();
  }
};

const emitClose = () => {
  emit('close');
};

const emitEdit = () => {
  emit('edit');
};
</script>

<style src="./TaskViewModal.styles.css" scoped></style>
