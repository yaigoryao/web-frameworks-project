import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createRootStore, type RootStore } from './rootStore';

const StoreContext = createContext<RootStore | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo(() => createRootStore(), []);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useRootStore(): RootStore {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useRootStore must be used within StoreProvider');
  }
  return store;
}
