import { createAction } from 'redux-actions';

import { Dispatch, ThunkAction, OptionCallback } from '../../state/types';
import {
  PerformanceTrackingMemberProgram,
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from './types';
import {
  UpdateProgramAndMetric as UpdateProgramAndMetricAPI,
  createProgramAndMetric as createProgramAndMetricAPI,
  fetchProgram as fetchProgramAPI,
  UpdateMemberMetricValue as UpdateMemberMetricValueAPi,
  fetchMemberProgram as fetchMemberProgramAPI,
  fetchMetric as fetchMetricAPI,
  createMemberProgram as createMemberProgramAPI,
  enableOrDisableProgram as enableOrDisableProgramAPI,
  disableMemberProgram as disableMemberProgramAPI,
  retrieveMemberProgram as retrieveMemberProgramAPI,
} from './api';

import { snackbarSuccess, snackbarError } from '#libs/snackbar/actions';
import { GenericPaginationResults } from '#libs/types';

export const ProgramCreateOrUpdateActions = {
  error: createAction('PROGRAM/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('PROGRAM/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('PROGRAM/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateProgram(
  data: PerformanceTrackingProgram,
  options?: OptionCallback<PerformanceTrackingProgram>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    const { metric_list, ...program } = data;
    dispatch(ProgramCreateOrUpdateActions.isLoading(true));
    dispatch(ProgramCreateOrUpdateActions.error(null));
    const apiCall = data.id
      ? UpdateProgramAndMetricAPI
      : createProgramAndMetricAPI;
    try {
      const response = await apiCall({
        program,
        metric_list,
      });

      dispatch(ProgramCreateOrUpdateActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
      if (data.id) {
        dispatch(
          snackbarSuccess('performanceTracking:program.actions.update.success'),
        );
      } else {
        dispatch(
          snackbarSuccess('performanceTracking:program.actions.create.success'),
        );
      }
    } catch (error) {
      dispatch(ProgramCreateOrUpdateActions.error(error));
      options?.onError && options.onError(error);
      if (data.id) {
        dispatch(
          snackbarError('performanceTracking.program.actions.update.error'),
        );
      } else {
        dispatch(
          snackbarError('performanceTracking.program.actions.create.error'),
        );
      }
    }
    dispatch(ProgramCreateOrUpdateActions.isLoading(false));
  };
}

export const ProgramListActions = {
  error: createAction('PROGRAM/FETCH/ERROR'),
  isLoading: createAction('PROGRAM/FETCH/IS_LOADING'),
  success: createAction('PROGRAM/FETCH/SUCCESS'),
};

export function fetchProgram(
  params?: { is_disabled?: boolean; company?: number; id__in?: Array<number> },
  options?: OptionCallback<Array<PerformanceTrackingProgram>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(ProgramListActions.isLoading(true));
    dispatch(ProgramListActions.error(null));
    try {
      const response = await fetchProgramAPI(params);
      dispatch(ProgramListActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (error) {
      dispatch(ProgramListActions.error(error));
      options?.onError && options.onError(error);
    }
    dispatch(ProgramListActions.isLoading(false));
  };
}

export const MemberProgramListActions = {
  error: createAction('MEMBERPROGRAM/FETCH/ERROR'),
  isLoading: createAction('MEMBERPROGRAM/FETCH/IS_LOADING'),
  success: createAction('MEMBERPROGRAM/FETCH/SUCCESS'),
};

export function fetchMemberProgram(
  params?: {
    company?: number;
    member?: number;
    program?: number;
    page?: number;
    page_size?: number;
    member__in?: Array<number>;
  },
  options?: OptionCallback<
    GenericPaginationResults<
      PerformanceTrackingMemberProgram<number, number, number>
    >
  >,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(MemberProgramListActions.isLoading(true));
    dispatch(MemberProgramListActions.error(null));
    try {
      if (
        params.program === undefined &&
        params.member === undefined &&
        !!params.member__in?.length
      ) {
        throw new Error('paramsNotValid');
      }
      const response = await fetchMemberProgramAPI(params);
      dispatch(MemberProgramListActions.success(response.data.results));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (error) {
      dispatch(MemberProgramListActions.error(error));
      options?.onError && options.onError(error);
    }
    dispatch(MemberProgramListActions.isLoading(false));
  };
}

export const ProgramEnableOrDisableActions = {
  error: createAction('PROGRAM/ENABLE_OR_DISABLE/ERROR'),
  isLoading: createAction('PROGRAM/ENABLE_OR_DISABLE/IS_LOADING'),
  success: createAction('PROGRAM/ENABLE_OR_DISABLE/SUCCESS'),
};

export function enableOrDisableProgram(
  params: { id: number; enabled: boolean },
  options?: OptionCallback<PerformanceTrackingProgram>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(ProgramEnableOrDisableActions.isLoading(true));
    dispatch(ProgramEnableOrDisableActions.error(null));
    try {
      const response = await enableOrDisableProgramAPI(params);
      dispatch(ProgramEnableOrDisableActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
      if (params.enabled) {
        dispatch(
          snackbarSuccess('performanceTracking:program.actions.enable.success'),
        );
      } else {
        dispatch(
          snackbarSuccess(
            'performanceTracking:program.actions.disable.success',
          ),
        );
      }
    } catch (error) {
      dispatch(ProgramEnableOrDisableActions.error(error));
      options?.onError && options.onError(error);
      if (params.enabled) {
        dispatch(
          snackbarError('performanceTracking:program.actions.enable.error'),
        );
      } else {
        dispatch(
          snackbarError('performanceTracking:program.actions.disable.error'),
        );
      }
    }
    dispatch(ProgramEnableOrDisableActions.isLoading(false));
  };
}

export const MetricListActions = {
  error: createAction('METRIC/FETCH/ERROR'),
  isLoading: createAction('METRIC/FETCH/IS_LOADING'),
  success: createAction('METRIC/FETCH/SUCCESS'),
};

export function fetchMetric(
  params?: { id__in?: Array<number>; company?: number; program?: number },
  options?: OptionCallback<Array<PerformanceTrackingMetric>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(MetricListActions.isLoading(true));
    dispatch(MetricListActions.error(null));
    try {
      const response = await fetchMetricAPI(params);

      dispatch(MetricListActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (error) {
      dispatch(MetricListActions.error(error));
      options?.onError && options.onError(error);
    }
    dispatch(MetricListActions.isLoading(false));
  };
}

export const MemberProgramCreateOrUpdateOrRetrieveActions = {
  error: createAction('MEMBERPROGRAM/CREATE_OR_UPDTAE_OR_RETRIEVE/ERROR'),
  isLoading: createAction(
    'MEMBERPROGRAM/CREATE_OR_UPDATE_OR_RETRIEVE/IS_LOADING',
  ),
  success: createAction('MEMBERPROGRAM/CREATE_OR_UPDATE_OR_RETRIEVE/SUCCESS'),
};

export function createMemberProgram(
  data: {
    program: number;
    member: number;
  },
  options?: OptionCallback<PerformanceTrackingMemberProgram>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.isLoading(true));
    dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.error(null));

    try {
      const response = await createMemberProgramAPI(data);

      dispatch(
        MemberProgramCreateOrUpdateOrRetrieveActions.success(response.data),
      );
      options?.onSuccess && options.onSuccess(response.data);
      dispatch(
        snackbarSuccess(
          'performanceTracking:memberProgram.actions.create.success',
        ),
      );
    } catch (error) {
      dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.error(error));
      options?.onError && options.onError(error);
      dispatch(
        snackbarError('performanceTracking:memberProgram.actions.create.error'),
      );
    }
    dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.isLoading(false));
  };
}

export function retrieveMemberProgram(
  params: { memberProgramId: number; companyId?: number },
  options?: OptionCallback<PerformanceTrackingMemberProgram>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.isLoading(true));
    dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.error(null));

    try {
      const response = await retrieveMemberProgramAPI(params);

      dispatch(
        MemberProgramCreateOrUpdateOrRetrieveActions.success(response.data),
      );
      options?.onSuccess && options.onSuccess(response.data);
    } catch (error) {
      dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.error(error));
      options?.onError && options.onError(error);
    }
    dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.isLoading(false));
  };
}

export function updateMemberMetricValue(
  data: {
    memberProgram: number;
    metric: number;
    value: number;
    company?: number;
  },
  options?: OptionCallback<PerformanceTrackingMemberProgram>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.isLoading(true));
    dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.error(null));

    try {
      const response = await UpdateMemberMetricValueAPi(data);

      dispatch(
        MemberProgramCreateOrUpdateOrRetrieveActions.success(response.data),
      );
      options?.onSuccess && options.onSuccess(response.data);
    } catch (error) {
      dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.error(error));
      options?.onError && options.onError(error);
    }
    dispatch(MemberProgramCreateOrUpdateOrRetrieveActions.isLoading(false));
  };
}

export const disableMemberProgramActions = {
  error: createAction('MEMBER_PROGRAM/DISABLE/ERROR'),
  isLoading: createAction('MEMBER_PROGRAM/DISABLE/IS_LOADING'),
  success: createAction('MEMBER_PROGRAM/DISABLE/SUCCESS'),
};

export function disableMemberProgram(
  memberProgramId: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(disableMemberProgramActions.isLoading(true));
    dispatch(disableMemberProgramActions.error(null));
    try {
      await disableMemberProgramAPI(memberProgramId);
      dispatch(disableMemberProgramActions.success({ memberProgramId }));
      options?.onSuccess && options.onSuccess({ memberProgramId });
      dispatch(
        snackbarSuccess(
          'performanceTracking:memberProgram.actions.disable.success',
        ),
      );
    } catch (error) {
      dispatch(disableMemberProgramActions.error(error));
      options?.onError && options.onError(error);
      dispatch(
        snackbarError(
          'performanceTracking:memberProgram.actions.disable.error',
        ),
      );
    }
    dispatch(disableMemberProgramActions.isLoading(false));
  };
}
