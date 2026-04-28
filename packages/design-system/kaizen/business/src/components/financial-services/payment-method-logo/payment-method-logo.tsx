import clsx from "clsx";
import React from "react";

import { cva } from "@bsport/kaizen-primitive-core";

import applePayLogo from "./assets/apple_pay.svg";
import bacsDebitLogo from "./assets/bacs_debit.svg";
import bancontactLogo from "./assets/bancontact.svg";
import googlePayLogo from "./assets/google_pay.svg";
import idealLogo from "./assets/ideal.svg";
import mastercardLogo from "./assets/mastercard.svg";
import paypalLogo from "./assets/paypal.svg";
import sepaDebitLogo from "./assets/sepa_debit.svg";
import twintLogo from "./assets/twint.svg";
import visaLogo from "./assets/visa.svg";

type PaymentMethodLogoType =
  | "visa"
  | "mastercard"
  | "bancontact"
  | "google_pay"
  | "ideal"
  | "twint"
  | "apple_pay"
  | "paypal"
  | "sepa_debit"
  | "bacs_debit";
type PaymentMethodLogoSize = "lg" | "md" | "sm";

type PaymentMethodLogoConfig = {
  label: string;
  src: string;
};

const PAYMENT_METHOD_LOGO_CONFIG: Partial<
  Record<PaymentMethodLogoType, PaymentMethodLogoConfig>
> = {
  visa: {
    label: "Visa",
    src: visaLogo,
  },
  mastercard: {
    label: "Mastercard",
    src: mastercardLogo,
  },
  sepa_debit: {
    label: "SEPA",
    src: sepaDebitLogo,
  },
  bacs_debit: {
    label: "BACS",
    src: bacsDebitLogo,
  },
  twint: {
    label: "TWINT",
    src: twintLogo,
  },
  bancontact: {
    label: "Bancontact",
    src: bancontactLogo,
  },
  ideal: {
    label: "iDEAL",
    src: idealLogo,
  },
  google_pay: {
    label: "Google Pay",
    src: googlePayLogo,
  },
  apple_pay: {
    label: "Apple Pay",
    src: applePayLogo,
  },
  paypal: {
    label: "PayPal",
    src: paypalLogo,
  },
};

const container = cva(
  [
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "overflow-hidden",
    "border-stroke-thin",
    "border-stroke-default",
    "bg-white",
  ],
  {
    variants: {
      size: {
        lg: ["h-element-xl", "w-element-2xl", "rounded-sm"],
        md: ["h-element-md", "w-element-lg", "rounded-xs"],
        sm: ["h-element-sm", "w-element-md", "rounded-xs"],
      },
    },
  },
);

/**
 * Props for the PaymentMethodLogo business component.
 *
 * Renders a payment method logo in a fixed-size bordered container.
 * The logo is centered and scales by size while preserving its aspect ratio.
 */
export type PaymentMethodLogoProps = {
  /** Payment method to render. Unknown values return null. */
  type: PaymentMethodLogoType;
  /** Visual size variant. */
  size?: PaymentMethodLogoSize;
  /** Optional className applied to the outer container. */
  className?: string;
};

/**
 * Business component that displays a payment method visual with normalized sizing.
 * Uses SVG assets and centers them vertically/horizontally in a consistent container.
 */
const PaymentMethodLogo: React.FC<PaymentMethodLogoProps> = ({
  type,
  size = "lg",
  className,
}) => {
  const config = PAYMENT_METHOD_LOGO_CONFIG[type];
  if (!config) return null;

  return (
    <div className={clsx(container({ size }), className)}>
      <img
        src={config.src}
        alt={config.label}
        className="block h-auto w-full max-h-full max-w-[60px]"
      />
    </div>
  );
};

PaymentMethodLogo.displayName = "KaizenPaymentMethodLogo";

export default PaymentMethodLogo;
