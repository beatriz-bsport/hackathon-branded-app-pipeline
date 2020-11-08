// @flow

export type Graph = {
  name: string,
  ressourceIdentifier: string,
  chart: 'bar' | 'grid' | 'pie',
  baseFilters: { [string]: string },
  dateFiltersName: { start: string, end: string },
  defaultRange: { start: string, end: string, kind: string },
};

export type Tab = { tab_label: string, graphs: Array<Graph> };

export type DashboardSettingsState = {
  loading: boolean,
  error: string,
  data: { id: number, company: number, settings: Array<Tab> },
};
