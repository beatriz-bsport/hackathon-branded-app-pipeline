import type { FilterElementState } from "@bsport/kaizen-primitive-core";

export const extractPersistedFilterIds = (
  filters: FilterElementState[],
  filterType: string,
): number[] => {
  const filter = filters.find((f) => f.field === filterType);
  return (
    filter?.valueIds.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id)) ||
    []
  );
};
