import { MetaActivity } from "@bsport/api-book";
import { buildById } from "@bsport/store-base";

import { groupActivityStore } from "#src/store";

export const updateGroupActivity = (updatedGroupActivity: MetaActivity) => {
  groupActivityStore.setState((state) => {
    const id = updatedGroupActivity.id;

    if (!id) return state;

    return {
      groupActivity: {
        ...state.groupActivity,
        byId: { ...state.groupActivity.byId, [id]: updatedGroupActivity },
      },
    };
  });
};

export const setInterrogate = ({
  canDestroy,
  offers,
}: {
  canDestroy: boolean;
  offers: number[];
}) => {
  groupActivityStore.setState((state) => {
    return {
      groupActivity: {
        ...state.groupActivity,
        interrogate: {
          canDestroy,
          offers,
        },
      },
    };
  });
};

export const setGroupActivities = ({
  groupActivities,
  count,
  page,
  search,
}: {
  groupActivities: MetaActivity[];
  count: number;
  page: number;
  search?: boolean;
}) => {
  groupActivityStore.setState((state) => {
    const byId = buildById<MetaActivity>({
      initial: state.groupActivity.byId,
      newItems: groupActivities,
    });

    const newIds = groupActivities.map((groupActivity) => groupActivity.id);

    return {
      groupActivity: {
        ...state.groupActivity,
        ids: search ? state.groupActivity.ids : newIds,
        searchedIds: search ? newIds : [],
        byId,
        count,
        page,
      },
    };
  });
};
