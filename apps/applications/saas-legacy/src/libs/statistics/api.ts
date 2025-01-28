import type { DataSourceDashboardGraph } from '#src/libs/dashboard/types';
import { postAuth } from '../../http';

import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BUSINESS_INSIGHTS_V1;

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
  return postAuth(
    `${API_V1_URI}/data_source/dashboard_graph_data`,
    {
      dashboard_graph_identifier,
      filter_config,
      date_filter_config,
      graph_family,
      graph_params,
    },
    undefined,
    undefined,
    { bypassLock: true },
  );
}
