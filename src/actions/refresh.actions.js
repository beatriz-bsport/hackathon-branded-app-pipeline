import types from './refresh.types';
import { Moment } from '../i18n';

import { fetchAllActivities as fetchAllMetaActivities } from './meta-activity.actions';
import { fetchAllOffers } from './offer.actions';
import { fetchAll as fetchAllMembers } from './member.actions';
import { fetchActivities as fetchActivitiesMinimal } from './activity.actions';
import { fetchAssociated as fetchAssociatedCoaches } from './coach.actions';
import { fetchEstablishments } from './establishment.actions';
import { fetchSCT } from './category.actions';
import { fetchAll as fetchInvoices } from './invoice.actions';
import { fetchAll as fetchAllPaymentPacks } from './paymentPack.actions';
import { fetchDashboard as fetchDashboardStats } from './stats.actions';

const THRESHOLD_MINUTES = 30;

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
      dispatch(fetchAllMetaActivities()),
      dispatch(fetchAllOffers()),
      dispatch(fetchAllMembers()),
      dispatch(fetchActivitiesMinimal()),
      dispatch(fetchAssociatedCoaches()),
      dispatch(fetchEstablishments()),
      dispatch(fetchSCT()),
      dispatch(fetchInvoices()),
      dispatch(fetchAllPaymentPacks()),
      dispatch(fetchDashboardStats()),
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
