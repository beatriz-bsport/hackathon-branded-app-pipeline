// @flow

import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import {
  NEW_TUTORIAL_SECTION_OR_LESSON,
  UNREAD_COMMUNICATION,
  // @ts-ignore
} from '@bsport/common/lib/master-data/alerting_kind';
import type { State } from '../../state/types';

const getState = (state: State) => state.alerting;

const countTutorialAlerting = createSelector(getState, (alertingState) => {
  if (
    // eslint-disable-next-line
    alertingState.items_by_kind.hasOwnProperty(
      NEW_TUTORIAL_SECTION_OR_LESSON.alert_kind,
    )
  ) {
    return alertingState.items_by_kind[
      NEW_TUTORIAL_SECTION_OR_LESSON.alert_kind
    ].count;
  }
  return 0;
});

const ALERTING_NOT_IN_GENERAL_COUNT = [UNREAD_COMMUNICATION.alert_kind];

const countAlerting = createSelector(getState, (alertingState) => {
  let count = 0;
  for (const k in alertingState.items_by_kind) {
    // eslint-disable-next-line
    if (
      !ALERTING_NOT_IN_GENERAL_COUNT.includes(parseInt(k)) &&
      // eslint-disable-next-line
      alertingState.items_by_kind.hasOwnProperty(k)
    ) {
      count += alertingState.items_by_kind[k].count || 0;
    }
  }
  return count;
});

const countAlertingForKind = createSelector(
  [getState, (state, kind) => kind],
  (alertingState, kind) => {
    let count = 0;
    for (const k in alertingState.items_by_kind) {
      if (
        parseInt(k) === parseInt(kind) &&
        // eslint-disable-next-line
        alertingState.items_by_kind.hasOwnProperty(k)
      ) {
        count += alertingState.items_by_kind[k].count || 0;
      }
    }
    return count;
  },
);

const getByKind = createSelector(getState, (alertingState) => {
  const byKind = [];
  for (const k in alertingState.items_by_kind) {
    // eslint-disable-next-line
    if (alertingState.items_by_kind.hasOwnProperty(k)) {
      byKind.push({ alert_kind: k, ...alertingState.items_by_kind[k] });
    }
  }
  return Immutable(byKind);
});

const getOneKind = createSelector(
  [getState, (state, kind) => kind],
  (alertingState, kind) => {
    const byKind = [];
    for (const k in alertingState.items_by_kind) {
      if (
        parseInt(k) === parseInt(kind) &&
        // eslint-disable-next-line
        alertingState.items_by_kind.hasOwnProperty(k)
      ) {
        byKind.push({ alert_kind: k, ...alertingState.items_by_kind[k] });
      }
    }
    return Immutable(byKind);
  },
);

export default {
  countAlerting,
  countAlertingForKind,
  countTutorialAlerting,
  getByKind,
  getOneKind,
};
