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
          <p class="text-gray-500">Loading tasks...</p>
        </div>
        <div v-else-if="isError" class="text-center py-8 text-red-500">
          <p>Error loading tasks. Please try again.</p>
        </div>
        <div v-else-if="kanbanItems.length > 0" class="kanban-wrapper">
          <KanbanBoard
            :items="kanbanItems"
            :lanes="lanes"
            @item-updated="handleItemUpdated"
            @item-clicked="handleItemClicked"
          />
          <div
            v-if="isUpdatingTaskStatus"
            class="mt-4 text-center text-gray-500 text-sm"
          >
            Updating task status...
          </div>
          <div
            v-else-if="updateTaskStatusError"
            class="mt-4 text-center text-red-500 text-sm"
          >
            Failed to update task status. Please try again.
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
import { ref } from 'vue';
import { KanbanBoard } from '../../components';
import { useTasks } from '../../composables/useTasks';

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
  updateTaskStatusError
} = useTasks();

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
