// @ts-expect-error
import type { Graph } from '../statistics/types';
import { ErrorAndLoading } from '#libs/types';
import {
  DataSourceFieldMetadata,
  DatatypeFilterConfig,
} from '#libs/datatype-filtering/types';

export type DashboardTab = { tab_label: string; graphs: Array<Graph> };

export type DashboardSettingsState = {
  loading: boolean;
  error: string;
  data: { id: number; company: number; settings: Array<DashboardTab> };
  dataSourceDashboardGraphs: {
    metadata: ErrorAndLoading & {
      results: Array<DataSourceDashboardGraphMetadata>;
    };
    settings: ErrorAndLoading & { results: DataSourceDashboardSettings };
  };
};

export type DataSourceDashboardGraph = {
  uuid: string;
  title: string;
  defaultTitle?: string;
  dashboard_graph_identifier: string;
  filter_config: DatatypeFilterConfig;
  date_filter_config: DatatypeFilterConfig;
  graph_family: 'temporal' | 'qualitative' | 'week_timeslots';
  graph_params: {
    date?: string;
    date_value?: null | string;
    aggregation_function_name?: 'count' | 'sum' | 'avg';
    group_by?: string;
    group_by_value?: null | string;
    date_for_slots?: string;
    ref_for_frequency?: string;
    accumulate_total_data?: boolean;
  };
  chart_component: 'bar' | 'area' | 'pie' | 'timeslots';
};

export type DataSourceDashboardTab = {
  tab_label: string;
  graphs: Array<DataSourceDashboardGraph>;
};

export type DataSourceDashboardSettings = Array<DataSourceDashboardTab>;

export type DataSourceDashboardGraphMetadata = {
  dashboard_graph_identifier: string;
  date_type: 'range' | 'single' | 'none';
  choices: {
    graph_families: {
      temporal?: {
        date: Array<string>;
        date_value: Array<string>;
      };
      qualitative?: {
        group_by: Array<string>;
        group_by_value: Array<string>;
      };
      week_timeslots?: {
        date_for_slots: Array<string>;
        ref_for_frequency: Array<string>;
      };
    };
    filterable_date: Array<string>;
  };
  metadata: Array<DataSourceFieldMetadata>;
};
