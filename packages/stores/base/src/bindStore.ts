import { type StoreApi, type ExtractState } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";

/**
 * Binds a store and creates a hook usable in React.
 *
 * @see https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#bounded-usestore-hook-for-vanilla-stores
 */
export const bindStore = ((store) => (selector, cmp) =>
  useStoreWithEqualityFn(store, selector, cmp)) as <S extends StoreApi<S>>(
  store: S,
) => {
  (): ExtractState<S>;
  <T>(selector: (state: ExtractState<S>) => T, cmp: (a: T, b: T) => boolean): T;
};
