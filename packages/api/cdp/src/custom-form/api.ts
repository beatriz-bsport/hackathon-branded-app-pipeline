import { type Fetch, buildUrlParams } from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";

import { CUSTOM_FORM_API_V1 } from "./constants";
import type {
  CustomForm,
  FetchCustomFormsParams,
  PaginatedCustomForms,
} from "./types";

export const customFormKeys = {
  all: [QUERY_KEY_MAIN, "custom-form"] as const,
  lists: () => [...customFormKeys.all, "list"] as const,
  list: (params: FetchCustomFormsParams) =>
    [...customFormKeys.lists(), params] as const,
} as const;

/**
 * Lists company custom forms for picker UIs.
 */
export const fetchCustomFormsAPI = async (
  fetch: Fetch<PaginatedCustomForms>,
  params: FetchCustomFormsParams,
): Promise<PaginatedCustomForms> => {
  const { data } = await fetch(
    `${CUSTOM_FORM_API_V1}/custom_form/${buildUrlParams(params)}`,
  );

  return data;
};

export type { CustomForm };
