import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import { getPaymentPackById } from '../payment-packs/selectors';

import { RootState } from '../../reducers';

const _getPaymentComboIdList = (state: RootState) => state.paymentCombo.allIds;

export const getPaymentComboDataDict = (state: RootState) =>
  state.paymentCombo.byId;

export const getPaymentCombo = (state: RootState, id: number) =>
  state.paymentCombo.byId[id];

/**
 * This selector retrieves available and non-available payment combos
 */
export const getAllPaymentComboList = createSelector(
  [_getPaymentComboIdList, getPaymentComboDataDict],
  (ids, data) => ids.map((id) => data[id]).filter((pc) => !!pc),
);

export const getAvailablePaymentComboList = createSelector(
  [_getPaymentComboIdList, getPaymentComboDataDict],
  (ids, data) =>
    ids
      .map((id) => data[id])
      .filter((pc) => !!pc)
      .filter((pc) => pc.available),
);

export const getPaymentComboListAvailableOnline = createSelector(
  getAvailablePaymentComboList,
  (paymentComboList) =>
    paymentComboList.filter((paymentCombo) => !paymentCombo.manager_only),
);

export const getPaymentComboListUnavailableOnline = createSelector(
  getAvailablePaymentComboList,
  (paymentComboList) =>
    paymentComboList.filter((paymentCombo) => paymentCombo.manager_only),
);

export const getPaymentComboListAvailableForSale = createSelector(
  getAvailablePaymentComboList,
  (paymentComboList) =>
    paymentComboList.filter(
      (paymentCombo) =>
        !paymentCombo.manager_only && paymentCombo.is_usable_by_staff,
    ),
);

export const getPaymentComboListUnavailableForSale = createSelector(
  getAvailablePaymentComboList,
  (paymentComboList) =>
    paymentComboList.filter(
      (paymentCombo) =>
        paymentCombo.manager_only || !paymentCombo.is_usable_by_staff,
    ),
);

const _getPaymentComboPurchaseList = (state: RootState) =>
  state.paymentCombo.purchase.items;

const getPaymentComboPurchaseList = createSelector(
  [_getPaymentComboPurchaseList, getPaymentComboDataDict],
  (purchases, combos) => {
    return purchases.map((p) => ({
      ...p,
      payment_combo: combos[p.payment_combo],
    }));
  },
);

export const getPaymentComboPurchaseListByCombo = (
  state: RootState,
  paymentComboId: number,
) =>
  getPaymentComboPurchaseList(state).filter(
    (purchase) =>
      purchase.payment_combo && purchase.payment_combo.id === paymentComboId,
  );

const _getPaymentComboIdsForDirectBooking = (state: RootState) =>
  state.paymentCombo.forBooking.allIds;

export const getPaymentComboForBooking = createSelector(
  [_getPaymentComboIdsForDirectBooking, getPaymentComboDataDict],
  (paymentComboIds, data) => {
    return paymentComboIds
      .map((id) => data[id])
      .filter((paymentCombo) => !!paymentCombo);
  },
);

export const withPaymentPack = memoize((selector: (state: RootState) => any) =>
  createSelector(
    [selector, getPaymentPackById],
    (comboList, paymentPackData) => {
      if (!Array.isArray(comboList)) {
        return {
          ...comboList,
          // @ts-expect-error
          payment_packs: comboList.payment_packs.map((pp) => ({
            ...pp,
            data: paymentPackData[pp.id] || {},
          })),
        };
      }
      return comboList
        .filter((pc) => !!pc)
        .map((pc) => ({
          ...pc,
          // @ts-expect-error
          payment_packs: pc.payment_packs.map((pp) => ({
            ...pp,
            data: paymentPackData[pp.id] || {},
          })),
        }));
    },
  ),
);
