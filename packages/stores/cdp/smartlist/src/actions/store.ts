import { smartlistStore } from "#src/store";
import type { Smartlist } from "#src/types";

export const updateSmartlist = (updatedSmartlist: Smartlist) => {
  smartlistStore.setState((state) => {
    if (!updatedSmartlist) return state;

    const id = updatedSmartlist.id;

    if (!id) return state;

    return {
      byId: { ...state.byId, [id]: updatedSmartlist },
    };
  });
};

export const setSmartlists = ({
  smartlists,
  count,
  page,
}: {
  smartlists: Smartlist[];
  count: number;
  page: number;
}) => {
  smartlistStore.setState((state) => {
    const byId = smartlists.reduce((acc, smartlist) => {
      acc[smartlist.id] = smartlist;
      return acc;
    }, state.byId);

    return {
      ids: smartlists.map((smartlist) => smartlist.id),
      byId,
      count,
      page,
    };
  });
};
