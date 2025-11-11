import type { RouteRecordRaw } from 'vue-router';

import { AppRoute } from '@/constants';
import { userRoutes } from '@/modules/user-management/router';
import { taskRoutes } from '@/modules/tasks/routes';

export const privateRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/master-layout/AppMasterLayout.vue'),
    children: [
      {
        path: AppRoute.DASHBOARD,
        name: AppRoute.DASHBOARD,
        component: () => import('@/modules/dashboard/DashboardView.vue'),
        alias: ['/'],
        meta: { requiresAuth: true }
      },
      ...userRoutes,
      ...taskRoutes
    ]
  }
];
