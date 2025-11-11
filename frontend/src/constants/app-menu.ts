import { LayoutDashboard, UserCog, ClipboardList } from 'lucide-vue-next';

import { AppRoute, Permission } from '@/constants';
import type { IMenuItem } from '@/types';

export const menus: IMenuItem[] = [
  {
    to: AppRoute.DASHBOARD,
    label: 'dashboard',
    icon: LayoutDashboard
  },
  {
    to: AppRoute.TASKS,
    label: 'tasks.board',
    icon: ClipboardList
  },
  {
    to: AppRoute.USER,
    label: 'user.list',
    icon: UserCog,
    authorities: [
      Permission.CREATE_USER,
      Permission.EDIT_USER,
      Permission.VIEW_USER_LISTING,
      Permission.VIEW_USER_DETAILS
    ]
  }
];
