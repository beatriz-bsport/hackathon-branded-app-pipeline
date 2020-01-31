// @flow

import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import type { State } from '../../state/types';

export const getAll = (state: State) => state.paymentPack.all;

const get = (state: State, id: number) =>
  getAll(state).find((pack) => pack.id === id);

export const getOne = (state: State, id: number) => state.paymentPack.byId[id];

const getPaymentPackNotifications = (state, id) =>
  Immutable(
    Object.values(state.paymentPack.notification.itemsById).filter(
      (notification) => notification.payment_pack === id,
    ),
  );

export const getEnabled = createSelector(
  getAll,
  (pps) => pps.filter((pp) => !pp.disabled),
);

export const getPaymentPackById = (state: State): Array<PaymentPack> =>
  state.paymentPack.byId;

export const getPaymentPackAllIds = (state: State): Array<PaymentPack> =>
  state.paymentPack.allIds;

export const getAllPaymentPacks = createSelector(
  getPaymentPackById,
  (paymentPacks) => Immutable(Object.values(paymentPacks)),
);

export const getPagePaymentPacks = createSelector(
  [getPaymentPackById, getPaymentPackAllIds],
  (paymentPacks, idList) => idList.map((id) => paymentPacks[id]),
);

const getSCTs = (state: State): Array => state.category.SCTs;

export const getMarketplacePaymentPacks = createSelector(
  [getPagePaymentPacks, getSCTs],
  (paymentPacks, SCTs) =>
    paymentPacks.map((pp) => ({
      ...pp,
      categories: SCTs.filter((sct) => pp.categories.includes(sct.id)),
    })),
);

export const getActivityCompatiblePaymentPackAllIds = (
  state: State,
): Array<number> => state.paymentPack.byActivity.allIds;

export const getActivityCompatiblePaymentPacks = createSelector(
  [getActivityCompatiblePaymentPackAllIds, getPaymentPackById],
  (idList, paymentPacks) => idList.map((id) => paymentPacks[id]),
);

const _getPaymentPackForBookingIds = (state: State) =>
  state.paymentPack.forBooking.allIds;

export const getPaymentPackForBooking = createSelector(
  [_getPaymentPackForBookingIds, getPaymentPackById],
  (ids, data) => ids.map((id) => data[id]),
);

export default {
  get,
  getAll,
  getEnabled,
  getActivityCompatiblePaymentPacks,
  getPaymentPackNotifications,
};
