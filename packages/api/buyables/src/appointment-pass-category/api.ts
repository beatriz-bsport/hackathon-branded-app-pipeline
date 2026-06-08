import { type PaginatedResponse, buildUrlParams } from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";
import { createAPI, createQueryOptions } from "#src/shared";

import type {
  AppointmentPassCategory,
  FetchAppointmentPassCategoriesParams,
} from "./types";

// ----------------------------------------------------------------------------

const APPOINTMENT_PASS_API_URL =
  "book/v1/private_service/private_pass_category";

export const appointmentPassCategoryKeys = {
  all: [QUERY_KEY_MAIN, "appointment-pass-category"] as const,

  lists: () => [...appointmentPassCategoryKeys.all, "list"] as const,
  list: (params: FetchAppointmentPassCategoriesParams) => [
    ...appointmentPassCategoryKeys.lists(),
    params,
  ],
} as const;

// ----------------------------------------------------------------------------

// Used in store/buyables/appointment-pass
export const fetchAppointmentPassCategoriesAPI = createAPI<
  PaginatedResponse<AppointmentPassCategory>,
  FetchAppointmentPassCategoriesParams
>((params) => [`${APPOINTMENT_PASS_API_URL}/${buildUrlParams(params)}`]);

export const fetchAppointmentPassCategoriesQueryOptions = createQueryOptions<
  PaginatedResponse<AppointmentPassCategory>,
  FetchAppointmentPassCategoriesParams
>(
  (params) => [`${APPOINTMENT_PASS_API_URL}/${buildUrlParams(params)}`],
  (params) => appointmentPassCategoryKeys.list(params),
);
