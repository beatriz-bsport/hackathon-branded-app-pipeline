import type { DateTime as DateTimeType } from 'luxon';

export type ReactRefT<T> = { current: T | null | void };

export type LuxonDateTime = DateTimeType;
