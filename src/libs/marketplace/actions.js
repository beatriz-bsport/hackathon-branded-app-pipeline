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

const actionsBulk = [
  { action: companyOffersActions, fetch: api.fetchCompanyOffers },
  {
    action: companyEstablishmentsActions,
    fetch: api.fetchCompanyEstablishments,
  },
  {
    action: companyMetaActivitiesActions,
    fetch: api.fetchCompanyMetaActivities,
  },
  { action: companyActivitiesActions, fetch: api.fetchCompanyActivities },
  { action: companyCoachesActions, fetch: api.fetchCompanyCoaches },
];
export function fetchCompanyData(companyId: number, page: number) {
  return actionsBulk.map((elem: any) => {
    return async (dispatch: Object) => {
      dispatch(elem.action.isLoading(true));
      dispatch(elem.error(null));
      try {
        const response = await elem.fetch(companyId, page);
        dispatch(elem.action.success(response.data));
      } catch (error) {
        dispach(elem.action.error(error));
      }
      dispatch(elem.action.isLoading(false));
    };
  });
}
