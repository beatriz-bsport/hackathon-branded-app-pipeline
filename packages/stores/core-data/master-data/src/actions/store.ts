import { buildById } from "@bsport/store-base";

import { sportCategoryStore } from "#src/store";
import type { SportCategory } from "#src/types";

export const setSportCategories = ({
  sportCategories,
}: {
  sportCategories: SportCategory[];
}) => {
  sportCategoryStore.setState((state) => ({
    ids: sportCategories.map((sportCategory) => sportCategory.id),
    byId: buildById<SportCategory>({
      initial: state.byId,
      newItems: sportCategories,
    }),
  }));
};
