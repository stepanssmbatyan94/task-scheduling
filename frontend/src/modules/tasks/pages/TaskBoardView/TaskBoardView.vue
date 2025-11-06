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
  isLoading,
  isError,
  refetch
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
const handleItemUpdated = (item: KanbanItem, newStatus: string) => {
  console.log('Item updated:', item, 'New status:', newStatus);
  // TODO: Update task via API
  // After successful update, refetch tasks
  // refetch();
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
