import { type UseQueryResult, useQueries } from "@tanstack/react-query";

import {
  type AppointmentPass,
  retrieveAppointmentPassQueryOptions,
} from "@bsport/api-buyables/appointment-pass";
import { type Pass, retrievePassQueryOptions } from "@bsport/api-buyables/pass";

import { fetch } from "#src/utils/fetch";

const STALETIME_5_MIN = 5 * 60 * 1_000;

function combineBenefitsQueries(
  results: [UseQueryResult<Pass>, UseQueryResult<AppointmentPass>],
) {
  const [passResult, appointmentPassResult] = results;
  return {
    passBenefit: passResult.data,
    appointmentPassBenefit: appointmentPassResult.data,
    isLoading: passResult.isLoading || appointmentPassResult.isLoading,
    isError: passResult.isError || appointmentPassResult.isError,
  };
}

export const useBenefitsQueries = ({
  passId,
  appointmentPassId,
  throwOnError,
}: {
  passId?: number | null;
  appointmentPassId?: number | null;
  /** Throwing on error will pop the error up to the first boundary */
  throwOnError?: boolean;
}) => {
  const data = useQueries({
    queries: [
      {
        ...retrievePassQueryOptions(fetch, passId!),
        enabled: Boolean(passId),
        staleTime: STALETIME_5_MIN,
        throwOnError,
      },
      {
        ...retrieveAppointmentPassQueryOptions(fetch, appointmentPassId!),
        enabled: Boolean(appointmentPassId),
        staleTime: STALETIME_5_MIN,
        throwOnError,
      },
    ],
    combine: combineBenefitsQueries,
  });

  return data;
};
