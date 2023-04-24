// @ts-nocheck
import { ErrorAndLoading } from '#libs/types';

export type Level = {
  id: number;
  company: number;
  name: string;
  color: string;
  enabled: boolean;
};

export type LevelState = ErrorAndLoading & {
  byId: Record<number, Level>;
  allIds: number[];
};

export type LevelFilterSet = {
  is_active?: boolean;
  company?: number;
  id__in?: number[];
  offer__ids__in?: number[];
  vod__ids__in?: number[];
};
