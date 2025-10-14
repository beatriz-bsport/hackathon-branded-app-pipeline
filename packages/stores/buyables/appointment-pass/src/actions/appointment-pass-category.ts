import { Result } from "typescript-result";

import { createErrorWithContext } from "@bsport/store-base";
import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchAppointmentPassCategoriesAPI } from "#src/api/appointment-pass-category";
import type {
  AppointmentPassCategory,
  FetchAppointmentPassCategoriesParams,
} from "#src/types";

import { setAppointmentPassCategories } from "./store";

export const fetchAppointmentPassCategoriesAction: Action<
  FetchAppointmentPassCategoriesParams,
  PaginatedResponse<AppointmentPassCategory>
> = async (fetch, params) => {
  const [uri, init] = fetchAppointmentPassCategoriesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

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
