import { Result } from "typescript-result";

import { createErrorWithContext } from "@bsport/store-base";
import type { Action, PaginatedResponse } from "@bsport/store-base";

import {
  type FetchAttendancesParams,
  clockInAPI,
  clockOutAPI,
  fetchAttendancesAPI,
} from "#src/api";
import type { Attendance } from "#src/types";

import { setAttendances, updateAttendance } from "./store";

/**
 * Fetches a list of paginated attendances.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 * @param params.my_current Whether to retrieve on going attendance of the user making the request
 */
export const fetchAttendancesAction: Action<
  FetchAttendancesParams,
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

/**
 * Clock-in the provided user
 * @param params.userId Id of the user to clock-in
 * @returns The generated Attendance object
 */
export const clockInAction: Action<{ userId: number }, Attendance> = async (
  fetch,
  params,
) => {
  const [uri, init] = clockInAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateAttendance(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to clock-in user",
        params,
      }),
  );
};

/**
 * Terminate the provided attendance (~clock-out the user)
 * @param params.attendanceId Id of the Attendance to mark as completed
 * @returns The updated Attendance object
 */
export const clockOutAction: Action<
  { attendanceId: number },
  Attendance
> = async (fetch, params) => {
  const [uri, init] = clockOutAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateAttendance(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to clock-out user",
        params,
      }),
  );
};
