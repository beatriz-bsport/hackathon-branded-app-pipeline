import { type Fetch, buildUrlParams } from "@bsport/store-base";

import type { ActivePartnershipAccount } from "./types";

const API_URL = "book/v1/partnership/partnership_account";

export const partnershipKeys = {
  activeAccounts: (params: {
    establishment?: number | null;
    dateStart?: string | null;
  }) => ["active-partnership-accounts", params] as const,
};

export const fetchActivePartnershipAccountsAPI = async (
  fetch: Fetch<ActivePartnershipAccount[]>,
  params: { establishment: number; date_start: string },
): Promise<ActivePartnershipAccount[]> => {
  const { data } = await fetch(
    `${API_URL}/active_for_offer/${buildUrlParams(params)}`,
  );
  return data;
};
