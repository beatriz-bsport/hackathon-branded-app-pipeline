import { Result } from "typescript-result";

import { fetchAppointmentPassCategoriesAPI } from "@bsport/api-buyables/appointment-pass-category";
import { createErrorWithContext } from "@bsport/store-base";
import type { Action, PaginatedResponse } from "@bsport/store-base";

import type {
  AppointmentPassCategory,
  FetchAppointmentPassCategoriesParams,
} from "#src/types";

import { setAppointmentPassCategories } from "./store";

export const fetchAppointmentPassCategoriesAction: Action<
  FetchAppointmentPassCategoriesParams,
  PaginatedResponse<AppointmentPassCategory>
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const data = await fetchAppointmentPassCategoriesAPI(fetch, params);

      setAppointmentPassCategories({
        categories: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch appointment pass categories",
        params,
      }),
  );
};
