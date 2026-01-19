import { Result } from "typescript-result";

import { fetchTagGroupsAPI, fetchTagsAPI } from "@bsport/api-core";
import { type Action, createErrorWithContext } from "@bsport/store-base";

import {
  createTagAPI,
  createTagGroupAPI,
  deleteTagAPI,
  deleteTagGroupAPI,
  fetchTagUsagesAPI,
  updateTagAPI,
  updateTagGroupAPI,
} from "#src/api";
import type {
  CreateTagGroupPayload,
  CreateTagPayload,
  DeleteTagGroupParams,
  DeleteTagParams,
  Tag,
  TagGroup,
  TagUsage,
  UpdateTagGroupPayload,
  UpdateTagPayload,
} from "#src/types";

import {
  deleteTag,
  deleteTagGroup,
  setSingleTag,
  setSingleTagGroup,
  setTagGroups,
  setTagUsages,
  setTags,
} from "./store";

/**
 * Fetches the list of tags from the API and updates the store.
 *
 * This action retrieves all available tags and automatically updates
 * the local store with the fetched data.
 *
 * @returns Promise<Result<Tag[], Error>> - A Result containing the array of tags or an error
 *
 * @example
 * ```typescript
 * const result = await fetchTagsAction(fetch);
 * if (result.isOk()) {
 *   console.log('Tags fetched:', result.value);
 * } else {
 *   console.error('Failed to fetch tags:', result.error);
 * }
 * ```
 */
export const fetchTagsAction: Action<void, Tag[]> = async (fetch) => {
  return Result.try(
    async () => {
      const tags = await fetchTagsAPI(fetch);

      setTags({
        tags,
      });

      return tags;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch tags",
      }),
  );
};

/**
 * Fetches the list of tag groups from the API and updates the store.
 *
 * This action retrieves all available tag groups and automatically updates
 * the local store with the fetched data.
 *
 * @returns Promise<Result<TagGroup[], Error>> - A Result containing the array of tag groups or an error
 *
 * @example
 * ```typescript
 * const result = await fetchTagGroupsAction(fetch);
 * if (result.isOk()) {
 *   console.log('Tag groups fetched:', result.value);
 * } else {
 *   console.error('Failed to fetch tag groups:', result.error);
 * }
 * ```
 */
export const fetchTagGroupsAction: Action<void, TagGroup[]> = async (fetch) => {
  return Result.try(
    async () => {
      const groups = await fetchTagGroupsAPI(fetch);

      setTagGroups({
        groups,
      });

      return groups;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch tag groups",
      }),
  );
};

/**
 * Creates a new tag group with the provided payload.
 *
 * This action sends a request to create a new tag group and returns
 * the created tag group data upon success.
 *
 * @param fetch - The fetch function for making HTTP requests
 * @param payload - The data required to create a new tag group
 * @param payload.name - The name of the tag group
 * @param payload.kind - The kind/type identifier for the tag group
 *
 * @returns Promise<Result<TagGroup, Error>> - A Result containing the created tag group or an error
 *
 * @example
 * ```typescript
 * const payload = {
 *   name: "Customer Segments",
 *   kind: 1
 * };
 *
 * const result = await createTagGroupAction(fetch, payload);
 * if (result.isOk()) {
 *   console.log('Tag group created:', result.value);
 * } else {
 *   console.error('Failed to create tag group:', result.error);
 * }
 * ```
 */
export const createTagGroupAction: Action<
  CreateTagGroupPayload,
  TagGroup
> = async (fetch, payload) => {
  const [uri, init] = createTagGroupAPI(payload);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSingleTagGroup({ group: data });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to create new tag group",
      }),
  );
};

/**
 * Updates an existing tag group with the provided payload.
 *
 * This action sends a request to update an existing tag group and returns
 * the updated tag group data upon success.
 *
 * @param fetch - The fetch function for making HTTP requests
 * @param payload - The complete tag group data for updating
 * @param payload.id - The unique identifier of the tag group
 * @param payload.name - The name of the tag group
 * @param payload.tags - Array of tag IDs belonging to this group
 * @param payload.kind - The kind/type identifier for the tag group
 * @param payload.tag_group_template - Template ID for the tag group (nullable)
 * @param payload.is_created_for_zoho - Whether this group was created for Zoho integration
 *
 * @returns Promise<Result<TagGroup, Error>> - A Result containing the updated tag group or an error
 *
 * @example
 * ```typescript
 * const payload = {
 *   id: 123,
 *   name: "Updated Customer Segments",
 *   tags: [1, 2, 3],
 *   kind: 1,
 *   tag_group_template: null,
 *   is_created_for_zoho: false
 * };
 *
 * const result = await updateTagGroupAction(fetch, payload);
 * if (result.isOk()) {
 *   console.log('Tag group updated:', result.value);
 * } else {
 *   console.error('Failed to update tag group:', result.error);
 * }
 * ```
 */
export const updateTagGroupAction: Action<
  UpdateTagGroupPayload,
  TagGroup
> = async (fetch, payload) => {
  const [uri, init] = updateTagGroupAPI(payload);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSingleTagGroup({ group: data });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to update tag group",
      }),
  );
};

/**
 * Deletes an existing tag group.
 *
 * This action sends a request to delete a tag group identified by the provided parameters
 * and returns the deleted tag group data upon success.
 *
 * @param fetch - The fetch function for making HTTP requests
 * @param params - The parameters required to delete the tag group
 * @param params.id - The unique identifier of the tag group to delete
 *
 * @returns Promise<Result<number, Error>> - A Result containing the deleted tag group ID or an error
 *
 * @example
 * ```typescript
 * const params = { id: 123 };
 *
 * const result = await deleteTagGroupAction(fetch, params);
 * if (result.isOk()) {
 *   console.log('Tag group deleted:', result.value);
 * } else {
 *   console.error('Failed to delete tag group:', result.error);
 * }
 * ```
 */
export const deleteTagGroupAction: Action<
  DeleteTagGroupParams,
  number
> = async (fetch, params) => {
  const [uri, init] = deleteTagGroupAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);

      deleteTagGroup({ id: params.id });

      return params.id;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to delete tag group",
      }),
  );
};

/**
 * Creates a new tag with the provided payload.
 *
 * This action sends a request to create a new tag and returns
 * the created tag data upon success.
 *
 * @param fetch - The fetch function for making HTTP requests
 * @param payload - The data required to create a new tag
 * @param payload.name - The name of the tag
 * @param payload.group - The ID of the tag group this tag belongs to
 * @param payload.color - Optional color for the tag (hex color string)
 * @param payload.icon - Optional icon identifier for the tag
 *
 * @returns Promise<Result<number, Error>> - A Result containing the deleted tag ID or an error
 *
 * @example
 * ```typescript
 * const payload = {
 *   name: "VIP Customer",
 *   group: 123,
 *   color: "#FFD700",
 *   icon: "star"
 * };
 *
 * const result = await createTagAction(fetch, payload);
 * if (result.isOk()) {
 *   console.log('Tag created:', result.value);
 * } else {
 *   console.error('Failed to create tag:', result.error);
 * }
 * ```
 */
export const createTagAction: Action<CreateTagPayload, Tag> = async (
  fetch,
  payload,
) => {
  const [uri, init] = createTagAPI(payload);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSingleTag({ tag: data });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to create new tag",
      }),
  );
};

/**
 * Updates an existing tag with the provided payload.
 *
 * This action sends a request to update an existing tag and returns
 * the updated tag data upon success.
 *
 * @param fetch - The fetch function for making HTTP requests
 * @param payload - The complete tag data for updating
 * @param payload.id - The unique identifier of the tag
 * @param payload.group - The ID of the tag group this tag belongs to
 * @param payload.name - The name of the tag
 * @param payload.color - The color of the tag (hex color string)
 * @param payload.icon - The icon identifier for the tag
 * @param payload.tag_template - Template ID for the tag (nullable)
 *
 * @returns Promise<Result<Tag, Error>> - A Result containing the updated tag or an error
 *
 * @example
 * ```typescript
 * const payload = {
 *   id: 456,
 *   group: 123,
 *   name: "Premium Customer",
 *   color: "#C0C0C0",
 *   icon: "medal",
 *   tag_template: null
 * };
 *
 * const result = await updateTagAction(fetch, payload);
 * if (result.isOk()) {
 *   console.log('Tag updated:', result.value);
 * } else {
 *   console.error('Failed to update tag:', result.error);
 * }
 * ```
 */
export const updateTagAction: Action<UpdateTagPayload, Tag> = async (
  fetch,
  payload,
) => {
  const [uri, init] = updateTagAPI(payload);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSingleTag({ tag: data });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to update tag",
      }),
  );
};

/**
 * Deletes an existing tag.
 *
 * This action sends a request to delete a tag identified by the provided parameters
 * and returns the deleted tag data upon success.
 *
 * @param fetch - The fetch function for making HTTP requests
 * @param params - The parameters required to delete the tag
 * @param params.id - The unique identifier of the tag to delete
 *
 * @returns Promise<Result<Tag, Error>> - A Result containing the deleted tag or an error
 *
 * @example
 * ```typescript
 * const params = { id: 456 };
 *
 * const result = await deleteTagAction(fetch, params);
 * if (result.isOk()) {
 *   console.log('Tag deleted:', result.value);
 * } else {
 *   console.error('Failed to delete tag:', result.error);
 * }
 * ```
 */
export const deleteTagAction: Action<DeleteTagParams, number> = async (
  fetch,
  params,
) => {
  const [uri, init] = deleteTagAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);

      deleteTag({ id: params.id });

      return params.id;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to delete tag",
      }),
  );
};

/**
 * Fetches the list usage of all the tags from the API and updates the store.
 *
 * This action retrieves all usages from each tags and automatically updates
 * the local store with the fetched data.
 *
 * @returns Promise<Result<TagUsage[], Error>> - A Result containing the array of tag usages or an error
 *
 * @example
 * ```typescript
 * const result = await fetchTagUsagesAction(fetch);
 * if (result.isOk()) {
 *   console.log('Tag usages fetched:', result.value);
 * } else {
 *   console.error('Failed to fetch tag usages:', result.error);
 * }
 * ```
 */
export const fetchTagUsagesAction: Action<void, TagUsage[]> = async (fetch) => {
  const [uri, init] = fetchTagUsagesAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setTagUsages({
        tagUsages: data,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch tag usages",
      }),
  );
};
