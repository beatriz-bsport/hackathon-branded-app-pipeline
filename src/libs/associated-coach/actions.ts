import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';

import uniq from 'lodash/uniq';
import { ThunkDispatch } from 'redux-thunk';
import { COACH_EMAIL_ADDRESS_EXISTS } from '@bsport/common/lib/master-data/error-codes/associated-coach';
import { putAuth, API_V1_URI, buildUrlParams } from '../../http';
import { snackbarSuccess, snackbarError } from '#libs/snackbar/actions';
import {
  updateCoach as updateCoachAPI,
  addCoach as addCoachAPI,
  linkByEmail as linkByEmailAPI,
  fetchAssociatedCoaches as fetchAssociatedCoachesAPI,
  fetchPaginatedAssociatedCoaches as fetchPaginatedAssociatedCoachesAPI,
  fetchAssociatedCoach as fetchAssociatedCoachAPI,
  deleteCoach as deleteCoachAPI,
  restoreCoach as restoreCoachAPI,
  fetchAssociatedCoachPerformance as fetchAssociatedCoachPerformanceAPI,
  updateCoachPrivateSlotsPaymentRules as updateCoachPrivateSlotsPaymentRulesAPI,
  editAccessToCoachSpaceAPI,
  retrieveMyAssociatedCoachProfile as retrieveMyAssociatedCoachProfileAPI,
  updateAssociatedCoachReplacementPreferences as updateAssociatedCoachReplacementPreferencesAPI,
  getAssociatedCoachLateReplacementRequestStatus as getAssociatedCoachLateReplacementRequestStatusAPI,
} from '#libs/associated-coach/api';
import { assignDisciplineGroup as assignDisciplineGroupAPI } from '#libs/replacement-request/api';
import { getFreshCoachIds } from '#libs/associated-coach/selectors';

import { createDictionnaryById, createIdList } from '../../actions/utils';
import {
  OptionCallback,
  Dispatch,
  CustomErrorActionCallback,
} from '../../state/types';
import { RootState } from '../../reducers';
import { ASSOCIATED_COACH_WITH_COACH_PAYMENT_RULE_GROUP } from '#libs/coach-payment-rules/constants';
import {
  Coach,
  CoachReplacementPreferencesData,
  CoachLateReplacementRequestStatus,
} from './types';
import { AssignAssociatedCoachDisciplineGroupParams } from '#libs/replacement-request/types';

export const associated = {
  isLoading: createAction('COACH/ASSOCIATED/IS_LOADING'),
  error: createAction('COACH/ASSOCIATED/ERROR'),
  success: createAction('COACH/ASSOCIATED/SUCCESS'),
};

export function linkByEmail(
  email: string,
  options: {
    onSuccess: () => void;
    onError: (error?: Error) => void;
  },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await linkByEmailAPI(email);
      if (response.status === 201) {
        dispatch(snackbarSuccess('coach.linkByEmail.success'));
        options.onSuccess();
      } else {
        options.onError(response);
      }
    } catch (err) {
      console.error(err);
      options.onError(err);
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
      dispatch(fetchAssociatedCoach(id));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(snackbarError('coach.delete.error'));
      if (options && options.onError) options.onError();
    }
  };
}

export const resetAction = createAction('COACH/RESET/SUCCESS');

export function resetCoaches() {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(resetAction(true));
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
  params?: { [key: string]: boolean | string | number | number[] },
  options?: OptionCallback<Array<Coach>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(coachListAction.isLoading(true));
    dispatch(coachListAction.error(null));
    try {
      const response = await fetchAssociatedCoachesAPI({
        ...params,
        page: 1,
      });
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

export const coachPaginatedListActions = {
  isLoading: createAction('COACH/PAGINATED_LIST/IS_LOADING'),
  error: createAction('COACH/PAGINATED_LIST/ERROR'),
  success: createAction('COACH/PAGINATED_LIST/SUCCESS'),
};

export function fetchAssociatedCoachesPaginatedList(
  params?: { [key: string]: boolean | number },
  options?: OptionCallback<{
    count: number;
    previous: null | number;
    next_page: null | number;
    results: Array<Coach>;
  }>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(coachPaginatedListActions.isLoading(true));
    dispatch(coachPaginatedListActions.error(null));
    try {
      const response = await fetchPaginatedAssociatedCoachesAPI({
        ...params,
        disabled: false,
      });
      dispatch(
        coachPaginatedListActions.success({
          coachDict: createDictionnaryById(response.data.results),
          coachIdList: createIdList(response.data.results),
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(coachPaginatedListActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(coachPaginatedListActions.isLoading(false));
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

export function createOrUpdateCoach(
  coachData: any,
  options: OptionCallback & CustomErrorActionCallback,
) {
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
      if (error.response?.status === 499 && error.response?.data?.error_code) {
        const error_code = error.response?.data?.error_code;
        const isEditing = coachData.has('id');

        if (
          (isEditing || !isEditing) &&
          error_code === COACH_EMAIL_ADDRESS_EXISTS
        ) {
          dispatch(snackbarError('coach.error'));
        } else dispatch(snackbarError(`coach.errors.${error_code}`));

        if (
          options &&
          options.customErrorAction &&
          error_code === COACH_EMAIL_ADDRESS_EXISTS
        ) {
          options.customErrorAction();
        }
      } else dispatch(snackbarError('coach.error'));

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
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));

    try {
      const response = await putAuth(
        `${API_V1_URI}/coach_payment_rules/set_coach_session_payment_rule/${buildUrlParams(
          {
            coachId,
            coachPaymentRuleId,
          },
        )}`,
      );
      dispatch(snackbarSuccess('paymentRules.update.success'));
      const payload = {
        coachId,
        coach_payment_rule_id: response.data.coach_payment_rule,
      };
      dispatch(setCoachPaymentRuleActions.success(payload));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.error_code ===
          ASSOCIATED_COACH_WITH_COACH_PAYMENT_RULE_GROUP
      ) {
        dispatch(
          snackbarError('paymentRuleGroups.update.error.coachWithPaymentGroup'),
        );
      } else {
        dispatch(snackbarError('paymentRules.update.error'));
      }
      dispatch(upsert.error(err));
    }
    dispatch(upsert.isLoading(false));
  };
}

export const setCoachWorkshopPaymentRuleActions = {
  success: createAction('COACH/WORHSHOP_PAYMENT_RULE/SUCCESS'),
};

export function setCoachWorkshopPaymentRule(
  coachId: number,
  coachPaymentRuleId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));

    try {
      const response = await putAuth(
        `${API_V1_URI}/coach_payment_rules/set_coach_workshop_payment_rule/${buildUrlParams(
          {
            coachId,
            coachPaymentRuleId,
          },
        )}`,
      );
      dispatch(snackbarSuccess('paymentRules.update.success'));
      const payload = {
        coachId,
        workshop_coach_payment_rule_id: response.data.coach_payment_rule,
      };
      dispatch(setCoachWorkshopPaymentRuleActions.success(payload));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.error_code ===
          ASSOCIATED_COACH_WITH_COACH_PAYMENT_RULE_GROUP
      ) {
        dispatch(
          snackbarError('paymentRuleGroups.update.error.coachWithPaymentGroup'),
        );
      } else {
        dispatch(snackbarError('paymentRules.update.error'));
      }
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
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));

    try {
      const response = await putAuth(
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
        private_coach_payment_rule_id: response.data.coach_payment_rule,
      };
      dispatch(setCoachPrivatePaymentRuleActions.success(payload));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.error_code ===
          ASSOCIATED_COACH_WITH_COACH_PAYMENT_RULE_GROUP
      ) {
        dispatch(
          snackbarError('paymentRuleGroups.update.error.coachWithPaymentGroup'),
        );
      } else {
        dispatch(snackbarError('paymentRules.update.error'));
      }
      dispatch(upsert.error(err));
    }
    dispatch(upsert.isLoading(false));
  };
}
export const setCoachPaymentRuleGroupActions = {
  success: createAction('COACH/PAYMENT_RULE_GROUP/SUCCESS'),
};

export function setCoachPaymentRuleGroup(
  coachId: number,
  coachPaymentRuleGroupId: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));

    try {
      const response = await putAuth(
        `${API_V1_URI}/coach_payment_rule_group/set_coach_payment_rule_group/${buildUrlParams(
          {
            coachId,
            coachPaymentRuleGroupId,
          },
        )}`,
      );
      dispatch(setCoachPaymentRuleGroupActions.success(response.data));
      dispatch(snackbarSuccess('paymentRules.update.success'));
      if (options && options.onSuccess) options.onSuccess();
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

export function fetchCoachBulkBase(params: any = {}, options?: OptionCallback) {
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
    const coachesId = new Set(freshCoachList);
    const newCoaches = new Set(ids);

    newCoaches?.forEach((e) => {
      if (coachesId.has(e)) {
        newCoaches.delete(e);
      }
    });
    newCoaches.delete(null);
    newCoaches.delete(undefined);
    newCoaches.delete(NaN);
    if (newCoaches.size === 0) {
      return;
    }
    dispatch(
      fetchCoachBulkBase({
        id__in: Array.from(newCoaches),
        company: companyId,
      }),
    );
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

export const updateCoachPrivateSlotsPaymentRulsActions = {
  isLoading: createAction('ASS_COACH/PRIVATE_SLOTS_PAYMENT_RULES/IS_LOADING'),
  error: createAction('ASS_COACH/PRIVATE_SLOTS_PAYMENT_RULES/ERROR'),
  success: createAction('ASS_COACH/PRIVATE_SLOTS_PAYMENT_RULES/SUCCESS'),
};

export const updateCoachPrivateSlotsPaymentRule = (
  id: number,
  data: any,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));

    try {
      const response = await updateCoachPrivateSlotsPaymentRulesAPI(id, data);
      dispatch(
        updateCoachPrivateSlotsPaymentRulsActions.success(response.data),
      );
      dispatch(snackbarSuccess('paymentRules.update.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(snackbarError('paymentRules.update.error'));
      dispatch(upsert.error(err));
    }
    dispatch(upsert.isLoading(false));
  };
};

export const editAccessToCoachSpaceActions = {
  isLoading: createAction('COACH/EDIT_ACCESS_TO_COACH_SPACE/IS_LOADING'),
  error: createAction('COACH/EDIT_ACCESS_TO_COACH_SPACE/ERROR'),
  success: createAction('COACH/EDIT_ACCESS_TO_COACH_SPACE/SUCCESS'),
};

export const editAccessToCoachSpace = (
  params: {
    id: number;
    has_access_to_coach_space: boolean;
  },
  options: OptionCallback<void>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(editAccessToCoachSpaceActions.isLoading(true));
    dispatch(editAccessToCoachSpaceActions.error(null));

    try {
      await editAccessToCoachSpaceAPI(params);
      dispatch(editAccessToCoachSpaceActions.success(params));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      options?.onError && options?.onError();
      dispatch(snackbarError('coach.editAccessToCoachSpace.error'));
      dispatch(editAccessToCoachSpaceActions.error(err));
    }
    dispatch(editAccessToCoachSpaceActions.isLoading(false));
  };
};

export const retrieveMyAssociatedCoachProfileActions = {
  error: createAction('ASSOCIATED_COACH/RETRIEVE_MY_PROPFILE/ERROR'),
  isLoading: createAction('ASSOCIATED_COACH/RETRIEVE_MY_PROPFILE/IS_LOADING'),
  success: createAction('ASSOCIATED_COACH/RETRIEVE_MY_PROPFILE/SUCCESS'),
};

export const retrieveMyAssociatedCoachProfile = (
  params?: { companyId: number },
  options?: OptionCallback<Coach>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveMyAssociatedCoachProfileActions.isLoading(true));
    dispatch(retrieveMyAssociatedCoachProfileActions.error(null));
    try {
      const response = await retrieveMyAssociatedCoachProfileAPI(params);
      dispatch(retrieveMyAssociatedCoachProfileActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (error) {
      dispatch(retrieveMyAssociatedCoachProfileActions.error(error));
      options?.onError && options.onError(error);
    }
    dispatch(retrieveMyAssociatedCoachProfileActions.isLoading(false));
  };
};

export const assignDisciplineGroupActions = {
  error: createAction('ASSOCIATED_COACH/DISCIPLINE_GROUP/ASSIGN/ERROR'),
  loading: createAction('ASSOCIATED_COACH/DISCIPLINE_GROUP/ASSIGN/LOADING'),
  success: createAction('ASSOCIATED_COACH/DISCIPLINE_GROUP/ASSIGN/SUCCESS'),
};

export const assignDisciplineGroup = (
  params: AssignAssociatedCoachDisciplineGroupParams,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(assignDisciplineGroupActions.loading(true));
    dispatch(assignDisciplineGroupActions.error(null));

    try {
      const response = await assignDisciplineGroupAPI(params);

      dispatch(assignDisciplineGroupActions.success(response.data));
      dispatch(snackbarSuccess('replacement.assignDisciplineGroup.success'));
      options?.onSuccess?.();
    } catch (error) {
      dispatch(assignDisciplineGroupActions.error(error));
      options?.onError?.();
    }
    dispatch(assignDisciplineGroupActions.loading(false));
  };
};

export const updateAssociatedCoachReplacementPreferences = (
  id: number,
  data: CoachReplacementPreferencesData,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(upsert.isLoading(true));
    dispatch(upsert.error(null));
    try {
      const response = await updateAssociatedCoachReplacementPreferencesAPI(
        id,
        data,
      );
      dispatch(upsert.success(response.data));
      dispatch(
        snackbarSuccess(
          'replacement.updateCoachReplacementPreferences.success',
        ),
      );
      options?.onSuccess?.();
    } catch (error) {
      dispatch(upsert.error(error));
      dispatch(
        snackbarError('replacement.updateCoachReplacementPreferences.error'),
      );
      options?.onError?.();
    }
    dispatch(upsert.isLoading(false));
  };
};

export const retrieveLateReplacementRequestStatus = {
  success: createAction(
    'ASSOCIATED_COACH/LATE_REQUEST_STATUS/RETRIEVE/SUCCESS',
  ),
  loading: createAction(
    'ASSOCIATED_COACH/LATE_REQUEST_STATUS/RETRIEVE/LOADING',
  ),
  error: createAction('ASSOCIATED_COACH/LATE_REQUEST_STATUS/RETRIEVE/ERROR'),
};

export const retrieveAssociatedCoachLateReplacementRequestStatus = (
  coachId: number,
  params: { company: number },
  options?: OptionCallback<CoachLateReplacementRequestStatus>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveLateReplacementRequestStatus.loading(true));
    dispatch(retrieveLateReplacementRequestStatus.error(null));
    try {
      const response = await getAssociatedCoachLateReplacementRequestStatusAPI(
        coachId,
        params,
      );
      dispatch(retrieveLateReplacementRequestStatus.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(retrieveLateReplacementRequestStatus.error(error));
      options?.onError?.();
    }
    dispatch(retrieveLateReplacementRequestStatus.loading(false));
  };
};
