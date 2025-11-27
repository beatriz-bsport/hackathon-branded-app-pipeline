import { buildById } from "@bsport/store-base";

import { packStore } from "#src/store";
import type { Pack, PurchasedPack } from "#src/types";

export const updatePack = (updatedPack: Pack) => {
  packStore.setState((state) => {
    if (!updatedPack) return state;

    const id = updatedPack.id;

    if (!id) return state;

    return {
      byId: { ...state.byId, [id]: updatedPack },
    };
  });
};

export const setPacks = ({
  packs,
  count,
  page,
}: {
  packs: Pack[];
  count: number;
  page: number;
}) => {
  packStore.setState((state) => {
    return {
      ids: packs.map((pack) => pack.id),
      byId: buildById<Pack>({ initial: state.byId, newItems: packs }),
      count,
      page,
    };
  });
};

export const setFuzzyPacks = ({ packs }: { packs: Array<Pack> }) => {
  packStore.setState((state) => {
    return {
      fuzzyIds: packs.map((item) => item.id),
      byId: buildById<Pack>({ initial: state.byId, newItems: packs }),
    };
  });
};

export const setPurchasedPacks = ({
  purchasedPacks,
  count,
  page,
}: {
  purchasedPacks: PurchasedPack[];
  count: number;
  page: number;
}) => {
  packStore.setState((state) => {
    return {
      purchasedPacks: {
        ...state.purchasedPacks,
        ids: purchasedPacks.map((item) => item.id),
        byId: buildById<PurchasedPack>({
          initial: state.purchasedPacks.byId,
          newItems: purchasedPacks,
        }),
        count,
        page,
      },
    };
  });
};
