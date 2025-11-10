<template>
  <div class="task-board-container">
    <PageBreadcrumb :items="breadcrumbItems" />
    <PageTitle :name="t('tasks.board')" :show-back-button="false">
      <template #actionButton>
        <Button
          :label="t('tasks.create')"
          icon="pi pi-plus"
          @click="openCreateModal"
        />
      </template>
    </PageTitle>

    <PageContent>
      <Card class="p-4">
        <div v-if="isLoading" class="text-center py-8">
          <p class="text-gray-500">{{ t('tasks.messages.loading') }}</p>
        </div>
        <div v-else-if="isError" class="text-center py-8 text-red-500">
          <p>{{ t('tasks.messages.loadError') }}</p>
        </div>
        <div v-else-if="kanbanItems.length > 0" class="kanban-wrapper">
          <KanbanBoard
            :items="kanbanItems"
            :lanes="lanes"
            :assignable-users="assignableUsers"
            :is-loading-assignable-users="assignmentLoading"
            :is-error-assignable-users="isErrorAssignableUsers"
            @item-updated="handleItemUpdated"
            @item-clicked="handleItemClicked"
            @assign-user="handleAssignUser"
          />
          <div class="kanban-feedback">
            <div v-if="isUpdatingTaskStatus" class="kanban-feedback-message">
              {{ t('tasks.messages.statusUpdating') }}
            </div>
            <div
              v-if="updateTaskStatusError"
              class="kanban-feedback-message kanban-feedback-message--error"
            >
              {{ t('tasks.messages.statusFailed') }}
            </div>
            <div
              v-if="isAssigningTaskUser"
              class="kanban-feedback-message"
            >
              {{ t('tasks.assignment.inProgress') }}
            </div>
            <div
              v-if="assignmentErrorMessage"
              class="kanban-feedback-message kanban-feedback-message--error"
            >
              {{ assignmentErrorMessage }}
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          {{ t('tasks.emptyState') }}
        </div>
      </Card>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { KanbanBoard } from '../../components';
import { useTasks } from '../../composables/useTasks';
import { useAssignableUsers } from '../../composables/useAssignableUsers';

import {
  Button,
  Card,
  PageBreadcrumb,
  PageContent,
  PageTitle
} from '@/components';
import { useTranslation } from '@/composables';
import type { BreadcrumbItemProps } from '@/types';
import type { KanbanItem } from '../../components/types';
import type { AssignableUser } from '../../task-type';

const { t } = useTranslation();

// Fetch tasks from API
const {
  kanbanItems,
  lanes,
  taskStatuses,
  isLoading,
  isError,
  updateTaskStatus,
  isUpdatingTaskStatus,
  updateTaskStatusError,
  assignTaskUser,
  isAssigningTaskUser,
  assignTaskUserError
} = useTasks();

const {
  assignableUsers,
  isLoading: isLoadingAssignableUsers,
  isFetching: isFetchingAssignableUsers,
  isError: isErrorAssignableUsers
} = useAssignableUsers();

const assignmentErrorMessage = ref<string | null>(null);

const assignmentLoading = computed(
  () => isLoadingAssignableUsers.value || isFetchingAssignableUsers.value
);

// Breadcrumb
const breadcrumbItems = ref<BreadcrumbItemProps[]>([
  {
    title: t('dashboard')
  },
  {
    title: t('tasks.board')
  }
]);

// Event handlers
const handleItemUpdated = async (item: KanbanItem, newStatus: string) => {
  if (item.id === undefined || item.id === null) {
    console.warn('Unable to update task status: missing task identifier', item);
    return;
  }

  const nextStatus = taskStatuses.value.find(
    (status) => status.name === newStatus
  );

  if (!nextStatus) {
    console.warn(`Unable to update task status: status "${newStatus}" not found`);
    return;
  }

  const taskId =
    typeof item.id === 'string' ? Number.parseInt(item.id, 10) : item.id;

  if (Number.isNaN(taskId)) {
    console.warn('Unable to update task status: invalid task identifier', item);
    return;
  }

  try {
    await updateTaskStatus({
      id: taskId,
      statusId: nextStatus.id,
      statusName: nextStatus.name
    });
  } catch (error) {
    console.error(
      'Failed to update task status',
      error || updateTaskStatusError.value
    );
  }
};

const resolveTaskId = (item: KanbanItem): number | null => {
  if (item.id === undefined || item.id === null) {
    return null;
  }

  const taskId = typeof item.id === 'string' ? Number.parseInt(item.id, 10) : item.id;

  return Number.isNaN(taskId) ? null : taskId;
};

const parseAssignmentError = (error: unknown): string => {
  const defaultMessage = t('tasks.assignment.errors.generic');

  if (error && typeof error === 'object') {
    const errorObject = error as Record<string, any>;

    if (errorObject.errors && typeof errorObject.errors === 'object') {
      const assignedUserError = errorObject.errors.assignedUser;

      if (assignedUserError === 'userHasOverlappingTask') {
        return t('tasks.assignment.errors.overlap');
      }

      if (typeof assignedUserError === 'string') {
        return assignedUserError;
      }
    }

    if (typeof errorObject.message === 'string') {
      return errorObject.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};

const handleAssignUser = async (item: KanbanItem, user: AssignableUser | null) => {
  const taskId = resolveTaskId(item);

  if (taskId === null) {
    console.warn('Unable to assign task: invalid task identifier', item);
    return;
  }

  assignmentErrorMessage.value = null;

  try {
    await assignTaskUser({
      id: taskId,
      user
    });
  } catch (e) {
    const message = parseAssignmentError(e ?? assignTaskUserError.value);
    assignmentErrorMessage.value = message;
  }
};

const handleItemClicked = (item: KanbanItem) => {
  console.log('Item clicked:', item);
  // TODO: Open task details modal
};

const openCreateModal = () => {
  // TODO: Open create task modal
  console.log('Open create task modal');
};
</script>

<style src="./TaskBoardView.styles.css" scoped></style>
