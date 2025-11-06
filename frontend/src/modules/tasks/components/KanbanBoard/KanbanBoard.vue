<template>
  <div class="kanban-board">
    <div
      v-for="lane in lanes"
      :key="lane.slug"
      class="kanban-lane"
      @drop="(e) => handleDrop(e, lane.slug)"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
    >
      <div class="kanban-lane-header">
        <h3 class="kanban-lane-title">{{ lane.name }}</h3>
        <span class="kanban-lane-count">{{ getLaneItemCount(lane.slug) }}</span>
      </div>
      <div class="kanban-lane-content">
        <KanbanCard
          v-for="item in getLaneItems(lane.slug)"
          :key="getItemKey(item)"
          :item="item"
          @drag-start="handleDragStart"
          @click="handleItemClick"
        />
        <div v-if="getLaneItems(lane.slug).length === 0" class="kanban-empty">
          {{ t('tasks.emptyState') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import KanbanCard from '../KanbanCard';
import { useKanbanDragDrop } from '../../composables/useKanbanDragDrop';
import { getItemKey, belongsToLane } from '../utils';
import type { KanbanBoardProps, KanbanEmits, KanbanItem } from '../types';
import { useTranslation } from '@/composables';
import { DRAG_DATA_KEY } from '../constants';

const props = defineProps<KanbanBoardProps>();

const emit = defineEmits<KanbanEmits>();

const { t } = useTranslation();

const getLaneItems = (laneSlug: string): KanbanItem[] => {
  return props.items.filter((item) => belongsToLane(item, laneSlug));
};

const getLaneItemCount = (laneSlug: string): number => {
  return getLaneItems(laneSlug).length;
};

const handleItemUpdated = (item: KanbanItem, newStatus: string) => {
  emit('item-updated', item, newStatus);
};

const handleItemClick = (item: KanbanItem) => {
  emit('item-clicked', item);
};

// Use drag handler for drag start
const { handleDragStart } = useKanbanDragDrop('', handleItemUpdated);

const handleDrop = (event: DragEvent, laneSlug: string) => {
  event.preventDefault();
  const data = event.dataTransfer?.getData(DRAG_DATA_KEY);

  if (!data) {
    return;
  }

  try {
    const item: KanbanItem = JSON.parse(data);

    // Only emit update if item is being moved to a different lane
    if (item.status !== laneSlug) {
      handleItemUpdated(item, laneSlug);
    }
  } catch (error) {
    console.error('Error parsing dropped item:', error);
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault();
};
</script>

<style src="./KanbanBoard.styles.css" scoped></style>
