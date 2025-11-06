/**
 * Utility functions for Kanban components
 */

import type { KanbanItem } from './types';

/**
 * Generates a unique key for a Kanban item
 * @param item - The Kanban item
 * @returns A unique key (id, summary, title, or random number)
 */
export function getItemKey(item: KanbanItem): string | number {
  return item.id ?? item.summary ?? item.title ?? Math.random();
}

/**
 * Checks if an item belongs to a specific lane
 * @param item - The Kanban item
 * @param laneSlug - The lane slug to check against
 * @returns True if the item belongs to the lane
 */
export function belongsToLane(item: KanbanItem, laneSlug: string): boolean {
  return item.status === laneSlug;
}

/**
 * Creates an updated item with a new status
 * @param item - The original Kanban item
 * @param newStatus - The new status to assign
 * @returns A new item object with the updated status
 */
export function createUpdatedItem(
  item: KanbanItem,
  newStatus: string
): KanbanItem {
  return { ...item, status: newStatus };
}

