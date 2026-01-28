import { Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import { REPLACEMENT_REQUEST_CANNOT_HAVE_ESTABLISHMENTS_AND_LOCATIONS_SET_AT_THE_SAME_TIME } from '@bsport/common/lib/master-data/error-codes/replacement.js';
import { ReplacementRequestPaginationByStatus } from '#src/libs/replacement-request/constants';
import { isErrorWithCustomCode } from '#src/libs/utils';
import { OptionCallback } from '../../state/types';

import {
  // Replacement Requests
  fetchAllReplacementRequestCoachAnswers as fetchAllReplacementRequestCoachAnswersAPI,
  createReplacementRequestBulk as createReplacementRequestBulkAPI,
  postponeReplacementRequestClosingDate as postponeReplacementRequestClosingDateAPI,
  approveReplacementRequestCoachAnswer as approveReplacementRequestCoachAnswerAPI,
  cancelReplacementRequest as cancelReplacementRequestAPI,
  markSubstituteAsUnavailable as markSubstituteAsUnavailableAPI,
  fetchAllReplacementRequests as fetchAllReplacementRequestsAPI,
  fetchSubstitutionHistory as fetchSubstitutionHistoryAPI,

  // Discipline Groups
  fetchDisciplineGroupList as fetchDisciplineGroupListAPI,
  createDisciplineGroup as createDisciplineGroupAPI,
  deleteDisciplineGroup as deleteDisciplineGroupAPI,
  updateDisciplineGroup as updateDisciplineGroupAPI,
  refuseReplacementRequest as refuseReplacementRequestAPI,

  // Replacement Request Coach Answers
  createOrUpdateReplacementRequestCoachAnswer as createOrUpdateReplacementRequestCoachAnswerAPI,

  // Has Unseen requests
  hasUnseenConfirmedRequests as hasUnseenConfirmedRequestsAPI,

  // Has pending requests on cancelled offers
  hasRequestsLinkedToCancelledOffers as hasRequestsLinkedToCancelledOffersAPI,

  // Configuration
  fetchReplacementRequestConfiguration as fetchReplacementRequestConfigurationAPI,
  updateReplacementRequestConfiguration as updateReplacementRequestConfigurationAPI,
} from './api';
import {
  ReplacementRequest,
  ReplacementRequestAPIData,
  ReplacementRequestFilter,
  ReplacementRequestCoachAnswerFilter,
  DisciplineGroupAPIData,
  ReplacementRequestCoachAnswerAPIData,
  ReplacementRequestConfiguration,
  SubstitutionHistoryFilter,
  SubstitutionHistoryItem,
} from './types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';

export const fetchAllReplacementRequestsActions = {
  error: createAction('REPLACEMENT_REQUEST/FETCH_LIST/ERROR'),
  loading: createAction('REPLACEMENT_REQUEST/FETCH_LIST/LOADING'),
  success: createAction('REPLACEMENT_REQUEST/FETCH_LIST/SUCCESS'),
  // Additional actions to allow pagination by status
  loadingPending: createAction(
    'REPLACEMENT_REQUEST/FETCH_LIST/LOADING_PENDING',
  ),
  loadingTeacherFound: createAction(
    'REPLACEMENT_REQUEST/FETCH_LIST/LOADING_TEACHER_FOUND',
  ),
  successPending: createAction(
    'REPLACEMENT_REQUEST/FETCH_LIST/SUCCESS_PENDING',
  ),
  successTeacherFound: createAction(
    'REPLACEMENT_REQUEST/FETCH_LIST/SUCCESS_TEACHER_FOUND',
  ),
};

export const fetchAllReplacementRequests = (
  params: ReplacementRequestFilter,
  options?: OptionCallback<ReplacementRequestAPIData[]>,
  paginateByStatus?: ReplacementRequestPaginationByStatus | null,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAllReplacementRequestsActions.loading(true));
    if (paginateByStatus === ReplacementRequestPaginationByStatus.Pending)
      dispatch(fetchAllReplacementRequestsActions.loadingPending(true));
    if (paginateByStatus === ReplacementRequestPaginationByStatus.TeacherFound)
      dispatch(fetchAllReplacementRequestsActions.loadingTeacherFound(true));
    dispatch(fetchAllReplacementRequestsActions.error(null));

    try {
      const page = params.page || 1;
      const response = await fetchAllReplacementRequestsAPI({
        ...params,
        page,
      });
      // @ts-expect-error
      const payload = { ...response.data, page };
      dispatch(fetchAllReplacementRequestsActions.success(payload));

      if (paginateByStatus === 'pending')
        dispatch(fetchAllReplacementRequestsActions.successPending(payload));
      if (paginateByStatus === 'teacherFound')
        dispatch(
          fetchAllReplacementRequestsActions.successTeacherFound(payload),
        );

      // @ts-expect-error
      options?.onSuccess?.(response.data.results);
    } catch (error) {
      dispatch(fetchAllReplacementRequestsActions.error(error));
      options?.onError?.();
    }
    dispatch(fetchAllReplacementRequestsActions.loading(false));
    if (paginateByStatus === 'pending')
      dispatch(fetchAllReplacementRequestsActions.loadingPending(false));
    if (paginateByStatus === 'teacherFound')
      dispatch(fetchAllReplacementRequestsActions.loadingTeacherFound(false));
  };
};

export const createReplacementRequestBulkActions = {
  error: createAction('REPLACEMENT_REQUEST/BULK_CREATE/ERROR'),
  loading: createAction('REPLACEMENT_REQUEST/BULK_CREATE/LOADING'),
  success: createAction('REPLACEMENT_REQUEST/BULK_CREATE/SUCCESS'),
};

export const createReplacementRequestBulk = (
  data: ReplacementRequestAPIData[],
  options?: OptionCallback<ReplacementRequestAPIData[]>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(createReplacementRequestBulkActions.loading(true));
    dispatch(createReplacementRequestBulkActions.error(null));

    try {
      const response = await createReplacementRequestBulkAPI(data);

      dispatch(createReplacementRequestBulkActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          // @ts-expect-error
          snackbarError(`replacement.errors.${error.response.data.error_code}`),
        );
      }
      dispatch(createReplacementRequestBulkActions.error(error));
      options?.onError?.();
    }
    dispatch(createReplacementRequestBulkActions.loading(false));
  };
};

export const updateReplacementRequestActions = {
  error: createAction('REPLACEMENT_REQUEST/UPDATE/ERROR'),
  loading: createAction('REPLACEMENT_REQUEST/UPDATE/LOADING'),
  success: createAction('REPLACEMENT_REQUEST/UPDATE/SUCCESS'),
};

export const postponeReplacementRequestClosingDate = (
  id: number,
  date: string,
  options?: OptionCallback<ReplacementRequest>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateReplacementRequestActions.loading(true));
    dispatch(updateReplacementRequestActions.error(null));

    try {
      const response = await postponeReplacementRequestClosingDateAPI(id, date);

      dispatch(updateReplacementRequestActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          // @ts-expect-error
          snackbarError(`replacement.errors.${error.response.data.error_code}`),
        );
      }
      dispatch(updateReplacementRequestActions.error(error));
      options?.onError?.();
    }
    dispatch(updateReplacementRequestActions.loading(false));
  };
};

export const refuseReplacementRequest = (
  id: number,
  options?: OptionCallback<ReplacementRequest>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateReplacementRequestActions.loading(true));
    dispatch(updateReplacementRequestActions.error(null));

    try {
      const response = await refuseReplacementRequestAPI(id);

      dispatch(updateReplacementRequestActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          // @ts-expect-error
          snackbarError(`replacement.errors.${error.response.data.error_code}`),
        );
      }
      dispatch(updateReplacementRequestActions.error(error));
      options?.onError?.();
    }
    dispatch(updateReplacementRequestActions.loading(false));
  };
};

export const approveReplacementRequestCoachAnswer = (
  requestId: number,
  answerId: number,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateReplacementRequestActions.loading(true));
    dispatch(updateReplacementRequestActions.error(null));
    try {
      const response = await approveReplacementRequestCoachAnswerAPI(
        requestId,
        answerId,
      );

      dispatch(updateReplacementRequestActions.success(response.data));
      options?.onSuccess?.();
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          // @ts-expect-error
          snackbarError(`replacement.errors.${error.response.data.error_code}`),
        );
      }
      dispatch(updateReplacementRequestActions.error(error));
      options?.onError?.();
    }
    dispatch(updateReplacementRequestActions.loading(false));
  };
};

export const cancelReplacementRequest = (
  requestId: number,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateReplacementRequestActions.loading(true));
    dispatch(updateReplacementRequestActions.error(null));
    try {
      const response = await cancelReplacementRequestAPI(requestId);

      dispatch(updateReplacementRequestActions.success(response.data));
      // @ts-expect-error
      dispatch(snackbarSuccess('replacement.cancelReplacementRequest.success'));
      options?.onSuccess?.();
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          // @ts-expect-error
          snackbarError(`replacement.errors.${error.response.data.error_code}`),
        );
      } else {
        // @ts-expect-error
        dispatch(snackbarError('replacement.cancelReplacementRequest.error'));
      }
      dispatch(updateReplacementRequestActions.error());
      options?.onError?.();
    }
    dispatch(updateReplacementRequestActions.loading(false));
  };
};

export const markSubstituteAsUnavailable = (
  requestId: number,
  reason: string,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateReplacementRequestActions.loading(true));
    dispatch(updateReplacementRequestActions.error(null));
    try {
      const response = await markSubstituteAsUnavailableAPI(requestId, reason);

      dispatch(updateReplacementRequestActions.success(response.data));
      options?.onSuccess?.();
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          // @ts-expect-error
          snackbarError(`replacement.errors.${error.response.data.error_code}`),
        );
      } else {
        dispatch(
          // @ts-expect-error
          snackbarError('replacement.markSubstituteAsUnavailable.error'),
        );
      }
      dispatch(updateReplacementRequestActions.error());
      options?.onError?.();
    }
    dispatch(updateReplacementRequestActions.loading(false));
  };
};

export const createOrUpdateReplacementRequestCoachAnswer = (
  replacementRequestId: number,
  data: ReplacementRequestCoachAnswerAPIData,
  options?: OptionCallback<ReplacementRequestAPIData>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateReplacementRequestActions.loading(true));
    dispatch(updateReplacementRequestActions.error(null));

    try {
      const response = await createOrUpdateReplacementRequestCoachAnswerAPI(
        replacementRequestId,
        data,
      );

      dispatch(updateReplacementRequestActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(updateReplacementRequestActions.error(error));
      options?.onError?.();
    }
    dispatch(updateReplacementRequestActions.loading(false));
  };
};

export const fetchHasUnseenConfirmedRequestsActions = {
  success: createAction('REPLACEMENT_REQUEST/HAS_UNSEEN/SUCCESS'),
};

export const fetchHasUnseenConfirmedRequests = (
  params: { company?: number } = {},
) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await hasUnseenConfirmedRequestsAPI(params);
      dispatch(fetchHasUnseenConfirmedRequestsActions.success(response.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchHasRequestsLinkedToCancelledOffersActions = {
  loading: createAction(
    'REPLACEMENT_REQUEST/LINKED_TO_CANCELLED_OFFERS/EXISTS/LOADING',
  ),
  success: createAction(
    'REPLACEMENT_REQUEST/LINKED_TO_CANCELLED_OFFERS/EXISTS/SUCCESS',
  ),
  error: createAction(
    'REPLACEMENT_REQUEST/LINKED_TO_CANCELLED_OFFERS/EXISTS/ERROR',
  ),
};

export const hasRequestsLinkedToCancelledOffers = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchHasRequestsLinkedToCancelledOffersActions.loading(true));
    dispatch(fetchHasRequestsLinkedToCancelledOffersActions.error(null));
    try {
      const response = await hasRequestsLinkedToCancelledOffersAPI();
      dispatch(
        fetchHasRequestsLinkedToCancelledOffersActions.success(response.data),
      );
      dispatch(fetchHasRequestsLinkedToCancelledOffersActions.loading(false));
    } catch (error) {
      console.error(error);
      dispatch(fetchHasRequestsLinkedToCancelledOffersActions.error(error));
    }
    dispatch(fetchHasRequestsLinkedToCancelledOffersActions.loading(false));
  };
};

export const markConfirmedRequestsAsSeen = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchHasUnseenConfirmedRequestsActions.success(false));
  };
};

export const fetchAllReplacementRequestCoachAnswersActions = {
  error: createAction('REPLACEMENT_REQUEST/COACH_ANSWER/FETCH_LIST/ERROR'),
  loading: createAction('REPLACEMENT_REQUEST/COACH_ANSWER/FETCH_LIST/LOADING'),
  success: createAction('REPLACEMENT_REQUEST/COACH_ANSWER/FETCH_LIST/SUCCESS'),
};

export const fetchAllReplacementRequestCoachAnswers = (
  params: ReplacementRequestCoachAnswerFilter,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAllReplacementRequestCoachAnswersActions.loading(true));
    dispatch(fetchAllReplacementRequestCoachAnswersActions.error(null));

    try {
      const response = await fetchAllReplacementRequestCoachAnswersAPI(params);
      dispatch(
        fetchAllReplacementRequestCoachAnswersActions.success(response.data),
      );
      options?.onSuccess?.();
    } catch (error) {
      dispatch(fetchAllReplacementRequestCoachAnswersActions.error(error));
      options?.onError?.();
    }
    dispatch(fetchAllReplacementRequestCoachAnswersActions.loading(false));
  };
};

export const fetchDisciplineGroupListActions = {
  error: createAction('DISCIPLINE_GROUP/LIST/ERROR'),
  loading: createAction('DISCIPLINE_GROUP/LIST/LOADING'),
  success: createAction('DISCIPLINE_GROUP/LIST/SUCCESS'),
};

export const fetchDisciplineGroupList = (
  options?: OptionCallback<DisciplineGroupAPIData[]>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchDisciplineGroupListActions.loading(true));
    dispatch(fetchDisciplineGroupListActions.error(null));

    try {
      const response = await fetchDisciplineGroupListAPI();
      dispatch(fetchDisciplineGroupListActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(fetchDisciplineGroupListActions.error(error));
      options?.onError?.();
    }
    dispatch(fetchDisciplineGroupListActions.loading(false));
  };
};

export const createDisciplineGroupActions = {
  error: createAction('DISCIPLINE_GROUP/CREATE/ERROR'),
  loading: createAction('DISCIPLINE_GROUP/CREATE/LOADING'),
  success: createAction('DISCIPLINE_GROUP/CREATE/SUCCESS'),
};

export const createDisciplineGroup = (
  data: Omit<DisciplineGroupAPIData, 'company'>,
  options?: OptionCallback<DisciplineGroupAPIData>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(createDisciplineGroupActions.loading(true));
    dispatch(createDisciplineGroupActions.error(null));

    try {
      const response = await createDisciplineGroupAPI(data);
      dispatch(createDisciplineGroupActions.success(response.data));
      // @ts-expect-error
      dispatch(snackbarSuccess('replacement.disciplineGroup.create.success'));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(createDisciplineGroupActions.error(error));
      // @ts-expect-error
      dispatch(snackbarError('replacement.disciplineGroup.create.error'));
      options?.onError?.();
    }
    dispatch(createDisciplineGroupActions.loading(false));
  };
};

export const updateDisciplineGroupActions = {
  error: createAction('DISCIPLINE_GROUP/UPDATE/ERROR'),
  loading: createAction('DISCIPLINE_GROUP/UPDATE/LOADING'),
  success: createAction('DISCIPLINE_GROUP/UPDATE/SUCCESS'),
};

export const updateDisciplineGroup = (
  id: number,
  data: Omit<DisciplineGroupAPIData, 'company'>,
  options?: OptionCallback<DisciplineGroupAPIData>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateDisciplineGroupActions.loading(true));
    dispatch(updateDisciplineGroupActions.error(null));

    try {
      const response = await updateDisciplineGroupAPI(id, data);

      dispatch(updateDisciplineGroupActions.success(response.data));
      // @ts-expect-error
      dispatch(snackbarSuccess('replacement.disciplineGroup.update.success'));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(updateDisciplineGroupActions.error(error));
      if (
        error.response?.data?.error_code ===
        REPLACEMENT_REQUEST_CANNOT_HAVE_ESTABLISHMENTS_AND_LOCATIONS_SET_AT_THE_SAME_TIME
      ) {
        dispatch(
          // @ts-expect-error
          snackbarError(
            `replacement.errors.${REPLACEMENT_REQUEST_CANNOT_HAVE_ESTABLISHMENTS_AND_LOCATIONS_SET_AT_THE_SAME_TIME}`,
          ),
        );
      } else {
        // @ts-expect-error
        dispatch(snackbarError('replacement.disciplineGroup.update.error'));
      }
      options?.onError?.();
    }
    dispatch(updateDisciplineGroupActions.loading(false));
  };
};

export const deleteDisciplineGroupActions = {
  error: createAction('DISCIPLINE_GROUP/DELETE/ERROR'),
  loading: createAction('DISCIPLINE_GROUP/DELETE/LOADING'),
};

export const deleteDisciplineGroup = (id: number, options?: OptionCallback) => {
  return async (dispatch: Dispatch) => {
    dispatch(deleteDisciplineGroupActions.loading(true));
    dispatch(deleteDisciplineGroupActions.error(null));

    try {
      await deleteDisciplineGroupAPI(id);
      // @ts-expect-error
      dispatch(snackbarSuccess('replacement.disciplineGroup.delete.success'));
      options?.onSuccess?.();
    } catch (error) {
      dispatch(deleteDisciplineGroupActions.error(error));
      // @ts-expect-error
      dispatch(snackbarError('replacement.disciplineGroup.delete.error'));
      options?.onError?.();
    }
    dispatch(deleteDisciplineGroupActions.loading(false));
  };
};

export const fetchReplacementRequestConfigurationActions = {
  error: createAction('REPLACEMENT_REQUEST_CONFIGURATION/RETRIEVE/ERROR'),
  loading: createAction('REPLACEMENT_REQUEST_CONFIGURATION/RETRIEVE/LOADING'),
  success: createAction('REPLACEMENT_REQUEST_CONFIGURATION/RETRIEVE/SUCCESS'),
};

export const fetchReplacementConfiguration = (options?: OptionCallback) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchReplacementRequestConfigurationActions.loading(true));
    dispatch(fetchReplacementRequestConfigurationActions.error(null));

    try {
      const response = await fetchReplacementRequestConfigurationAPI();
      dispatch(
        fetchReplacementRequestConfigurationActions.success(response.data),
      );
      options?.onSuccess?.();
    } catch (error) {
      dispatch(fetchReplacementRequestConfigurationActions.error(error));
      options?.onError?.();
    }
    dispatch(fetchReplacementRequestConfigurationActions.loading(false));
  };
};

export const updateReplacementRequestConfigurationActions = {
  error: createAction('REPLACEMENT_REQUEST_CONFIGURATION/UPDATE/ERROR'),
  loading: createAction('REPLACEMENT_REQUEST_CONFIGURATION/UPDATE/LOADING'),
  success: createAction('REPLACEMENT_REQUEST_CONFIGURATION/UPDATE/SUCCESS'),
};

export const updateReplacementConfiguration = (
  companyId: number,
  data: ReplacementRequestConfiguration,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateReplacementRequestConfigurationActions.loading(true));
    dispatch(updateReplacementRequestConfigurationActions.error(null));

    try {
      const response = await updateReplacementRequestConfigurationAPI(
        companyId,
        data,
      );
      dispatch(
        updateReplacementRequestConfigurationActions.success(response.data),
      );
      // @ts-expect-error
      dispatch(snackbarSuccess('companyTheme.update.success'));
      options?.onSuccess?.();
    } catch (error) {
      dispatch(updateReplacementRequestConfigurationActions.error(error));
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          // @ts-expect-error
          snackbarError(`replacement.errors.${error.response.data.error_code}`),
        );
      }
      options?.onError?.();
    }
    dispatch(updateReplacementRequestConfigurationActions.loading(false));
  };
};

export const fetchSubstitutionHistoryActions = {
  error: createAction('SUBSTITUTION_HISTORY/FETCH/ERROR'),
  loading: createAction('SUBSTITUTION_HISTORY/FETCH/LOADING'),
  success: createAction('SUBSTITUTION_HISTORY/FETCH/SUCCESS'),
};

export const fetchSubstitutionHistory = (
  params: SubstitutionHistoryFilter,
  options?: OptionCallback<SubstitutionHistoryItem[]>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchSubstitutionHistoryActions.loading(true));
    dispatch(fetchSubstitutionHistoryActions.error(null));

    try {
      const response = await fetchSubstitutionHistoryAPI(params);
      const page = params.page || 1;
      const data = response.data;
      const results = data.results ?? [];
      const count = data.total_count ?? results.length;
      const payload = {
        results,
        count,
        page: data.current_page ?? page,
      };
      dispatch(fetchSubstitutionHistoryActions.success(payload));
      options?.onSuccess?.(results);
    } catch (error) {
      dispatch(fetchSubstitutionHistoryActions.error(error));
      options?.onError?.();
    }
    dispatch(fetchSubstitutionHistoryActions.loading(false));
  };
};
