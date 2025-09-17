import { createAction } from 'redux-actions';
import type { Dispatch } from '#src/state/types';

export const analyticsActionTypes = {
  OPT_IN_TRACKING_B2B: 'ANALYTICS/OPT_IN_TRACKING_B2B',
  OPT_IN_TRACKING_B2C: 'ANALYTICS/OPT_IN_TRACKING_B2C',
} as const;

const optInTrackingB2B = createAction(analyticsActionTypes.OPT_IN_TRACKING_B2B);
const optInTrackingB2C = createAction(analyticsActionTypes.OPT_IN_TRACKING_B2C);

export const requestOptInTrackingB2B = () => (dispatch: Dispatch) => {
  dispatch(optInTrackingB2B());
};

export const requestOptInTrackingB2C = () => (dispatch: Dispatch) => {
  dispatch(optInTrackingB2C());
};
