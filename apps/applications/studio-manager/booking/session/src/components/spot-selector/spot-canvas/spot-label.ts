// Legacy parity (saas-legacy CanvasSpot.getText): prefix/suffix are mutually
// exclusive — render whichever is set, not both. Falsy indexType (incl. 0)
// falls back to `index`, mirroring legacy.
export const composeLabel = (
  prefix: string | null | undefined,
  indexType: string | number | null | undefined,
  index: number,
  suffix: string | null | undefined,
): string => {
  const core = indexType ? String(indexType) : String(index);
  if (prefix) return `${prefix}${core}`;
  if (suffix) return `${core}${suffix}`;
  return core;
};

export const truncateLabel = (label: string, max = 4) =>
  label.length > max ? `${label.slice(0, max - 1)}…` : label;
