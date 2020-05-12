// @flow

import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import memoize from 'memoize-one';

import type { State } from '../../state/types';

export const getPaymentPackById = (state: State): Array<PaymentPack> =>
  state.paymentPack.byId;

export const getPaymentPackAllIds = (state: State): Array<PaymentPack> =>
  state.paymentPack.allIds;

export const getAll = createSelector(
  [getPaymentPackById, getPaymentPackAllIds],
  (paymentPacks, idList) => idList.map((id) => paymentPacks[id]),
);

const get = (state: State, id: number) => {
  state.paymentPack.byId[id];
};

export const getWithSCT = (state: State, id: number) => {
  const pack = state.paymentPack.byId[id];
  if (pack) {
    return {
      ...pack,
      categories: getSCTs(state).filter((sct) =>
        (pack.categories || []).includes(sct.id),
      ),
    };
  }
  return pack;
};

export const getOne = (state: State, id: number) => state.paymentPack.byId[id];

export const withSCT = memoize((selector) =>
  createSelector(
    [selector, getSCTs],
    (paymentPacks, SCTs) => {
      if (Array.isArray(paymentPacks)) {
        return paymentPacks.map((pp) => ({
          ...pp,
          categories: SCTs.filter((sct) =>
            (pp.categories || []).includes(sct.id),
          ),
        }));
      }
      if (paymentPacks) {
        return {
          ...paymentPacks,
          categories: SCTs.filter((sct) =>
            (paymentPacks.categories || []).includes(sct.id),
          ),
        };
      }
      return paymentPacks;
    },
  ),
);

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

export const getAllPaymentPacks = createSelector(
  getPaymentPackById,
  (paymentPacks) => Immutable(Object.values(paymentPacks)),
);

const getSCTs = (state: State): Array => state.category.SCTs;

export const getMarketplacePaymentPacks = createSelector(
  [getAll, getSCTs],
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
  getWithSCT,
  getAll,
  getEnabled,
  getActivityCompatiblePaymentPacks,
  getPaymentPackNotifications,
};
