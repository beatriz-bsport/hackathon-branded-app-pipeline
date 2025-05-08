import { createAction } from 'redux-actions';
import type { OptionCallback, ThunkAction } from '#src/state/types';
import type {
  MarketingPreferenceData,
  MarketingPreferenceUpdatePayload,
} from '#src/libs/communication/types';

import {
  fetchMyFranchiseMarketingPreferences as fetchMyFranchiseMarketingPreferencesAPI,
  updateMyFranchiseMarketingPreferences as updateMyFranchiseMarketingPreferencesAPI,
  checkFranchiseMarketingPreferencesEligibility as checkFranchiseMarketingPreferencesEligibilityAPI,
} from '#src/libs/communication/api';
import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';
export const fetchMyFranchiseMarketingPreferencesActions = {
  success: createAction<MarketingPreferenceData[]>(
    'MY_FRANCHISE_MARKETING_PREFERENCES/LIST/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'MY_FRANCHISE_MARKETING_PREFERENCES/LIST/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'MY_FRANCHISE_MARKETING_PREFERENCES/LIST/ERROR',
  ),
};

export const fetchMyFranchiseMarketingPreferences = (
  {
    franchise_id,
  }: {
    franchise_id: number;
  },
  options?: OptionCallback<MarketingPreferenceData[]>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(fetchMyFranchiseMarketingPreferencesActions.isLoading(true));
    dispatch(fetchMyFranchiseMarketingPreferencesActions.error(null));
    try {
      const response = await fetchMyFranchiseMarketingPreferencesAPI(
        franchise_id,
      );
      dispatch(
        fetchMyFranchiseMarketingPreferencesActions.success(response.data),
      );

      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchMyFranchiseMarketingPreferencesActions.error(err));
      options?.onError?.(err);
    }
    dispatch(fetchMyFranchiseMarketingPreferencesActions.isLoading(false));
  };
};

export const updateMyFranchiseMarketingPreferencesActions = {
  success: createAction<{ franchise_id: number }>(
    'MY_FRANCHISE_MARKETING_PREFERENCES/UPDATE/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'MY_FRANCHISE_MARKETING_PREFERENCES/UPDATE/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'MY_FRANCHISE_MARKETING_PREFERENCES/UPDATE/ERROR',
  ),
};

export const updateMyFranchiseMarketingPreferences = (
  {
    franchise_id,
    data,
  }: {
    franchise_id: number;
    data: MarketingPreferenceUpdatePayload[];
  },
  options?: OptionCallback,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(updateMyFranchiseMarketingPreferencesActions.isLoading(true));
    dispatch(updateMyFranchiseMarketingPreferencesActions.error(null));
    try {
      await updateMyFranchiseMarketingPreferencesAPI(franchise_id, data);
      dispatch(
        updateMyFranchiseMarketingPreferencesActions.success({ franchise_id }),
      );
      dispatch(
        snackbarSuccess?.('Your marketing preferences have been updated.'),
      );
      dispatch(fetchMyFranchiseMarketingPreferences({ franchise_id }));
      options?.onSuccess?.();
    } catch (err) {
      console.error(err);
      dispatch(updateMyFranchiseMarketingPreferencesActions.error(err));
      dispatch(
        snackbarError?.(
          'An error occured while updating your marketing preferences.',
        ),
      );
      dispatch(fetchMyFranchiseMarketingPreferences({ franchise_id }));
      options?.onError?.();
    }
    dispatch(updateMyFranchiseMarketingPreferencesActions.isLoading(false));
  };
};

export const checkFranchiseMarketingPreferencesEligibilityActions = {
  success: createAction(
    'MY_FRANCHISE_MARKETING_PREFERENCES/ELIGIBILITY/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'MY_FRANCHISE_MARKETING_PREFERENCES/ELIGIBILITY/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'MY_FRANCHISE_MARKETING_PREFERENCES/ELIGIBILITY/ERROR',
  ),
};

export const checkFranchiseMarketingPreferencesEligibility = (
  {
    franchise_id,
  }: {
    franchise_id: number;
  },
  options?: OptionCallback<{ eligible: boolean }>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(
      checkFranchiseMarketingPreferencesEligibilityActions.isLoading(true),
    );
    dispatch(checkFranchiseMarketingPreferencesEligibilityActions.error(null));
    try {
      await checkFranchiseMarketingPreferencesEligibilityAPI(franchise_id);
      dispatch(checkFranchiseMarketingPreferencesEligibilityActions.success());

      options?.onSuccess?.({ eligible: true });
    } catch (err) {
      console.error(err);
      dispatch(checkFranchiseMarketingPreferencesEligibilityActions.error(err));
      options?.onError?.();
    }
    dispatch(
      checkFranchiseMarketingPreferencesEligibilityActions.isLoading(false),
    );
  };
};
