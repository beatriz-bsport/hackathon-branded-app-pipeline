import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchTeacherPaymentRulesAPI } from "@bsport/api-financial-services";

import { fetch } from "#src/utils/fetch";

import { TEACHER_PAYMENT_RULES_QUERY_KEY } from "./constants";

const TEACHER_PAYMENT_RULES_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchTeacherPaymentRules = fetchTeacherPaymentRulesAPI.bind(null, fetch);

export const teacherPaymentGroupQueryOptions = () => {
  return queryOptions({
    queryKey: [TEACHER_PAYMENT_RULES_QUERY_KEY],
    queryFn: () => fetchTeacherPaymentRules(),
    staleTime: TEACHER_PAYMENT_RULES_STALE_TIME,
  });
};

export const useFetchTeacherPaymentRules = () => {
  return useQuery({
    ...teacherPaymentGroupQueryOptions(),
  });
};
