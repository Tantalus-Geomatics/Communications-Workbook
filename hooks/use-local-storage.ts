'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';

const LOCAL_STORAGE_CHANGE_EVENT = 'cmw-local-storage-change';

const emptySubscribe = () => () => {};

function useIsHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void, boolean] {
  const isHydrated = useIsHydrated();
  const initialRef = useRef(initialValue);
  const cacheRef = useRef<{ raw: string | null; parsed: T }>({
    raw: null,
    parsed: initialValue,
  });

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === key) {
          onStoreChange();
        }
      };
      const handleCustom = (event: Event) => {
        const customEvent = event as CustomEvent<{ key: string }>;
        if (customEvent.detail?.key === key) {
          onStoreChange();
        }
      };

      window.addEventListener('storage', handleStorage);
      window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleCustom);
      return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleCustom);
      };
    },
    [key]
  );

  const getSnapshot = useCallback((): T => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        cacheRef.current = { raw: null, parsed: initialRef.current };
        return initialRef.current;
      }
      if (cacheRef.current.raw === raw) {
        return cacheRef.current.parsed;
      }
      const parsed = JSON.parse(raw) as T;
      cacheRef.current = { raw, parsed };
      return parsed;
    } catch {
      return initialRef.current;
    }
  }, [key]);

  const getServerSnapshot = useCallback((): T => {
    return initialRef.current;
  }, []);

  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      const current = getSnapshot();
      const nextValue = value instanceof Function ? value(current) : value;
      try {
        const serialized = JSON.stringify(nextValue);
        window.localStorage.setItem(key, serialized);
        cacheRef.current = { raw: serialized, parsed: nextValue };
        window.dispatchEvent(
          new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } })
        );
      } catch {
        // Ignore storage quota errors
      }
    },
    [getSnapshot, key]
  );

  const clearValue = useCallback(() => {
    try {
      const serialized = JSON.stringify(initialRef.current);
      window.localStorage.setItem(key, serialized);
      cacheRef.current = { raw: serialized, parsed: initialRef.current };
      window.dispatchEvent(
        new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [key]);

  return [storedValue, setValue, clearValue, isHydrated];
}
