// @flow

import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { NEW_TUTORIAL_SECTION_OR_LESSON } from '@bsport/common/lib/master-data/alerting_kind';
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

const countAlerting = createSelector(getState, (alertingState) => {
  let count = 0;
  for (const k in alertingState.items_by_kind) {
    // eslint-disable-next-line
    if (alertingState.items_by_kind.hasOwnProperty(k)) {
      count += alertingState.items_by_kind[k].count || 0;
    }
  }
  return count;
});

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

export default { countAlerting, countTutorialAlerting, getByKind };
