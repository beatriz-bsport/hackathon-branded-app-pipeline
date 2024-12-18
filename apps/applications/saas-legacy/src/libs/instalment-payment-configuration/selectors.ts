import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';
import { getPaymentPackById } from '#src/libs/payment-packs/selectors';
import { getGiftcardData } from '#src/libs/giftcard/selectors';
import { _getPrivatePassData } from '#src/libs/private-service/selectors/private-pass';
import { getPaymentComboDataDict } from '../payment-combo/selectors';
import { RootState } from '../../reducers';
import {
  getShopItemStandaloneById,
  getShopItemBaseById,
} from '../shop/selectors';

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
              // @ts-expect-error
              .map((id) => paymentPackById[id])
              // @ts-expect-error
              .filter((pp) => pp),
          }));
        }
        return {
          ...instalmentPaymentList,
          payment_pack_list: instalmentPaymentList.payment_pack_list
            // @ts-expect-error
            .map((id) => paymentPackById[id])
            // @ts-expect-error
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
              // @ts-expect-error
              (id) => giftcardById[id],
            ),
          }));
        }
        return {
          ...instalmentPaymentList,
          giftcard_list: instalmentPaymentList.giftcard_list.map(
            // @ts-expect-error
            (id) => giftcardById[id],
          ),
        };
      },
    ),
);

export const withCombo = memoize(
  (selector: (state: RootState, id?: number) => any) =>
    createSelector(
      [selector, getPaymentComboDataDict],
      (instalmentPaymentList, paymentComboById) => {
        if (!instalmentPaymentList) {
          return instalmentPaymentList;
        }
        if (Array.isArray(instalmentPaymentList)) {
          return instalmentPaymentList.map((instalmentPayment) => ({
            ...instalmentPayment,
            payment_combo_list: instalmentPayment.payment_combo_list.map(
              // @ts-expect-error
              (id) => paymentComboById[id],
            ),
          }));
        }
        return {
          ...instalmentPaymentList,
          payment_combo_list: instalmentPaymentList.payment_combo_list.map(
            // @ts-expect-error
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
              // @ts-expect-error
              (id) => privatePassData[id],
            ),
          }));
        }
        return {
          ...instalmentPaymentList,
          private_pass_list: instalmentPaymentList.private_pass_list.map(
            // @ts-expect-error
            (id) => privatePassData[id],
          ),
        };
      },
    ),
);

export const withShopItems = memoize(
  (selector: (state: RootState, id?: number) => any) =>
    createSelector(
      [selector, getShopItemStandaloneById, getShopItemBaseById],
      (instalmentPaymentList, shopItemStandaloneData, shopItemBaseData) => {
        if (!instalmentPaymentList) {
          return instalmentPaymentList;
        }
        if (Array.isArray(instalmentPaymentList)) {
          return instalmentPaymentList.map((instalmentPayment) => ({
            ...instalmentPayment,
            shop_item_list: instalmentPayment.shop_item_list.map(
              // @ts-expect-error
              (id) => shopItemStandaloneData[id] ?? shopItemBaseData[id],
            ),
          }));
        }
        return {
          ...instalmentPaymentList,
          shop_item_list: instalmentPaymentList.shop_item_list.map(
            // @ts-expect-error
            (id) => shopItemStandaloneData[id] ?? shopItemBaseData[id],
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
