import { ErrorAndLoading } from '../types';

export type SmartList = {
  id: number;
  company: number;
  name: string;
  description: string;
  members: Array<any>;
};

export type AutoTagRule = {
  id: number;
  smartlist: number;
  tag: number;
  kind: number;
  date_created: string;
};

export type SmartListState = ErrorAndLoading & {
  byId: { [key: string]: SmartList };
  allIds: number[];
  upsert: ErrorAndLoading;
  filter: ErrorAndLoading;
  smartListTagRules: ErrorAndLoading & {
    byId: { [key: string]: AutoTagRule };
  };
  smartListFiltered: ErrorAndLoading & {
    items: SmartList[];
  };
};
