import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import alertingSelectors from '../alerting/selectors';
import { CompanyOnboardingTypes } from '#libs/alerting/constants';
import type { State } from '../../state/types';
import { AlertPayloadResult } from '#libs/alerting/types';
import { CompanyState } from './types';

const _getState = (state: State) => state.company;

const _getCompanyData = (state: State) => _getState(state).byId;

const _getSearchedCompanyIdList = (state: State) =>
  _getState(state).search.allIds;

export const getSearchedCompanyList = createSelector(
  [_getCompanyData, _getSearchedCompanyIdList],
  (data, ids) => ids.map((id: number) => data[id]),
);

export const getCompanyFeatureState = (state: State) =>
  _getState(state).feature;

export const getCompanyCountry = (state: State) =>
  state.theme?.theme?.locale.split('_')[1];

const getStripeCompanyData = (state: CompanyState) =>
  state?.stripeCompany?.data;

export const getStripeOnboardingPending = createSelector(
  [
    _getState,
    getStripeCompanyData,
    alertingSelectors.getCompanyOnboardingAlerting,
  ],
  (state, stripeCompanyData, byKind) =>
    stripeCompanyData &&
    !stripeCompanyData.has_no_need_for_stripe_configuration &&
    !!byKind[0]?.results?.filter((a: Immutable.Immutable<AlertPayloadResult>) =>
      [
        CompanyOnboardingTypes.VERIFICATION,
        CompanyOnboardingTypes.CREATION,
      ].includes('type' in a?.data ? a?.data?.type : undefined),
    )?.length,
);
