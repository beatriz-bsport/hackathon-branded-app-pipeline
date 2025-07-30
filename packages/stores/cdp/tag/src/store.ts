import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Tag, TagGroup, TagUsage } from "#src/types";

export interface TagState {
  groups: TagGroup[];
  tags: Tag[];
  tagUsageById: Record<number, TagUsage>;
}

export const tagStore = createStore<TagState>()(() => ({
  groups: [],
  tags: [],
  tagUsageById: {},
}));

export const useTagStore = bindStore(tagStore);
