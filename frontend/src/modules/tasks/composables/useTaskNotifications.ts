import { onBeforeUnmount, shallowRef, watch } from 'vue';
import type { Ref } from 'vue';
import { io, type Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue3-toastify';

import { env } from '@/config/env';
import { useTranslation } from '@/composables';
import { useCurrentUserStore } from '@/modules/current-user/current-user-store';

import { TASKS_BASE_QUERY_KEY } from './useTasks';

type TaskAssignmentPayload = {
  taskId: number;
  title: string;
  status?: string | null;
  isReassignment?: boolean;
};

const SOCKET_NAMESPACE = '/tasks';

export function useTaskNotifications(): void {
  const currentUserStore = useCurrentUserStore();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const socketRef = shallowRef<Socket | null>(null) as Ref<Socket | null>;

  const disconnect = () => {
    if (socketRef.value) {
      socketRef.value.disconnect();
      socketRef.value = null;
    }
  };

  const connect = (userId: number) => {
    if (!env.SOCKET_BASE_URL) {
      return;
    }

    const socket = io(`${env.SOCKET_BASE_URL}${SOCKET_NAMESPACE}`, {
      withCredentials: true,
      transports: ['websocket'],
      query: {
        userId: String(userId),
      },
    });

    socket.on('connect_error', (error) => {
      console.error('Task notifications socket error:', error);
    });

    socket.on('taskAssigned', (payload: TaskAssignmentPayload) => {
      const message = payload.isReassignment
        ? t('tasks.notifications.reassigned', { title: payload.title })
        : t('tasks.notifications.assigned', { title: payload.title });

      toast.info(message);
      queryClient.invalidateQueries({ queryKey: TASKS_BASE_QUERY_KEY });
    });

    socketRef.value = socket;
  };

  watch(
    () => currentUserStore.user?.id,
    (userId) => {
      disconnect();

      if (userId) {
        connect(Number(userId));
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    disconnect();
  });
}

