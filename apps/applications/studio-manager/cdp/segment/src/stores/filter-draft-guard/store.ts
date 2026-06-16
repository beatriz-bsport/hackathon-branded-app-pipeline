import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { FilterDraftGuardState } from "./types";

const getInitialState = (): Pick<
  FilterDraftGuardState,
  "dirtySavedFilterKeys" | "unsavedNewFilterCount"
> => ({
  dirtySavedFilterKeys: {},
  unsavedNewFilterCount: 0,
});

export const filterDraftGuardStore = createStore<FilterDraftGuardState>(
  (set) => ({
    ...getInitialState(),
    setSavedFilterDirty: (filterKey, isDirty) => {
      set((state) => {
        if (!isDirty) {
          if (!(filterKey in state.dirtySavedFilterKeys)) {
            return state;
          }

          const { [filterKey]: _removed, ...dirtySavedFilterKeys } =
            state.dirtySavedFilterKeys;

          return { dirtySavedFilterKeys };
        }

        if (state.dirtySavedFilterKeys[filterKey] === true) {
          return state;
        }

        return {
          dirtySavedFilterKeys: {
            ...state.dirtySavedFilterKeys,
            [filterKey]: true,
          },
        };
      });
    },
    setUnsavedNewFilterCount: (count) => {
      set({ unsavedNewFilterCount: count });
    },
    reset: () => {
      set(getInitialState());
    },
  }),
);

export const useFilterDraftGuardStore = bindStore(filterDraftGuardStore);
