import { Result } from "typescript-result";

import type { Action } from "@bsport/store-base";

import { FetchSctParams, fetchScts } from "#src/api";
import type { sct } from "#src/types";

import { setScts } from "./store";

export const fetchSctsAction: Action<FetchSctParams, sct[]> = async (
  fetch,
  params,
) => {
  const [uri, init] = fetchScts(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setScts({
        scts: data,
      });

      return data;
    },
    (error) => new Error("Failed to fetch SCTs", { cause: error }),
  );
};
