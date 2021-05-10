import { createAction } from 'redux-actions';
import {
  fetchCoachPaymentRules,
  fetchCoachSessionPerformance,
  fetchCoachPrivateServicePerformance,
  setSessionCoachPaymentRuleAPI,
  setPrivateBookingCoachPaymentRuleAPI,
  runSimulationAPI,
} from './api';
import type { Dispatch, OptionCallback } from '../../state/types';
import type { CoachPaymentRule } from '../types';
import { snackbarError, snackbarSuccess } from '../../actions/snackbar.actions';
import { postBaseAuth, putAuth, API_V1_URI, deleteAuth } from '../../http';

export const fetchAllPaymentRules = {
  success: createAction('COACH-PAYMENT/LIST/SUCCESS'),
  isLoading: createAction('COACH-PAYMENT/LIST/LOADING'),
  error: createAction('COACH-PAYMENT/LIST/ERROR'),
};

export function fetchAllCoachPaymentRules(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAllPaymentRules.isLoading(true));
    dispatch(fetchAllPaymentRules.error(null));
    try {
      const response = await fetchCoachPaymentRules();
      dispatch(fetchAllPaymentRules.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchAllPaymentRules.error(err));
    }
    dispatch(fetchAllPaymentRules.isLoading(false));
  };
}

export const coachPaymentRuleSetUpsert = {
  error: createAction('COACH_PAYMENT_RULES/UPSERT/ERROR'),
  isLoading: createAction('COACH_PAYMENT_RULES/UPSERT/IS_LOADING'),
  success: createAction('COACH_PAYMENT_RULES/UPSERT/SUCCESS'),
};

export const showDialog = createAction('COACH_PAYMENT_RULES/DIALOG/IS_OPEN');
export const showSimulationDialog = createAction(
  'COACH_PAYMENT_RULES/SIMULATION/IS_OPEN',
);

export function upsertCoachPaymentRule(rule: CoachPaymentRule, options = {}) {
  return async (dispatch: Dispatch) => {
    dispatch(coachPaymentRuleSetUpsert.isLoading(true));
    dispatch(coachPaymentRuleSetUpsert.error(null));

    const method = rule.id ? putAuth : postBaseAuth;
    const suffix = rule.id ? `${rule.id}/` : '';
    const kind = rule.id ? 'update' : 'create';
    try {
      const response = await method(
        `${API_V1_URI}/coach_payment_rules/${suffix}`,
        rule,
      );

      dispatch(coachPaymentRuleSetUpsert.success(response.data));
      dispatch(snackbarSuccess(`paymentRules.${kind}.success`));
      dispatch(showDialog(false));
      if (options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`paymentRules.${kind}.error`));
      dispatch(coachPaymentRuleSetUpsert.error(error.response.data));
      if (options.onError) options.onError();
    }
  };
}

export const coachPaymentRuleSetDelete = {
  error: createAction('COACH_PAYMENT_RULES/DELETE/ERROR'),
  isLoading: createAction('COACH_PAYMENT_RULES/DELETE/IS_LOADING'),
  success: createAction('COACH_PAYMENT_RULES/DELETE/SUCCESS'),
};

export function deleteCoachPaymentRule(rule: CoachPaymentRule) {
  return async (dispatch: Dispatch) => {
    dispatch(coachPaymentRuleSetDelete.isLoading(true));

    try {
      await deleteAuth(`${API_V1_URI}/coach_payment_rules/${rule.id}`);
      dispatch(coachPaymentRuleSetDelete.success(rule));
      dispatch(snackbarSuccess('paymentRules.delete.success'));
    } catch (error) {
      dispatch(coachPaymentRuleSetDelete.error(rule));
      dispatch(snackbarError('paymentRules.delete.error'));
    }
    dispatch(coachPaymentRuleSetDelete.isLoading(false));
  };
}

export const coachPaymentSimulation = {
  error: createAction('COACH_PAYMENT_RULES/SIMULATION/ERROR'),
  isLoading: createAction('COACH_PAYMENT_RULES/SIMULATION/IS_LOADING'),
  success: createAction('COACH_PAYMENT_RULES/SIMULATION/SUCCESS'),
};

export function runCoachPaymenrRuleSimulation(id: number, params: object) {
  return async (dispatch: Dispatch) => {
    dispatch(coachPaymentSimulation.isLoading(true));
    dispatch(coachPaymentSimulation.error(null));
    try {
      const response = await runSimulationAPI(id, params);
      dispatch(coachPaymentSimulation.success(response.data));
    } catch (error) {
      dispatch(coachPaymentSimulation.error(error));
    }
    dispatch(coachPaymentSimulation.isLoading(false));
  };
}

export const coachSessionPerformanceActions = {
  error: createAction('COACH/PERFORMANCE2/ERROR'),
  isLoading: createAction('COACH/PERFORMANCE2/IS_LOADING'),
  success: createAction('COACH/PERFORMANCE2/SUCCESS'),
};

export function fetchCoachSessionPerformanceAction(
  associatedCoachId: number,
  start_timestamp: number,
  end_timestamp: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(coachSessionPerformanceActions.isLoading(true));
    dispatch(coachSessionPerformanceActions.error(null));
    try {
      const response = await fetchCoachSessionPerformance(
        associatedCoachId,
        start_timestamp,
        end_timestamp,
      );
      dispatch(
        coachSessionPerformanceActions.success({
          associatedCoachId,
          data: response.data,
        }),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(coachSessionPerformanceActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(coachSessionPerformanceActions.isLoading(false));
  };
}

export const coachPrivateServicePerformanceActions = {
  error: createAction('COACH/PRIVATE_SERVICE/PERFORMANCE/ERROR'),
  isLoading: createAction('COACH/PRIVATE_SERVICE/PERFORMANCE/IS_LOADING'),
  success: createAction('COACH/PRIVATE_SERVICE/PERFORMANCE/SUCCESS'),
};

export function fetchCoachPrivateServicePerformanceAction(
  associatedCoachId: number,
  start_timestamp: number,
  end_timestamp: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(coachPrivateServicePerformanceActions.isLoading(true));
    dispatch(coachPrivateServicePerformanceActions.error(null));
    try {
      const response = await fetchCoachPrivateServicePerformance(
        associatedCoachId,
        start_timestamp,
        end_timestamp,
      );
      dispatch(
        coachPrivateServicePerformanceActions.success({
          associatedCoachId,
          data: response.data,
        }),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(coachPrivateServicePerformanceActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(coachPrivateServicePerformanceActions.isLoading(false));
  };
}
export const sessionCoachPaymentRule = {
  isLoading: createAction('SESSIONS/COACH_PAYMENT_RULE/IS_LOADING'),
  error: createAction('SESSIONS/COACH_PAYMENT_RULE/ERROR'),
  success: createAction('SESSIONS/COACH_PAYMENT_RULE/SUCCESS'),
};
export function setSessionCoachPaymentRule(
  associatedCoachId: number,
  sessionId: number,
  coachPaymentRuleId: number,
) {
  return async (dispatch: Dispatch) => {
    dispatch(sessionCoachPaymentRule.isLoading(true));
    dispatch(sessionCoachPaymentRule.error(null));

    try {
      const response = await setSessionCoachPaymentRuleAPI(
        sessionId,
        coachPaymentRuleId,
      );
      dispatch(
        sessionCoachPaymentRule.success({
          associatedCoachId,
          sessionId,
          data: response.data,
        }),
      );
      dispatch(snackbarSuccess('paymentRules.update.success'));
    } catch (error) {
      console.error(error);
      dispatch(snackbarError('paymentRules.update.error'));
      dispatch(sessionCoachPaymentRule.error(error));
    }
    dispatch(sessionCoachPaymentRule.isLoading(false));
  };
}

export const setPrivateBookingCoachPaymentRuleActions = {
  isLoading: createAction('PRIVATE_BOOKING/COACH_PAYMENT_RULE/IS_LOADING'),
  error: createAction('PRIVATE_BOOKING/COACH_PAYMENT_RULE/ERROR'),
  success: createAction('PRIVATE_BOOKING/COACH_PAYMENT_RULE/SUCCESS'),
};
export function setPrivateBookingCoachPaymentRule(
  associatedCoachId: number,
  privateBookingId: number,
  coachPaymentRuleId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(setPrivateBookingCoachPaymentRuleActions.isLoading(true));
    dispatch(setPrivateBookingCoachPaymentRuleActions.error(null));

    try {
      const response = await setPrivateBookingCoachPaymentRuleAPI(
        privateBookingId,
        coachPaymentRuleId,
      );
      dispatch(
        setPrivateBookingCoachPaymentRuleActions.success({
          associatedCoachId,
          privateBookingId,
          data: response.data,
        }),
      );
      dispatch(snackbarSuccess('paymentRules.update.success'));
    } catch (error) {
      console.error(error);
      dispatch(snackbarError('paymentRules.update.error'));
      dispatch(setPrivateBookingCoachPaymentRuleActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(setPrivateBookingCoachPaymentRuleActions.isLoading(false));
  };
}
