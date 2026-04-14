import { type Fetch, buildUrlParams } from "@bsport/store-base";

import type {
  ActivePartnershipAccount,
  FetchActivePartnershipAccountsParams,
} from "./types";

const API_URL = "book/v1/partnership/partnership_account";

export const fetchActivePartnershipAccountsAPI = async (
  fetch: Fetch<ActivePartnershipAccount[]>,
  params: FetchActivePartnershipAccountsParams,
): Promise<ActivePartnershipAccount[]> => {
  const { data } = await fetch(
    `${API_URL}/active_for_offer/${buildUrlParams(params)}`,
  );
  return data;
};
