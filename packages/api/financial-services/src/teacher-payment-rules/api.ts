import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { CoachPaymentRule } from "./types";

const API_URL = "financial-services/v1";
const API_URL_TEACHER_PAYMENT_RULES = `${API_URL}/coach_payment_rules`;

const fetchTeacherPaymentRulesAPIConfig = (): ApiConfig => {
  return [`${API_URL_TEACHER_PAYMENT_RULES}/get_coach_payment_rules/`];
};

export const fetchTeacherPaymentRulesAPI = async (
  fetch: Fetch<CoachPaymentRule[]>,
): Promise<CoachPaymentRule[]> => {
  const [uri, init] = fetchTeacherPaymentRulesAPIConfig();

  const { data } = await fetch(uri, init);

  return data;
};
