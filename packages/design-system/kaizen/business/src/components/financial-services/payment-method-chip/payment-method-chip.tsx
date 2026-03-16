import React from "react";

import type { PaymentMethodType } from "@bsport/api-financial-services/types";
import {
  Chip,
  type ChipProps,
  type IconName,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

type PaymentMethodConfig = {
  label: string;
  iconLeft?: IconName;
};

const PAYMENT_METHOD_CONFIG: Record<PaymentMethodType, PaymentMethodConfig> = {
  card: {
    label: "Card",
    iconLeft: "credit-card-02",
  },
  sepa_debit: {
    label: "SEPA",
    iconLeft: "bank",
  },
  bacs_debit: {
    label: "BACS",
    iconLeft: "bank",
  },
  twint: {
    label: "TWINT",
    iconLeft: "bank",
  },
  bancontact: {
    label: "Bancontact",
    iconLeft: "bank",
  },
  ideal: {
    label: "iDEAL",
    iconLeft: "bank",
  },
  apple_pay: {
    label: "Apple Pay",
    iconLeft: "apple-logo",
  },
  google_pay: {
    label: "Google Pay",
    iconLeft: "google-logo",
  },
};

/**
 * Props for the PaymentMethodChip business component.
 *
 * Renders a Chip with a human-readable label and optional icon based on the payment method type.
 * Use `chipProps` to override default Chip appearance (e.g. size, color, className).
 */
export type PaymentMethodChipProps = {
  /** Payment method type; determines label and icon. Must be a known type or component returns null. */
  type: PaymentMethodType;
  /** Optional props passed through to the underlying Chip (e.g. size, color, className). */
  chipProps?: Omit<ChipProps, "label" | "iconLeft">;
};

/**
 * Business chip that displays a payment method with a consistent label and icon.
 * Maps API keys (e.g. card, sepa_debit) to display labels (Card, SEPA) and icons.
 * Returns null if `type` is not in the supported set.
 */
const PaymentMethodChip: React.FC<PaymentMethodChipProps> = ({
  type,
  chipProps,
}) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  const config = PAYMENT_METHOD_CONFIG[type];
  if (!config) return null;

  const { label, iconLeft } = config;
  const displayLabel = type === "card" ? t("paymentMethod.card") : label;

  return (
    <Chip
      type="weak"
      color="default"
      size="lg"
      {...chipProps}
      label={displayLabel}
      iconLeft={iconLeft}
    />
  );
};

PaymentMethodChip.displayName = "KaizenPaymentMethodChip";

export default PaymentMethodChip;
