import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let pendingIds: ReadonlySet<number> = new Set<number>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function addPendingDeletion(id: number) {
  if (pendingIds.has(id)) return;
  pendingIds = new Set(pendingIds).add(id);
  emit();
}

export function removePendingDeletion(id: number) {
  if (!pendingIds.has(id)) return;
  const next = new Set(pendingIds);
  next.delete(id);
  pendingIds = next;
  emit();
}

export function resetPendingDeletions() {
  pendingIds = new Set<number>();
  emit();
}

export function usePendingVideoDeletionIds(): ReadonlySet<number> {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => pendingIds,
    () => new Set<number>(),
  );
}
