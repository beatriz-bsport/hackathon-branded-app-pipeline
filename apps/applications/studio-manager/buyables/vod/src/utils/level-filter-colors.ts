const LEVEL_FILTER_VALUE_PREFIX = "level:";

export const getLevelFilterValueId = (levelId: number) =>
  `${LEVEL_FILTER_VALUE_PREFIX}${levelId}`;

export const getLevelIdFromFilterValue = (value: string) =>
  parseInt(value.slice(LEVEL_FILTER_VALUE_PREFIX.length), 10);
