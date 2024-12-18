import Immutable from 'seamless-immutable';
import type { LuxonDateTime } from '#src/types';

export type StatsState = Immutable.Immutable<{
  dateRange: DateRange;
  mainChart: string;
  stats: { [key: string]: any };
  bySmartListId: {
    [key: number]: {
      [key: number]: StatisticPointTable;
    };
  };
}>;

export type DateRange = {
  start: LuxonDateTime;
  end: LuxonDateTime;
  kind?: string;
};

export type NumberDateRange = {
  start: number;
  end: number;
  kind?: string;
};

export type StatisticPointTable = {
  loading: boolean;
  data_type: string;
  data: Array<StatisticPoint>;
};

export type StatisticPoint = {
  d?: number;
  v: number;
};

export type StringStatisticPointTable = {
  loading: boolean;
  data_type: string;
  data: Array<StringStatisticPoint>;
};

export type StringStatisticPoint = {
  d?: string;
  v: number;
};
