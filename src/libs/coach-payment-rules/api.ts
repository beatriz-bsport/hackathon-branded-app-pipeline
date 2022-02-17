import {
  API_V1_URI,
  getAuth,
  putAuth,
  postAuth,
  postBaseAuth,
  buildUrlParams,
} from '../../http';

export const fetchCoachPaymentRules = async () => {
  return getAuth(`${API_V1_URI}/coach_payment_rules/get_coach_payment_rules/`);
};
export const fetchCoachPaymentRuleGroups = async () => {
  return getAuth(
    `${API_V1_URI}/coach_payment_rule_group/get_coach_payment_rule_groups/`,
  );
};
export const fetchCoachSessionPerformance = async (params: {
  associatedCoachId: number;
  start_timestamp: number;
  end_timestamp: number;
  sessionId?: number;
}) => {
  return getAuth(
    `${API_V1_URI}/coach_payment_rules/get_coach_session_performance/${buildUrlParams(
      {
        ...params,
      },
    )}`,
  );
};

export const fetchBulkCoachSessionPerformance = async (params: {
  associated_coach_ids: Array<number>;
  start_timestamp: number;
  end_timestamp: number;
}) => {
  return postAuth(
    `${API_V1_URI}/coach_payment_rules/get_bulk_coach_session_performance/${buildUrlParams(
      {
        start_timestamp: params.start_timestamp,
        end_timestamp: params.end_timestamp,
      },
    )}`,
    {
      associated_coach_ids: params.associated_coach_ids,
    },
  );
};
export const fetchBulkCachedCoachSessionPerformance = async (params: {
  associated_coach_ids: Array<number>;
  start_timestamp: number;
  end_timestamp: number;
}) => {
  return postAuth(
    `${API_V1_URI}/coach_payment_rules/fetch_bulk_coach_session_performance/${buildUrlParams(
      {
        start_timestamp: params.start_timestamp,
        end_timestamp: params.end_timestamp,
      },
    )}`,
    {
      associated_coach_ids: params.associated_coach_ids,
    },
  );
};
export const fetchCoachPrivateServicePerformance = async (params: {
  associatedCoachId: number;
  start_timestamp: number;
  end_timestamp: number;
  privateBookingId?: number;
}) => {
  return getAuth(
    `${API_V1_URI}/coach_payment_rules/get_coach_private_service_performance/${buildUrlParams(
      {
        ...params,
      },
    )}`,
  );
};

export const fetchBlukCoachPrivateServicePerformance = async (params: {
  associated_coach_ids: Array<number>;
  start_timestamp: number;
  end_timestamp: number;
}) => {
  return postAuth(
    `${API_V1_URI}/coach_payment_rules/get_bulk_private_service_performance/${buildUrlParams(
      {
        start_timestamp: params.start_timestamp,
        end_timestamp: params.end_timestamp,
      },
    )}`,
    {
      associated_coach_ids: params.associated_coach_ids,
    },
  );
};
export const runSimulationAPI = async (id: number, params: any) => {
  return postBaseAuth(
    `${API_V1_URI}/coach_payment_rules/${id}/run_simulation/`,
    params,
  );
};
export const setSessionCoachPaymentRuleAPI = async (
  sessionId: number,
  coachPaymentRuleId: number,
) => {
  return putAuth(
    `${API_V1_URI}/coach_payment_rules/set_session_payment_rule/${buildUrlParams(
      {
        sessionId,
        coachPaymentRuleId,
      },
    )}`,
  );
};

export const setPrivateBookingCoachPaymentRuleAPI = async (
  privateBookingId: number,
  coachPaymentRuleId: number,
) => {
  return putAuth(
    `${API_V1_URI}/coach_payment_rules/set_private_booking_payment_rule/${buildUrlParams(
      {
        privateBookingId,
        coachPaymentRuleId,
      },
    )}`,
  );
};

export const exportAsyncCoachPerformanceExcel = async (params: {
  start_timestamp?: number;
  end_timestamp?: number;
  score_timestamp?: number;
}) => {
  return getAuth(
    `${API_V1_URI}/coach_payment_rules/export_excel/${buildUrlParams(params)}`,
  );
};

export const fetchCoachPerformanceCachedData = async (params: {
  max_range: number;
}) => {
  return getAuth(
    `${API_V1_URI}/coach_payment_rules/get_last_cached_data/${buildUrlParams(
      params,
    )}`,
  );
};
