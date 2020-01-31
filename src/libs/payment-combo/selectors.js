// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';
import type { PaymentCombo } from './types';

const _getPaymenComboIdList: (State) => Array<number> = (state) =>
  state.paymentCombo.allIds;
export const getPaymenComboDataDict: (State) => {
  [id: number]: PaymentCombo,
} = (state) => state.paymentCombo.byId;

export const getPaymentCombo: (State, number) => ?PaymentCombo = (state, id) =>
  state.paymentCombo.byId[id];

export const getPaymentComboList: (State) => Array<PaymentCombo> = createSelector(
  [_getPaymenComboIdList, getPaymenComboDataDict],
  (ids, data) => ids.map((id) => data[id]).filter((pc) => pc.available),
);

export const getPaymentComboListAvailableOnline: (State) => Array<PaymentCombo> = createSelector(
  getPaymentComboList,
  (pcList) => pcList.filter((pc) => !pc.manager_only),
);

export const getPaymentComboListUnavailableOnline: (State) => Array<PaymentCombo> = createSelector(
  getPaymentComboList,
  (pcList) => pcList.filter((pc) => pc.manager_only),
);

const _getPaymentComboPurchaseList = (state: State) =>
  state.paymentCombo.purchase.items;

const getPaymentComboPurchaseList = createSelector(
  [_getPaymentComboPurchaseList, getPaymenComboDataDict],
  (purchases, combos) =>
    purchases.map((p) => ({
      ...p,
      payment_combo: combos[p.payment_combo],
    })),
);

export const getPaymentComboPurchaseListByCombo: (
  State,
  number,
) => Array<PaymentCombo> = (state, paymentComboId) =>
  getPaymentComboPurchaseList(state).filter(
    (purchase) =>
      purchase.payment_combo && purchase.payment_combo.id === paymentComboId,
  );

const _getForBookingIds = (state: State) =>
  state.paymentCombo.forBooking.allIds;

export const getPaymentComboForBooking = createSelector(
  [_getForBookingIds, getPaymenComboDataDict],
  (ids, data) => ids.map((id) => data[id]),
);
