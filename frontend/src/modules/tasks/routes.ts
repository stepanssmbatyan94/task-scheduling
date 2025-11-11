import type { RouteRecordRaw } from 'vue-router';

import { AppRoute } from '@/constants';
import TaskBoardView from './pages/TaskBoardView';

export const taskRoutes: RouteRecordRaw[] = [
  {
    path: AppRoute.TASKS,
    name: AppRoute.TASKS,
    component: TaskBoardView,
    meta: {
      requiresAuth: true,
      authorities: []
    }
  }
];

