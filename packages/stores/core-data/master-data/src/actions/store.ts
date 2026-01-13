import type { SportCategory } from "@bsport/api-core";
import { buildById } from "@bsport/store-base";

import { sportCategoryStore } from "#src/store";

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
