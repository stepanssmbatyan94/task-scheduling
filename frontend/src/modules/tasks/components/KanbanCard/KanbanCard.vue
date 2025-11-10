<template>
  <div
    class="kanban-card"
    draggable="true"
    @dragstart="handleDragStart"
    @click="handleClick"
  >
    <div class="kanban-card-header">
      <p class="kanban-card-title">{{ item.summary || item.title }}</p>
      <div class="kanban-card-assignee-control">
        <button
          class="kanban-card-assign-trigger"
          type="button"
          :title="assignedUserDisplayName"
          @click.stop="toggleAssignOverlay"
        >
          <Avatar
            v-if="item.assignedUser"
            :src="userAvatarSrc"
            :label="userInitials"
            shape="circle"
            class="kanban-card-avatar"
          />
          <span v-else class="kanban-card-assign-button" aria-hidden="true">
            <i class="pi pi-plus"></i>
          </span>
          <span class="sr-only">{{ assignedUserDisplayName }}</span>
        </button>

        <OverlayPanel
          ref="assignOverlay"
          appendTo="body"
          class="kanban-card-assign-overlay"
        >
          <div class="kanban-card-assign-overlay-content">
            <div v-if="isLoadingAssignableUsers" class="kanban-card-assign-overlay-status">
              {{ t('tasks.assignment.loading') }}
            </div>
            <div
              v-else-if="isErrorAssignableUsers"
              class="kanban-card-assign-overlay-status kanban-card-assign-overlay-status--error"
            >
              {{ t('tasks.assignment.loadError') }}
            </div>
            <div v-else>
              <button
                type="button"
                class="kanban-card-assign-option"
                :class="{ 'kanban-card-assign-option--selected': isSelectedUser(null) }"
                @click="handleUserSelection(null)"
              >
                <span>{{ t('tasks.assignment.unassign') }}</span>
                <i
                  v-if="isSelectedUser(null)"
                  class="pi pi-check kanban-card-assign-option-check"
                  aria-hidden="true"
                ></i>
              </button>

              <div
                v-if="sortedAssignableUsers.length === 0"
                class="kanban-card-assign-overlay-status"
              >
                {{ t('tasks.assignment.emptyList') }}
              </div>

              <ul v-else class="kanban-card-assign-list">
                <li v-for="user in sortedAssignableUsers" :key="user.id">
                  <button
                    type="button"
                    class="kanban-card-assign-option"
                    :class="{ 'kanban-card-assign-option--selected': isSelectedUser(user) }"
                    @click="handleUserSelection(user)"
                  >
                    <div class="kanban-card-assign-option-text">
                      <span class="kanban-card-assign-option-name">
                        {{ formatAssignableUserName(user) }}
                      </span>
                      <span v-if="user.email" class="kanban-card-assign-option-sub">
                        {{ user.email }}
                      </span>
                    </div>
                    <i
                      v-if="isSelectedUser(user)"
                      class="pi pi-check kanban-card-assign-option-check"
                      aria-hidden="true"
                    ></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </OverlayPanel>
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
        <span
          v-if="item.endDate"
          :class="['kanban-card-date', dueDateClass]"
          :title="dueDateTooltip"
        >
          <i class="pi pi-clock kanban-card-date-icon" aria-hidden="true"></i>
          {{ formatDate(item.endDate) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import OverlayPanel from 'primevue/overlaypanel';

import type { AssignableUser } from '../../task-type';
import type { KanbanItem } from '../types';
import { useTranslation } from '@/composables';
import Avatar from '@/components/ui/Avatar.vue';
import { getInitials } from '@/utils/common';

interface Props {
  item: KanbanItem;
  assignableUsers: AssignableUser[];
  isLoadingAssignableUsers: boolean;
  isErrorAssignableUsers: boolean;
}

const props = defineProps<Props>();

const { t } = useTranslation();

const emit = defineEmits<{
  'drag-start': [event: DragEvent, item: KanbanItem];
  'click': [item: KanbanItem];
  'assign-user': [item: KanbanItem, user: AssignableUser | null];
}>();

const handleDragStart = (event: DragEvent) => {
  emit('drag-start', event, props.item);
};

const handleClick = () => {
  emit('click', props.item);
};

const assignOverlay = ref<InstanceType<typeof OverlayPanel> | null>(null);

const collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'sort' });

const assignedUserId = computed(() => props.item.assignedUser?.id ?? null);

const assignedUserDisplayName = computed(() => {
  const user = props.item.assignedUser;
  if (!user) {
    return t('tasks.assignment.noAssignee');
  }

  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName;
  }

  return user.email ?? t('tasks.assignment.noEmail');
});

const formatAssignableUserName = (user: AssignableUser): string => {
  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName;
  }

  return user.email ?? t('tasks.assignment.noEmail');
};

const sortedAssignableUsers = computed<AssignableUser[]>(() => {
  return [...props.assignableUsers].sort((a, b) =>
    collator.compare(formatAssignableUserName(a), formatAssignableUserName(b))
  );
});

const toggleAssignOverlay = (event: MouseEvent) => {
  event.stopPropagation();
  assignOverlay.value?.toggle(event);
};

const handleUserSelection = (user: AssignableUser | null) => {
  emit('assign-user', props.item, user);
  assignOverlay.value?.hide();
};

const isSelectedUser = (user: AssignableUser | null) => {
  if (user === null) {
    return assignedUserId.value === null;
  }

  return assignedUserId.value === user.id;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
};

type DueDateVariant = 'overdue' | 'today' | 'upcoming' | undefined;

const dueDateDayDifference = computed<number | undefined>(() => {
  const rawDate = props.item.endDate;

  if (!rawDate) {
    return undefined;
  }

  const dueDate = new Date(rawDate);

  if (Number.isNaN(dueDate.getTime())) {
    return undefined;
  }

  const dueDateStart = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate()
  );
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diffInMs = dueDateStart.getTime() - todayStart.getTime();

  return Math.round(diffInMs / (1000 * 60 * 60 * 24));
});

const dueDateVariant = computed<DueDateVariant>(() => {
  const diffInDays = dueDateDayDifference.value;

  if (diffInDays === undefined) {
    return undefined;
  }

  if (diffInDays < 0) {
    return 'overdue';
  }

  if (diffInDays === 0) {
    return 'today';
  }

  return 'upcoming';
});

const dueDateClass = computed(() =>
  dueDateVariant.value ? `kanban-card-date--${dueDateVariant.value}` : undefined
);

const dueDateTooltip = computed(() => {
  const diffInDays = dueDateDayDifference.value;

  if (diffInDays === undefined) {
    return undefined;
  }

  switch (dueDateVariant.value) {
    case 'overdue':
      return t('tasks.dueDate.tooltip.overdue', {
        count: Math.abs(diffInDays)
      });
    case 'today':
      return t('tasks.dueDate.tooltip.today');
    case 'upcoming':
      return t('tasks.dueDate.tooltip.upcoming', {
        count: diffInDays
      });
    default:
      return undefined;
  }
});

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
