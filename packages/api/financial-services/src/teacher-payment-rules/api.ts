import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_TEACHER_PAYMENT_RULES, QUERY_KEY_MAIN } from "../constants";
import { CoachPaymentRule } from "./types";

export const teacherPaymentRulesKeys = {
  all: [QUERY_KEY_MAIN, "teacher-payment-rules"] as const,
  list: () => [...teacherPaymentRulesKeys.all, "list"] as const,
} as const;

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
