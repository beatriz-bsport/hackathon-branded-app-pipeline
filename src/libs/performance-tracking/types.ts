import { Member as MemberType } from '#libs/member/types';

export type PerformanceTrackingMetric<Program = number> = {
  id?: number;
  program?: Program;
  name: string;
  machine_id: string;
  min_value: number;
  max_value: number;
  default_value: number;
  index: number;
  color: string;
  is_disabled: boolean;
};

export type PerformanceTrackingProgram<Metric = PerformanceTrackingMetric> = {
  id?: number;
  name: string;
  company?: number;
  description: string;
  icon: string;
  color: string;
  is_disabled: boolean;
  is_default: boolean;
  metric_list?: Array<Metric>;
};

export type PerformanceTrackingMemberProgram<
  Program = PerformanceTrackingProgram,
  Metric = PerformanceTrackingMetric,
  Member = MemberType,
> = {
  id?: number;
  is_disabled: boolean;
  member: Member;
  program: Program;
  metric_record: MetricRecord<Metric>;
};

export type MetricRecord<Metric = PerformanceTrackingMetric> = {
  general: {
    metrics: Array<{
      value: number;
      metric: Metric;
      metric_id: number;
    }>;
    creationDate: string;
    metric_ids: Array<number>;
  };
};

export type PerformanceTrackingState = {
  program: {
    allIds: Array<number>;
    byId: {
      [id: number]: PerformanceTrackingProgram<number>;
    };
    loading: boolean;
    error: string;
    createOrUpdate: {
      loading: boolean;
      error: string | null;
    };
    disabled: {
      loading: boolean;
      error: string | null;
    };
    delete: {
      loading: boolean;
      error: string | null;
    };
  };
  memberProgram: {
    allIds: Array<number>;
    byMemberId: {
      [id: number]: Array<number>;
    };
    loading: boolean;
    error: string | null;
    byId: {
      [id: number]: PerformanceTrackingMemberProgram<number, number, number>;
    };
    createOrUpdate: {
      loading: boolean;
      error: string | null;
    };
  };
  metricList: {
    loading: boolean;
    error: string;
    byId: {
      [id: number]: PerformanceTrackingMetric<number>;
    };
    byProgramId: {
      [id: number]: Array<PerformanceTrackingMetric<number>>;
    };
  };
};
