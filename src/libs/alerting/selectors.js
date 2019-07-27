// @flow

import Immutable from 'seamless-immutable';
import type { State } from '../../state/types';

const getState = (state: State) => state.alerting;

const getByKind = (state: State) => {
  const alertingState = getState(state);
  const byKind = [];
  for (const k in alertingState.items_by_kind) {
    // eslint-disable-next-line
    if (alertingState.items_by_kind.hasOwnProperty(k)) {
      byKind.push({ alert_kind: k, ...alertingState.items_by_kind[k] });
    }
  }
  return Immutable(byKind);
};

const countAlerting = (state: State) => {
  const alertingState = getState(state);
  let count = 0;
  for (const k in alertingState.items_by_kind) {
    // eslint-disable-next-line
    if (alertingState.items_by_kind.hasOwnProperty(k)) {
      count += alertingState.items_by_kind[k].count;
    }
  }
  return count;
};

export default { countAlerting, getByKind };
