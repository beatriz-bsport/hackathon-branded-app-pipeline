import { createAction } from 'redux-actions';
import type { Dispatch, OptionCallback, ThunkAction } from '../../state/types';
import {
  retrieveReferralProgram as retrieveReferralProgramAPI,
  retrieveReferralProgramForCompany as retrieveReferralProgramForCompanyAPI,
  updateReferralProgram as updateReferralProgramAPI,
  retrieveReferralMemberStatus as retrieveReferralMemberStatusAPI,
} from './api';
import { ReferralMemberStatus, ReferralProgram } from './types';

export const retrieveReferralProgramActions = {
  isLoading: createAction<boolean>('REFERRAL_PROGRAM/RETRIEVE/IS_LOADING'),
  error: createAction<Error | null>('REFERRAL_PROGRAM/RETRIEVE/ERROR'),
  success: createAction<ReferralProgram>('REFERRAL_PROGRAM/RETRIEVE/SUCCESS'),
};

export function retrieveReferralProgram(
  options?: OptionCallback<ReferralProgram>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveReferralProgramActions.isLoading(true));
    dispatch(retrieveReferralProgramActions.error(null));

    try {
      const response = await retrieveReferralProgramAPI();
      dispatch(retrieveReferralProgramActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(retrieveReferralProgramActions.error(err));
      options?.onError && options.onError();
    }
    dispatch(retrieveReferralProgramActions.isLoading(false));
  };
}

export function retrieveReferralProgramForCompany(
  company_id: number,
  options?: OptionCallback<ReferralProgram>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveReferralProgramActions.isLoading(true));
    dispatch(retrieveReferralProgramActions.error(null));

    try {
      const response = await retrieveReferralProgramForCompanyAPI(company_id);
      dispatch(retrieveReferralProgramActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(retrieveReferralProgramActions.error(err));
      options?.onError && options.onError();
    }
    dispatch(retrieveReferralProgramActions.isLoading(false));
  };
}

export const updateReferralProgramActions = {
  isLoading: createAction<boolean>('REFERRAL_PROGRAM/UPDATE/IS_LOADING'),
  error: createAction<Error | null>('REFERRAL_PROGRAM/UPDATE/ERROR'),
  success: createAction<ReferralProgram>('REFERRAL_PROGRAM/UPDATE/SUCCESS'),
};

export function updateReferralProgram(
  data: ReferralProgram,
  options?: OptionCallback<ReferralProgram>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateReferralProgramActions.isLoading(true));
    dispatch(updateReferralProgramActions.error(null));

    try {
      const response = await updateReferralProgramAPI(data);
      dispatch(updateReferralProgramActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateReferralProgramActions.error(err));
      options?.onError && options.onError();
    }
    dispatch(updateReferralProgramActions.isLoading(false));
  };
}

export const retrieveReferralMemberStatusActions = {
  isLoading: createAction<boolean>(
    'REFERRAL_MEMBER_STATUS/RETRIEVE/IS_LOADING',
  ),
  error: createAction<Error | null>('REFERRAL_MEMBER_STATUS/RETRIEVE/ERROR'),
  success: createAction<ReferralMemberStatus>(
    'REFERRAL_MEMBER_STATUS/RETRIEVE/SUCCESS',
  ),
};

export function retrieveReferralMemberStatus(
  memberId: number,
  options?: OptionCallback<ReferralMemberStatus>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveReferralMemberStatusActions.isLoading(true));
    dispatch(retrieveReferralMemberStatusActions.error(null));

    try {
      const response = await retrieveReferralMemberStatusAPI(memberId);
      dispatch(retrieveReferralMemberStatusActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(retrieveReferralMemberStatusActions.error(err));
      options?.onError && options.onError();
    }
    dispatch(retrieveReferralMemberStatusActions.isLoading(false));
  };
}
