import type { MiddlewareAPI, Dispatch, Action } from 'redux';
import {
  resetAnalyticsB2B,
  identifyAnalyticsB2BWithAccessLevel,
} from './index';
import { authActionTypes } from '#src/actions/constants';
import type { RootState } from '#src/reducers';

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
          identifyAnalyticsB2BWithAccessLevel({
            username,
            franchiseRole,
            companyRole,
          });
        } catch (err) {
          console.error(err);
        }
      }
    }

    // Reset identity on both instances
    if (action.type === authActionTypes.DISCONNECT) {
      try {
        resetAnalyticsB2B();
      } catch (err) {
        console.error(err);
      }
      /** @todo Mixpanel Add B2C */
    }

    return result;
  };
}
