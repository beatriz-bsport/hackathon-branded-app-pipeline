import { useEffect, useId, useState } from "react";

import type { SavedPaymentMethod } from "@bsport/api-financial-services/payment-method";
import {
  Body,
  type IconName,
  type Item,
  Select,
} from "@bsport/kaizen-primitive-core";

import PaymentMethodLogo, {
  type PaymentMethodLogoProps,
} from "#src/components/financial-services/payment-method-logo";
import type { PaymentMethodSelectorProps } from "#src/components/financial-services/payment-method-selector/types";
import { i18nInstance, useTranslation } from "#src/i18n";

import {
  ALL_PAYMENT_METHOD_OPTIONS,
  type AllPaymentMethodKey,
  DEFAULT_ALL_METHOD_KEY,
  SAVED_METHOD_LOGO_TYPE,
  SAVED_PAYMENT_METHOD_TYPE,
} from "./constants";
import { isSameSelection, parseSelectValue, toSelectValue } from "./helpers";
import {
  PAYMENT_METHOD_SELECTOR_SELECTION_KIND,
  type PaymentMethodSelectorResolvedSelection,
  type PaymentMethodSelectorSelection,
} from "./types";
import { useFetchSavedPaymentMethods } from "./use-fetch-saved-payment-methods";

const PLACEHOLDER_ITEM_ID = "payment-method-selector:placeholder";

type SavedPaymentMethodMappedOption = {
  id: string;
  label: string;
  logoType?: PaymentMethodLogoProps["type"];
  savedType: SavedPaymentMethod["type"];
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
      paymentMethod.type === SAVED_PAYMENT_METHOD_TYPE.CARD
        ? "paymentMethod.card"
        : paymentMethod.type === SAVED_PAYMENT_METHOD_TYPE.SEPA_DEBIT
          ? "paymentMethod.sepaDebit"
          : "paymentMethod.bacsDebit",
    )
  );
};

const savedPaymentMethodToLogoType = (
  paymentMethod: SavedPaymentMethod,
): PaymentMethodLogoProps["type"] | undefined => {
  switch (paymentMethod.type) {
    case SAVED_PAYMENT_METHOD_TYPE.CARD: {
      const normalizedBrand = (
        paymentMethod.display_brand ??
        paymentMethod.brand ??
        ""
      ).toLowerCase();

      if (normalizedBrand === SAVED_METHOD_LOGO_TYPE.VISA) {
        return SAVED_METHOD_LOGO_TYPE.VISA;
      }
      if (normalizedBrand === SAVED_METHOD_LOGO_TYPE.MASTERCARD) {
        return SAVED_METHOD_LOGO_TYPE.MASTERCARD;
      }
      return undefined;
    }
    case SAVED_PAYMENT_METHOD_TYPE.SEPA_DEBIT:
      return SAVED_METHOD_LOGO_TYPE.SEPA_DEBIT;
    case SAVED_PAYMENT_METHOD_TYPE.BACS_DEBIT:
      return SAVED_METHOD_LOGO_TYPE.BACS_DEBIT;
  }
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
    savedType: paymentMethod.type,
    expirationDate: formatExpirationDate(paymentMethod.additional_info),
    logoType: savedPaymentMethodToLogoType(paymentMethod),
  }));
};

const getTriggerIconLeftForSelection = (
  selection: PaymentMethodSelectorSelection,
  allMethodsItems: Array<{
    id: AllPaymentMethodKey;
    iconLeft?: IconName;
  }>,
  savedMethodItems: SavedPaymentMethodMappedOption[],
): IconName | undefined => {
  if (!selection) return undefined;

  if (selection.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL) {
    return allMethodsItems.find((item) => item.id === selection.id)?.iconLeft;
  }

  const saved = savedMethodItems.find((item) => item.id === selection.id);
  if (!saved) return undefined;

  return saved.savedType === SAVED_PAYMENT_METHOD_TYPE.CARD
    ? "credit-card-02"
    : "bank";
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
  const disabledAllMethodIds = allMethodsConfig?.disabledIds;
  const adornmentByAllMethodId = allMethodsConfig?.adornmentById;
  const allMethodsItems = ALL_PAYMENT_METHOD_OPTIONS.filter(
    (option) => !hiddenAllMethodIds?.includes(option.id),
  ).map((option) => ({
    id: option.id,
    label: t(option.labelKey),
    iconLeft: option.iconLeft,
    disabled: disabledAllMethodIds?.includes(option.id),
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
    id: toSelectValue({
      kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL,
      id: item.id,
    }),
    label: item.label,
    iconLeft: item.iconLeft,
    disabled: item.disabled,
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
            id: toSelectValue({
              kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED,
              id: item.id,
            }),
            label: item.label,
            leftSlot: item.logoType ? (
              <PaymentMethodLogo size="md" type={item.logoType} />
            ) : undefined,
            rightSlot:
              item.savedType === SAVED_PAYMENT_METHOD_TYPE.CARD &&
              item.expirationDate ? (
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

  const triggerIconLeft = getTriggerIconLeftForSelection(
    currentSelection,
    allMethodsItems,
    savedMethodItems,
  );

  useEffect(() => {
    if ((isLoading || isError) && !currentSelection) {
      return;
    }

    const firstSavedMethod = savedMethodItems[0];
    const hasSelectedSavedMethod =
      currentSelection?.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED &&
      savedMethodItems.some((item) => item.id === currentSelection.id);
    const hasSelectedAllMethod =
      currentSelection?.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL;

    const nextSelection: PaymentMethodSelectorResolvedSelection =
      firstSavedMethod
        ? {
            kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED,
            id: firstSavedMethod.id,
            paymentMethodType: firstSavedMethod.savedType,
          }
        : {
            kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL,
            id: DEFAULT_ALL_METHOD_KEY,
          };

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

    if (parsedSelection.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED) {
      const matchedSavedMethod = savedMethodItems.find(
        (item) => item.id === parsedSelection.id,
      );
      applySelection({
        ...parsedSelection,
        paymentMethodType: matchedSavedMethod?.savedType,
      });
      return;
    }

    applySelection(parsedSelection);
  };

  return (
    <Select
      {...selectProps}
      id={selectProps.id ?? `${selectorId}-payment-method`}
      disabled={disabled}
      fullWidth={fullWidth}
      iconLeft={triggerIconLeft ?? selectProps.iconLeft}
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
