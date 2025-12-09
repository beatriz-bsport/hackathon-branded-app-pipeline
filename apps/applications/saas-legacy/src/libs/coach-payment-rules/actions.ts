import { createAction } from 'redux-actions';
import {
  fetchCoachPaymentRules,
  fetchCoachPaymentRuleGroups,
  fetchCoachSessionPerformance,
  fetchBulkCoachSessionPerformance as fetchBulkCoachSessionPerformanceAPI,
  fetchBulkCachedCoachSessionPerformance as fetchBulkCachedCoachSessionPerformanceAPI,
  fetchCoachPrivateServicePerformance,
  fetchBulkCoachPrivateServicePerformance as fetchBulkCoachPrivateServicePerformanceAPI,
  fetchBulkCachedCoachPrivateServicePerformance as fetchBulkCachedCoachPrivateServicePerformanceAPI,
  setSessionCoachPaymentRuleAPI,
  setPrivateBookingCoachPaymentRuleAPI,
  runSimulationAPI,
  exportAsyncCoachPerformanceExcel as exportAsyncCoachPerformanceExcelAPI,
  fetchCoachPerformanceCachedData as fetchCoachPerformanceCachedDataAPI,
  exportAsyncCoachPerformancePdf as exportAsyncCoachPerformancePdfAPI,
} from './api';
import type { Dispatch, OptionCallback } from '../../state/types';
import type {
  CoachPaymentRule,
  CoachPaymentRuleGroup,
  CoachPerformance,
} from './types';
import { snackbarError, snackbarSuccess } from '../snackbar/actions';
import { postBaseAuth, putAuth, deleteAuth } from '../../http';
import { displayBackgroundDialog } from '../background-dialog/actions';
import { monitorBackgroundTask } from '../background-task/actions';
// @ts-expect-error
import { openPdfDocument } from './utils';

import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;

export const fetchAllPaymentRules = {
  success: createAction('COACH-PAYMENT/LIST/SUCCESS'),
  isLoading: createAction('COACH-PAYMENT/LIST/LOADING'),
  error: createAction('COACH-PAYMENT/LIST/ERROR'),
};

export function fetchAllCoachPaymentRules(
  options?: OptionCallback<CoachPaymentRule[]>,
) {
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

export function upsertCoachPaymentRule(
  rule: CoachPaymentRule,
  options?: OptionCallback,
) {
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
      // @ts-expect-error
      if (options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      let error_message = `paymentRules.${kind}.error`;

      if (error.response.data?.error_code === 91000) {
        error_message =
          'paymentRules.errors.cannotHaveSeveralPaymentRulesWithSameName';
      }

      dispatch(snackbarError(error_message));
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
    } catch (_error) {
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
    associatedCoachId: number;
    start_timestamp: number;
    end_timestamp: number;
    sessionId?: number;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      coachSessionPerformanceActions.isLoading({
        loading: true,
        associatedCoachId: params.associatedCoachId,
      }),
    );
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
    dispatch(
      coachSessionPerformanceActions.isLoading({
        loading: false,
        associatedCoachId: params.associatedCoachId,
      }),
    );
  };
}

export const coachBulkSessionPerformanceActions = {
  error: createAction('COACH/PERFORMANCE_BULK/ERROR'),
  isLoading: createAction('COACH/PERFORMANCE_BULK/IS_LOADING'),
  success: createAction('COACH/PERFORMANCE_BULK/SUCCESS'),
};
export function fetchBulkCoachSessionPerformance(
  params: {
    associated_coach_ids: Array<number>;
    start_timestamp: number;
    end_timestamp: number;
    from_cache?: boolean;
  },
  options?: OptionCallback<{ [coach_id: number]: Array<CoachPerformance> }>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(coachBulkSessionPerformanceActions.isLoading(true));
    dispatch(coachBulkSessionPerformanceActions.error(null));
    try {
      const api_call = params?.from_cache
        ? fetchBulkCachedCoachSessionPerformanceAPI
        : fetchBulkCoachSessionPerformanceAPI;
      const response = await api_call(params);
      dispatch(coachBulkSessionPerformanceActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(coachBulkSessionPerformanceActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(coachBulkSessionPerformanceActions.isLoading(false));
  };
}
export const coachPrivateServicePerformanceActions = {
  error: createAction('COACH/PRIVATE_SERVICE/PERFORMANCE/ERROR'),
  isLoading: createAction('COACH/PRIVATE_SERVICE/PERFORMANCE/IS_LOADING'),
  success: createAction('COACH/PRIVATE_SERVICE/PERFORMANCE/SUCCESS'),
};

export function fetchCoachPrivateServicePerformanceAction(
  params: {
    associatedCoachId: number;
    start_timestamp: number;
    end_timestamp: number;
    privateBookingId?: number;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      coachPrivateServicePerformanceActions.isLoading({
        loading: true,
        associatedCoachId: params.associatedCoachId,
      }),
    );
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
    dispatch(
      coachPrivateServicePerformanceActions.isLoading({
        loading: false,
        associatedCoachId: params.associatedCoachId,
      }),
    );
  };
}

export const coachBulkPrivateServicePerformanceActions = {
  error: createAction('COACH/PRIVATE_SERVICE/BULK_PERFORMANCE/ERROR'),
  isLoading: createAction('COACH/PRIVATE_SERVICE/BULK_PERFORMANCE/IS_LOADING'),
  success: createAction('COACH/PRIVATE_SERVICE/BULK_PERFORMANCE/SUCCESS'),
};

export function fetchBulkPrivateServicePerformance(
  params: {
    associated_coach_ids: Array<number>;
    start_timestamp: number;
    end_timestamp: number;
    from_cache?: boolean;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(coachBulkPrivateServicePerformanceActions.isLoading(true));
    dispatch(coachBulkPrivateServicePerformanceActions.error(null));
    try {
      const api_call = params?.from_cache
        ? fetchBulkCachedCoachPrivateServicePerformanceAPI
        : fetchBulkCoachPrivateServicePerformanceAPI;
      const response = await api_call(params);
      dispatch(
        coachBulkPrivateServicePerformanceActions.success(response.data),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(coachBulkPrivateServicePerformanceActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(coachBulkPrivateServicePerformanceActions.isLoading(false));
  };
}
export const sessionCoachPaymentRule = {
  isLoading: createAction('SESSIONS/COACH_PAYMENT_RULE/IS_LOADING'),
  error: createAction('SESSIONS/COACH_PAYMENT_RULE/ERROR'),
  success: createAction('SESSIONS/COACH_PAYMENT_RULE/SUCCESS'),
};
export function setSessionCoachPaymentRule(
  {
    associatedCoachId,
    sessionId,
    coachPaymentRuleId,
  }: {
    associatedCoachId: number;
    sessionId: number;
    coachPaymentRuleId: number;
  },
  options?: OptionCallback<{ associatedCoachId: number; sessionId: number }>,
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
  {
    associatedCoachId,
    privateBookingId,
    coachPaymentRuleId,
  }: {
    associatedCoachId: number;
    privateBookingId: number;
    coachPaymentRuleId: number;
  },
  options?: OptionCallback<{
    associatedCoachId: number;
    privateBookingId: number;
  }>,
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
  success: createAction<CoachPaymentRuleGroup[]>(
    'COACH-PAYMENT-GROUP/LIST/SUCCESS',
  ),
  isLoading: createAction<boolean>('COACH-PAYMENT-GROUP/LIST/LOADING'),
  error: createAction<Error | null>('COACH-PAYMENT-GROUP/LIST/ERROR'),
};

export function fetchAllCoachPaymentRuleGroups(
  options?: OptionCallback<CoachPaymentRuleGroup[]>,
) {
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
  options?: OptionCallback<CoachPaymentRule>,
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
      // @ts-expect-error
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
    } catch (_error) {
      dispatch(coachPaymentRuleGroupDelete.error(group));
      dispatch(snackbarError('paymentRuleGroups.delete.error'));
    }
    dispatch(coachPaymentRuleGroupDelete.isLoading(false));
  };
}

export const exportExcelPerformanceActions = {
  isLoading: createAction('COACH_PERFORMANCE/EXCEL/IS_LOADING'),
  error: createAction('COACH_PERFORMANCE/EXCEL/ERROR'),
  success: createAction('COACH_PERFORMANCE/EXCEL/SUCCESS'),
  create: createAction('COACH_PERFORMANCE/EXCEL/CREATE'),
};

export function exportExcelPerformance(
  params: {
    start_timestamp?: number;
    end_timestamp?: number;
    score_timestamp?: number;
    associated_coaches_in?: Array<number>;
  },
  options?: OptionCallback & {
    closeInitialDialog: () => void;
    backgroundDialog?: {
      message: string;
      title: string;
    };
  },
) {
  return async (dispatch: Dispatch) => {
    dispatch(exportExcelPerformanceActions.isLoading(true));
    dispatch(exportExcelPerformanceActions.error(null));
    try {
      const response = await exportAsyncCoachPerformanceExcelAPI(params);
      dispatch(exportExcelPerformanceActions.success(response.data));
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            if (options?.onSuccess) options.onSuccess();
            if (options?.closeInitialDialog) options.closeInitialDialog();
            dispatch(
              displayBackgroundDialog(
                backgroundTaskUuid,
                options?.backgroundDialog?.message,
                options?.backgroundDialog?.title,
                // @ts-expect-error
                response.data,
              ),
            );
          },
        }),
      );
    } catch (err) {
      dispatch(exportExcelPerformanceActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(exportExcelPerformanceActions.isLoading(false));
  };
}

export const fetchCoachPerformanceCachedDataActions = {
  error: createAction('COACH/PERFORMANCE/GET_CACHED_DATA/ERROR'),
  isLoading: createAction('COACH/PERFORMANCE/GET_CACHED_DATA/IS_LOADING'),
  success: createAction('COACH/PERFORMANCE/GET_CACHED_DATA/SUCCESS'),
};

export function fetchCoachPerformanceCachedData(
  params: {
    max_range: number;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCoachPerformanceCachedDataActions.isLoading(true));
    dispatch(fetchCoachPerformanceCachedDataActions.error(null));
    try {
      const response = await fetchCoachPerformanceCachedDataAPI(params);
      dispatch(fetchCoachPerformanceCachedDataActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(fetchCoachPerformanceCachedDataActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchCoachPerformanceCachedDataActions.isLoading(false));
  };
}

export const exportPdfPerformanceActions = {
  isLoading: createAction('COACH_PERFORMANCE/PDF/IS_LOADING'),
  error: createAction('COACH_PERFORMANCE/PDF/ERROR'),
  success: createAction('COACH_PERFORMANCE/PDF/SUCCESS'),
  create: createAction('COACH_PERFORMANCE/PDF/CREATE'),
};

export function exportPdfPerformance(
  params: {
    start_timestamp?: number;
    end_timestamp?: number;
    score_timestamp?: number;
    associated_coaches_in?: Array<number>;
    data_to_export?: number;
    company_id?: number;
    establishmentFilterIds?: number[];
    establismentGroupFilterNames?: string[];
    establishmentFilterNames?: string[];
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(exportPdfPerformanceActions.isLoading(true));
    dispatch(exportPdfPerformanceActions.error(null));
    try {
      const response = await exportAsyncCoachPerformancePdfAPI(params);
      dispatch(exportPdfPerformanceActions.success(response.data));
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            if (options?.onSuccess) options.onSuccess();
            openPdfDocument(response);
          },
        }),
      );
    } catch (err) {
      dispatch(exportPdfPerformanceActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(exportPdfPerformanceActions.isLoading(false));
  };
}
