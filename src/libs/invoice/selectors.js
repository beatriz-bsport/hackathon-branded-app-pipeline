// @flow
import memoize from 'memoize-one';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import { createSelector } from 'reselect';

import { getPrivatePassAvailable } from '../private-service/selectors/private-pass';
import { getShopItemsAvailable } from '../shop/selectors';
import { getEnabled as getPaymentPackEnabled } from '../payment-packs/selectors';
import { getPaymentComboList } from '../payment-combo/selectors';
import { getMemberListData, getMemberDetailData } from '../member/selectors';
import { getUsers as getStaff } from '../role/selectors';

export const getBuyableItem = createSelector(
  [
    getPaymentPackEnabled,
    getShopItemsAvailable,
    getPrivatePassAvailable,
    getPaymentComboList,
  ],
  (paymentPackList, shopItemList, privatePassList, paymentComboList) => ({
    [BUYABLE_ITEM_PASS]: paymentPackList,
    [BUYABLE_ITEM_SHOP_ITEM]: shopItemList,
    [BUYABLE_ITEM_PRIVATE_PASS]: privatePassList,
    [BUYABLE_ITEM_COMBO_ITEM]: paymentComboList,
  }),
);

const _getInvoiceData = (state: State) => state.invoice.byId;

export const getInvoice = (state: State, uuid: string) => {
  return state.invoice.byId[uuid];
};

const _getInvoiceListIds = (state: State) => {
  return state.invoice.list.allIds;
};

export const getInvoiceList = createSelector(
  [_getInvoiceData, _getInvoiceListIds],
  (data, ids) => ids.map((id) => data[id]),
);

const _getInvoiceItemData = (state: State) => {
  return state.invoice.invoiceItem.byId;
};

const _getPaymentData = (state: State) => {
  return state.invoice.payment.byId;
};

export const withInvoiceItem = memoize((selector) =>
  createSelector(
    [selector, _getInvoiceItemData],
    (invoice, invoiceItemData) => {
      if (!invoice) return invoice;
      if (Array.isArray(invoice)) {
        return invoice.map((inv) => ({
          ...inv,
          invoice_items: inv.invoice_items.map((ii) => {
            return invoiceItemData[ii];
          }),
        }));
      }
      return {
        ...invoice,
        invoice_items: invoice.invoice_items.map((ii) => {
          return invoiceItemData[ii];
        }),
      };
    },
  ),
);

export const withPayment = memoize((selector) =>
  createSelector(
    [selector, _getPaymentData],
    (invoice, paymentData) => {
      if (!invoice) return invoice;
      if (Array.isArray(invoice)) {
        return invoice.map((inv) => ({
          ...inv,
          payments: inv.payments.map((p) => paymentData[p]),
        }));
      }
      return {
        ...invoice,
        payments: invoice.payments.map((p) => paymentData[p]),
      };
    },
  ),
);

export const withMember = memoize((selector) =>
  createSelector(
    [selector, getMemberListData, getMemberDetailData],
    (invoice, memberData, memberDetailData) => {
      if (!invoice) return invoice;
      if (Array.isArray(invoice)) {
        return invoice
          .filter((inv) => !!inv)
          .map((inv) => ({
            ...inv,
            member: memberData[inv.member] || memberDetailData[inv.member],
          }));
      }
      return {
        ...invoice,
        member: memberData[invoice.member] || memberDetailData[invoice.member],
      };
    },
  ),
);

export const withAuthor = memoize((selector) =>
  createSelector(
    [selector, getStaff],
    (invoice, staffData) => {
      if (!invoice) return invoice;
      if (Array.isArray(invoice)) {
        return invoice
          .filter((inv) => !!inv)
          .map((inv) => ({
            ...inv,
            author: staffData.find((r) => r.id === inv.author),
          }));
      }
      return {
        ...invoice,
        author: staffData.find((r) => r.id === invoice.author),
      };
    },
  ),
);

export const getQuickInvoiceList = (state) => state.invoice.quickInvoices;
