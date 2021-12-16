import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import moment from 'moment/moment';
import { getSCTs } from '../category/selectors';
import { getAllCoachesDict } from '../associated-coach/selectors';
import { getAllMembers } from '../member/selectors';
import { RootState } from '../../reducers';
import { Video } from './types';
import { getConsumerPacksWithPaymentPack } from '../consumer-payment-pack/selectors';
import { SCT } from '../category/types';
import { getPrivateConsumerPassDict } from '../private-service/selectors/private-consumer-pass';

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
export const withConsumerPass = memoize((selector) =>
  createSelector(
    [selector, getConsumerPacksWithPaymentPack, getPrivateConsumerPassDict],
    (purchasedVideos, consumerPackList, privateConsumerPassDict) => {
      if (Array.isArray(purchasedVideos)) {
        return purchasedVideos.map((pv) => ({
          ...pv,
          consumer_payment_pack: consumerPackList.find(
            (cpp) => cpp.id === pv.consumer_payment_pack,
          ),
          private_consumer_pass:
            privateConsumerPassDict[pv.private_consumer_pass],
        }));
      }
      if (purchasedVideos) {
        return {
          ...purchasedVideos,
          consumer_payment_pack: consumerPackList.find(
            (cpp) => cpp.id === purchasedVideos.consumer_payment_pack,
          ),
          private_consumer_pass:
            privateConsumerPassDict[purchasedVideos.private_consumer_pass],
        };
      }
      return purchasedVideos;
    },
  ),
);

export const withVideoData = memoize((selector) =>
  createSelector([selector, getVideoData], (purchasedVideos, videoData) => {
    if (Array.isArray(purchasedVideos)) {
      return purchasedVideos.map((pv) => ({
        ...pv,
        video: videoData[pv.video],
      }));
    }
    if (purchasedVideos) {
      return {
        ...purchasedVideos,
        video: videoData[purchasedVideos.video],
      };
    }
    return purchasedVideos;
  }),
);
export const getVideoPurchases = (state: RootState) =>
  state.video.purchase.items;

export const getAssociatedPurchases = (state: RootState) =>
  state.video.purchase.associatedVideoPurchase;

const _getMember = (_, id: number) => id;

export const getVideoPurchasedByMember = createSelector(
  [getVideoPurchases, _getMember],
  (videoPurchaseList, memberId) => {
    return videoPurchaseList.filter((v) => v.member_id === memberId);
  },
);

export const getAssociatedVideoPurchasedByMember = createSelector(
  [getAssociatedPurchases, _getMember],
  (videoPurchaseList, memberId) => {
    return videoPurchaseList.filter((v) => v.member_id === memberId);
  },
);

export const getLastVideoPurchasedByVideo = memoize((videoId: number) =>
  createSelector([getVideoPurchases], (purchasedVideos) => {
    return purchasedVideos
      .filter((v) => v.video === videoId)
      .reduce(
        (acc, curr) =>
          acc && moment(acc.date_created).isAfter(moment(curr.date_created))
            ? acc
            : curr,
        null,
      );
  }),
);

export const getConsumerPurchaseVideoListWithData = createSelector(
  [getVideoPurchasedByMember, getVideoData],
  (purchases, videolist) =>
    purchases.map((purchase) => ({
      ...purchase,
      video: Object.values(videolist).find((v) => v.id === purchase.video),
    })),
);

export const getSelectedVideoPurchased = (state, vodId) =>
  state.video.purchase.byId[vodId];
export const getMemberVideoListWithConsumerPack = createSelector(
  [getConsumerPurchaseVideoListWithData, getConsumerPacksWithPaymentPack],
  (purchaseVideos, consumerPacklist) =>
    purchaseVideos.map((v) => ({
      ...v,
      consumer_payment_pack: consumerPacklist.find(
        (cpp) => cpp.id === v.consumer_payment_pack,
      ),
    })),
);

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

export const getPlaybackUrlById = (state: RootState, videoId) =>
  state.video.playbackUrl.byId[videoId];
