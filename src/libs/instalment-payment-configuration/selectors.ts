import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';
import { RootState } from '../../reducers';
import { getPaymentPackById } from '#libs/payment-packs/selectors';
import { getGiftcardData } from '#libs/giftcard/selectors';
import { getPaymenComboDataDict } from '../payment-combo/selectors';
import { _getPrivatePassData } from '#libs/private-service/selectors/private-pass';
import { _getAllShopItemData } from '../shop/selectors';

const getInstalmentPaymentAllIds = (state: RootState) =>
  state.instalmentPayment.allIds;

export const getInstalmentPaymentDict = (state: RootState) =>
  state.instalmentPayment.byId;

export const retrieveInstalmentPayment = (state: RootState, id: number) =>
  getInstalmentPaymentDict(state)[id];

export const getInstalmentPaymentList = createSelector(
  [getInstalmentPaymentAllIds, getInstalmentPaymentDict],
  (instalmentPaymentAllIds, instalmentPaymentDict) => {
    return instalmentPaymentAllIds
      .map((id) => instalmentPaymentDict[id])
      .filter((instalmentPayment) => instalmentPayment?.is_disabled === false);
  },
);

export const withPaymentPack = memoize(
  (selector: (state: RootState, id?: number) => any) =>
    createSelector(
      [selector, getPaymentPackById],
      (instalmentPaymentList, paymentPackById) => {
        if (!instalmentPaymentList) {
          return instalmentPaymentList;
        }
        if (Array.isArray(instalmentPaymentList)) {
          return instalmentPaymentList.map((instalmentPayment) => ({
            ...instalmentPayment,
            payment_pack_list: instalmentPayment.payment_pack_list
              .map((id) => paymentPackById[id])
              .filter((pp) => pp),
          }));
        }
        return {
          ...instalmentPaymentList,
          payment_pack_list: instalmentPaymentList.payment_pack_list
            .map((id) => paymentPackById[id])
            .filter((pp) => pp),
        };
      },
    ),
);

export const withGiftcard = memoize(
  (selector: (state: RootState, id?: number) => any) =>
    createSelector(
      [selector, getGiftcardData],
      (instalmentPaymentList, giftcardById) => {
        if (!instalmentPaymentList) {
          return instalmentPaymentList;
        }
        if (Array.isArray(instalmentPaymentList)) {
          return instalmentPaymentList.map((instalmentPayment) => ({
            ...instalmentPayment,
            giftcard_list: instalmentPayment.giftcard_list.map(
              (id) => giftcardById[id],
            ),
          }));
        }
        return {
          ...instalmentPaymentList,
          giftcard_list: instalmentPaymentList.giftcard_list.map(
            (id) => giftcardById[id],
          ),
        };
      },
    ),
);

export const withCombo = memoize(
  (selector: (state: RootState, id?: number) => any) =>
    createSelector(
      [selector, getPaymenComboDataDict],
      (instalmentPaymentList, paymentComboById) => {
        if (!instalmentPaymentList) {
          return instalmentPaymentList;
        }
        if (Array.isArray(instalmentPaymentList)) {
          return instalmentPaymentList.map((instalmentPayment) => ({
            ...instalmentPayment,
            payment_combo_list: instalmentPayment.payment_combo_list.map(
              (id) => paymentComboById[id],
            ),
          }));
        }
        return {
          ...instalmentPaymentList,
          payment_combo_list: instalmentPaymentList.payment_combo_list.map(
            (id) => paymentComboById[id],
          ),
        };
      },
    ),
);

export const withPrivatePass = memoize(
  (selector: (state: RootState, id?: number) => any) =>
    createSelector(
      [selector, _getPrivatePassData],
      (instalmentPaymentList, privatePassData) => {
        if (!instalmentPaymentList) {
          return instalmentPaymentList;
        }
        if (Array.isArray(instalmentPaymentList)) {
          return instalmentPaymentList.map((instalmentPayment) => ({
            ...instalmentPayment,
            private_pass_list: instalmentPayment.private_pass_list.map(
              (id) => privatePassData[id],
            ),
          }));
        }
        return {
          ...instalmentPaymentList,
          private_pass_list: instalmentPaymentList.private_pass_list.map(
            (id) => privatePassData[id],
          ),
        };
      },
    ),
);

export const withShopItems = memoize(
  (selector: (state: RootState, id?: number) => any) =>
    createSelector(
      [selector, _getAllShopItemData],
      (instalmentPaymentList, privatePassData) => {
        if (!instalmentPaymentList) {
          return instalmentPaymentList;
        }
        if (Array.isArray(instalmentPaymentList)) {
          return instalmentPaymentList.map((instalmentPayment) => ({
            ...instalmentPayment,
            shop_item_list: instalmentPayment.shop_item_list.map(
              (id) => privatePassData[id],
            ),
          }));
        }
        return {
          ...instalmentPaymentList,
          shop_item_list: instalmentPaymentList.shop_item_list.map(
            (id) => privatePassData[id],
          ),
        };
      },
    ),
);
export const composeWithAllItems = memoize(
  (selector: (state: RootState, id?: number) => any) =>
    [
      withShopItems,
      withPrivatePass,
      withCombo,
      withGiftcard,
      withPaymentPack,
    ].reduce((acc, func) => func(acc), selector),
);

export const getInstalmentPaymentForBasketAllIds = (state: RootState) =>
  state.instalmentPayment.byBasket.allIds;

export const getInstalmentForBasketList = createSelector(
  [
    getInstalmentPaymentDict,
    getInstalmentPaymentForBasketAllIds,
    (state) => state.instalmentPayment,
  ],
  (data, ids, instalmentState) =>
    ids
      .map((id) => data[id])
      .filter((ipc) => !!ipc)
      .map((ipc) => ({
        ...ipc,
        basketId: instalmentState.byBasket.basketId,
      })),
);
