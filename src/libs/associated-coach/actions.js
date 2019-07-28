// @flow

import { push } from 'react-router-redux';
import { createAction } from 'redux-actions';

import { putAuth, API_URI } from '../../http';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import {
  updateCoach as updateCoachAPI,
  addCoach as addCoachAPI,
  linkByEmail as linkByEmailAPI,
  fetchAssociatedCoaches as fetchAssociatedCoachesAPI,
  fetchAssociatedCoachPerformance as fetchAssociatedCoachPerformanceAPI,
} from './api';

import type { Dispatch, ThunkAction } from '../../state/types';

type CoachPayload = FormData;

export const associated = {
  isLoading: createAction('COACH/ASSOCIATED/IS_LOADING'),
  error: createAction('COACH/ASSOCIATED/ERROR'),
  success: createAction('COACH/ASSOCIATED/SUCCESS'),
};

export function linkByEmail(
  email: string,
  options: { onSuccess: () => void, onError: () => void },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await linkByEmailAPI(email);
      if (response.status === 201) {
        dispatch(snackbarSuccess('coach.forms.linkByEmail.success'));
        dispatch(fetchAssociated());
        options.onSuccess();
      } else {
        options.onError();
      }
    } catch (err) {
      console.error(err);
      options.onError();
    }
  };
}

export function fetchAssociated() {
  return async (dispatch: Dispatch) => {
    dispatch(associated.isLoading(true));
    dispatch(associated.error(null));
    try {
      const response = await fetchAssociatedCoachesAPI();
      dispatch(associated.success(response.data));
    } catch (error) {
      dispatch(associated.error(error));
    }
    dispatch(associated.isLoading(false));
  };
}

export const upsert = {
  isLoading: createAction('COACH/UPSERT/IS_LOADING'),
  error: createAction('COACH/UPSERT/ERROR'),
  success: createAction('COACH/UPSERT/SUCCESS'),
};

export function createOrUpdateCoach(
  coachData: CoachPayload,
  options: *,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));

    const createOrUpdate = coachData.has('id') ? updateCoachAPI : addCoachAPI;
    try {
      const response = await createOrUpdate(coachData);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(response);
      }

      dispatch(upsert.success(response));
      const key = coachData.has('id') ? 'update' : 'create';
      dispatch(snackbarSuccess(`coach.forms.${key}.success`));
      dispatch(fetchAssociated());
      dispatch(push('/coach'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        (error.response.data.email || []).length &&
        error.response.data.email[0] ===
          'user with this email address already exists.'
      ) {
        dispatch(snackbarError('coach.forms.error_email_exists'));
      } else {
        dispatch(snackbarError('coach.forms.error'));
      }

      dispatch(upsert.error(error));
      if (options && options.onError) {
        options.onError((error || []).response ? error.response.data : {});
      }
    }
    dispatch(upsert.isLoading(false));
  };
}

export function startUpdate(coach: { id: number }): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(push(`/coach/edit/${coach.id}`));
  };
}

export const performance = {
  isLoading: createAction('COACH/PERFORMANCE/IS_LOADING'),
  error: createAction('COACH/PERFORMANCE/ERROR'),
  success: createAction('COACH/PERFORMANCE/SUCCESS'),
};

export function fetchAssociatedCoachPerformance(
  associatedCoachId: number,
  start: number,
  end: number,
  options: * = {},
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(performance.isLoading({ loading: true, associatedCoachId }));
    dispatch(performance.error({ error: null, associatedCoachId }));

    try {
      const response = await fetchAssociatedCoachPerformanceAPI(
        associatedCoachId,
        start,
        end,
      );
      dispatch(
        performance.success({ result: response.data, associatedCoachId }),
      );
      if (options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(performance.error({ error, associatedCoachId }));
      if (options.onError) options.onError();
    }
    dispatch(performance.isLoading({ associatedCoachId, loading: false }));
  };
}

export const setPaymentRule = {
  success: createAction('COACH/PAYMENT_RULE/SUCCESS'),
};

export function setCoachPaymentRule(
  coachId: number,
  paymentRuleId: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));

    try {
      const response = await putAuth(
        `${API_URI}/accounts/coaches/${coachId}/set_payment_rule/`,
        { default_payment_rule_id: paymentRuleId },
      );
      dispatch(snackbarSuccess('paymentRules:update.success'));
      dispatch(setPaymentRule.success({ coachId, data: response.data }));
    } catch (err) {
      dispatch(snackbarError('paymentRules:update.error'));
      dispatch(upsert.error(err));
    }
    dispatch(upsert.isLoading(false));
  };
}

export const sessionPaymentRule = {
  isLoading: createAction('SESSIONS/PAYMENT_RULE/IS_LOADING'),
  error: createAction('SESSIONS/PAYMENT_RULE/ERROR'),
  success: createAction('SESSIONS/PAYMENT_RULE/SUCCESS'),
};

export function setSessionPaymentRule(
  associatedCoachId: number,
  sessionId: number,
  paymentRuleId: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(sessionPaymentRule.isLoading(true));
    dispatch(sessionPaymentRule.error(null));

    try {
      const response = await putAuth(
        `${API_URI}/bookings/sessions/${sessionId}/set_payment_rule/`,
        { payment_rule_id: paymentRuleId },
      );
      dispatch(
        sessionPaymentRule.success({
          associatedCoachId,
          sessionId,
          data: response.data,
        }),
      );
      dispatch(snackbarSuccess('paymentRules:update.success'));
    } catch (error) {
      console.error(error);
      dispatch(snackbarError('paymentRules:update.error'));
      dispatch(sessionPaymentRule.error(error));
    }
    dispatch(sessionPaymentRule.isLoading(false));
  };
}
