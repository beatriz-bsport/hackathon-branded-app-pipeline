// @ts-nocheck
import { Moment } from 'moment-timezone';
import Immutable from 'seamless-immutable';

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
  start: Moment;
  end: Moment;
  kind?: string;
};

export type StatisticPointTable = {
  loading: boolean;
  data_type: string;
  data: Array<StatisticPoint>;
};

export type StatisticPoint = {
  d?: string;
  v: number;
};
