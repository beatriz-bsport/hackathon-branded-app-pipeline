import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  fetchTeacherPaymentRulesAPI,
  teacherPaymentRulesKeys,
} from "@bsport/api-financial-services/teacher-payment-rules";

import { fetch } from "#src/utils/fetch";

const TEACHER_PAYMENT_RULES_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchTeacherPaymentRules = fetchTeacherPaymentRulesAPI.bind(null, fetch);

export const teacherPaymentGroupQueryOptions = () => {
  return queryOptions({
    queryKey: teacherPaymentRulesKeys.list(),
    queryFn: () => fetchTeacherPaymentRules(),
    staleTime: TEACHER_PAYMENT_RULES_STALE_TIME,
  });
};

export const useFetchTeacherPaymentRules = () => {
  return useQuery({
    ...teacherPaymentGroupQueryOptions(),
  });
};
