import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import Immutable from 'seamless-immutable';
import { DateTime } from 'luxon';
import { discretizeByAndFillMissing as discretizeAndFillMissing } from '../../state/stats/utils';
import { State, Dispatch } from '../../state/types';
// @ts-expect-error
import { Graph } from './types';
import { getDateRangeFromGraphFilter } from '#libs/dashboard/utils';
import type {
  DataSourceDashboardGraph,
  DataSourceDashboardTab,
} from '../dashboard/types';

export const getGraphData = (
  state: State,
  graphList: Array<Graph>,
  dateRangeByIdentifier: {
    [key: string]: { start: string; end: string; kind: string };
  },
  graphRessources: any,
) => {
  const data = {};
  graphList.forEach((graph) => {
    const { timeSettings, selector } =
      graphRessources[graph.ressourceIdentifier];
    if (timeSettings !== 'none') {
      // @ts-expect-error
      data[graph.name] = selector(
        state,
        graph.name,
        dateRangeByIdentifier[graph.name],
        graph.aggregate,
      );
    } else {
      // @ts-expect-errors
      data[graph.name] = selector(state, graph.name);
    }
  });
  return data;
};

export const getGraphActions = (
  dispatch: Dispatch,
  graphList: Array<Graph>,
  graphRessources: any,
) => {
  const actions = {};
  graphList.forEach((graph) => {
    // @ts-expect-error
    actions[graph.name] = graphRessources[graph.ressourceIdentifier].action;
  });
  return bindActionCreators(actions, dispatch);
};

export const getStatisticTemporal = (
  state: State,
  identifier: string,
  range: { start: DateTime; end: DateTime },
  aggregate?: boolean,
) => {
  let data = [];
  let loading = true;
  if (
    state.stats.stats &&
    state.stats.stats[identifier] &&
    state.stats.stats[identifier].data
  ) {
    data = Immutable(state.stats.stats[identifier].data);
    loading = state.stats.stats[identifier].isLoading;
  }
  let countBeforeSelectedDate = 0;
  if (aggregate) {
    // @ts-expect-error
    const _data = data.filter((d) => {
      if (DateTime.fromISO(d.d) >= range.start) {
        return true;
      }
      countBeforeSelectedDate += d.v;
      return false;
    });

    data = _data;
  }

  const processedData = discretizeAndFillMissing(data, range.start, range.end);
  if (aggregate) {
    let v = countBeforeSelectedDate;
    const aggregatedData = [];
    for (let i = 0; i < processedData.length; i += 1) {
      aggregatedData.push({ ...processedData[i], v: processedData[i].v + v });
      v += processedData[i].v;
    }
    return { data: aggregatedData, loading };
  }

  return { data: processedData, loading };
};

export const getStatisticTemporalGrid = (state: State, identifier: string) => {
  let data = [];
  let loading = true;
  if (
    state.stats.stats &&
    state.stats.stats[identifier] &&
    state.stats.stats[identifier].data
  ) {
    ({ data } = state.stats.stats[identifier]);
    loading = state.stats.stats[identifier].isLoading;
  }
  return { data, loading };
};

// -----------------------------------
const _getDataSourceDashboardStatisticsByUuid = (state: State) =>
  // @ts-expect-error
  state.stats.dataSourceDashboard.byUuid;

export const _getDataSourceDashboardGraphStatistics = (
  // @ts-expect-error
  dataSourceDashboardStatisticsByUuid,
  graph: DataSourceDashboardGraph,
) => {
  let graph_data = [];
  let loading = true;
  let base_value_for_accumulate = null;

  if (dataSourceDashboardStatisticsByUuid[graph.uuid]?.data) {
    ({ graph_data, base_value_for_accumulate } = Immutable(
      dataSourceDashboardStatisticsByUuid[graph.uuid].data,
    ));
    ({ loading } = dataSourceDashboardStatisticsByUuid[graph.uuid]);
  }

  if (graph.graph_family === 'qualitative') {
    // Order desc for legend display
    const sortedData = [...graph_data].sort((a, b) => b.value - a.value);
    return { data: sortedData, loading };
  }

  if (graph.graph_family !== 'temporal') {
    return { data: graph_data, loading };
  }

  const { start, end } = getDateRangeFromGraphFilter(graph);
  const processedData = discretizeAndFillMissing(
    graph_data,
    start,
    end,
    graph.graph_params.aggregation_function_name,
  );

  if (!graph.graph_params.accumulate_total_data) {
    return { data: processedData, loading };
  }

  // in this case, cumsum starting from 'base_value_for_accumulate'
  let v = base_value_for_accumulate;
  const aggregatedData = [];
  for (let i = 0; i < processedData.length; i += 1) {
    aggregatedData.push({ ...processedData[i], v: processedData[i].v + v });
    v += processedData[i].v;
  }
  return { data: aggregatedData, loading };
};

export const getDataSourceDashboardTabStatistics = createSelector(
  [
    _getDataSourceDashboardStatisticsByUuid,
    (state, dashboardTab) => dashboardTab,
  ],
  (
    dataSourceDashboardStatisticsByUuid,
    dashboardTab: DataSourceDashboardTab,
  ) => {
    return (
      dashboardTab.graphs?.reduce(
        (acc, graph) => ({
          ...acc,
          [graph.uuid]: _getDataSourceDashboardGraphStatistics(
            dataSourceDashboardStatisticsByUuid,
            graph,
          ),
        }),
        {},
      ) || {}
    );
  },
);
