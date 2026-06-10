import { useMutation, useQueryClient } from "@tanstack/react-query";

import { memberKeys } from "@bsport/api-cdp/member";
import {
  type CreateInvoiceBuyableItem,
  type CreateInvoiceGiftcardConfig,
  type CreateInvoiceRequest,
  type CreateInvoiceResponse,
  createInvoiceAPI,
} from "@bsport/api-financial-services/invoice-create";
import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";
import type { Fetch } from "@bsport/fetch";

import type {
  CheckoutFlowFormData,
  CheckoutFlowItem,
  GiftcardDeliveryFormat,
} from "#src/components/core/checkout-flow-modal/types";

import {
  GIFTCARD_KIND_EMAIL,
  GIFTCARD_KIND_PDF,
  INVOICES_QUERY_KEY,
  TYPE_TO_IDENTIFIER,
} from "./constants";
import { resolveCheckoutItemInvoicePriceAndVoucher } from "./lib/resolve-checkout-item-invoice-price-voucher";

const deliveryFormatToKind = (format: GiftcardDeliveryFormat): number =>
  format === "email" ? GIFTCARD_KIND_EMAIL : GIFTCARD_KIND_PDF;

/** Returns one unit of the item (unit price and unit voucher). */
const itemToBuyableItem = (
  item: CheckoutFlowItem,
): CreateInvoiceBuyableItem => {
  const { price, voucher } = resolveCheckoutItemInvoicePriceAndVoucher(item);

  return {
    buyable_item_id: item.buyableItemId,
    buyable_item_identifier: TYPE_TO_IDENTIFIER[item.type] ?? 0,
    price,
    voucher,
    voucher_reason: item.discountReason,
  };
};

const buildGiftcardConfigList = (
  items: CheckoutFlowItem[],
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
  data: CheckoutFlowFormData,
): CreateInvoiceRequest => {
  const buyable_items = data.items.flatMap((item) =>
    Array.from({ length: item.quantity }, () => itemToBuyableItem(item)),
  );
  const giftcard_config_list = buildGiftcardConfigList(data.items);
  return {
    member: data.member!.id,
    date: getLocalNow({}).toISO() ?? new Date().toISOString(),
    is_v2: true,
    buyable_items,
    coupon_codes: data.promoCodes.length > 0 ? data.promoCodes : undefined,
    establishment_billing_group: data.establishmentBillingGroupId ?? undefined,
    giftcard_config_list:
      giftcard_config_list.length > 0 ? giftcard_config_list : undefined,
    custom_footer: data.footnote?.trim() ?? undefined,
  };
};

export type UseCreateInvoiceOptions = {
  fetch: Fetch;
  onError?: (error: Error) => void;
  onSubmit?: (data: CheckoutFlowFormData, invoiceUuid: string) => void;
};

export const useCreateInvoice = (options: UseCreateInvoiceOptions) => {
  const queryClient = useQueryClient();
  const { fetch: fetchInstance, onError, onSubmit } = options;
  const createInvoice = createInvoiceAPI.bind(null, fetchInstance);

  return useMutation<CreateInvoiceResponse, Error, CheckoutFlowFormData>({
    mutationFn: async (data) => {
      const payload = mapFormDataToCreateInvoiceRequest(data);
      return createInvoice(payload);
    },
    onSuccess: (invoice, data) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
      onSubmit?.(data, invoice.uuid);
    },
    onError,
  });
};
