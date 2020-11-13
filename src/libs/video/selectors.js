import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import { getSCTs } from '../category/selectors';
import { getAllCoachesDict } from '../associated-coach/selectors';
import { getAllMembers } from '../member/selectors';

const getVideoListIds = (state) => state.video.list.allIds;
const getVideoSearchListIds = (state) => state.video.search.allIds;

export const getVideoData = (state) => state.video.byId;

export const getVideo = (state, id) => getVideoData(state)[id];

export const withCategory = memoize((selector) =>
  createSelector(
    [selector, getSCTs],
    (videoList, SCTList) => {
      if (Array.isArray(videoList)) {
        return videoList.map((v) => ({
          ...v,
          SCT: SCTList.find((sct) => sct.id === v.SCT),
        }));
      }
      if (!videoList) return videoList;
      return {
        ...videoList,
        SCT: SCTList.find((sct) => sct.id === videoList.SCT),
      };
    },
  ),
);

export const getVideoList = createSelector(
  [getVideoListIds, getVideoData],
  (ids, data) => ids.map((id) => data[id]),
);

export const getVideoSearchList = createSelector(
  [getVideoSearchListIds, getVideoData],
  (ids, data) => ids.map((id) => data[id]),
);

export const withCoach = memoize((selector) =>
  createSelector(
    [selector, getAllCoachesDict],
    (videoList, coachData) => {
      if (Array.isArray(videoList)) {
        return videoList.map((v) => ({
          ...v,
          coaches: v.coaches
            .map((c) =>
              Object.values(coachData).find((coach) =>
                coach.associatedcoach_set.includes(c),
              ),
            )
            .filter((c) => !!c),
        }));
      }
      if (!videoList) return videoList;

      return {
        ...videoList,
        coaches: videoList.coaches.map((c) =>
          Object.values(coachData).find((coach) =>
            coach.associatedcoach_set.includes(c),
          ),
        ),
      };
    },
  ),
);

const getVideoPurchases = (state) => state.video.purchase.items;

export const getVideoPurchasesWithMember = createSelector(
  [getVideoPurchases, getAllMembers],
  (purchases, members) =>
    purchases.map((purchase) => ({
      ...purchase,
      member: members.find((m) => m.id === purchase.member_id),
    })),
);

const getVideoViews = (state) => state.video.views.items;

export const getVideoViewsWithMember = createSelector(
  [getVideoViews, getAllMembers],
  (views, members) =>
    views.map((view) => ({
      ...view,
      member: members.find((m) => m.id === view.member_id),
    })),
);
