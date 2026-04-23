import { useQuery } from "@tanstack/react-query";

import { fetch } from "#src/utils/fetch";

export type SmartfillRunNotification = {
  id: number;
  communication_sent_id: number;
  date_sent: string;
  member_id: number;
};

export type SmartfillRunDetail = {
  id: number;
  offer_id: number;
  date_created: string;
  notifications: SmartfillRunNotification[];
};

export const SMARTFILL_RUN_DETAIL_QUERY_KEY = (id: number) =>
  ["@sm-smartfill", "runs", id] as const;

export const useSmartfillRunDetail = (id: number | null) =>
  useQuery({
    queryKey: SMARTFILL_RUN_DETAIL_QUERY_KEY(id ?? -1),
    queryFn: async () => {
      const { data } = await fetch<SmartfillRunDetail>(
        `book/v1/smartfill/runs/${id}/`,
      );
      return data;
    },
    enabled: id != null,
  });
