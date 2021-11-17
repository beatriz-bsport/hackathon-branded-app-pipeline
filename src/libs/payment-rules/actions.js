// @flow

import { createAction } from 'redux-actions';

import { snackbarError, snackbarSuccess } from '../snackbar/actions';
import {
  deleteAuth,
  getAuth,
  postBaseAuth,
  putAuth,
  API_URI,
} from '../../http';

import type { Dispatch, ThunkAction } from '../../state/types';
import type { PaymentRule } from './types';

export const paymentRuleSet = {
  error: createAction('PAYMENT_RULES/LOAD/ERROR'),
  isLoading: createAction('PAYMENT_RULES/LOAD/IS_LOADING'),
  success: createAction('PAYMENT_RULES/LOAD/SUCCESS'),
};

export function fetchPaymentRules(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentRuleSet.isLoading(true));
    dispatch(paymentRuleSet.error(null));

    try {
      const response = await getAuth(`${API_URI}/payment-rules/`);

      dispatch(paymentRuleSet.success(response.data));
    } catch (error) {
      dispatch(paymentRuleSet.error(error));
    }

    dispatch(paymentRuleSet.isLoading(false));
  };
}

export const paymentRuleSetUpsert = {
  error: createAction('PAYMENT_RULES/UPSERT/ERROR'),
  isLoading: createAction('PAYMENT_RULES/UPSERT/IS_LOADING'),
  success: createAction('PAYMENT_RULES/UPSERT/SUCCESS'),
};

export const showDialog = createAction('PAYMENT_RULES/DIALOG/IS_OPEN');

export function upsertPaymentRule(rule: PaymentRule, options = {}) {
  return async (dispatch: Dispatch) => {
    dispatch(paymentRuleSetUpsert.isLoading(true));
    dispatch(paymentRuleSetUpsert.error(null));

    const method = rule.id ? putAuth : postBaseAuth;
    const suffix = rule.id ? `${rule.id}/` : '';
    const kind = rule.id ? 'update' : 'create';
    try {
      const response = await method(`${API_URI}/payment-rules/${suffix}`, rule);

      dispatch(paymentRuleSetUpsert.success(response.data));
      dispatch(snackbarSuccess(`paymentRules.${kind}.success`));
      dispatch(showDialog(false));
      if (options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(snackbarError(`paymentRules.${kind}.error`));
      dispatch(paymentRuleSetUpsert.error(error.response.data));
      if (options.onError) options.onError();
    }
  };
}

export const paymentRuleSetDelete = {
  error: createAction('PAYMENT_RULES/DELETE/ERROR'),
  isLoading: createAction('PAYMENT_RULES/DELETE/IS_LOADING'),
  success: createAction('PAYMENT_RULES/DELETE/SUCCESS'),
};

export function deletePaymentRule(rule: PaymentRule) {
  return async (dispatch: Dispatch) => {
    dispatch(paymentRuleSetDelete.isLoading(rule));

    try {
      await deleteAuth(`${API_URI}/payment-rules/${rule.id}`);
      dispatch(paymentRuleSetDelete.success(rule));
      dispatch(snackbarSuccess('paymentRules.delete.success'));
    } catch (error) {
      dispatch(paymentRuleSetDelete.error(rule));
      dispatch(snackbarError('paymentRules.delete.error'));
    }
  };
}
