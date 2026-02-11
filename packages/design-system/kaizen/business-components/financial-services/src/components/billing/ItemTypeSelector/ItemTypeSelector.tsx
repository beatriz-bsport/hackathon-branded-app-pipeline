import React, { useEffect, useState } from "react";

import { Body, Button, type IconName } from "@bsport/kaizen-primitive-core";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export const INVOICE_ITEMS_KINDS = {
  pass: "pass",
  appointment_pass: "appointment_pass",
  product: "product",
  pack: "pack",
  giftcard: "giftcard",
  subscription: "subscription",
} as const;

export type InvoiceItemKind = keyof typeof INVOICE_ITEMS_KINDS;

export type ItemTypeSelectorProps = {
  label?: string;
  value?: InvoiceItemKind | null;
  defaultValue?: InvoiceItemKind;
  onSelect: (type: InvoiceItemKind) => void;
};

/**
 * ItemTypeSelector component for selecting invoice item types in the billing flow.
 *
 * This business component is used within the BillingFlowModal to allow users to select
 * the type of item they want to add to an invoice (Pass, Appointment Pass, Products, Pack, Gift Card, Subscription).
 *
 * The component supports both controlled and uncontrolled modes:
 * - **Controlled Mode**: Pass the `value` prop to control the selected value externally. Use `onSelect` to handle changes.
 * - **Uncontrolled Mode**: When `value` is undefined, the component manages its own internal state. Pass `defaultValue` to initialize the selected value.
 *
 * @example
 * ```tsx
 * // Controlled mode
 * <ItemTypeSelector
 *   value={selectedType}
 *   onSelect={setSelectedType}
 * />
 *
 * // Uncontrolled mode
 * <ItemTypeSelector
 *   defaultValue="pass"
 *   onSelect={(type) => console.log(type)}
 * />
 * ```
 */
const ItemTypeSelector: React.FC<ItemTypeSelectorProps> = ({
  label,
  value,
  defaultValue,
  onSelect,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  // Internal state for uncontrolled mode
  const [internalSelected, setInternalSelected] =
    useState<InvoiceItemKind | null>(defaultValue ?? null);

  // Sync internal state when controlled value changes (for uncontrolled mode)
  useEffect(() => {
    if (value === undefined && defaultValue !== undefined) {
      setInternalSelected(defaultValue);
    }
  }, [value, defaultValue]);

  // Use controlled value if provided (including null), otherwise use internal state
  // When value is explicitly null, no item should be selected
  const selectedValue = value !== undefined ? value : internalSelected;

  const itemTypes: Array<{
    value: InvoiceItemKind;
    label: string;
    icon: IconName;
  }> = [
    {
      value: INVOICE_ITEMS_KINDS.pass,
      label: t("itemTypeSelector.pass"),
      icon: "ticket-01",
    },
    {
      value: INVOICE_ITEMS_KINDS.appointment_pass,
      label: t("itemTypeSelector.appointmentPass"),
      icon: "ticket-01",
    },
    {
      value: INVOICE_ITEMS_KINDS.product,
      label: t("itemTypeSelector.product"),
      icon: "shopping-bag-01",
    },
    {
      value: INVOICE_ITEMS_KINDS.pack,
      label: t("itemTypeSelector.pack"),
      icon: "package",
    },
    {
      value: INVOICE_ITEMS_KINDS.giftcard,
      label: t("itemTypeSelector.giftcard"),
      icon: "gift-02",
    },
    {
      value: INVOICE_ITEMS_KINDS.subscription,
      label: t("itemTypeSelector.subscription"),
      icon: "refresh-cw-04",
    },
  ];

  const handleItemTypeSelect = (itemType: InvoiceItemKind) => {
    onSelect(itemType);
    if (value === undefined) {
      setInternalSelected(itemType);
    }
  };

  // When value is null, no button should be selected
  // Compare selectedValue with itemTypeValue - both should be InvoiceItemKind strings
  const isSelected = (itemTypeValue: InvoiceItemKind) => {
    if (selectedValue === null) {
      return false;
    }
    return selectedValue === itemTypeValue;
  };

  return (
    <div className="flex flex-col items-start gap-sm self-stretch">
      {label && (
        <Body htmlVariant="span" size="md" color="default">
          {label}
        </Body>
      )}
      <div className="flex flex-wrap items-end content-end gap-sm self-stretch">
        {itemTypes.map((itemType) => (
          <Button
            key={itemType.value}
            kind="default"
            intent="default"
            color={isSelected(itemType.value) ? "selected" : "main"}
            size="md"
            label={itemType.label}
            iconLeft={itemType.icon}
            onClick={() => handleItemTypeSelect(itemType.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemTypeSelector;
