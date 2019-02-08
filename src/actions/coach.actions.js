// @flow

import { push } from 'react-router-redux';
import { createAction } from 'redux-actions';

import { putAuth, API_URI } from '../http';
import { snackbarSuccess, snackbarError } from './snackbar.actions';
import api from '../api';

import type { Dispatch } from '../state/types';

type CoachPayload = FormData;

export const associated = {
  isLoading: createAction('COACH/ASSOCIATED/IS_LOADING'),
  error: createAction('COACH/ASSOCIATED/ERROR'),
  success: createAction('COACH/ASSOCIATED/SUCCESS'),
};

export function fetchAssociated() {
  return async (dispatch: Dispatch) => {
    dispatch(associated.isLoading(true));
    dispatch(associated.error(null));
    try {
      const response = await api.coach.fetchAssociated();
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

export function createOrUpdateCoach(coachData: CoachPayload, options) {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));

    const createOrUpdate = coachData.has('id')
      ? api.coach.updateCoach
      : api.coach.addCoach;
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
      console.error(error);
      dispatch(snackbarError('coach.forms.error'));
      dispatch(upsert.error(error));
      if (options && options.onError) options.onError(error.response.data);
    }
    dispatch(upsert.isLoading(false));
  };
}

export function startUpdate(coach: { id: number }) {
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
  options = {},
) {
  return async (dispatch: Dispatch) => {
    dispatch(performance.isLoading(true));
    dispatch(performance.error(null));

    try {
      const response = await api.coach.fetchAssociatedCoachPerformance(
        associatedCoachId,
        start,
        end,
      );
      dispatch(performance.success(response.data));
      if (options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(performance.error(err));
      if (options.onError) options.onError();
    }
    dispatch(performance.isLoading(false));
  };
}

export const setPaymentRule = {
  success: createAction('COACH/PAYMENT_RULE/SUCCESS'),
};

export function setCoachPaymentRule(coachId: number, paymentRuleId: number) {
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
  sessionId: number,
  paymentRuleId: number,
) {
  return async (dispatch: Dispatch) => {
    dispatch(sessionPaymentRule.isLoading(true));
    dispatch(sessionPaymentRule.error(null));

    try {
      const response = await putAuth(
        `${API_URI}/bookings/sessions/${sessionId}/set_payment_rule/`,
        { payment_rule_id: paymentRuleId },
      );
      dispatch(sessionPaymentRule.success({ sessionId, data: response.data }));
      dispatch(snackbarSuccess('paymentRules:update.success'));
    } catch (error) {
      console.log(error);
      dispatch(snackbarError('paymentRules:update.error'));
      dispatch(sessionPaymentRule.error(error));
    }
    dispatch(sessionPaymentRule.isLoading(false));
  };
}
