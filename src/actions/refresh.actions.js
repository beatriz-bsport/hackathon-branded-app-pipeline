import types from './refresh.types';
import { Moment } from '../i18n';

import { fetchAllOffers } from './offer.actions';
import { fetchSCT } from './category.actions';
import { fetchAll as fetchAllPaymentPacks } from './paymentPack.actions';
import { fetchDashboard as fetchDashboardStats } from './stats.actions';

import { fetchAll as fetchShop } from '../libs/shop/actions/shopitem';
import { fetchPaymentRules } from '../libs/payment-rules/actions';
import { fetchAll as fetchAllAlertings } from '../libs/alerting/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoaches } from '../libs/associated-coach/actions';

const THRESHOLD_MINUTES = 60 * 12;

export function refreshIfNeeded() {
  return (dispatch, getState) => {
    const { lastUpdate } = getState().refresh;
    if (
      Moment(lastUpdate * 1000).isBefore(
        Moment().add(-THRESHOLD_MINUTES, 'minutes'),
      )
    ) {
      return dispatch(forceRefresh());
    }
    return dispatch(storeIsAlreadyFresh());
  };
}

export function forceRefresh() {
  return (dispatch) => {
    dispatch(storeIsRefreshing());
    Promise.all([
      dispatch(fetchAllAlertings()),
      dispatch(fetchAllOffers()),
      dispatch(fetchAssociatedCoaches()),
      dispatch(fetchSCT()),
      dispatch(fetchAllPaymentPacks()),
      dispatch(fetchDashboardStats()),
      dispatch(fetchShop()),
      dispatch(fetchPaymentRules()),
    ]).then(() => dispatch(storeHasRefreshed()));
  };
}

export function storeHasRefreshed() {
  return { type: types.REFRESH_STORE_DONE };
}

export function storeIsRefreshing() {
  return { type: types.REFRESH_STORE_START };
}

export function storeIsAlreadyFresh() {
  return { type: types.REFRESH_STORE_UNNECESSARY };
}
