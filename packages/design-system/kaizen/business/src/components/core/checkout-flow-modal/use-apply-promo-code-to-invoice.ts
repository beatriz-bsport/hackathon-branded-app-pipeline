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

import { useCheckoutFlowTrack } from "#src/components/core/checkout-flow-modal/checkout-flow-tracking-context";
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
  const track = useCheckoutFlowTrack();

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
    onSuccess: (response, { codes, isRefresh }) => {
      if (!response.can_be_applied || response.applied_coupons.length === 0) {
        const errorMsg = t("checkoutFlowModal.promoCode.errors.notFound");
        setError("promoCodes", { type: "manual", message: errorMsg });
        if (!isRefresh) {
          track("checkout_flow_apply_promo_code_button_clicked", {
            promo_code: codes[0] ?? "",
            promo_code_error: errorMsg,
            member_id: memberId,
          });
        }
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

      if (!isRefresh) {
        const submittedCode = (codes[0] ?? "").trim().toLowerCase();
        const appliedCoupon = response.applied_coupons.find(
          (coupon) => coupon.code.trim().toLowerCase() === submittedCode,
        );
        track("checkout_flow_apply_promo_code_button_clicked", {
          promo_code: codes[0] ?? "",
          promo_code_id: appliedCoupon?.id,
          promo_code_value: Math.round(
            Math.abs(appliedCoupon?.voucher ?? 0) * 100,
          ),
          member_id: memberId,
        });
      }
    },
    onError: (error: Error, { codes, isRefresh }) => {
      console.error("Failed to apply promo code:", error);

      let errorText: string;
      if (error instanceof HTTPException && error.customErrorCodes.length > 0) {
        const errorCode = error.customErrorCodes[0];
        errorText = !isCouponErrorCode(errorCode)
          ? t("checkoutFlowModal.promoCode.errors.notApplicable")
          : t(`checkoutFlowModal.promoCode.errors.${errorCode}`);

        setError("promoCodes", { type: "manual", message: errorText });
      } else {
        errorText = t("checkoutFlowModal.promoCode.errors.notApplicable");
        setError("promoCodes", { type: "manual", message: errorText });
      }

      if (!isRefresh) {
        track("checkout_flow_apply_promo_code_button_clicked", {
          promo_code: codes[0] ?? "",
          promo_code_error: errorText,
          member_id: memberId,
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
    const removedCoupon = appliedCoupons[indexToRemove];
    if (removedCoupon) {
      track("checkout_flow_delete_promo_code_button_clicked", {
        promo_code: removedCoupon.code,
        promo_code_id: removedCoupon.id,
        promo_code_value: Math.round(Math.abs(removedCoupon.voucher) * 100),
        member_id: memberId,
      });
    }
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
