// @flow

import { createAction } from 'redux-actions';
import api from './api';

export const companyOffersActions = {
  error: createAction('COMPANY/OFFERS/ERROR'),
  isLoading: createAction('COMPANY/OFFERS/IS_LOADING'),
  success: createAction('COMPANY/OFFERS/SUCCESS'),
};

export const companyEstablishmentsActions = {
  error: createAction('COMPANY/ESTABLISHMENTS/ERROR'),
  isLoading: createAction('COMPANY/ESTABLISHMENTS/IS_LOADING'),
  success: createAction('COMPANY/ESTABLISHMENTS/SUCCESS'),
};

export const companyMetaActivitiesActions = {
  error: createAction('COMPANY/META_ACTIVITIES/ERROR'),
  isLoading: createAction('COMPANY/META_ACTIVITIES/IS_LOADING'),
  success: createAction('COMPANY/META_ACTIVITIES/SUCCESS'),
};

export const companyActivitiesActions = {
  error: createAction('COMPANY/ACTIVITIES/ERROR'),
  isLoading: createAction('COMPANY/ACTIVITIES/IS_LOADING'),
  success: createAction('COMPANY/ACTIVITIES/SUCCESS'),
};

export const companyCoachesActions = {
  error: createAction('COMPANY/COACHES/ERROR'),
  isLoading: createAction('COMPANY/COACHES/IS_LOADING'),
  success: createAction('COMPANY/COACHES/SUCCESS'),
};

export function fetchCompanyOffers(companyId: number, page: number) {
  return async (dispatch: Object) => {
    dispatch(companyOffersActions.isLoading(true));
    dispatch(companyOffersActions.error(null));
    try {
      const response = await api.fetchCompanyOffers(companyId, page);
      dispatch(companyOffersActions.success(response.data));
    } catch (error) {
      dispatch(companyOffersActions.error(error));
    }
    dispatch(companyOffersActions.isLoading(false));
  };
}

export function fetchCompanyCoaches(companyId: number, page: number) {
  return async (dispatch: Object) => {
    dispatch(companyCoachesActions.isLoading(true));
    dispatch(companyCoachesActions.error(null));
    try {
      const response = await api.fetchCompanyCoaches(companyId, page);
      dispatch(companyCoachesActions.success(response.data));
    } catch (error) {
      dispatch(companyCoachesActions.error(error));
    }
    dispatch(companyCoachesActions.isLoading(false));
  };
}

export function fetchCompanyEstablishments(companyId: number, page: number) {
  return async (dispatch: Object) => {
    dispatch(companyEstablishmentsActions.isLoading(true));
    dispatch(companyEstablishmentsActions.error(null));
    try {
      const response = await api.fetchCompanyEstablishments(companyId, page);
      dispatch(companyEstablishmentsActions.success(response.data));
    } catch (error) {
      dispatch(companyEstablishmentsActions.error(error));
    }
    dispatch(companyEstablishmentsActions.isLoading(false));
  };
}

export function fetchCompanyActivities(companyId: number, page: number) {
  return async (dispatch: Object) => {
    dispatch(companyActivitiesActions.isLoading(true));
    dispatch(companyActivitiesActions.error(null));
    try {
      const response = await api.fetchCompanyActivities(companyId, page);
      dispatch(companyActivitiesActions.success(response.data));
    } catch (error) {
      dispatch(companyActivitiesActions.error(error));
    }
    dispatch(companyActivitiesActions.isLoading(false));
  };
}

export function fetchCompanyMetaActivities(companyId: number, page: number) {
  return async (dispatch: Object) => {
    dispatch(companyMetaActivitiesActions.isLoading(true));
    dispatch(companyMetaActivitiesActions.error(null));
    try {
      const response = await api.fetchCompanyMetaActivities(companyId, page);
      dispatch(companyMetaActivitiesActions.success(response.data));
    } catch (error) {
      dispatch(companyMetaActivitiesActions.error(error));
    }
    dispatch(companyMetaActivitiesActions.isLoading(false));
  };
}
