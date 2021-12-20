import {
  deleteAuth,
  getAuth,
  postAuth,
  putAuth,
  buildUrlParams,
  API_V1_URI,
} from '../../http';
import { PerformanceTrackingMetric, PerformanceTrackingProgram } from './types';

export const createProgramAndMetric = async (data: {
  program: PerformanceTrackingProgram;
  metric_list: Array<PerformanceTrackingMetric>;
}) => {
  return postAuth(
    `${API_V1_URI}/performance_tracking/program/create_program_and_metrics/`,
    data,
  );
};

export const createMemberProgram = async (data: {
  program: number;
  member: number;
}) => {
  return postAuth(`${API_V1_URI}/performance_tracking/member_program/`, data);
};

export const UpdateProgramAndMetric = async (data: {
  program: PerformanceTrackingProgram;
  metric_list: Array<PerformanceTrackingMetric>;
}) => {
  return putAuth(
    `${API_V1_URI}/performance_tracking/program/${data.program.id}/update_program_and_metrics/`,
    data,
  );
};

export const UpdateMemberMetricValue = async (data: {
  memberProgram: number;
  metric: number;
  value: number;
  company?: number;
}) => {
  const { memberProgram, company, ...restData } = data;
  return putAuth(
    `${API_V1_URI}/performance_tracking/member_program/${memberProgram}/update_record_value/${
      company ? buildUrlParams({ company }) : ''
    }`,
    { ...restData },
  );
};

export const fetchProgram = async (params: {
  is_disabled?: boolean;
  company?: number;
  id__in?: Array<number>;
}) => {
  return getAuth(
    `${API_V1_URI}/performance_tracking/program/${buildUrlParams(params)}`,
  );
};

export const fetchMemberProgram = async (params: {
  member?: number;
  member__in?: Array<number>;
  company?: number;
  program?: number;
  page?: number;
  page_size?: number;
}) => {
  return getAuth(
    `${API_V1_URI}/performance_tracking/member_program/${buildUrlParams(
      params,
    )}`,
  );
};

export const enableOrDisableProgram = async (params: {
  id: number;
  enabled: boolean;
}) => {
  const { id, ...restParams } = params;
  return putAuth(
    `${API_V1_URI}/performance_tracking/program/${id}/disable_or_enable_program/`,
    restParams,
  );
};

export const fetchMetric = async (params?: {
  id__in?: Array<number>;
  company?: number;
  program?: number;
}) => {
  return getAuth(
    `${API_V1_URI}/performance_tracking/metric/${buildUrlParams({
      ...params,
    })}`,
  );
};

export const disableMemberProgram = async (memberProgramId: number) => {
  return deleteAuth(
    `${API_V1_URI}/performance_tracking/member_program/${memberProgramId}/`,
  );
};
