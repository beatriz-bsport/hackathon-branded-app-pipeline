import { type ApiConfig, type Fetch, buildUrlParams } from "@bsport/store-base";

import { API_V1_URL } from "../constants";
import type {
  EstablishmentBillingGroup,
  FetchEstablishmentBillingGroupsParams,
} from "./types";

const ESTABLISHMENT_BILLING_GROUP_API_URL = `${API_V1_URL}/establishment-billing-group`;

const fetchEstablishmentBillingGroupsAPI = (
  params: FetchEstablishmentBillingGroupsParams,
): ApiConfig => {
  return [`${ESTABLISHMENT_BILLING_GROUP_API_URL}/${buildUrlParams(params)}`];
};

export const fetchEstablishmentBillingGroups = async (
  fetch: Fetch<EstablishmentBillingGroup[]>,
  params: FetchEstablishmentBillingGroupsParams,
): Promise<EstablishmentBillingGroup[]> => {
  const [uri, init] = fetchEstablishmentBillingGroupsAPI(params);
  const { data } = await fetch(uri, init);
  return data;
};
