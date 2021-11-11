// @flow

import { bindActionCreators } from 'redux';
import Immutable from 'seamless-immutable';
import type { Moment } from 'moment-timezone';
import moment from 'moment-timezone';
import { discretizeByAndFillMissing as discretizeAndFillMissing } from '../../state/stats/utils';
import type { State, Dispatch } from '../../state/types';
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
    const { timeSettings, selector } =
      graphRessources[graph.ressourceIdentifier];
    if (timeSettings !== 'none') {
      data[graph.name] = selector(
        state,
        graph.name,
        dateRangeByIdentifier[graph.name],
        graph.aggregate,
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
    const _data = data.filter((d) => {
      if (moment(d.d).isSameOrAfter(moment(range.start))) {
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
