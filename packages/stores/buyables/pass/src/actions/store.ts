import { buildById } from "@bsport/store-base";

import { passStore } from "#src/store";
import type { Pass, PassCategory } from "#src/types";

export const setPasses = ({
  passes,
  count,
  page,
  kind = "active",
}: {
  passes: Pass[];
  count: number;
  page: number;
  kind?: "active" | "archived" | "searched";
}) => {
  passStore.setState((state) => {
    if (!passes) return state;

    const sanitizedPasses = passes.filter(
      (item) => item.id !== null && item.id !== undefined,
    );

    const updatedState = {
      items: {
        ...state.items,
        byId: buildById<Pass>({
          initial: state.items.byId,
          newItems: sanitizedPasses,
        }),
      },
    };

    updatedState.items[kind] = {
      ids: sanitizedPasses.map((pass) => pass.id),
      count,
      page,
    };

    return updatedState;
  });
};

export const setPassCategories = ({
  passCategories,
  count,
  page,
}: {
  passCategories: PassCategory[];
  count: number;
  page: number;
}) => {
  passStore.setState((state) => {
    if (!passCategories) return state;

    const sanitizedPassCategories = passCategories.filter(
      (item) => item.id !== null && item.id !== undefined,
    );

    return {
      categories: {
        byId: buildById<PassCategory>({
          initial: state.categories.byId,
          newItems: sanitizedPassCategories,
        }),
        ids: sanitizedPassCategories.map((category) => category.id),
        count,
        page,
      },
    };
  });
};
