<template>
  <div class="task-board-container">
    <PageBreadcrumb :items="breadcrumbItems" />
    <PageTitle :name="t('tasks.board')" :show-back-button="false">
      <template #actionButton>
        <AddNewButton @click="openCreateModal" :label="t('tasks.create')" />
      </template>
    </PageTitle>

    <PageContent>
      <Card class="p-4">
        <div v-if="items.length > 0" class="kanban-wrapper">
          <KanbanBoard
            :items="items"
            :lanes="lanes"
            @item-updated="handleItemUpdated"
            @item-clicked="handleItemClicked"
          />
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          No tasks available
        </div>
      </Card>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { KanbanBoard } from '../../components';

import {
  AddNewButton,
  Card,
  PageBreadcrumb,
  PageContent,
  PageTitle
} from '@/components';
import { useTranslation } from '@/composables';
import type { BreadcrumbItemProps } from '@/types';

const { t } = useTranslation();

// Kanban board data
const lanes = ref([
  { name: 'Pending', slug: 'pending' },
  { name: 'In Progress', slug: 'in-progress' },
  { name: 'Completed', slug: 'completed' },
  { name: 'Cancelled', slug: 'cancelled' }
]);

const items = ref([
  {
    id: 1,
    status: 'pending',
    summary: 'Sample Task 1',
    description: 'This is a sample task description for the pending column.',
    assignedUser: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe'
    },
    endDate: '2025-01-20T00:00:00Z'
  },
  {
    id: 2,
    status: 'pending',
    summary: 'Another Pending Task',
    description: 'Another task that needs to be done.',
    endDate: '2025-01-25T00:00:00Z'
  },
  {
    id: 3,
    status: 'in-progress',
    summary: 'Task in Progress',
    description: 'This task is currently being worked on.',
    assignedUser: {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith'
    },
    endDate: '2025-01-30T00:00:00Z'
  },
  {
    id: 4,
    status: 'completed',
    summary: 'Completed Task',
    description: 'This task has been completed successfully.',
    assignedUser: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe'
    },
    endDate: '2025-01-15T00:00:00Z'
  }
]);

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
const handleItemUpdated = (item: any, newStatus: string) => {
  console.log('Item updated:', item, 'New status:', newStatus);
  // Update the item in the local array
  const index = items.value.findIndex((i) => i.id === item.id);
  if (index !== -1) {
    items.value[index] = { ...item, status: newStatus };
  }
  // TODO: Update task via API
};

const handleItemClicked = (item: any) => {
  console.log('Item clicked:', item);
  // TODO: Open task details modal
};

const openCreateModal = () => {
  // TODO: Open create task modal
  console.log('Open create task modal');
};
</script>

<style src="./TaskBoardView.styles.css" scoped></style>
