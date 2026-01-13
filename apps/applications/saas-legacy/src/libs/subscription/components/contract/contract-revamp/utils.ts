function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function getIdOrObject<T extends { id: number }>(
  value: T | number,
): number {
  return isNumber(value) ? value : value.id;
}
