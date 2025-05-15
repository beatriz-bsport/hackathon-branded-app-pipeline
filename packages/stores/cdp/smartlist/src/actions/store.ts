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
  pageSize,
  mode = "default",
}: {
  smartlists: Smartlist[];
  count: number;
  page?: number;
  pageSize?: number;
  mode?: "default" | "search";
}) => {
  smartlistStore.setState((state) => {
    const initialValue: { byId: { [key: number]: Smartlist }; ids: number[] } =
      {
        byId: { ...state.byId },
        ids: [],
      };

    const { byId, ids } = smartlists.reduce((result, item) => {
      result.byId[item.id] = item;
      result.ids.push(item.id);

      return result;
    }, initialValue);

    return {
      ...state,
      ...(mode === "search" ? { fuzzySearchIds: ids } : { ids }),
      byId,
      count,
      page,
      pageSize,
    };
  });
};

export const setPaginationData = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  smartlistStore.setState((state) => ({
    ...state,
    page,
    pageSize,
  }));
};

export const resetFuzzySearch = () => {
  smartlistStore.setState((state) => ({
    ...state,
    fuzzySearchIds: [],
  }));
};
