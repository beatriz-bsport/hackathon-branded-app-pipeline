import { useQuery } from "@tanstack/react-query";

import { fetch } from "#src/utils/fetch";

type SmartfillConfigStatus = {
  enabled: boolean;
};

export const SMARTFILL_CONFIG_STATUS_QUERY_KEY = [
  "@sm-smartfill",
  "config",
  "status",
] as const;

export const useSmartfillConfigStatus = () =>
  useQuery({
    queryKey: SMARTFILL_CONFIG_STATUS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await fetch<SmartfillConfigStatus>(
        "book/v1/smartfill/config/status/",
      );
      return data;
    },
  });
