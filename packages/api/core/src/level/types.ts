export type Level = {
  id: number;
  company?: number;
  name: string;
  color: string;
  enabled?: boolean;
};

export type LevelFilterSet = {
  is_active?: boolean;
  company?: number;
  id__in?: number[];
  offer__ids__in?: number[];
  vod__ids__in?: number[];
};
