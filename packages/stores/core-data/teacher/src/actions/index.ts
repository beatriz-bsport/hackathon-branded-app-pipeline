import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchTeachersAPI } from "#src/api";
import type { Teacher } from "#src/types";

import { setTeachers } from "./store";

/**
 * Fetches a list of paginated teachers.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 */
export const fetchTeachersAction: Action<
  { page: number; page_size: number },
  PaginatedResponse<Teacher>
> = async (fetch, params) => {
  const [uri, init] = fetchTeachersAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setTeachers({
        teachers: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) => new Error("Failed to fetch teachers", { cause: error }),
  );
};
