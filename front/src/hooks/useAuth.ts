import { useRootStore } from '../stores/StoreContext';
import type { AuthStore } from '../stores/authStore';

/** Доступ к сессии; компоненты, читающие user/isLoading, оборачивайте в `observer`. */
export function useAuth(): AuthStore {
  return useRootStore().authStore;
}
