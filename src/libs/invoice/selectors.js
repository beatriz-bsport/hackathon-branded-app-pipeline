// @flow
import memoize from 'memoize-one';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_GIFTCARD,
} from '@bsport/common/lib/master-data/buyable-items';
import { PLANNED_PAYMENT_EVENT_STATUS_REGISTERED } from '@bsport/common/lib/master-data/planned-payment-event';
import { createSelector } from 'reselect';

import { getPrivatePassAvailable } from '../private-service/selectors/private-pass';
import { getShopItemsAvailable } from '../shop/selectors';
import { getEnabled as getPaymentPackEnabled } from '../payment-packs/selectors';
import { getPaymentComboList } from '../payment-combo/selectors';
import { getMemberListData, getMemberDetailData } from '../member/selectors';
import { getUsers as getStaff } from '../role/selectors';
import { getAllEstablishments } from '../establishment/selectors';
import { getGiftcardListEnabled } from '../giftcard/selectors';

export const getBuyableItem = createSelector(
  [
    getPaymentPackEnabled,
    getShopItemsAvailable,
    getPrivatePassAvailable,
    getPaymentComboList,
    getGiftcardListEnabled,
  ],
  (
    paymentPackList,
    shopItemList,
    privatePassList,
    paymentComboList,
    giftcardList,
  ) => ({
    [BUYABLE_ITEM_PASS]: paymentPackList,
    [BUYABLE_ITEM_SHOP_ITEM]: shopItemList,
    [BUYABLE_ITEM_PRIVATE_PASS]: privatePassList,
    [BUYABLE_ITEM_COMBO_ITEM]: paymentComboList,
    [BUYABLE_ITEM_GIFTCARD]: giftcardList,
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

export const getInvoiceListUnpaid = createSelector(
  getInvoiceList,
  (invoiceList) =>
    invoiceList.filter((inv) => !inv.fully_payed && !inv.reverted),
);

const _getInvoiceItemData = (state: State) => {
  return state.invoice.invoiceItem.byId;
};

const _getPaymentData = (state: State) => {
  return state.invoice.payment.byId;
};

const _getPlannedPaymentEventData = (state: State) => {
  return state.invoice.planned_payment_event.byId;
};

const _getPlannedPaymentEventListIds = (state: State) => {
  return state.invoice.planned_payment_event.allIds;
};

export const getPlannedPaymentEventList = createSelector(
  [
    _getPlannedPaymentEventListIds,
    _getPlannedPaymentEventData,
    (state, uuid) => uuid,
  ],
  (ids, data, uuid) =>
    ids
      .map((id) => data[id])
      .filter((ppe) => !!ppe && ppe.invoice === uuid)
      .filter(
        (ppe) =>
          !(
            ppe.status === PLANNED_PAYMENT_EVENT_STATUS_REGISTERED &&
            !ppe.processing
          ),
      ),
);

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
  createSelector([selector, _getPaymentData], (invoice, paymentData) => {
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
  }),
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
  createSelector([selector, getStaff], (invoice, staffData) => {
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
  }),
);

export const withEstablishment = memoize((selector) =>
  createSelector(
    [selector, getAllEstablishments],
    (invoice, establishmentData) => {
      if (!invoice) return invoice;
      if (Array.isArray(invoice)) {
        return invoice
          .filter((inv) => !!inv)
          .map((inv) => ({
            ...inv,
            establishment: invoice.establishment
              ? establishmentData?.find(
                  (est) => est.id === invoice.establishment,
                )
              : null,
          }));
      }
      return {
        ...invoice,
        establishment:
          invoice?.establishment &&
          establishmentData?.find((est) => est.id === invoice.establishment),
      };
    },
  ),
);
export const getQuickInvoiceList = (state) => state.invoice.quickInvoices;

const _getPaymentListIds = (state) => state.invoice.payment.allIds;

const _getUuid = (state, uuid) => uuid;

export const getPaymentListInInvoice = createSelector(
  [_getPaymentData, _getPaymentListIds, _getUuid],
  (data, ids, invoiceUuid) =>
    ids.map((id) => data[id]).filter((p) => p.invoice === invoiceUuid),
);

export const getAllQuickCreatedInvoices = createSelector(
  [_getInvoiceListIds, _getInvoiceData],
  (ids, data) =>
    ids
      .map((id) => data[id])
      .filter(
        (inv) =>
          inv.is_quick_invoice &&
          !inv.reverted &&
          (!inv.fully_payed || inv.price_due === '0.00'),
      ),
);
