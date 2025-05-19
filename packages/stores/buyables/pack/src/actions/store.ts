import { packStore } from "#src/store";
import type { Pack } from "#src/types";

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
    const byId = packs.reduce((acc, pack) => {
      acc[pack.id] = pack;
      return acc;
    }, state.byId);

    return {
      ids: packs.map((pack) => pack.id),
      byId,
      count,
      page,
    };
  });
};
