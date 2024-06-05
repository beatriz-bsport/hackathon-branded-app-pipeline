import type { DataSourceDashboardGraph } from '#src/libs/dashboard/types';
import { API_V1_URI, postAuth } from '../../http';

export async function fetchDataSourceDashboardStatistics(
  graph: DataSourceDashboardGraph,
) {
  const {
    dashboard_graph_identifier,
    filter_config,
    date_filter_config,
    graph_family,
    graph_params,
  } = graph;
  return postAuth(`${API_V1_URI}/data_source/dashboard_graph_data`, {
    dashboard_graph_identifier,
    filter_config,
    date_filter_config,
    graph_family,
    graph_params,
  });
}
