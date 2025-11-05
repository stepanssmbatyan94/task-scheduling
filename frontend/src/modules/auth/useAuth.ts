import { storeToRefs } from 'pinia';

import { useCurrentUserStore } from '@/modules/current-user/current-user-store';
import type { Permission } from '@/types';

export function useAuth() {
  const store = useCurrentUserStore();
  const { authorities } = storeToRefs(store);

  function hasAuthority(menuAuthorities?: string[]): boolean {
    if (!menuAuthorities || menuAuthorities.length === 0) {
      return true;
    }

    return store.isAuthorize(menuAuthorities);
  }

  function hasPermission(permission: Permission): boolean {
    if (!permission) {
      return true;
    }

    if (!authorities.value || authorities.value.length === 0) {
      return true;
    }

    return authorities.value.includes(permission);
  }

  return {
    authorities,
    hasAuthority,
    hasPermission
  };
}
