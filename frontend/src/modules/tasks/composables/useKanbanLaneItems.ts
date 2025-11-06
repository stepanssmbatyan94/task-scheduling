/**
 * Composable for filtering and managing lane items
 */

import { computed } from 'vue';
import type { KanbanItem, Lane } from '../components/types';
import { belongsToLane } from '../components/utils';

export function useKanbanLaneItems(lane: Lane, items: KanbanItem[]) {
  const laneItems = computed(() => {
    return items.filter((item) => belongsToLane(item, lane.slug));
  });

  const itemCount = computed(() => laneItems.value.length);

  return {
    laneItems,
    itemCount
  };
}
