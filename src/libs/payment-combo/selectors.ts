import { createSelector } from 'reselect';
import memoize from 'memoize-one';

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
  (pcList) => pcList.filter((pc) => !pc.manager_only),
);

export const getPaymentComboListUnavailableOnline = createSelector(
  getPaymentComboList,
  (pcList) => pcList.filter((pc) => pc.manager_only),
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

const _getForBookingIds = (state: RootState) =>
  state.paymentCombo.forBooking.allIds;

export const getPaymentComboForBooking = createSelector(
  [_getForBookingIds, getPaymenComboDataDict],
  (ids, data) => ids.map((id) => data[id]),
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
