import { type FilterElementState } from "@bsport/kaizen-primitive-core";

import { classesListStore } from "./store";

export const setClassFilters = (filters: FilterElementState[]) => {
  classesListStore.setState({ filters });
};
