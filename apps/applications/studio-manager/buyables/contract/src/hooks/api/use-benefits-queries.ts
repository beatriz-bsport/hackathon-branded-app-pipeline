import {
  type UseSuspenseQueryResult,
  queryOptions,
  useSuspenseQueries,
} from "@tanstack/react-query";

import {
  type AppointmentPass,
  appointmentPassKeys,
  retrieveAppointmentPassQueryOptions,
} from "@bsport/api-buyables/appointment-pass";
import {
  type Pass,
  passKeys,
  retrievePassQueryOptions,
} from "@bsport/api-buyables/pass";

import { fetch } from "#src/utils/fetch";

const STALETIME_5_MIN = 5 * 60 * 1_000;

export type UseBenefitsQueriesReturnType = {
  passBenefit: Pass | null;
  appointmentPassBenefit: AppointmentPass | null;
};

function passBenefitQueryOptions(passId: number | null | undefined) {
  if (passId == null) {
    return queryOptions({
      queryKey: [...passKeys.details(), "none"],
      queryFn: () => null,
      staleTime: Infinity,
    });
  }
  return {
    ...retrievePassQueryOptions(fetch, passId),
    staleTime: STALETIME_5_MIN,
  };
}

function appointmentPassBenefitQueryOptions(
  appointmentPassId: number | null | undefined,
) {
  if (appointmentPassId == null) {
    return queryOptions({
      queryKey: [...appointmentPassKeys.details(), "none"],
      queryFn: () => null,
      staleTime: Infinity,
    });
  }
  return {
    ...retrieveAppointmentPassQueryOptions(fetch, appointmentPassId),
    staleTime: STALETIME_5_MIN,
  };
}

function combineBenefitsQueries(
  results: [
    UseSuspenseQueryResult<Pass | null>,
    UseSuspenseQueryResult<AppointmentPass | null>,
  ],
) {
  const [passResult, appointmentPassResult] = results;
  return {
    passBenefit: passResult.data ?? null,
    appointmentPassBenefit: appointmentPassResult.data ?? null,
  };
}

/**
 * Suspends until both benefit details resolve, so the contract form can be
 * initialized from ready data — no loading flag / effect synchronization.
 */
export const useBenefitsQueries = ({
  passId,
  appointmentPassId,
}: {
  passId?: number | null;
  appointmentPassId?: number | null;
}): UseBenefitsQueriesReturnType =>
  useSuspenseQueries({
    queries: [
      passBenefitQueryOptions(passId),
      appointmentPassBenefitQueryOptions(appointmentPassId),
    ],
    combine: combineBenefitsQueries,
  });
