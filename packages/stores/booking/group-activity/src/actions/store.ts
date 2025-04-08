import { groupActivityStore } from "#src/store";
import type { MetaActivity } from "#src/types";

export const updateGroupActivity = (updatedGroupActivity: MetaActivity) => {
  groupActivityStore.setState((state) => {
    const id = updatedGroupActivity.id;

    if (!id) return state;

    return {
      byId: { ...state.byId, [id]: updatedGroupActivity },
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
  groupActivityStore.setState(() => {
    return {
      interrogate: {
        canDestroy,
        offers,
      },
    };
  });
};

export const setGroupActivities = ({
  groupActivities,
  count,
  page,
}: {
  groupActivities: MetaActivity[];
  count: number;
  page: number;
}) => {
  groupActivityStore.setState((state) => {
    const byId = groupActivities.reduce((acc, groupActivity) => {
      acc[groupActivity.id] = groupActivity;
      return acc;
    }, state.byId);

    return {
      ids: groupActivities.map((groupActivity) => groupActivity.id),
      byId,
      count,
      page,
    };
  });
};
