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
