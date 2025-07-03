import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Tag, TagGroup } from "#src/types";

export interface TagState {
  groups: TagGroup[];
  tags: Tag[];
}

export const tagStore = createStore<TagState>()(() => ({
  groups: [],
  tags: [],
}));

export const useTagStore = bindStore(tagStore);
