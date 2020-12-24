// @flow

import { bindActionCreators } from 'redux';
import Immutable from 'seamless-immutable';
import type { Moment } from 'moment-timezone';
import { discretizeByAndFillMissing as discretizeAndFillMissing } from '../../state/stats/utils';
import type { State, Dispatch } from '../../state/types.ts';
import type { Graph } from './types';

export const getGraphData = (
  state: State,
  graphList: Array<Graph>,
  dateRangeByIdentifier: {
    [string]: { start: string, end: string, kind: string },
  },
  graphRessources: any,
) => {
  const data = {};
  graphList.forEach((graph) => {
    const { timeSettings, selector } = graphRessources[
      graph.ressourceIdentifier
    ];
    if (timeSettings !== 'none') {
      data[graph.name] = selector(
        state,
        graph.name,
        dateRangeByIdentifier[graph.name],
      );
    } else {
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
    actions[graph.name] = graphRessources[graph.ressourceIdentifier].action;
  });
  return bindActionCreators(actions, dispatch);
};

export const getStatisticTemporal = (
  state: State,
  identifier: string,
  range: { start: Moment, end: Moment },
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
  const processedData = discretizeAndFillMissing(data, range.start, range.end);
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
