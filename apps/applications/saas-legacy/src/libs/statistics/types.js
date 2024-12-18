// @flow

export type Graph = {
  title: string,
  name: string,
  ressourceIdentifier: string,
  chart: 'bar' | 'grid' | 'pie',
  baseFilters: { [string]: string },
  dateFiltersName: { start: string, end: string },
  dateRange: { start: string, end: string, kind: string },
  dataFilters?: { [string]: string },
  aggregate: boolean | undefined,
};

export type WaitingListStatisticsParams = {
  min_date: string,
  max_date: string,
  date_field: string,
  kind: string,
  activity__in?: number[],
  establishments?: number[],
  establishment_group__in?: number[],
  active?: boolean,
  has_active_sub_teacher_request?: boolean,
};
