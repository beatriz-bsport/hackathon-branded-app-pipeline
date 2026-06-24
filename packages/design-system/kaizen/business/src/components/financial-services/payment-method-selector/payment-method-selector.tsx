import { useCallback, useEffect, useId, useState } from "react";

import type { SavedPaymentMethod } from "@bsport/api-financial-services/payment-method";
import {
  Body,
  type IconName,
  type Item,
  Select,
} from "@bsport/kaizen-primitive-core";

import {
  type SavedPaymentMethodTypeLabelKey,
  getSavedPaymentMethodDisplay,
} from "#src/components/financial-services/payment-method-display";
import PaymentMethodLogo, {
  type PaymentMethodLogoType,
} from "#src/components/financial-services/payment-method-logo";
import type { PaymentMethodSelectorProps } from "#src/components/financial-services/payment-method-selector/types";
import { i18nInstance, useTranslation } from "#src/i18n";

import {
  ALL_PAYMENT_METHOD_OPTIONS,
  type AllPaymentMethodKey,
  DEFAULT_ALL_METHOD_KEY,
  SAVED_PAYMENT_METHOD_TYPE,
} from "./constants";
import {
  enrichSavedSelection,
  isSameSelection,
  parseSelectValue,
  toSelectValue,
} from "./helpers";
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
  logoType?: PaymentMethodLogoType;
  savedType: SavedPaymentMethod["type"];
  expirationDate?: string;
  paymentBackendIdentifier?: number;
};

const mapSavedPaymentMethodsToOptions = (
  paymentMethods: SavedPaymentMethod[],
  t: (key: SavedPaymentMethodTypeLabelKey) => string,
): SavedPaymentMethodMappedOption[] => {
  return paymentMethods.map((paymentMethod) => {
    const display = getSavedPaymentMethodDisplay(paymentMethod);

    return {
      id: paymentMethod.id,
      label: display.hasMaskedDigits
        ? display.maskedIdentifier
        : t(display.typeLabelKey),
      savedType: paymentMethod.type,
      expirationDate: display.expiry,
      logoType: display.logoType,
      paymentBackendIdentifier: paymentMethod.payment_backend_identifier,
    };
  });
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
 * - Supports controlled (`value` + `onSelectionChange`) and uncontrolled modes.
 * - Uncontrolled with `defaultValue`: seeds the initial selection once and
 *   keeps it (no auto-select override).
 * - Uncontrolled without `defaultValue`: auto-selects the first saved payment
 *   method when available, falling back to "new card" otherwise.
 * - Emits selection through `onSelectionChange`; `saved` selections are
 *   enriched with `paymentMethodType` and `payment_backend_identifier`.
 */
export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  memberId,
  fetch,
  value,
  defaultValue,
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

  const isControlled = value !== undefined;
  const hasExplicitInitialSelection =
    isControlled || defaultValue !== undefined;

  const [internalSelection, setInternalSelection] =
    useState<PaymentMethodSelectorSelection>(defaultValue ?? null);

  const currentSelection: PaymentMethodSelectorSelection = isControlled
    ? (value ?? null)
    : internalSelection;

  const applySelection = useCallback(
    (selection: PaymentMethodSelectorResolvedSelection): void => {
      if (!isControlled) {
        setInternalSelection(selection);
      }
      onSelectionChange?.(selection);
    },
    [isControlled, onSelectionChange],
  );

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
    // Controlled mode and explicit `defaultValue` both opt out of the
    // auto-select default so the consumer's selection is preserved.
    if (hasExplicitInitialSelection) {
      return;
    }

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
            payment_backend_identifier:
              firstSavedMethod.paymentBackendIdentifier,
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
  }, [
    applySelection,
    currentSelection,
    hasExplicitInitialSelection,
    isError,
    isLoading,
    savedMethodItems,
  ]);

  const handleChange = (selectedValue: string): void => {
    const parsedSelection = parseSelectValue(selectedValue);
    if (!parsedSelection) return;

    const enrichedSelection = enrichSavedSelection(
      parsedSelection,
      savedMethodItems,
    );
    if (!enrichedSelection) return;

    applySelection(enrichedSelection);
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
