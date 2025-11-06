<template>
  <div
    class="kanban-card"
    draggable="true"
    @dragstart="handleDragStart"
    @click="handleClick"
  >
    <div class="kanban-card-header">
      <p class="kanban-card-title">{{ item.summary || item.title }}</p>
      <Avatar
          v-if="item.assignedUser"
          :src="userAvatarSrc"
          :label="userInitials"
          shape="circle"
          class="kanban-card-avatar"
        />

      <div v-else>
        <button
          class="kanban-card-assign-button"
          @click.stop="handleAssignClick"
          type="button"
          :title="unassignedText"
        >
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>
    <p v-if="item.description" class="kanban-card-description">
      {{ item.description }}
    </p>
    <div class="kanban-card-footer">
      <span v-if="item.assignedUser" class="kanban-card-assignee">
        {{ item.assignedUser.firstName }} {{ item.assignedUser.lastName }}
      </span>
      <div class="kanban-card-footer-right">
        <span v-if="item.endDate" class="kanban-card-date">
          {{ formatDate(item.endDate) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { KanbanItem } from '../types';
import { useTranslation } from '@/composables';
import Avatar from '@/components/ui/Avatar.vue';
import { getInitials } from '@/utils/common';

interface Props {
  item: KanbanItem;
}

const props = defineProps<Props>();

const { t } = useTranslation();

const emit = defineEmits<{
  'drag-start': [event: DragEvent, item: KanbanItem];
  'click': [item: KanbanItem];
}>();

const handleDragStart = (event: DragEvent) => {
  emit('drag-start', event, props.item);
};

const handleClick = () => {
  emit('click', props.item);
};

const handleAssignClick = () => {
  console.log('Assign user clicked for task:', props.item);
  // TODO: Open assign user modal/dialog
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const unassignedText = computed(() => t('tasks.unassigned'));

const userAvatarSrc = computed(() => {
  const user = props.item.assignedUser;
  if (!user) return undefined;
  return user.profileImageUrl || user.photo?.path || undefined;
});

const userInitials = computed(() => {
  const user = props.item.assignedUser;
  if (!user) return undefined;
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return fullName ? getInitials(fullName) : undefined;
});
</script>

<style src="./KanbanCard.styles.css" scoped></style>
