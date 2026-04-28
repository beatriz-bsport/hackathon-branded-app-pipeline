import { useCallback } from "react";

import { useFormContext } from "@bsport/form";

import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

type AddItemValidationField =
  | "addItemQuantity"
  | "addItemPriceCts"
  | "addItemDiscountReason"
  | "addItemGiftcardRecipientName"
  | "addItemGiftcardFrom"
  | "addItemGiftcardTo"
  | "addItemGiftcardValidFrom"
  | "addItemGiftcardRecipientEmails"
  | "addItemGiftcardBackgroundImage";

const ADD_ITEM_VALIDATION_FIELDS: AddItemValidationField[] = [
  "addItemQuantity",
  "addItemPriceCts",
  "addItemDiscountReason",
  "addItemGiftcardRecipientName",
  "addItemGiftcardFrom",
  "addItemGiftcardTo",
  "addItemGiftcardValidFrom",
  "addItemGiftcardRecipientEmails",
  "addItemGiftcardBackgroundImage",
];

/**
 * We use DOM selectors as a fallback to set focus since some inputs in this section
 * are composite components (e.g., Autocomplete, DatePicker, custom wrappers), and
 * react-hook-form's setFocus(fieldName) doesn't always correctly focus the
 * underlying input element. By using stable ID prefixes, we ensure that after validation,
 * the first invalid and visible control reliably receives focus.
 */
const FIELD_FOCUS_SELECTOR: Record<AddItemValidationField, string> = {
  addItemQuantity: 'input[id^="quantity-"]',
  addItemPriceCts: 'input[id^="price-"]',
  addItemDiscountReason: 'textarea[id^="checkout-flow-discount-reason-"]',
  addItemGiftcardRecipientName: 'input[id^="giftcard-name-"]',
  addItemGiftcardFrom: 'input[id^="giftcard-from-"]',
  addItemGiftcardTo: 'input[id^="giftcard-to-"]',
  addItemGiftcardValidFrom: 'input[id^="giftcard-valid-from-"]',
  addItemGiftcardRecipientEmails: 'input[id^="giftcard-recipient-emails-"]',
  addItemGiftcardBackgroundImage: "#giftcard-background-image",
};

export const useAddItemValidation = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { getValues, setError, clearErrors, setFocus } =
    useFormContext<CheckoutFlowFormState>();
  const requiredFieldMessage = t("checkoutFlowModal.validation.fieldRequired");

  return useCallback((): boolean => {
    const values = getValues();
    clearErrors(ADD_ITEM_VALIDATION_FIELDS);

    const errors: AddItemValidationField[] = [];

    if (values.addItemQuantity < 1) {
      setError("addItemQuantity", {
        type: "manual",
        message: t("checkoutFlowModal.validation.quantityMin"),
      });
      errors.push("addItemQuantity");
    }

    if (values.addItemPriceCts == null || values.addItemPriceCts < 0) {
      setError("addItemPriceCts", {
        type: "manual",
        message: t("checkoutFlowModal.validation.priceMin"),
      });
      errors.push("addItemPriceCts");
    }

    const isDiscountApplied =
      values.addItemApplyDiscount &&
      (values.addItemDiscountPercent > 0 ||
        values.addItemDiscountAmountCts > 0);
    if (
      isDiscountApplied &&
      values.isDiscountReasonRequired &&
      !values.addItemDiscountReason.trim()
    ) {
      setError("addItemDiscountReason", {
        type: "manual",
        message: requiredFieldMessage,
      });
      errors.push("addItemDiscountReason");
    }

    if (values.addItemSelectedItemType === "giftcard") {
      if (!values.addItemGiftcardRecipientName.trim()) {
        setError("addItemGiftcardRecipientName", {
          type: "manual",
          message: t(
            "checkoutFlowModal.validation.giftcardRecipientNameRequired",
          ),
        });
        errors.push("addItemGiftcardRecipientName");
      }

      if (!values.addItemGiftcardFrom.trim()) {
        setError("addItemGiftcardFrom", {
          type: "manual",
          message: t("checkoutFlowModal.validation.giftcardFromRequired"),
        });
        errors.push("addItemGiftcardFrom");
      }

      if (!values.addItemGiftcardTo.trim()) {
        setError("addItemGiftcardTo", {
          type: "manual",
          message: t("checkoutFlowModal.validation.giftcardToRequired"),
        });
        errors.push("addItemGiftcardTo");
      }

      if (
        values.addItemGiftcardDeliveryFormat === "pdf" &&
        !values.addItemGiftcardValidFrom.trim()
      ) {
        setError("addItemGiftcardValidFrom", {
          type: "manual",
          message: t("checkoutFlowModal.validation.giftcardValidFromRequired"),
        });
        errors.push("addItemGiftcardValidFrom");
      }

      if (values.addItemGiftcardDeliveryFormat === "email") {
        if (values.addItemGiftcardRecipientEmails.length === 0) {
          setError("addItemGiftcardRecipientEmails", {
            type: "manual",
            message: t(
              "checkoutFlowModal.validation.giftcardRecipientEmailsRequired",
            ),
          });
          errors.push("addItemGiftcardRecipientEmails");
        }

        if (values.addItemGiftcardBackgroundImage == null) {
          setError("addItemGiftcardBackgroundImage", {
            type: "manual",
            message: t(
              "checkoutFlowModal.validation.giftcardBackgroundImageRequired",
            ),
          });
          errors.push("addItemGiftcardBackgroundImage");
        }
      }
    }

    const firstErrorField = errors[0];
    if (!firstErrorField) return true;

    setFocus(firstErrorField);
    const firstInvalidElement = document.querySelector<HTMLElement>(
      FIELD_FOCUS_SELECTOR[firstErrorField],
    );
    firstInvalidElement?.focus();
    return false;
  }, [clearErrors, getValues, requiredFieldMessage, setError, setFocus, t]);
};
