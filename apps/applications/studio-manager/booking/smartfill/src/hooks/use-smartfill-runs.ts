import { useQuery } from "@tanstack/react-query";

import { fetch } from "#src/utils/fetch";

export type SmartfillRun = {
  id: number;
  offer_id: number;
  date_created: string;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  next_page: number | null;
  results: T[];
};

export const SMARTFILL_RUNS_QUERY_KEY = ["@sm-smartfill", "runs"] as const;

export const useSmartfillRuns = (enabled: boolean) =>
  useQuery({
    queryKey: SMARTFILL_RUNS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await fetch<Paginated<SmartfillRun>>(
        "book/v1/smartfill/runs/",
      );
      return data;
    },
    enabled,
  });
