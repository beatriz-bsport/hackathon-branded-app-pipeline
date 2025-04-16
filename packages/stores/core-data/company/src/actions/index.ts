import { Result } from "typescript-result";

import type { Action } from "@bsport/store-base";

import {
  type FetchCompaniesParams,
  fetchCompaniesAPI,
  fetchFeaturesAPI,
} from "#src/api";
import type { Company, UpsellSumup } from "#src/types";

import { setCompanies, setFeatures } from "./store";

/**
 * Search for companies.
 * @param params.search [Optional] String to query company.
 * @param params.id__in [Optional] Filter companies.
 */
export const fetchCompaniesAction: Action<
  FetchCompaniesParams,
  Company[]
> = async (fetch, params) => {
  const [uri, init] = fetchCompaniesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCompanies(data);

      return data;
    },
    (error) => new Error("Failed to fetch companies", { cause: error }),
  );
};

/**
 * Query the features available for the User's company.
 */
export const fetchFeaturesAction: Action<
  void,
  { upsell: UpsellSumup[] }
> = async (fetch) => {
  const [uri, init] = fetchFeaturesAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setFeatures(data.upsell);

      return data;
    },
    (error) => new Error("Failed to fetch features", { cause: error }),
  );
};
