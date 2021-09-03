// @flow

import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import memoize from 'memoize-one';

import type { State } from '../../state/types';
import { getSCTs } from '../category/selectors';
import { getAllEstablishmentsDict as getEstablishmentData } from '../establishment/selectors';
import { getMetaActivityAbstractDict as getMetaActivityData } from '../meta-activity/selectors';
import type { PaymentPack, PaymentPackCategory } from './types';

export const getPaymentPackById = (state: State): Array<PaymentPack> =>
  state.paymentPack.byId;

export const getPaymentPack = (state: State, id: number): PaymentPack =>
  getPaymentPackById(state)[id];

export const getPaymentPackAllIds = (state: State): Array<PaymentPack> =>
  state.paymentPack.allIds;

export const getPaymentPackCategoryById = (state: State): PaymentPackCategory =>
  state.paymentPack.paymentPackCategory.byId;

export const getPaymentPackCategoryAllIds = (state: State): Array<number> =>
  state.paymentPack.paymentPackCategory.allIds;

export const getPaymentPackCategory = createSelector(
  [getPaymentPackCategoryById, (_, id: number) => id],
  (categoryDict, paymentPackId) => categoryDict[paymentPackId],
);

export const getAllPaymentPackCategory = createSelector(
  [getPaymentPackCategoryAllIds, getPaymentPackCategoryById],
  (idList, categoryData) => idList.map((id) => categoryData[id]),
);
export const getAll = createSelector(
  [getPaymentPackById, getPaymentPackAllIds],
  (paymentPacks, idList) => idList.map((id) => paymentPacks[id]),
);

export const getEnabledPaymentPacks = createSelector(
  [getPaymentPackById, getPaymentPackAllIds],
  (paymentPacks, idList) =>
    idList.map((id) => paymentPacks[id]).filter((pack) => !pack.disabled),
);

export const getDisabledPaymentPacks = createSelector(
  [getPaymentPackById, getPaymentPackAllIds],
  (paymentPacks, idList) =>
    idList.map((id) => paymentPacks[id]).filter((pack) => pack.disabled),
);

const get = (state: State, id: number) => {
  return state.paymentPack.byId[id];
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
  createSelector([selector, getSCTs], (paymentPacks, SCTs) => {
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
  }),
);

export const withMetaActivities = memoize((selector) =>
  createSelector(
    [selector, getMetaActivityData],
    (paymentPacks, metaActivityData) => {
      if (Array.isArray(paymentPacks)) {
        return paymentPacks.map((pp) => ({
          ...pp,
          metaActivities: pp.metaActivities.map((id) => metaActivityData[id]),
        }));
      }
      if (paymentPacks) {
        return {
          ...paymentPacks,
          metaActivities: paymentPacks.metaActivities.map(
            (id) => metaActivityData[id],
          ),
        };
      }
      return paymentPacks;
    },
  ),
);

export const withEstablishments = memoize((selector) =>
  createSelector(
    [selector, getEstablishmentData],
    (paymentPacks, establishmentData) => {
      if (Array.isArray(paymentPacks)) {
        return paymentPacks.map((pp) => ({
          ...pp,
          establishments: pp.establishments.map((id) => establishmentData[id]),
        }));
      }
      if (paymentPacks) {
        return {
          ...paymentPacks,
          establishments: paymentPacks.establishments.map(
            (id) => establishmentData[id],
          ),
        };
      }
      return paymentPacks;
    },
  ),
);

export const getPaymentPackNotifications = (state, id) =>
  Immutable(
    Object.values(state.paymentPack.notification.itemsById).filter(
      (notification) => notification.payment_pack === id,
    ),
  );

export const getEnabled = createSelector(getAll, (pps) =>
  pps.filter((pp) => !pp.disabled),
);

export const getAllPaymentPacks = createSelector(
  getPaymentPackById,
  (paymentPacks) => Immutable(Object.values(paymentPacks)),
);

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

const _getPaymentPackListIds = (state) => state.paymentPack.compatible.allIds;

export const getPaymentPackCompatibleList = createSelector(
  [getPaymentPackById, _getPaymentPackListIds],
  (data, ids) => ids.map((id) => data[id]),
);

export default {
  get,
  getWithSCT,
  getAll,
  getEnabled,
  getActivityCompatiblePaymentPacks,
  getPaymentPackNotifications,
};

export const getPaymentPackUnCategoryWithPaymentPacks = (
  enabledPaymentPackSelector: any,
) =>
  createSelector([enabledPaymentPackSelector], (enabledPackList) => {
    return {
      publicPacks: enabledPackList.filter(
        (pack) => !pack.category && !pack.manager_only,
      ),
      managerPacks: enabledPackList.filter(
        (pack) => !pack.category && !!pack.manager_only,
      ),
    };
  });

export const getPaymentPackCategoryWithPaymentPacks = (
  enabledPaymentPackSelector: any,
) =>
  createSelector(
    [
      getPaymentPackCategoryAllIds,
      getPaymentPackCategoryById,
      enabledPaymentPackSelector,
    ],
    (categoryIdList, categoryData, enabledPackList) => {
      return categoryIdList.map((catId) => {
        return categoryData
          ? {
              ...categoryData[catId],
              publicPacks: enabledPackList.filter(
                (pack) => pack.category === catId && !pack.manager_only,
              ),
              managerPacks: enabledPackList.filter(
                (pack) => pack.category === catId && pack.manager_only,
              ),
            }
          : {};
      });
    },
  );
