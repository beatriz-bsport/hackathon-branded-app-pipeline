import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';

import uniq from 'lodash/uniq';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { putAuth, API_V1_URI, buildUrlParams } from '../../http';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import {
  updateCoach as updateCoachAPI,
  addCoach as addCoachAPI,
  linkByEmail as linkByEmailAPI,
  fetchAssociatedCoaches as fetchAssociatedCoachesAPI,
  fetchAssociatedCoach as fetchAssociatedCoachAPI,
  deleteCoach as deleteCoachAPI,
  restoreCoach as restoreCoachAPI,
  fetchAssociatedCoachPerformance as fetchAssociatedCoachPerformanceAPI,
} from './api';
import { getFreshCoachIds } from './selectors';

import { createDictionnaryById, createIdList } from '../../actions/utils';
import { OptionCallback } from '../../state/types';
import { RootState } from '../../reducers';

export const associated = {
  isLoading: createAction('COACH/ASSOCIATED/IS_LOADING'),
  error: createAction('COACH/ASSOCIATED/ERROR'),
  success: createAction('COACH/ASSOCIATED/SUCCESS'),
};

export function linkByEmail(
  email: string,
  options: { onSuccess: () => void; onError: () => void },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await linkByEmailAPI(email);
      if (response.status === 201) {
        dispatch(snackbarSuccess('coach.linkByEmail.success'));
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

export const deleteActions = {
  isLoading: createAction('COACH/DELETE/IS_LOADING'),
  error: createAction('COACH/DELETE/ERROR'),
  success: createAction('COACH/DELETE/SUCCESS'),
};

export function deleteCoach(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    try {
      await deleteCoachAPI(id);
      dispatch(snackbarSuccess('coach.delete.success'));
      // @ts-ignore TODO CHECK THIS
      dispatch(fetchAssociatedCoach(id));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(snackbarError('coach.delete.error'));
      if (options && options.onError) options.onError();
    }
  };
}

export const restoreActions = {
  isLoading: createAction('COACH/RESTORE/IS_LOADING'),
};

export function restoreCoach(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(restoreActions.isLoading(true));
    try {
      const response = await restoreCoachAPI(id);
      const payload = { [response.data.id]: response.data };
      dispatch(coachDetailAction.success(payload));
      dispatch(snackbarSuccess('coach.restore.success'));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(snackbarError('coach.restore.error'));
      if (options && options.onError) options.onError(err);
    }
    dispatch(restoreActions.isLoading(false));
  };
}

export const coachListAction = {
  isLoading: createAction('COACH/LIST/IS_LOADING'),
  error: createAction('COACH/LIST/ERROR'),
  success: createAction('COACH/LIST/SUCCESS'),
};

export function fetchAssociatedCoachesList(
  params?: { [key: string]: boolean },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(coachListAction.isLoading(true));
    dispatch(coachListAction.error(null));
    try {
      const response = await fetchAssociatedCoachesAPI(params);
      dispatch(
        coachListAction.success({
          coachDict: createDictionnaryById(response.data),
          coachIdList: createIdList(response.data),
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(coachListAction.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(coachListAction.isLoading(false));
  };
}

export const coachDetailAction = {
  isLoading: createAction('COACH/DETAIL/IS_LOADING'),
  error: createAction('COACH/DETAIL/ERROR'),
  success: createAction('COACH/DETAIL/SUCCESS'),
};

export function fetchAssociatedCoach(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(coachDetailAction.isLoading(true));
    dispatch(coachDetailAction.error(null));
    try {
      const response = await fetchAssociatedCoachAPI(id);
      const payload = { [response.data.id]: response.data };
      dispatch(coachDetailAction.success(payload));
    } catch (error) {
      dispatch(coachDetailAction.error(error));
    }
    dispatch(coachDetailAction.isLoading(false));
  };
}

export const upsert = {
  isLoading: createAction('COACH/UPSERT/IS_LOADING'),
  error: createAction('COACH/UPSERT/ERROR'),
  success: createAction('COACH/UPSERT/SUCCESS'),
};

export function createOrUpdateCoach(coachData: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));

    const createOrUpdate = coachData.has('id') ? updateCoachAPI : addCoachAPI;
    try {
      const response = await createOrUpdate(coachData);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(response);
      }
      const key = coachData.has('id') ? 'update' : 'create';
      dispatch(snackbarSuccess(`coach.${key}.success`));
      // @ts-ignore TODO check this
      dispatch(fetchAssociatedCoachesList());
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        (error.response.data.email || []).length &&
        error.response.data.email[0] ===
          'user with this email address already exists.'
      ) {
        dispatch(snackbarError('coach.error_email_exists'));
      } else {
        dispatch(snackbarError('coach.error'));
      }

      dispatch(upsert.error(error));
      if (options && options.onError) {
        options.onError((error || []).response ? error.response.data : {});
      }
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
  options: any = {},
) {
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

export const setCoachPaymentRuleActions = {
  success: createAction('COACH/PAYMENT_RULE/SUCCESS'),
};

export function setCoachPaymentRule(
  coachId: number,
  coachPaymentRuleId: number,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));

    try {
      await putAuth(
        `${API_V1_URI}/coach_payment_rules/set_coach_session_payment_rule/${buildUrlParams(
          {
            coachId,
            coachPaymentRuleId,
          },
        )}`,
      );
      dispatch(snackbarSuccess('paymentRules.update.success'));
      const payload = { coachId, coach_payment_rule_id: coachPaymentRuleId };
      dispatch(setCoachPaymentRuleActions.success(payload));
    } catch (err) {
      dispatch(snackbarError('paymentRules.update.error'));
      dispatch(upsert.error(err));
    }
    dispatch(upsert.isLoading(false));
  };
}
export const setCoachPrivatePaymentRuleActions = {
  success: createAction('COACH/PRIVATE_PAYMENT_RULE/SUCCESS'),
};

export function setCoachPrivatePaymentRule(
  coachId: number,
  coachPaymentRuleId: number,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));

    try {
      await putAuth(
        `${API_V1_URI}/coach_payment_rules/set_coach_private_payment_rule/${buildUrlParams(
          {
            coachId,
            coachPaymentRuleId,
          },
        )}`,
      );
      dispatch(snackbarSuccess('paymentRules.update.success'));
      const payload = {
        coachId,
        private_coach_payment_rule_id: coachPaymentRuleId,
      };
      dispatch(setCoachPrivatePaymentRuleActions.success(payload));
    } catch (err) {
      dispatch(snackbarError('paymentRules.update.error'));
      dispatch(upsert.error(err));
    }
    dispatch(upsert.isLoading(false));
  };
}

export const bulkRetrieveActions = {
  isLoading: createAction('COACH/BULK_RETRIEVE/IS_LOADING'),
  error: createAction('COACH/BULK_RETRIEVE/ERROR'),
  success: createAction('COACH/BULK_RETRIEVE/SUCCESS'),
};

function fetchCoachBulkBase(params: any = {}, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(bulkRetrieveActions.isLoading(true));
    dispatch(bulkRetrieveActions.error(null));

    try {
      const response = await fetchAssociatedCoachesAPI({
        ...params,
        page_size: null,
      });
      dispatch(bulkRetrieveActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(bulkRetrieveActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(bulkRetrieveActions.isLoading(false));
  };
}

export const fetchCoachBulk = (
  ids: Array<number>,
  options?: OptionCallback,
) => {
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState,
  ) => {
    const freshCoachList = getFreshCoachIds(getState());
    const ids_uniq = uniq(ids.filter((id) => !!id)).filter(
      (id) => !freshCoachList.includes(id),
    );
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(fetchCoachBulkBase({ id__in: ids_uniq }, options));
  };
};

export const fetchAssociatedCoachBulkFromCoachIds = (
  ids: Array<number>,
  companyId: number,
) => {
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState,
  ) => {
    const freshCoachList = getFreshCoachIds(getState());
    const ids_uniq = uniq(ids.filter((id) => !!id)).filter(
      (id) => !freshCoachList.includes(id),
    );
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(fetchCoachBulkBase({ id__in: ids_uniq, company: companyId }));
  };
};

export const fetchAssociatedCoachBulk = (
  ids: Array<number>,
  options?: OptionCallback,
) => {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    const ids_uniq = uniq(ids.filter((id) => !!id));
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(fetchCoachBulkBase({ associated_coach__in: ids_uniq }, options));
  };
};
