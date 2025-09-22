import { buildById } from "@bsport/store-base";

import { passStore } from "#src/store";
import type { Pass } from "#src/types";

export const updatePass = (updatedPass: Pass) => {
  passStore.setState((state) => {
    if (!updatedPass) return state;

    const id = updatedPass.id;

    if (!id) return state;

    return {
      byId: { ...state.byId, [id]: updatedPass },
    };
  });
};

export const setPasses = ({
  passes,
  count,
  page,
}: {
  passes: Pass[];
  count: number;
  page: number;
}) => {
  passStore.setState((state) => {
    return {
      ids: passes.map((pass) => pass.id),
      byId: buildById<Pass>({ initial: state.byId, newItems: passes }),
      count,
      page,
    };
  });
};
