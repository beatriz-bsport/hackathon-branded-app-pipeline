import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createInvoiceAPI,
  updateInvoiceFooterAPI,
} from "@bsport/api-financial-services";
import type {
  CreateInvoiceBuyableItem,
  CreateInvoiceGiftcardConfig,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
} from "@bsport/api-financial-services";
import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";

import type {
  BillingFlowFormData,
  BillingFlowItem,
  GiftcardDeliveryFormat,
} from "#src/components/billing/BillingFlowModal/types";
import fetch from "#src/utils/fetch";

import {
  GIFTCARD_KIND_EMAIL,
  GIFTCARD_KIND_PDF,
  INVOICES_QUERY_KEY,
  TYPE_TO_IDENTIFIER,
} from "./constants";

const deliveryFormatToKind = (format: GiftcardDeliveryFormat): number =>
  format === "email" ? GIFTCARD_KIND_EMAIL : GIFTCARD_KIND_PDF;

const itemToBuyableItem = (item: BillingFlowItem): CreateInvoiceBuyableItem => {
  const lineTotalCts = item.priceCts * item.quantity;
  const price = (lineTotalCts / 100).toFixed(2);
  const voucher =
    item.discountPercent > 0
      ? (
          (item.priceCts * item.quantity * item.discountPercent) /
          10000
        ).toFixed(2)
      : item.discountAmountCts > 0
        ? ((item.discountAmountCts * item.quantity) / 100).toFixed(2)
        : "0.00";
  return {
    buyable_item_id: item.buyableItemId,
    buyable_item_identifier: TYPE_TO_IDENTIFIER[item.type] ?? 0,
    price,
    voucher,
    voucher_reason: "",
  };
};

const buildGiftcardConfigList = (
  items: BillingFlowItem[],
): CreateInvoiceGiftcardConfig[] =>
  items
    .filter((item) => item.type === "giftcard")
    .map((item): CreateInvoiceGiftcardConfig => {
      return {
        giftcard: item.buyableItemId,
        price: item.priceCts / 100,
        name:
          item.giftcardRecipientName != null
            ? item.giftcardRecipientName
            : undefined,
        message_is_from:
          item.giftcardFrom != null ? item.giftcardFrom : undefined,
        message_is_for: item.giftcardTo != null ? item.giftcardTo : undefined,
        message_content:
          item.giftcardPersonalMessage != null
            ? item.giftcardPersonalMessage
            : undefined,
        background_image:
          item.giftcardBackgroundImage != null
            ? item.giftcardBackgroundImage
            : undefined,
        recipients:
          item.giftcardRecipientEmails != null
            ? item.giftcardRecipientEmails
            : undefined,
        activation_datetime:
          item.giftcardValidFrom != null ? item.giftcardValidFrom : undefined,
        kind:
          item.giftcardDeliveryFormat != null
            ? deliveryFormatToKind(item.giftcardDeliveryFormat)
            : undefined,
        ...(item.giftcardScheduledDate != null &&
        item.giftcardScheduledTime != null
          ? (() => {
              const [hour = 0, minute = 0] = item.giftcardScheduledTime
                .split(":")
                .map(Number);
              const dateTime = fromIsoString(item.giftcardScheduledDate)
                .setZone("local")
                .set({ hour, minute, second: 0, millisecond: 0 });
              return { date_to_send: dateTime.toISO() ?? undefined };
            })()
          : {}),
      };
    });

const mapFormDataToCreateInvoiceRequest = (
  data: BillingFlowFormData,
): CreateInvoiceRequest => {
  const buyable_items = data.items.map(itemToBuyableItem);
  const giftcard_config_list = buildGiftcardConfigList(data.items);
  return {
    member: data.member!.id,
    date:
      data.date?.trim() || getLocalNow({}).toISO() || new Date().toISOString(),
    is_v2: true,
    buyable_items,
    coupon_codes: data.promoCodes.length > 0 ? data.promoCodes : undefined,
    establishment_billing_group: data.establishmentBillingGroupId ?? undefined,
    giftcard_config_list:
      giftcard_config_list.length > 0 ? giftcard_config_list : undefined,
  };
};

const createInvoice = createInvoiceAPI.bind(null, fetch);
const updateFooter = updateInvoiceFooterAPI.bind(null, fetch);

export type UseCreateInvoiceOptions = {
  onError?: (error: Error) => void;
  onSubmit?: (data: BillingFlowFormData, invoiceUuid: string) => void;
};

export const useCreateInvoice = (options?: UseCreateInvoiceOptions) => {
  const queryClient = useQueryClient();
  const { onError, onSubmit } = options ?? {};

  return useMutation<CreateInvoiceResponse, Error, BillingFlowFormData>({
    mutationFn: async (data) => {
      const payload = mapFormDataToCreateInvoiceRequest(data);
      const invoice = await createInvoice(payload);

      // TODO: Update backend create invoice endpoint to accept footnote in the payload
      if (data.footnote?.trim()) {
        try {
          await updateFooter(invoice.uuid, data.footnote.trim());
        } catch (error) {
          onError?.(error as Error);
        }
      }

      return invoice;
    },
    onSuccess: (invoice, data) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      onSubmit?.(data, invoice.uuid);
    },
    onError,
  });
};
