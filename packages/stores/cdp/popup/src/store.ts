import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Popup } from "#src/types";

export interface PopupState {
  byId: { [key: number]: Popup };
  count: number;
  ids: number[];
}

export const popupStore = createStore<PopupState>()(() => ({
  byId: {},
  count: 0,
  ids: [],
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const popups = usePopupStore(selector);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const popups = usePopupStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const usePopupStore = bindStore(popupStore);
