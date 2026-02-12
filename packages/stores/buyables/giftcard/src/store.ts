import { createStore } from "zustand/vanilla";

import type { Giftcard, GiftcardImage } from "@bsport/api-buyables";
import { type PaginatedState, bindStore } from "@bsport/store-base";

export interface GiftcardState {
  giftcards: PaginatedState<Giftcard>;
  giftcardImages: PaginatedState<GiftcardImage>;
}

const defaultState = {
  byId: {},
  count: 0,
  ids: [],
  page: 1,
};

export const giftcardStore = createStore<GiftcardState>()(() => ({
  giftcards: {
    ...defaultState,
  },
  giftcardImages: {
    ...defaultState,
  },
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const giftcards = useGiftcardStore(selectGiftcards);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const giftcards = useGiftcardStore(selectGiftcards, (a, b) => a.id === b.id);
 *   ```
 */
export const useGiftcardStore = bindStore(giftcardStore);
