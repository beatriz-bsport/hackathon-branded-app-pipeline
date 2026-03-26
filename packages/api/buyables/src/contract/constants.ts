import {
  API_V0_URL_SUBSCRIPTION,
  API_V1_URL_SUBSCRIPTION,
  QUERY_KEY_MAIN,
} from "#src/constants";

import type { FetchContractsParams } from "./types/params";

export const API_V0_URL_CONTRACT = `${API_V0_URL_SUBSCRIPTION}/contract`;
export const API_V1_URL_CONTRACT = `${API_V1_URL_SUBSCRIPTION}/contract`;

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "contract"] as const,

  lists: () => [...queryKeys.all, "list"] as const,

  list: (params: FetchContractsParams) =>
    [...queryKeys.lists(), params] as const,

  details: () => [...queryKeys.all, "detail"] as const,

  detail: (id: number) => [...queryKeys.details(), id] as const,
} as const;
