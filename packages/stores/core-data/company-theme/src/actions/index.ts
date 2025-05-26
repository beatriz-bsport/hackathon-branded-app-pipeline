import { Result } from "typescript-result";

import { type Action, createErrorWithContext } from "@bsport/store-base";

import { fetchCompanyThemeAPI, updateCompanyThemeAPI } from "#src/api";
import type { CompanyTheme } from "#src/types";

import { setCompanyTheme } from "./store";

/**
 * Fetch the theme of a Company.
 * @param params.companyId [Optional] Id of the company to retrieve the theme.
 * If not provided, it will call the /me endpoint, that uses the company field of the user making the request.
 */
export const fetchCompanyThemeAction: Action<
  { companyId?: number } | void,
  CompanyTheme
> = async (fetch, params) => {
  const [uri, init] = fetchCompanyThemeAPI(params ?? {});

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCompanyTheme(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch companyTheme",
        params: { companyId: params?.companyId },
      }),
  );
};

/**
 * Update the theme of a Company with the provided data
 * @param params.companyId Id of the company to update the theme.
 * @param params.data Dict of values to provide to the body of the request
 */
export const updateCompanyThemeAction: Action<
  { companyId: number; data: unknown },
  CompanyTheme
> = async (fetch, params) => {
  const [uri, init] = updateCompanyThemeAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCompanyTheme(data);

      return data;
    },
    (error) => {
      let dataContext = "Can not serialize";
      try {
        dataContext = JSON.stringify(params.data);
      } catch {
        // Skip
      }
      return createErrorWithContext(error, {
        message: "Failed to update companyTheme",
        params: { companyId: params?.companyId, data: dataContext },
      });
    },
  );
};
