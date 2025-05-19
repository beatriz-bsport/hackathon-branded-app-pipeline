import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchCustomFormsAPI } from "#src/api";
import type { CustomForm } from "#src/types";

import { setCustomForms } from "./store";

/**
 * Fetches a list of paginated custom forms.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 */
export const fetchCustomFormsAction: Action<
  { page: number; page_size: number },
  PaginatedResponse<CustomForm>
> = async (fetch, params) => {
  const [uri, init] = fetchCustomFormsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCustomForms({
        customForms: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) => new Error("Failed to fetch custom forms", { cause: error }),
  );
};
