// TODO : export in store | api pkg
import fetch from "#src/utils/fetch";

// ----- Generic -----
export const performFetchAction = async <T>({
  url,
  params = {},
  errorReturn,
}: {
  url: string;
  params?: object;
  errorReturn: T;
}): Promise<T> => {
  try {
    const { data } = await fetch(url, params);
    return data as T;
  } catch (error) {
    console.error(error);
    return errorReturn;
  }
};

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
