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
            :style="avatarStyle"
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
      {{ truncatedDescription }}
      <span v-if="shouldShowDescriptionTooltip" class="kanban-card-description-more">
        (…)
      </span>
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

const DESCRIPTION_CHAR_LIMIT = 160;

const truncatedDescription = computed(() => {
  if (!props.item.description) {
    return '';
  }

  return props.item.description.length > DESCRIPTION_CHAR_LIMIT
    ? props.item.description.slice(0, DESCRIPTION_CHAR_LIMIT).trimEnd()
    : props.item.description;
});

const shouldShowDescriptionTooltip = computed(() => {
  return Boolean(props.item.description && props.item.description.length > DESCRIPTION_CHAR_LIMIT);
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

const AVATAR_COLOR_PALETTE = [
  '#FDE68A',
  '#FBCFE8',
  '#BFDBFE',
  '#BBF7D0',
  '#FECACA',
  '#DDD6FE',
  '#FCD34D',
  '#C7D2FE',
  '#A7F3D0',
  '#F9A8D4'
] as const;

const getSeedFromValue = (value: unknown): number | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'number') {
    return value;
  }

  const text = String(value);
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }

  return hash;
};

const avatarBackgroundColor = computed(() => {
  if (userAvatarSrc.value) {
    return undefined;
  }

  const candidateIds = [
    props.item.assignedUser?.id,
    props.item.assignedUser?.email,
    props.item.assignedUser?.firstName,
    props.item.id
  ];

  for (const candidate of candidateIds) {
    const seed = getSeedFromValue(candidate);

    if (seed !== undefined) {
      const index = Math.abs(seed) % AVATAR_COLOR_PALETTE.length;
      return AVATAR_COLOR_PALETTE[index];
    }
  }

  return AVATAR_COLOR_PALETTE[0];
});

const avatarStyle = computed(() => {
  const backgroundColor = avatarBackgroundColor.value;

  if (!backgroundColor) {
    return undefined;
  }

  return {
    backgroundColor,
    color: '#111827'
  };
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
