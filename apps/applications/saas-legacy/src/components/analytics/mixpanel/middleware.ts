import type { MiddlewareAPI, Dispatch, Action } from 'redux';
import {
  resetAnalyticsB2B,
  identifyAnalyticsB2BWithAccessLevel,
  resetAnalyticsB2C,
  identifyAnalyticsB2CWithMembership,
  analyticsClientB2B,
  analyticsClientB2C,
} from './index';
import { authActionTypes } from '#src/actions/constants';
import type { RootState } from '#src/reducers';
import { getMembership } from '#src/libs/membership/selectors';
import { getTheme } from '#src/libs/theme/selectors';
import { analyticsActionTypes } from '#src/components/analytics/actions';
import {
  optInTrackingAnalyticsB2C,
  optOutTrackingAnalyticsB2B,
  optInTrackingAnalyticsB2B,
  optOutTrackingAnalyticsB2C,
} from '#src/components/analytics/mixpanel';

export function analyticsMiddleware({
  getState,
}: MiddlewareAPI<Dispatch, RootState>) {
  return (next: Dispatch<any>) => (action: Action) => {
    const prevState = getState();
    const result = next(action);
    const nextState = getState();

    // Set traits to the user based on access level result
    if (
      [
        authActionTypes.CHECK_ACCESS_LEVEL,
        authActionTypes.LOGIN_SUCCESSFUL,
      ].includes(action.type)
    ) {
      const {
        username: prevUsername,
        franchise_role: prevFranchiseRole,
        role: prevCompanyRole,
      } = prevState.auth;
      const {
        username,
        franchise_role: franchiseRole,
        role: companyRole,
      } = nextState.auth;
      if (
        prevUsername !== username ||
        prevFranchiseRole !== franchiseRole ||
        prevCompanyRole !== companyRole
      ) {
        try {
          if (analyticsClientB2B.getIsTracking()) {
            identifyAnalyticsB2BWithAccessLevel({
              username,
              franchiseRole,
              companyRole,
            });
          }
        } catch (err) {
          console.error(
            'Failed to identify B2B analytics user from middleware',
            err,
          );
        }
      }
    }

    // Reset identity on both instances
    if (action.type === authActionTypes.DISCONNECT) {
      if (analyticsClientB2B.getIsTracking()) {
        try {
          resetAnalyticsB2B();
        } catch (err) {
          console.error(
            'Failed to reset B2B analytics user from middleware:',
            err,
          );
        }
      }
      if (analyticsClientB2C.getIsTracking()) {
        try {
          resetAnalyticsB2C();
        } catch (err) {
          console.error(
            'Failed to reset B2C analytics user from middleware:',
            err,
          );
        }
      }
    }

    // Identify B2C user when membership data becomes available
    if (
      [
        'MEMBERSHIP/RETRIEVE/SUCCESS',
        'MEMBERSHIP/LINK/SUCCESS',
        'MEMBERSHIP/SET_ACTIVE',
      ].includes(action.type)
    ) {
      try {
        if (analyticsClientB2C.getIsTracking()) {
          const prevTheme = getTheme(prevState);
          const nextTheme = getTheme(nextState);
          const prevCompanyId = prevTheme?.company;
          const nextCompanyId = nextTheme?.company;

          if (!nextCompanyId) return result;

          const prevMembership = prevCompanyId
            ? getMembership(prevState, prevCompanyId)
            : null;
          const nextMembership = getMembership(nextState, nextCompanyId);

          if (!nextMembership) return result;
          if (!nextMembership.user_id) return result;

          const prevFranchisorId = prevTheme?.franchisor || null;
          const nextFranchisorId = nextTheme?.franchisor || null;

          // Only identify if data has actually changed
          const membershipChanged =
            !prevMembership ||
            prevMembership.id !== nextMembership.id ||
            prevMembership.name !== nextMembership.name ||
            prevMembership.company !== nextMembership.company ||
            prevMembership.user_id !== nextMembership.user_id;

          const contextChanged =
            prevCompanyId !== nextCompanyId ||
            prevFranchisorId !== nextFranchisorId;

          if (membershipChanged || contextChanged) {
            identifyAnalyticsB2CWithMembership({
              userId: nextMembership.user_id,
              memberId: nextMembership.id,
              username: nextMembership.name || '',
              companyId: nextMembership.company,
              companyName: nextMembership.company_name,
              franchisorId: nextFranchisorId,
            });
          }
        }
      } catch (err) {
        console.error(
          'Failed to identify B2C analytics user from middleware:',
          err,
        );
      }
    }

    if (action.type === analyticsActionTypes.OPT_IN_TRACKING_B2B) {
      try {
        optInTrackingAnalyticsB2B();
        optOutTrackingAnalyticsB2C();
      } catch (err) {
        console.error('Failed to opt in B2B analytics from middleware:', err);
      }
    }

    if (action.type === analyticsActionTypes.OPT_IN_TRACKING_B2C) {
      try {
        optInTrackingAnalyticsB2C();
        optOutTrackingAnalyticsB2B();
      } catch (err) {
        console.error('Failed to opt in B2C analytics from middleware:', err);
      }
    }

    return result;
  };
}
