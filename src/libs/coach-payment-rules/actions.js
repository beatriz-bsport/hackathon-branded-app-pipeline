import { createAction } from 'redux-actions';
import {
  fetchCoachPaymentRules,
  fetchCoachPaymentRuleGroups,
  fetchCoachSessionPerformance,
  fetchCoachPrivateServicePerformance,
  setSessionCoachPaymentRuleAPI,
  setPrivateBookingCoachPaymentRuleAPI,
  runSimulationAPI,
} from './api';
import type { Dispatch, OptionCallback } from '../../state/types';
import type { CoachPaymentRule, CoachPaymentRuleGroup } from '../types';
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
export const showGroupDialog = createAction(
  'COACH_PAYMENT_RULES_GROUP/DIALOG/IS_OPEN',
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
  reset: createAction('COACH_PAYMENT_RULES/SIMULATION/RESET'),
};

export function resetCoachPaymentSimulation() {
  return async (dispatch: Dispatch) => {
    dispatch(coachPaymentSimulation.reset());
  };
}
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
  params: {
    associatedCoachId: number,
    start_timestamp: number,
    end_timestamp: number,
    sessionId: ?number,
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(coachSessionPerformanceActions.isLoading(true));
    dispatch(coachSessionPerformanceActions.error(null));
    try {
      const response = await fetchCoachSessionPerformance(params);
      dispatch(
        coachSessionPerformanceActions.success({
          associatedCoachId: params.associatedCoachId,
          data: response.data,
          sessionId: params.sessionId,
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
  params: {
    associatedCoachId: number,
    start_timestamp: number,
    end_timestamp: number,
    privateBookingId: number,
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(coachPrivateServicePerformanceActions.isLoading(true));
    dispatch(coachPrivateServicePerformanceActions.error(null));
    try {
      const response = await fetchCoachPrivateServicePerformance(params);
      dispatch(
        coachPrivateServicePerformanceActions.success({
          associatedCoachId: params.associatedCoachId,
          data: response.data,
          privateBookingId: params.privateBookingId,
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
  { associatedCoachId, sessionId, coachPaymentRuleId },
  options: ?OptionCallback,
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
      if (options && options.onSuccess)
        options.onSuccess({ associatedCoachId, sessionId });
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
  { associatedCoachId, privateBookingId, coachPaymentRuleId },
  options: ?OptionCallback,
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
      if (options && options.onSuccess)
        options.onSuccess({ associatedCoachId, privateBookingId });
    } catch (error) {
      console.error(error);
      dispatch(snackbarError('paymentRules.update.error'));
      dispatch(setPrivateBookingCoachPaymentRuleActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(setPrivateBookingCoachPaymentRuleActions.isLoading(false));
  };
}

export const fetchAllPaymentRuleGroups = {
  success: createAction('COACH-PAYMENT-GROUP/LIST/SUCCESS'),
  isLoading: createAction('COACH-PAYMENT-GROUP/LIST/LOADING'),
  error: createAction('COACH-PAYMENT-GROUP/LIST/ERROR'),
};

export function fetchAllCoachPaymentRuleGroups(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAllPaymentRuleGroups.isLoading(true));
    dispatch(fetchAllPaymentRuleGroups.error(null));
    try {
      const response = await fetchCoachPaymentRuleGroups();
      dispatch(fetchAllPaymentRuleGroups.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchAllPaymentRuleGroups.error(err));
    }
    dispatch(fetchAllPaymentRuleGroups.isLoading(false));
  };
}

export const upsertPaymentGroupActions = {
  success: createAction('COACH-PAYMENT-GROUP/UPSERT/SUCCESS'),
  isLoading: createAction('COACH-PAYMENT-GROUP/UPSERT/LOADING'),
  error: createAction('COACH-PAYMENT-GROUP/UPSERT/ERROR'),
};
export function upsertCoachPaymentRuleGroup(
  group: CoachPaymentRuleGroup,
  options = {},
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertPaymentGroupActions.isLoading(true));
    dispatch(upsertPaymentGroupActions.error(null));
    const method = group.id ? putAuth : postBaseAuth;
    const suffix = group.id ? `${group.id}/` : '';
    const kind = group.id ? 'update' : 'create';
    try {
      const response = await method(
        `${API_V1_URI}/coach_payment_rule_group/${suffix}`,
        group,
      );

      dispatch(upsertPaymentGroupActions.success(response.data));
      dispatch(snackbarSuccess(`paymentRuleGroups.${kind}.success`));
      dispatch(showGroupDialog(false));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`paymentRuleGroups.${kind}.error`));
      dispatch(upsertPaymentGroupActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
  };
}

export const coachPaymentRuleGroupDelete = {
  error: createAction('COACH_PAYMENT_RULES_GROUP/DELETE/ERROR'),
  isLoading: createAction('COACH_PAYMENT_RULES_GROUP/DELETE/IS_LOADING'),
  success: createAction('COACH_PAYMENT_RULES_GROUP/DELETE/SUCCESS'),
};

export function deleteCoachPaymentRuleGroup(group: CoachPaymentRuleGroup) {
  return async (dispatch: Dispatch) => {
    dispatch(coachPaymentRuleGroupDelete.isLoading(true));

    try {
      await deleteAuth(`${API_V1_URI}/coach_payment_rule_group/${group.id}/`);
      dispatch(coachPaymentRuleGroupDelete.success(group));
      dispatch(snackbarSuccess('paymentRuleGroups.delete.success'));
    } catch (error) {
      dispatch(coachPaymentRuleGroupDelete.error(group));
      dispatch(snackbarError('paymentRuleGroups.delete.error'));
    }
    dispatch(coachPaymentRuleGroupDelete.isLoading(false));
  };
}
