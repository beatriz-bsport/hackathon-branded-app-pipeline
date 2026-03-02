import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  type AppliedCoupon,
  type ApplyToInvoiceResponse,
  CouponErrorCodes,
  type InvoiceItem,
  applyPromoCodeToInvoiceAPI,
} from "@bsport/api-buyables";
import { type Fetch, HTTPException } from "@bsport/fetch";
import { useFormContext } from "@bsport/form";

import { TYPE_TO_IDENTIFIER } from "#src/components/core/checkout-flow-modal/constants";
import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import type { CheckoutFlowItem } from "#src/components/core/checkout-flow-modal/types";
import { i18nInstance, useTranslation } from "#src/i18n";
import { invariant } from "#src/utils/invariant";

type UseApplyPromoCodeResult = {
  appliedCoupons: AppliedCoupon[];
  isApplyingPromoCode: boolean;
  errorMessage: string | null;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: (index: number) => void;
};

const transformItemsToInvoiceItems = (
  items: CheckoutFlowItem[],
): InvoiceItem[] => {
  return items.map((item, index) => {
    const price = (item.priceCts / 100).toFixed(2);
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
      // Keep a per-line unique id so repeated promo-code applications do not overwrite
      // previous item entries on the API side.
      id: index + 1,
      name: item.itemName,
      price,
      voucher,
      buyable_item_id: item.buyableItemId,
      buyable_item_identifier: TYPE_TO_IDENTIFIER[item.type] ?? 0,
      voucher_reason: "",
      editable: true,
      reverted: false,
    };
  });
};

const calculateTotalDiscountCts = (coupons: AppliedCoupon[]): number => {
  return Math.round(
    coupons.reduce((sum, coupon) => sum + coupon.voucher, 0) * 100,
  );
};

type CouponErrorCode = (typeof CouponErrorCodes)[keyof typeof CouponErrorCodes];
const couponErrorCodes = Object.values(CouponErrorCodes) as readonly number[];
const isCouponErrorCode = (errorCode: number): errorCode is CouponErrorCode =>
  couponErrorCodes.includes(errorCode);

export const useApplyPromoCodeToInvoice = (
  fetch: Fetch,
): UseApplyPromoCodeResult => {
  const applyPromoCodeToInvoice = applyPromoCodeToInvoiceAPI.bind(null, fetch);

  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { watch, setValue, setError, clearErrors, getFieldState, formState } =
    useFormContext<CheckoutFlowFormState>();

  const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupon[]>([]);
  const errorMessage =
    getFieldState("promoCodes", formState).error?.message ?? null;

  const member = watch("member");
  const memberId = member?.id;
  const items = watch("items");
  const promoCodes = watch("promoCodes");

  const { mutateAsync, isPending: isApplyingPromoCode } = useMutation<
    ApplyToInvoiceResponse,
    Error,
    { codes: string[]; isRefresh: boolean }
  >({
    mutationFn: async ({ codes, isRefresh }) => {
      invariant(memberId, "Missing member");

      const invoiceItems = transformItemsToInvoiceItems(items);
      const alreadyAppliedCoupons = isRefresh
        ? []
        : appliedCoupons.map((coupon) => ({
            coupon_id: coupon.id,
            code: coupon.code,
          }));

      const response = await applyPromoCodeToInvoice({
        codes,
        member: memberId,
        invoice: { invoice_items: invoiceItems },
        already_applied_coupons: alreadyAppliedCoupons,
      });

      if (!isRefresh) {
        setValue("promoCode", "", { shouldDirty: true });
      }

      return response;
    },
    onSuccess: (response) => {
      if (!response.can_be_applied || response.applied_coupons.length === 0) {
        setError("promoCodes", {
          type: "manual",
          message: t("checkoutFlowModal.promoCode.errors.notFound"),
        });
        return;
      }

      setAppliedCoupons(response.applied_coupons);

      setValue(
        "promoCodes",
        response.applied_coupons.map((coupon) => coupon.code),
        { shouldDirty: true },
      );
      setValue(
        "promoCodeDiscountCts",
        calculateTotalDiscountCts(response.applied_coupons),
        { shouldDirty: true },
      );
      clearErrors("promoCodes");
    },
    onError: (error: Error) => {
      console.error("Failed to apply promo code:", error);

      if (error instanceof HTTPException && error.customErrorCodes.length > 0) {
        const errorCode = error.customErrorCodes[0];
        const errorText = !isCouponErrorCode(errorCode)
          ? t("checkoutFlowModal.promoCode.errors.notApplicable")
          : t(`checkoutFlowModal.promoCode.errors.${errorCode}`);

        setError("promoCodes", { type: "manual", message: errorText });
      } else {
        setError("promoCodes", {
          type: "manual",
          message: t("checkoutFlowModal.promoCode.errors.notApplicable"),
        });
      }
    },
  });

  // Recalculate coupons if items are added or removed and we have coupons
  useEffect(() => {
    if (promoCodes.length > 0 && items.length > 0) {
      mutateAsync({ codes: promoCodes, isRefresh: true });
    }
  }, [items.length]);

  const applyPromoCode = async (code: string): Promise<boolean> => {
    try {
      clearErrors("promoCodes");
      const response = await mutateAsync({
        codes: [code.trim()],
        isRefresh: false,
      });
      return response.can_be_applied && response.applied_coupons.length > 0;
    } catch {
      return false;
    }
  };

  const removePromoCode = (indexToRemove: number) => {
    const remainingCoupons = appliedCoupons.filter(
      (_, idx) => idx !== indexToRemove,
    );
    setAppliedCoupons(remainingCoupons);

    setValue(
      "promoCodes",
      remainingCoupons.map((coupon) => coupon.code),
      { shouldDirty: true },
    );
    setValue(
      "promoCodeDiscountCts",
      calculateTotalDiscountCts(remainingCoupons),
      { shouldDirty: true },
    );
    clearErrors("promoCodes");
  };

  return {
    appliedCoupons,
    isApplyingPromoCode,
    errorMessage,
    applyPromoCode,
    removePromoCode,
  };
};
