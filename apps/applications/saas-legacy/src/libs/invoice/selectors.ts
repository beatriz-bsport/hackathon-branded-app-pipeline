import memoize from 'memoize-one';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_GIFTCARD,
} from '@bsport/common/lib/master-data/buyable-items.js';
import { createSelector } from 'reselect';
import SeamlessImmutable from 'seamless-immutable';

import { getEnabled as getPaymentPackEnabled } from '#src/libs/payment-packs/selectors';
import { getGiftcardListEnabled } from '#src/libs/giftcard/selectors';
import {
  getMemberListData,
  getMemberDetailData,
} from '#src/libs/member/selectors';
import { getAvailablePaymentComboList } from '#src/libs/payment-combo/selectors';
import { getPrivatePassAvailable } from '#src/libs/private-service/selectors/private-pass';
import { getShopItemsAvailable } from '#src/libs/shop/selectors';
import { getUsers as getStaff } from '#src/libs/role/selectors';
import {
  getAllEstablishments,
  getAllEstablishmentBillingGroupDict,
} from '#src/libs/establishment/selectors';
import { shouldPlannedPaymentEventBeDisplayed } from '#src/libs/invoice/utils';

import type { PrivatePass } from '#src/libs/private-service/types';
import type { ShopItem } from '#src/libs/shop/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { Giftcard } from '#src/libs/giftcard/types';
import type { PaymentItem } from '#src/libs/invoice/payment/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type {
  InvoiceState,
  Invoice,
  PlannedPaymentEvent,
} from '#src/libs/invoice/types';
import type { RootState } from '../../reducers';

export const getState = (state: RootState): InvoiceState => state.invoice;

export const getBuyableItem = createSelector(
  [
    getPaymentPackEnabled,
    getShopItemsAvailable,
    getPrivatePassAvailable,
    getAvailablePaymentComboList,
    getGiftcardListEnabled,
  ],
  (
    paymentPackList: SeamlessImmutable.ImmutableArray<PaymentPack>,
    shopItemList: ShopItem[],
    privatePassList: PrivatePass[],
    paymentComboList: PaymentCombo[],
    giftcardList: Giftcard[],
  ) => ({
    [BUYABLE_ITEM_PASS]: paymentPackList?.filter(
      (paymentPack) => paymentPack.is_usable_by_staff,
    ),
    [BUYABLE_ITEM_SHOP_ITEM]: shopItemList,
    [BUYABLE_ITEM_PRIVATE_PASS]: privatePassList?.filter(
      (privatePass) =>
        !privatePass.is_unpaid_private_booking_integration &&
        privatePass.is_usable_by_staff,
    ),
    [BUYABLE_ITEM_COMBO_ITEM]: paymentComboList?.filter(
      (paymentCombo) => paymentCombo.is_usable_by_staff,
    ),
    [BUYABLE_ITEM_GIFTCARD]: giftcardList,
  }),
);

export const getInvoiceData = (state: RootState) => getState(state).byId;

export const getInvoice = (state: RootState, uuid: string) => {
  return getState(state).byId[uuid];
};

const _getInvoiceListIds = (state: RootState) => {
  return getState(state).list.allIds;
};

export const getInvoiceList = createSelector(
  [getInvoiceData, _getInvoiceListIds],
  (data, ids) => ids.map((id: string) => data[id]),
);

export const getInvoiceListUnpaid = createSelector(
  getInvoiceList,
  (invoiceList) =>
    invoiceList.filter((inv: Invoice) => !inv.fully_payed && !inv.reverted),
);

const _getInvoiceItemData = (state: RootState) => {
  return getState(state).invoiceItem.byId;
};

const _getPaymentData = (state: RootState) => {
  return getState(state).payment.byId;
};

const _getPlannedPaymentEventData = (state: RootState) => {
  return getState(state).planned_payment_event.byId;
};

const _getPlannedPaymentEventListIds = (state: RootState) => {
  return getState(state).planned_payment_event.allIds;
};

export const getPlannedPaymentEventList = createSelector(
  [
    _getPlannedPaymentEventListIds,
    _getPlannedPaymentEventData,
    (_: RootState, uuid: string) => uuid,
  ],
  (ids, data, uuid) =>
    ids
      .map((id: number) => data[id])
      .filter((ppe: PlannedPaymentEvent) => !!ppe && ppe.invoice === uuid)
      .filter(shouldPlannedPaymentEventBeDisplayed),
);

export const withInvoiceItem = memoize(
  <T extends Invoice[] | Invoice | null>(selector: (state: RootState) => T) =>
    createSelector(
      [selector, _getInvoiceItemData],
      (invoice, invoiceItemData): T => {
        if (!invoice) return invoice as T;

        if (Array.isArray(invoice)) {
          return invoice.map((inv: Invoice) => ({
            ...inv,
            invoice_items: inv.invoice_items.map((ii) => invoiceItemData[ii]),
          })) as unknown as T;
        }
        return {
          ...invoice,
          invoice_items: invoice.invoice_items.map((ii) => invoiceItemData[ii]),
        } as T;
      },
    ),
);

export const getUnpaidInvoiceListWithInvoiceItemAndMembers = createSelector(
  [
    getInvoiceListUnpaid,
    _getInvoiceItemData,
    getMemberListData,
    getMemberDetailData,
  ],
  (
    unpaidInvoiceList: Invoice[] | Invoice | null,
    invoiceItemData,
    memberData,
    memberDetailData,
  ) => {
    if (!unpaidInvoiceList) return unpaidInvoiceList;
    if (Array.isArray(unpaidInvoiceList)) {
      return unpaidInvoiceList.map((inv: Invoice) => ({
        ...inv,
        invoice_items: inv.invoice_items.map((ii) => invoiceItemData[ii]),
        member: memberData[inv.member] || memberDetailData[inv.member],
      }));
    }
    return {
      ...unpaidInvoiceList,
      invoice_items: unpaidInvoiceList.invoice_items.map(
        (ii) => invoiceItemData[ii],
      ),
      member:
        memberData[unpaidInvoiceList.member] ||
        memberDetailData[unpaidInvoiceList.member],
    };
  },
);

export const withPayment = memoize(
  (selector: (state: RootState) => Invoice[] | Invoice | null) =>
    createSelector([selector, _getPaymentData], (invoice, paymentData) => {
      if (!invoice) return invoice;
      if (Array.isArray(invoice)) {
        return invoice.map((inv: Invoice) => ({
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

export const withMember = memoize(
  (selector: (state: RootState) => Invoice[] | Invoice | null) =>
    createSelector(
      [selector, getMemberListData, getMemberDetailData],
      (invoice, memberData, memberDetailData) => {
        if (!invoice) return invoice;
        if (Array.isArray(invoice)) {
          return invoice
            .filter((inv: Invoice) => !!inv)
            .map((inv: Invoice) => ({
              ...inv,
              member: memberData[inv.member] || memberDetailData[inv.member],
            }));
        }
        return {
          ...invoice,
          member:
            memberData[invoice.member] || memberDetailData[invoice.member],
        };
      },
    ),
);

export const getInvoiceMemberFullDetail = memoize(
  (selector: (state: RootState) => Invoice[] | Invoice | null) =>
    createSelector(
      [selector, getMemberDetailData],
      (invoiceObject, memberDetailData) => {
        if (!invoiceObject) return invoiceObject;
        if (Array.isArray(invoiceObject)) {
          return invoiceObject
            .filter((inv) => !!inv)
            .map((_inv) => memberDetailData[_inv.member]);
        }
        return memberDetailData[invoiceObject.member];
      },
    ),
);

export const withAuthor = memoize(
  (selector: (state: RootState) => Invoice[] | Invoice | null) =>
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

export const withEstablishment = memoize(
  (selector: (state: RootState) => Invoice[] | Invoice | null) =>
    createSelector(
      [selector, getAllEstablishments],
      (invoice, establishmentData) => {
        if (!invoice) return invoice;
        if (Array.isArray(invoice)) {
          return invoice
            .filter((inv: Invoice) => !!inv)
            .map((inv: Invoice) => ({
              ...inv,
              establishment: inv.establishment
                ? establishmentData?.find(
                    (est: Establishment) => est.id === inv.establishment,
                  )
                : null,
            }));
        }
        return {
          ...invoice,
          establishment:
            invoice?.establishment &&
            establishmentData?.find(
              (est: Establishment) => est.id === invoice.establishment,
            ),
        };
      },
    ),
);

/**
 * Creates a memoized selector that adds the establishment billing group to each invoice.
 *
 * @param {Function} selector - A function that selects invoices from the state.
 * @returns {Function} - A memoized selector that selects invoices with their associated establishment billing group.
 *
 * If `selector` returns an array of invoices, the selector maps over the array and replaces the `establishment_billing_group` property of each invoice.
 * If `selector` returns a single invoice, the selector replaces the `establishment_billing_group` property of that invoice.
 */
export const withEstablishmentBillingGroup = memoize(
  (selector: (state: RootState) => Invoice[] | Invoice | null) =>
    createSelector(
      [selector, getAllEstablishmentBillingGroupDict],
      (invoice, establishmentBillingGroupById) => {
        if (!invoice) return invoice;
        if (Array.isArray(invoice)) {
          return invoice
            .filter((inv) => !!inv)
            .map((inv) => ({
              ...inv,
              establishment_billing_group: inv.establishment_billing_group
                ? establishmentBillingGroupById?.[
                    inv?.establishment_billing_group
                  ]
                : null,
            }));
        }
        return {
          ...invoice,
          establishment_billing_group:
            invoice?.establishment_billing_group &&
            establishmentBillingGroupById?.[
              invoice?.establishment_billing_group
            ],
        };
      },
    ),
);

export const getEditEstablishmentBillingGroupIsLoading = (state: RootState) =>
  getState(state).editEstablishmentBillingGroup.loading;

const _getPaymentListIds = (state: RootState) => getState(state).payment.allIds;

const _getUuid = (_: RootState, uuid: string) => uuid;

export const getPaymentList = createSelector(
  [_getPaymentData, _getPaymentListIds],
  (data, ids) => ids.map((id: string) => data[id]),
);

export const getPaymentListInInvoice = createSelector(
  [_getPaymentData, _getPaymentListIds, _getUuid],
  (data: { [id: string]: PaymentItem }, ids: string[], invoiceUuid: string) =>
    ids
      .map((id: string) => data[id])
      .filter((p: PaymentItem) => p.invoice === invoiceUuid),
);

export const getAllQuickCreatedInvoices = createSelector(
  [_getInvoiceListIds, getInvoiceData],
  (ids: string[], data: { [key: string]: Invoice }) =>
    ids
      .map((id: string) => data[id])
      .filter(
        (inv: Invoice) =>
          inv.is_quick_invoice &&
          !inv.reverted &&
          (!inv.fully_payed || inv.price_due === '0.00'),
      ),
);

export const getInvoiceXmlBulkLoading = (state: RootState) =>
  getState(state).generateXmlBulk.loading;

export const getDownloadInvoiceBulkExportLoading = (state: RootState) =>
  getState(state).downloadBulkExport.loading;
