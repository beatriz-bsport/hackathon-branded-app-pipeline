import { Result } from "typescript-result";

import { createErrorWithContext } from "@bsport/store-base";
import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchAttendancesAPI } from "#src/api";
import type { Attendance } from "#src/types";

import { setAttendances } from "./store";

/**
 * Fetches a list of paginated attendances.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 */
export const fetchAttendancesAction: Action<
  { page: number; page_size: number },
  PaginatedResponse<Attendance>
> = async (fetch, params) => {
  const [uri, init] = fetchAttendancesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setAttendances({
        attendances: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch attendances",
        params,
      }),
  );
};
