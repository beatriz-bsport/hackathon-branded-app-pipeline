// @flow

import { createAction } from 'redux-actions';
import api from './api';
import type { Dispatch } from '../../state/types';

type ResponsePaginated = {
  data: {
    next_page: ?number,
    results: Array<*>,
  },
};

export const companyOffersActions = {
  error: createAction('MARKETPLACE/OFFERS/ERROR'),
  isLoading: createAction('MARKETPLACE/OFFERS/IS_LOADING'),
  success: createAction('MARKETPLACE/OFFERS/SUCCESS'),
};

export const companyEstablishmentsActions = {
  error: createAction('MARKETPLACE/ESTABLISHMENTS/ERROR'),
  isLoading: createAction('MARKETPLACE/ESTABLISHMENTS/IS_LOADING'),
  success: createAction('MARKETPLACE/ESTABLISHMENTS/SUCCESS'),
};

export const companyMetaActivitiesActions = {
  error: createAction('MARKETPLACE/META_ACTIVITIES/ERROR'),
  isLoading: createAction('MARKETPLACE/META_ACTIVITIES/IS_LOADING'),
  success: createAction('MARKETPLACE/META_ACTIVITIES/SUCCESS'),
};

export const companyActivitiesActions = {
  error: createAction('MARKETPLACE/ACTIVITIES/ERROR'),
  isLoading: createAction('MARKETPLACE/ACTIVITIES/IS_LOADING'),
  success: createAction('MARKETPLACE/ACTIVITIES/SUCCESS'),
};

export const companyCoachesActions = {
  error: createAction('MARKETPLACE/COACHES/ERROR'),
  isLoading: createAction('MARKETPLACE/COACHES/IS_LOADING'),
  success: createAction('MARKETPLACE/COACHES/SUCCESS'),
};

export const paymentPackList = {
  error: createAction('MARKETPLACE/PAYMENT_PACKS/ERROR'),
  isLoading: createAction('MARKETPLACE/PAYMENT_PACKS/IS_LOADING'),
  success: createAction('MARKETPLACE/PAYMENT_PACKS/SUCCESS'),
};

export const companyDetail = {
  error: createAction('MARKETPLACE/DETAIL/ERROR'),
  isLoading: createAction('MARKETPLACE/DETAIL/IS_LOADING'),
  success: createAction('MARKETPLACE/DETAIL/SUCCESS'),
};

export function resetOffersAction() {
  return async (dispatch: Dispatch) => {
    dispatch(companyOffersActions.isLoading(false));
    dispatch(companyOffersActions.success([]));
    dispatch(companyOffersActions.error(null));
  };
}

export function fetchCompanyAction(companyId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(companyDetail.isLoading(true));
    dispatch(companyDetail.error(null));

    try {
      const response = await api.fetchCompany(companyId);
      const company = response.data;
      dispatch(companyDetail.success(company));
      dispatch(companyDetail.isLoading(false));
    } catch (err) {
      dispatch(companyDetail.error(err));
      dispatch(companyDetail.isLoading(false));
    }
  };
}

export const fetchPaginated = async (
  fetchFunc: (page: number) => Promise<ResponsePaginated>,
  page: ?number,
): Array<*> => {
  const res = await fetchFunc(page || 1);
  const { results, next_page } = res.data;
  if (!next_page) {
    return results;
  }
  const next_results = await fetchPaginated(fetchFunc, next_page);
  return [...results, ...next_results];
};

export function fetchPaymentPacksAction(companyId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(paymentPackList.isLoading(true));
    dispatch(paymentPackList.error(null));
    try {
      const paymentPacks = await fetchPaginated((page: number) =>
        api.fetchPaymentPacks({
          companyId,
          page,
        }),
      );
      dispatch(paymentPackList.success(paymentPacks));
    } catch (error) {
      dispatch(paymentPackList.error(error));
    }
    dispatch(paymentPackList.isLoading(false));
  };
}

export function fetchCompanyOffersAction(
  companyId: number,
  min_date: string,
  max_date: string,
) {
  return async (dispatch: Dispatch) => {
    dispatch(companyOffersActions.isLoading(true));
    dispatch(companyOffersActions.error(null));
    try {
      const offers = await fetchPaginated((page: number) =>
        api.fetchCompanyOffers({
          companyId,
          min_date,
          max_date,
          page,
          is_workshop: false,
        }),
      );
      dispatch(companyOffersActions.success(offers));
    } catch (error) {
      dispatch(companyOffersActions.error(error));
    }
    dispatch(companyOffersActions.isLoading(false));
  };
}

export function fetchCompanyOffersWorkshopAction(
  companyId: number,
  min_date: string,
  max_date: string,
) {
  return async (dispatch: Dispatch) => {
    dispatch(companyOffersActions.isLoading(true));
    dispatch(companyOffersActions.error(null));
    try {
      const offers = await fetchPaginated((page: number) =>
        api.fetchCompanyOffers({
          companyId,
          min_date,
          max_date,
          page,
          is_workshop: true,
        }),
      );
      dispatch(companyOffersActions.success(offers));
    } catch (error) {
      dispatch(companyOffersActions.error(error));
    }
    dispatch(companyOffersActions.isLoading(false));
  };
}

export function fetchCompanyCoachesAction(companyId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(companyCoachesActions.isLoading(true));
    dispatch(companyCoachesActions.error(null));
    try {
      const coaches = await fetchPaginated((page: number) =>
        api.fetchCompanyCoaches({ companyId, page }),
      );
      dispatch(companyCoachesActions.success(coaches));
    } catch (error) {
      dispatch(companyCoachesActions.error(error));
    }
    dispatch(companyCoachesActions.isLoading(false));
  };
}

export function fetchCompanyEstablishmentsAction(companyId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(companyEstablishmentsActions.isLoading(true));
    dispatch(companyEstablishmentsActions.error(null));
    try {
      const establishments = await fetchPaginated((page: number) =>
        api.fetchCompanyEstablishments({ companyId, page }),
      );
      dispatch(companyEstablishmentsActions.success(establishments));
    } catch (error) {
      dispatch(companyEstablishmentsActions.error(error));
    }
    dispatch(companyEstablishmentsActions.isLoading(false));
  };
}

export function fetchCompanyActivitiesAction(companyId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(companyActivitiesActions.isLoading(true));
    dispatch(companyActivitiesActions.error(null));
    try {
      const activities = await fetchPaginated((page: number) =>
        api.fetchCompanyActivities({ companyId, page }),
      );
      dispatch(companyActivitiesActions.success(activities));
    } catch (error) {
      dispatch(companyActivitiesActions.error(error));
    }
    dispatch(companyActivitiesActions.isLoading(false));
  };
}

export function fetchCompanyMetaActivitiesAction(companyId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(companyMetaActivitiesActions.isLoading(true));
    dispatch(companyMetaActivitiesActions.error(null));
    try {
      const metaActivities = await fetchPaginated((page: number) =>
        api.fetchCompanyMetaActivities({ companyId, page }),
      );
      dispatch(companyMetaActivitiesActions.success(metaActivities));
    } catch (error) {
      dispatch(companyMetaActivitiesActions.error(error));
    }
    dispatch(companyMetaActivitiesActions.isLoading(false));
  };
}
