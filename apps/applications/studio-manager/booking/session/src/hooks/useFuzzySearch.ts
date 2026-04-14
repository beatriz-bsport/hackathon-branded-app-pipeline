import Fuse, { type IFuseOptions } from "fuse.js";
import { useMemo } from "react";

const FUSE_THRESHOLD = 0.3;

export const useFuzzySearch = <T>(
  items: T[],
  searchQuery: string,
  keys: IFuseOptions<T>["keys"],
): T[] => {
  return useMemo(() => {
    if (!searchQuery) return items;

    const fuse = new Fuse(items, {
      keys,
      shouldSort: false,
      threshold: FUSE_THRESHOLD,
    });
    return fuse.search(searchQuery).map((result) => result.item);
  }, [items, searchQuery, keys]);
};
