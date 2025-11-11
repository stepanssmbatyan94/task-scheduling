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
        <div class="task-board-filters">
          <span class="p-input-icon-left task-board-filters__search-wrapper">
            <i class="pi pi-search mr-2" />
            <InputText
              v-model="searchTerm"
              :placeholder="t('tasks.filters.searchPlaceholder')"
              class="task-board-filters__search"
            />
          </span>
          <Button
            v-if="trimmedSearchTerm.length > 0"
            severity="secondary"
            size="small"
            icon="pi pi-times"
            :label="t('tasks.filters.clearSearch')"
            class="task-board-filters__clear"
            @click="clearSearch"
          />
          <MultiSelect
            v-model="selectedUserIds"
            :options="userFilterOptions"
            option-label="label"
            option-value="value"
            display="chip"
            :loading="assignmentLoading"
            :disabled="assignmentLoading"
            :placeholder="t('tasks.filters.assignedUsersPlaceholder')"
            class="task-board-filters__multiselect"
          />
          <Button
            v-if="selectedUserIds.length > 0"
            severity="secondary"
            size="small"
            icon="pi pi-times"
            :label="t('tasks.filters.clearAssignedUsers')"
            class="task-board-filters__clear"
            @click="clearSelectedUsers"
          />
        </div>

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
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          {{ t('tasks.emptyState') }}
        </div>
      </Card>
    </PageContent>

    <TaskFormModal
      :visible="showCreateModal"
      mode="create"
      :task="null"
      :statuses="taskStatuses"
      :assignable-users="assignableUsers"
      :assignable-users-loading="assignmentLoading"
      :is-submitting="isCreatingTask"
      @close="closeCreateModal"
      @submit="handleCreateTask"
    />

    <TaskViewModal
      :visible="isViewModalOpen"
      :task="selectedTask"
      :statuses="taskStatuses"
      :assignable-users="assignableUsers"
      @close="handleCloseView"
      @edit="openEditModal"
    />

    <TaskFormModal
      :visible="isEditModalOpen"
      mode="edit"
      :task="selectedTask"
      :statuses="taskStatuses"
      :assignable-users="assignableUsers"
      :assignable-users-loading="assignmentLoading"
      :is-submitting="isUpdatingTask"
      @close="handleCloseEdit"
      @submit="handleUpdateTask"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import { KanbanBoard, TaskFormModal, TaskViewModal } from '../../components';
import { useTasks } from '../../composables/useTasks';
import { useAssignableUsers } from '../../composables/useAssignableUsers';

import {
  Button,
  Card,
  PageBreadcrumb,
  PageContent,
  PageTitle
} from '@/components';
import { useDebouncedRef, useTranslation } from '@/composables';
import type { BreadcrumbItemProps } from '@/types';
import type { KanbanItem } from '../../components/types';
import type { AssignableUser, CreateTaskPayload, Task, UpdateTaskPayload } from '../../task-type';
import { toast } from 'vue3-toastify';

const { t } = useTranslation();

const selectedUserIds = ref<string[]>([]);
const searchTerm = ref('');
const debouncedSearchTerm = useDebouncedRef(searchTerm, 300);
const trimmedSearchTerm = computed(() => debouncedSearchTerm.value.trim());
const taskFilters = computed(() => {
  const filters: Record<string, unknown> = {};

  const userIds = selectedUserIds.value
    .map((id) => {
      const numericId = Number(id);
      return Number.isNaN(numericId) ? id : numericId;
    })
    .filter((id) => id !== undefined && id !== null);

  if (userIds.length > 0) {
    filters.assignedUsers = userIds.map((id) => ({ id }));
  }

  if (trimmedSearchTerm.value.length > 0) {
    filters.search = trimmedSearchTerm.value;
  }

  return Object.keys(filters).length > 0 ? filters : undefined;
});

const {
  tasks,
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
  createTask,
  isCreatingTask,
  updateTask,
  isUpdatingTask,
  updateTaskError
} = useTasks({ filters: taskFilters });

const {
  assignableUsers,
  isLoading: isLoadingAssignableUsers,
  isFetching: isFetchingAssignableUsers,
  isError: isErrorAssignableUsers
} = useAssignableUsers();

const assignmentLoading = computed(
  () => isLoadingAssignableUsers.value || isFetchingAssignableUsers.value
);

const userFilterOptions = computed(() => {
  return (assignableUsers.value ?? []).map((user) => ({
    label: formatUserDisplayName(user),
    value: String(user.id)
  }));
});

watch(
  assignableUsers,
  (users) => {
    const validIds = new Set((users ?? []).map((user) => String(user.id)));
    selectedUserIds.value = selectedUserIds.value.filter((id) => validIds.has(id));
  },
  { immediate: true }
);

const showCreateModal = ref(false);
const isViewModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedTask = ref<Task | null>(null);

const breadcrumbItems = ref<BreadcrumbItemProps[]>([
  {
    title: t('tasks.board')
  }
]);

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

const handleAssignUser = async (item: KanbanItem, user: AssignableUser | null) => {
  const taskId = resolveTaskId(item);

  if (taskId === null) {
    return;
  }

  try {
    await assignTaskUser({
      id: taskId,
      user
    });
  } catch (error) {
    console.error('Failed to assign task user', error);
  }
};

const handleItemClicked = (item: KanbanItem) => {
  const task = tasks.value.find((existingTask) => existingTask.id === item.id);
  selectedTask.value = task ?? null;
  isViewModalOpen.value = Boolean(task);
  isEditModalOpen.value = false;
};

const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const handleCreateTask = async (payload: CreateTaskPayload) => {
  try {
    await createTask(payload);
    toast.success(t('tasks.messages.createSuccess'));
    closeCreateModal();
  } catch (error) {
    console.error('Failed to create task', error);
  }
};

const handleCloseView = () => {
  isViewModalOpen.value = false;
  if (!isEditModalOpen.value) {
    selectedTask.value = null;
  }
};

const openEditModal = () => {
  if (!selectedTask.value) {
    return;
  }
  isViewModalOpen.value = false;
  isEditModalOpen.value = true;
};

const handleCloseEdit = () => {
  isEditModalOpen.value = false;
  selectedTask.value = null;
};

const handleUpdateTask = async (payload: CreateTaskPayload) => {
  if (!selectedTask.value) {
    return;
  }

  const updatePayload: UpdateTaskPayload = {
    ...payload
  };

  try {
    await updateTask({
      id: selectedTask.value.id,
      values: updatePayload
    });
    toast.success(t('tasks.messages.updateSuccess'));
    handleCloseEdit();
  } catch (error) {
    console.error('Failed to update task', error || updateTaskError.value);
  }
};

const clearSelectedUsers = () => {
  selectedUserIds.value = [];
};

const clearSearch = () => {
  searchTerm.value = '';
};

const formatUserDisplayName = (user: AssignableUser): string => {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (fullName) {
    return fullName;
  }

  if (user.email) {
    return user.email;
  }

  return t('tasks.unassigned');
};
</script>

<style src="./TaskBoardView.styles.css" scoped></style>
