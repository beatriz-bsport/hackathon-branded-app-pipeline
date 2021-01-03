// @flow

import type { Graph } from '../statistics/types';

export type DashboardTab = { tab_label: string, graphs: Array<Graph> };

export type DashboardSettingsState = {
  loading: boolean,
  error: string,
  data: { id: number, company: number, settings: Array<DashboardTab> },
};
