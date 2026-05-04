import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { type FilterElementState } from "@bsport/kaizen-primitive-core";
import { bindStore } from "@bsport/store-base";

export interface ClassesListState {
  filters: FilterElementState[];
}

export const getInitialState = (): ClassesListState => ({
  filters: [],
});

export const classesListStore = createStore<ClassesListState>()(
  devtools(
    persist(getInitialState, {
      name: "classes-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ filters }) => ({ filters }),
    }),
  ),
);

export const useClassesListStore = bindStore(classesListStore);
