// @ts-nocheck
import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import uniq from 'lodash/uniq';

import { getPaymentPackById } from '../payment-packs/selectors';

import { RootState } from '../../reducers';

const _getPaymenComboIdList = (state: RootState) => state.paymentCombo.allIds;

export const getPaymenComboDataDict = (state: RootState) =>
  state.paymentCombo.byId;

export const getPaymentCombo = (state: RootState, id: number) =>
  state.paymentCombo.byId[id];

export const getPaymentComboList = createSelector(
  [_getPaymenComboIdList, getPaymenComboDataDict],
  (ids, data) =>
    ids
      .map((id) => data[id])
      .filter((pc) => !!pc)
      .filter((pc) => pc.available),
);

export const getPaymentComboListAvailableOnline = createSelector(
  getPaymentComboList,
  (paymentComboList) =>
    paymentComboList.filter((paymentCombo) => !paymentCombo.manager_only),
);

export const getPaymentComboListUnavailableOnline = createSelector(
  getPaymentComboList,
  (paymentComboList) =>
    paymentComboList.filter((paymentCombo) => paymentCombo.manager_only),
);

export const getPaymentComboListAvailableForSale = createSelector(
  getPaymentComboList,
  (paymentComboList) =>
    paymentComboList.filter(
      (paymentCombo) =>
        !paymentCombo.manager_only && paymentCombo.is_usable_by_staff,
    ),
);

export const getPaymentComboListUnavailableForSale = createSelector(
  getPaymentComboList,
  (paymentComboList) =>
    paymentComboList.filter(
      (paymentCombo) =>
        paymentCombo.manager_only || !paymentCombo.is_usable_by_staff,
    ),
);

const _getPaymentComboPurchaseList = (state: RootState) =>
  state.paymentCombo.purchase.items;

const getPaymentComboPurchaseList = createSelector(
  [_getPaymentComboPurchaseList, getPaymenComboDataDict],
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

const _getForContractsIds = (state: RootState) =>
  state.paymentCombo.forContracts.allIds;

const _getForBookingIds = (state: RootState) =>
  state.paymentCombo.forBooking.allIds;

export const getPaymentComboForBooking = createSelector(
  [_getForBookingIds, _getForContractsIds, getPaymenComboDataDict],
  (forBookingIds, forContractsIds, data) => {
    const filteredComboIds = uniq([...forBookingIds, ...forContractsIds]);
    const paymentCombosForBooking = filteredComboIds.map((id) => data[id]);
    return paymentCombosForBooking;
  },
);

export const withPaymentPack = memoize((selector: (state: RootState) => any) =>
  createSelector(
    [selector, getPaymentPackById],
    (comboList, paymentPackData) => {
      if (!Array.isArray(comboList)) {
        return {
          ...comboList,
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
          payment_packs: pc.payment_packs.map((pp) => ({
            ...pp,
            data: paymentPackData[pp.id] || {},
          })),
        }));
    },
  ),
);
