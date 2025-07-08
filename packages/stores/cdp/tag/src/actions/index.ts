import { Result } from "typescript-result";

import { type Action, createErrorWithContext } from "@bsport/store-base";

import { fetchTagGroupsAPI, fetchTagsAPI } from "#src/api";
import type { Tag, TagGroup } from "#src/types";

import { setTagGroups, setTags } from "./store";

/**
 * Fetches the list of tags.
 */
export const fetchTagsAction: Action<void, Tag[]> = async (fetch) => {
  const [uri, init] = fetchTagsAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setTags({
        tags: data,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch tags",
      }),
  );
};

/**
 * Fetches the list of tag groups.
 */
export const fetchTagGroupsAction: Action<void, TagGroup[]> = async (fetch) => {
  const [uri, init] = fetchTagGroupsAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setTagGroups({
        groups: data,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch tag groups",
      }),
  );
};
