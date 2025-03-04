// TODO : export in store | api pkg
import { performFetchAction } from "./store-api-pkg";

// ----- Types -----

export type Tag<TG = number> = {
  id: number;
  name: string;
  group?: TG;
  color: string;
  icon: string;
  tag_template?: number;
};

export type TagGroup<T = number> = {
  id: number;
  name: string;
  tags: T[];
  kind: number;
};

// ----- API -----

const API_URI = "customer-data-platform/v0";

/**
 * Return the complete list of company tags
 */
export const fetchTagList = async (): Promise<Tag[]> => {
  return await performFetchAction<Tag[]>({
    url: `${API_URI}/tagging/tag/`,
    errorReturn: [],
  });
};

/**
 * Return the complete list of company tag groups
 */
export const fetchTagGroupList = async (): Promise<TagGroup[]> => {
  return await performFetchAction<TagGroup[]>({
    url: `${API_URI}/tagging/tag-group/`,
    errorReturn: [],
  });
};
