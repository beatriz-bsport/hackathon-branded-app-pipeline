import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import { getSCTs } from '../category/selectors';
import { getAllCoachesDict } from '../associated-coach/selectors';
import { getAllMembers } from '../member/selectors';
import { RootState } from '../../reducers';
import { Video } from './types';
import { SCT } from '../category/types';

const getVideoListIds = (state: RootState) => state.video.list.allIds;
const getVideoSearchListIds = (state: RootState) => state.video.search.allIds;

export const getVideoData = (state: RootState) => state.video.byId;

export const getVideo = (state: RootState, id: number) =>
  getVideoData(state)[id];

export const withCategory = memoize((selector: any) =>
  createSelector([selector, getSCTs], (videoList: Video | Video[], SCTList) => {
    if (Array.isArray(videoList)) {
      return videoList.map((v) => ({
        ...v,
        SCT: SCTList.find((sct) => sct.id === v.SCT),
      })) as Video<SCT>[];
    }
    if (!videoList) return videoList;
    return {
      ...videoList,
      SCT: SCTList.find((sct) => sct.id === videoList.SCT),
    } as Video<SCT>;
  }),
) as (selector: any) => Video<SCT> | Video<SCT>[];

export const getVideoList = createSelector(
  [getVideoListIds, getVideoData],
  (ids, data) => ids.map((id) => data[id]),
);

export const getVideoSearchList = createSelector(
  [getVideoSearchListIds, getVideoData],
  (ids, data) => ids.map((id) => data[id]),
);

export const withCoach = memoize((selector: any) =>
  createSelector(
    [selector, getAllCoachesDict],
    (videoList: Video | Video[], coachData) => {
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

const getVideoPurchases = (state: RootState) => state.video.purchase.items;

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

const _getVideoCoaches = (state: RootState) =>
  state.video.filterableParams.items.coaches || [];

const _getVideoCategories = (state: RootState) =>
  state.video.filterableParams.items.SCTs || [];

export const withVideoCoach = (selector: any) =>
  createSelector(
    [selector, _getVideoCoaches],
    (videoList: Video | Video[], coachList) => {
      if (Array.isArray(videoList)) {
        return videoList.map((v) => ({
          ...v,
          coaches: v.coaches
            .map((c) =>
              coachList.find((coach) => coach.associatedcoach_set.includes(c)),
            )
            .filter((c) => !!c),
        }));
      }
      if (!videoList) return videoList;

      return {
        ...videoList,
        coaches: videoList.coaches.map((c) =>
          coachList.find((coach) => coach.associatedcoach_set.includes(c)),
        ),
      };
    },
  );

export const withVideoCategory = (selector) =>
  createSelector([selector, _getVideoCategories], (videoList, SCTList) => {
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
  });
