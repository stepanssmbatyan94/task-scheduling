/**
 * Composable for handling drag and drop functionality in Kanban components
 */

import { ref } from 'vue';
import type { KanbanItem } from '../components/types';
import { createUpdatedItem } from '../components/utils';
import { DRAG_DATA_KEY, DRAG_EFFECT } from '../components/constants';

export function useKanbanDragDrop(
  currentLaneSlug: string,
  onItemUpdated: (item: KanbanItem, newStatus: string) => void
) {
  const draggedItem = ref<KanbanItem | null>(null);

  const handleDragStart = (event: DragEvent, item: KanbanItem) => {
    draggedItem.value = item;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = DRAG_EFFECT;
      event.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(item));
    }
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const data = event.dataTransfer?.getData(DRAG_DATA_KEY);

    if (!data) {
      draggedItem.value = null;
      return;
    }

    try {
      const item: KanbanItem = JSON.parse(data);

      // Only emit update if item is being moved to a different lane
      if (item.status !== currentLaneSlug) {
        const updatedItem = createUpdatedItem(item, currentLaneSlug);
        onItemUpdated(updatedItem, currentLaneSlug);
      }
    } catch (error) {
      console.error('Error parsing dropped item:', error);
    } finally {
      draggedItem.value = null;
    }
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault();
  };

  return {
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    draggedItem
  };
}
