import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import alertingSelectors from '../alerting/selectors';
import { CompanyOnboardingTypes } from '#libs/alerting/constants';
import type { State } from '../../state/types';
import { AlertPayloadResult } from '#libs/alerting/types';

const _getState = (state: State) => state.company;

const _getCompanyData = (state: State) => state.company.byId;

const _getSearchedCompanyIdList = (state: State) => state.company.search.allIds;

export const getSearchedCompanyList = createSelector(
  [_getCompanyData, _getSearchedCompanyIdList],
  (data, ids) => ids.map((id: number) => data[id]),
);

export const getCompanyFeatureState = (state: State) => state.company.feature;

export const getCompanyCountry = (state: State) =>
  state.theme?.theme?.locale.split('_')[1];

export const getStripeOnboardingPending = createSelector(
  [_getState, alertingSelectors.getCompanyOnboardingAlerting],
  (state, byKind) =>
    state.stripeCompany.data &&
    !state.stripeCompany.data?.has_no_need_for_stripe_configuration &&
    !!byKind[0]?.results?.filter((a: Immutable.Immutable<AlertPayloadResult>) =>
      [
        CompanyOnboardingTypes.VERIFICATION,
        CompanyOnboardingTypes.CREATION,
      ].includes('type' in a?.data ? a?.data?.type : undefined),
    )?.length,
);
