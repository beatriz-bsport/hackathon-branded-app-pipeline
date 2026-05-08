import { useEffect, useId, useState } from "react";

import type { SavedPaymentMethod } from "@bsport/api-financial-services/payment-method";
import { Body, type Item, Select } from "@bsport/kaizen-primitive-core";

import type { PaymentMethodSelectorProps } from "#src/components/financial-services/payment-method-selector/types";
import { i18nInstance, useTranslation } from "#src/i18n";

import {
  ALL_PAYMENT_METHOD_OPTIONS,
  DEFAULT_ALL_METHOD_KEY,
} from "./constants";
import { isSameSelection, parseSelectValue, toSelectValue } from "./helpers";
import type {
  PaymentMethodSelectorResolvedSelection,
  PaymentMethodSelectorSelection,
} from "./types";
import { useFetchSavedPaymentMethods } from "./use-fetch-saved-payment-methods";

const PLACEHOLDER_ITEM_ID = "payment-method-selector:placeholder";
type SavedPaymentMethodVisualType = "card" | "sepa_debit" | "bacs_debit";
type SavedPaymentMethodMappedOption = {
  id: string;
  label: string;
  visualType: SavedPaymentMethodVisualType;
  expirationDate?: string;
};

const formatSavedPaymentMethodLabel = (
  paymentMethod: SavedPaymentMethod,
  t: (
    key:
      | "paymentMethod.card"
      | "paymentMethod.sepaDebit"
      | "paymentMethod.bacsDebit",
  ) => string,
): string => {
  const normalizedIdentifier = paymentMethod.readable_identifier?.trim() ?? "";
  const identifierDigits = normalizedIdentifier.replace(/[^0-9]/g, "");
  const maskedIdentifier = normalizedIdentifier.startsWith("****")
    ? normalizedIdentifier
    : identifierDigits
      ? `****${identifierDigits.slice(-4)}`
      : "";

  return (
    maskedIdentifier ||
    t(
      paymentMethod.type === "card"
        ? "paymentMethod.card"
        : paymentMethod.type === "sepa_debit"
          ? "paymentMethod.sepaDebit"
          : "paymentMethod.bacsDebit",
    )
  );
};

const getSavedPaymentMethodVisualType = (
  paymentMethod: SavedPaymentMethod,
): SavedPaymentMethodVisualType => {
  if (paymentMethod.type === "card") {
    return "card";
  }

  if (paymentMethod.type === "sepa_debit") {
    return "sepa_debit";
  }

  return "bacs_debit";
};

const formatExpirationDate = (value?: string): string | undefined => {
  if (!value) return undefined;

  const trimmedValue = value.trim();
  const match = trimmedValue.match(/^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/);

  if (!match) return trimmedValue;

  const [, month, year] = match;
  const normalizedMonth = month.padStart(2, "0");
  const normalizedYear = year.length === 4 ? year.slice(-2) : year;

  return `${normalizedMonth}/${normalizedYear}`;
};

const mapSavedPaymentMethodsToOptions = (
  paymentMethods: SavedPaymentMethod[],
  t: (
    key:
      | "paymentMethod.card"
      | "paymentMethod.sepaDebit"
      | "paymentMethod.bacsDebit",
  ) => string,
): SavedPaymentMethodMappedOption[] => {
  return paymentMethods.map((paymentMethod) => ({
    id: paymentMethod.id,
    label: formatSavedPaymentMethodLabel(paymentMethod, t),
    expirationDate: formatExpirationDate(paymentMethod.additional_info),
    visualType: getSavedPaymentMethodVisualType(paymentMethod),
  }));
};

/**
 * Business selector for payment flows.
 *
 * Behavior:
 * - Always uncontrolled.
 * - Auto-selects the first saved payment method when available.
 * - Falls back to "new card" when there are no saved methods.
 * - Emits selection through `onSelectionChange`.
 */
export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  memberId,
  fetch,
  onSelectionChange,
  allMethodsConfig,
  disabled,
  size,
  fullWidth = true,
  required,
  ...selectProps
}: PaymentMethodSelectorProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const selectorId = useId();

  const {
    data: savedPaymentMethods = [],
    isLoading,
    isError,
  } = useFetchSavedPaymentMethods(fetch, memberId);

  const savedMethodItems = mapSavedPaymentMethodsToOptions(
    savedPaymentMethods,
    (key) => t(key),
  );
  const hiddenAllMethodIds = allMethodsConfig?.hiddenIds;
  const adornmentByAllMethodId = allMethodsConfig?.adornmentById;
  const allMethodsItems = ALL_PAYMENT_METHOD_OPTIONS.filter(
    (option) => !hiddenAllMethodIds?.includes(option.id),
  ).map((option) => ({
    id: option.id,
    label: t(option.labelKey),
    iconLeft: option.iconLeft,
  }));

  const [currentSelection, setCurrentSelection] =
    useState<PaymentMethodSelectorSelection>(null);

  const applySelection = (
    selection: PaymentMethodSelectorResolvedSelection,
  ): void => {
    setCurrentSelection(selection);
    onSelectionChange?.(selection);
  };

  const currentValue = currentSelection
    ? toSelectValue(currentSelection)
    : PLACEHOLDER_ITEM_ID;

  const allItems: Item[] = allMethodsItems.map((item) => ({
    id: toSelectValue({ kind: "all", id: item.id }),
    label: item.label,
    iconLeft: item.iconLeft,
    rightSlot: adornmentByAllMethodId?.[item.id],
  }));

  const menuItems: Item[] =
    savedMethodItems.length === 0
      ? allItems
      : [
          {
            type: "title",
            label: t("paymentMethod.selector.savedMethodsLabel"),
          },
          ...savedMethodItems.map((item) => ({
            id: toSelectValue({ kind: "saved", id: item.id }),
            label: item.label,
            rightSlot:
              item.visualType === "card" && item.expirationDate ? (
                <Body htmlVariant="span" size="lg" color="weaker">
                  {item.expirationDate}
                </Body>
              ) : undefined,
          })),
          { type: "title", label: t("paymentMethod.selector.allMethodsLabel") },
          ...allItems,
        ];

  const selectItems: Item[] = currentSelection
    ? menuItems
    : [
        {
          id: PLACEHOLDER_ITEM_ID,
          label: t("paymentMethod.selector.loadingSavedMethods"),
          disabled: true,
        },
        ...menuItems,
      ];

  useEffect(() => {
    if ((isLoading || isError) && !currentSelection) {
      return;
    }

    const firstSavedMethodId = savedMethodItems[0]?.id;
    const hasSelectedSavedMethod =
      currentSelection?.kind === "saved" &&
      savedMethodItems.some((item) => item.id === currentSelection.id);
    const hasSelectedAllMethod = currentSelection?.kind === "all";

    const nextSelection: PaymentMethodSelectorResolvedSelection =
      firstSavedMethodId
        ? { kind: "saved", id: firstSavedMethodId }
        : { kind: "all", id: DEFAULT_ALL_METHOD_KEY };

    if (
      hasSelectedSavedMethod ||
      hasSelectedAllMethod ||
      isSameSelection(currentSelection, nextSelection)
    )
      return;

    applySelection(nextSelection);
  }, [applySelection, currentSelection, isLoading, savedMethodItems]);

  const handleChange = (selectedValue: string): void => {
    const parsedSelection = parseSelectValue(selectedValue);
    if (!parsedSelection) return;

    applySelection(parsedSelection);
  };

  return (
    <Select
      {...selectProps}
      id={selectProps.id ?? `${selectorId}-payment-method`}
      disabled={disabled}
      fullWidth={fullWidth}
      items={selectItems}
      loadingProps={{
        isLoading,
        message: t("paymentMethod.selector.loadingSavedMethods"),
      }}
      onChange={handleChange}
      required={required}
      size={size}
      value={currentValue}
    />
  );
};

PaymentMethodSelector.displayName = "KaizenPaymentMethodSelector";
