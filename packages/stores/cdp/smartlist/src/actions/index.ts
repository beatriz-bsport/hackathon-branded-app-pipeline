import { Result } from "typescript-result";

import type { Action } from "@bsport/store-base";

import { fetchSmartlistsAPI } from "#src/api";
import type { Smartlist } from "#src/types";

import { setSmartlists } from "./store";

export const fetchSmartlistsAction: Action<
  { page: number; page_size: number },
  Smartlist[]
> = async (fetch) => {
  const [uri, init] = fetchSmartlistsAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSmartlists({
        smartlists: data,
        page: 1,
        count: data.length,
      });

      return data;
    },
    (error) => new Error("Failed to fetch smartlists", { cause: error }),
  );
};
