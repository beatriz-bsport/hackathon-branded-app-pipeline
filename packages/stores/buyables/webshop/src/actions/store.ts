import { buildById } from "@bsport/store-base";

import { webshopStore } from "#src/store";
import type { WebshopItem } from "#src/types";

export const updateWebshopItem = (updatedWebshopItem: WebshopItem) => {
  webshopStore.setState((state) => {
    if (!updatedWebshopItem) return state;

    const id = updatedWebshopItem.id;

    if (!id) return state;

    return {
      items: {
        ...state.items,
        byId: { ...state.items.byId, [id]: updatedWebshopItem },
      },
    };
  });
};

export const setWebshopItems = ({
  webshopItems,
  count,
  page,
}: {
  webshopItems: WebshopItem[];
  count: number;
  page: number;
}) => {
  webshopStore.setState((state) => {
    return {
      items: {
        ids: webshopItems.map((model) => model.id),
        byId: buildById({ initial: state.items.byId, newItems: webshopItems }),
        count,
        page,
      },
    };
  });
};
