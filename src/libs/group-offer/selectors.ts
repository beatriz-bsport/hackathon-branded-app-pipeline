// @ts-nocheck
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import memoize from 'memoize-one';
import { RootState } from '../../reducers';
import { Offer } from '#libs/offer/types';

export const getGroupPreview = (state: RootState) =>
  state.groupOffer.preview.groups;

export const getGroupListCount = (state: RootState) => state.groupOffer.count;

export const getGroupData = (state: RootState) => state.groupOffer.byId;

export const getGroupDataById = (state: RootState, id: number) =>
  state.groupOffer.byId?.[id] ?? [];

const _getGroupListIds = (state: RootState) => state.groupOffer.allIds;

export const getGroupList = createSelector(
  [_getGroupListIds, getGroupData],
  (groupListIds, groupListById) => {
    return groupListIds.map((groupId) => groupListById[groupId]);
  },
);
// Here reimplement _getOfferData for depencies injection problem
const localeGetOfferData = (state: RootState) => state.offer.byId;

export const getOffersListByGroup = createCachedSelector(
  [getGroupDataById, localeGetOfferData],
  (group, offersData) => {
    if (!group.offers) return [];
    return group.offers.map((id) => offersData[id]);
  },
)((state: RootState, groupId: number) => groupId);

export const withGroup = memoize((selector: (state: RootState) => Offer) =>
  createSelector([selector, getGroupData], (offer, groupData) => {
    if (!offer) return offer;
    if (Array.isArray(offer)) {
      return offer.map((o) => ({
        ...o,
        group: groupData[o.group] || o.group,
      }));
    }
    return {
      ...offer,
      group: groupData[offer.group] || offer.group,
    };
  }),
);

const _getSimilarGroupIds = (state: RootState) =>
  state.groupOffer.similar.allIds;

export const getSimilarGroups = createSelector(
  [_getSimilarGroupIds, getGroupData],
  (groups, groupsData) => {
    return groups.map((id) => groupsData[id]);
  },
);

export const getGroupByIdCurried = (state: RootState) => (id: number) => {
  return state.groupOffer.byId?.[id];
};

export const retrieveGroupOffer = (state: RootState) => {
  return state.groupOffer.byId?.[state.groupOffer.retrieve.id];
};

export const getGroupOffersStatusById = (state: RootState) =>
  state.groupOffer.offersStatus.byId;

export const getGroupOffersStatus = (state: RootState, id: number) =>
  getGroupOffersStatusById(state)[id] || {};

const getOffersIdsToBeBookedByGroupId = (state: RootState) =>
  state.groupOffer.offersIdsToBeBooked.byGroupId;

export const getGroupOffersIdsToBeBooked = (state: RootState, id: number) =>
  getOffersIdsToBeBookedByGroupId(state)[id];
