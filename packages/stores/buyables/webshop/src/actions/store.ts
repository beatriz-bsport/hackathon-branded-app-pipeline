import { buildById } from "@bsport/store-base";

import { webshopStore } from "#src/store";
import type { WebshopCategory, WebshopItem } from "#src/types";

export const setWebshopItems = ({
  webshopItems,
  count,
  page,
  kind,
}: {
  webshopItems: WebshopItem[];
  count: number;
  page: number;
  kind: "searched" | "active";
}) => {
  webshopStore.setState((state) => {
    const sanitizedInstances = webshopItems.filter(
      (item) => item.id !== null && item.id !== undefined,
    );

    const updatedState = {
      items: {
        ...state.items,
        byId: buildById<WebshopItem>({
          initial: state.items.byId,
          newItems: sanitizedInstances,
        }),
      },
    };

    updatedState.items[kind] = {
      ids: sanitizedInstances.map((instance) => instance.id),
      count,
      page,
    };

    return updatedState;
  });
};

export const setWebshopCategories = ({
  webshopCategories,
  count,
  page,
}: {
  webshopCategories: WebshopCategory[];
  count: number;
  page: number;
}) => {
  webshopStore.setState((state) => {
    const sanitizedInstances = webshopCategories.filter(
      (item) => item.id !== null && item.id !== undefined,
    );

    return {
      categories: {
        ids: sanitizedInstances.map((model) => model.id),
        byId: buildById<WebshopCategory>({
          initial: state.categories.byId,
          newItems: sanitizedInstances,
        }),
        count,
        page,
      },
    };
  });
};
