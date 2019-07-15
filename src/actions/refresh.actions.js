import types from './refresh.types';
import { Moment } from '../i18n';

import { fetchAllOffers } from './offer.actions';
import { fetchActivities as fetchActivitiesMinimal } from './activity.actions';
import { fetchSCT } from './category.actions';
import { fetchAll as fetchAllPaymentPacks } from './paymentPack.actions';
import { fetchDashboard as fetchDashboardStats } from './stats.actions';

import { fetchAllActivities as fetchAllMetaActivities } from '../libs/meta-activity/actions/meta-activity.actions';
import { fetchEstablishments } from '../libs/establishment/actions';
import { fetchAll as fetchShop } from '../libs/shop/actions/shopitem';
import { fetchPaymentRules } from '../libs/payment-rules/actions';
import { fetchAll as fetchWorkshopActivities } from '../libs/meta-activity/actions/workshop-activity.actions';
import { fetch as fetchAllAlertings } from '../libs/alerting/actions';
import { fetchAssociated as fetchAssociatedCoaches } from '../libs/associated-coach/actions';

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
      dispatch(fetchAllMetaActivities()),
      dispatch(fetchAllOffers()),
      dispatch(fetchActivitiesMinimal()),
      dispatch(fetchAssociatedCoaches()),
      dispatch(fetchEstablishments()),
      dispatch(fetchSCT()),
      dispatch(fetchAllPaymentPacks()),
      dispatch(fetchDashboardStats()),
      dispatch(fetchShop()),
      dispatch(fetchPaymentRules()),
      dispatch(fetchWorkshopActivities()),
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
