// @flow

import { createAction } from 'redux-actions';
import api from './api';

type ResponsePaginated = {
  data: {
    next_page: ?number,
    results: Array<*>,
  },
};

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

export function fetchCompanyOffers(companyId: number) {
  return async (dispatch: Object) => {
    dispatch(companyOffersActions.isLoading(true));
    dispatch(companyOffersActions.error(null));
    try {
      const offers = await fetchPaginated((page: number) =>
        api.fetchCompanyOffers({ companyId, page }),
      );
      dispatch(companyOffersActions.success(offers));
    } catch (error) {
      dispatch(companyOffersActions.error(error));
    }
    dispatch(companyOffersActions.isLoading(false));
  };
}

export function fetchCompanyCoaches(companyId: number) {
  return async (dispatch: Object) => {
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

export function fetchCompanyEstablishments(companyId: number) {
  return async (dispatch: Object) => {
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

export function fetchCompanyActivities(companyId: number) {
  return async (dispatch: Object) => {
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

export function fetchCompanyMetaActivities(companyId: number) {
  return async (dispatch: Object) => {
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
