import {
  API_V1_URI,
  getAuth,
  putAuth,
  postBaseAuth,
  buildUrlParams,
} from '../../http';

export const fetchCoachPaymentRules = async () => {
  return getAuth(`${API_V1_URI}/coach_payment_rules/get_coach_payment_rules/`);
};

export const fetchCoachSessionPerformance = async (
  associatedCoachId: number,
  start_timestamp: number,
  end_timestamp: number,
) => {
  return getAuth(
    `${API_V1_URI}/coach_payment_rules/get_coach_session_performance/${buildUrlParams(
      {
        associatedCoachId,
        start_timestamp,
        end_timestamp,
      },
    )}`,
  );
};
export const fetchCoachPrivateServicePerformance = async (
  associatedCoachId: number,
  start_timestamp: number,
  end_timestamp: number,
) => {
  return getAuth(
    `${API_V1_URI}/coach_payment_rules/get_coach_private_service_performance/${buildUrlParams(
      {
        associatedCoachId,
        start_timestamp,
        end_timestamp,
      },
    )}`,
  );
};
export const runSimulationAPI = async (id, params) => {
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
