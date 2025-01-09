/* eslint-disable bsport/no-redux-in-component */
import React from 'react';

// Redux utils
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

// Types and enums
import type { RootState } from '#src/reducers';
import { CADENCE_FINNER_GRAIN_ALLOWED_COMPANY_LIST } from '#src/libs/sequential_marketing/constants/event';

/***
 * @description Generic provider for the authorization of displaying the finner grain events
 * feature to the authorizes and whitelisted studios
 * ***/
export const useWhitelistFinnerGrainEvents = () => {
  const companyId = useSelector(
    createSelector(
      [(state: RootState) => state.theme.theme.company],
      (data) => {
        return data;
      },
    ),
  );
  const isAudienceFinnerGrainEventsActivated = React.useMemo(
    () =>
      CADENCE_FINNER_GRAIN_ALLOWED_COMPANY_LIST.includes(companyId) ||
      process.env.REACT_APP_SENTRY_ENVIRONMENT !== 'production',
    [companyId],
  );

  return { isAudienceFinnerGrainEventsActivated };
};

export default useWhitelistFinnerGrainEvents;
