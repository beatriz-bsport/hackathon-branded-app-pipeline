import type { MiddlewareAPI, Dispatch, Action } from 'redux';
import {
  meiroAnalyticsClient,
  optIn as optInB2CTrackingMeiro,
  reset as resetAnalyticsMeiro,
} from './index';
import { authActionTypes } from '#src/actions/constants';
import type { RootState } from '#src/reducers';
import { getMembership } from '#src/libs/membership/selectors';
import { getTheme } from '#src/libs/theme/selectors';
import { analyticsActionTypes } from '#src/components/analytics/actions';

export function meiroAnalyticsMiddleware({
  getState,
}: MiddlewareAPI<Dispatch, RootState>) {
  return (next: Dispatch<any>) => (action: Action) => {
    const result = next(action);
    const nextState = getState();

    // Reset B2C Meiro analytics on logout
    if (action.type === authActionTypes.DISCONNECT) {
      if (meiroAnalyticsClient.getIsTracking()) {
        resetAnalyticsMeiro();
      }
    }

    if (action.type === analyticsActionTypes.OPT_IN_TRACKING_B2C) {
      try {
        const theme = getTheme(nextState);
        const companyId = theme?.company;
        const franchisorId = theme?.franchisor ?? undefined;
        const membership = companyId
          ? getMembership(nextState, companyId)
          : null;
        const userId = membership?.user_id;

        optInB2CTrackingMeiro({
          companyId,
          franchisorId,
          userId,
        });
      } catch (err) {
        console.error(
          'Failed to opt in Meiro B2C analytics from middleware:',
          err,
        );
      }
    }

    return result;
  };
}
