export type FilterDraftGuardState = {
  dirtySavedFilterKeys: Record<string, boolean>;
  unsavedNewFilterCount: number;
  setSavedFilterDirty: (filterKey: string, isDirty: boolean) => void;
  setUnsavedNewFilterCount: (count: number) => void;
  reset: () => void;
};
