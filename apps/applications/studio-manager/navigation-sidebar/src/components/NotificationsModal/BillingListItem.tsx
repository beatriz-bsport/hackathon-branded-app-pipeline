import type { FC } from "react";

import { formatPriceWithCurrency } from "@bsport/currency";
import { Body } from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export type BillingListItemProps = {
  id: string;
  title: string;
  description: string;
  paidAmount: number;
  dueAmount: number;
  currencySymbol: string;
};

/**
 * BillingListItem displays billing notification information in a structured format.
 *
 * This component renders a list item with billing details including title, description,
 * paid amount, and due amount. It formats currency values using the provided currency symbol
 * and highlights due amounts with a warning color for better visibility.
 *
 * @param {BillingListItemProps} props - The component props
 * @param {string} props.title - The main title of the billing notification
 * @param {string} props.description - Additional descriptive text for the notification
 * @param {number} props.paidAmount - The amount already paid
 * @param {number} props.dueAmount - The amount still due
 * @param {string} props.currencySymbol - The currency symbol to display with amounts
 *
 * @returns {JSX.Element} A styled list item component for billing notifications
 */
const BillingListItem: FC<BillingListItemProps> = ({
  id,
  title,
  description,
  paidAmount,
  dueAmount,
  currencySymbol,
}) => {
  const { t } = useTranslation("default");

  const formatCurrencyValue = (amount: number) => {
    return formatPriceWithCurrency(amount, currencySymbol);
  };

  return (
    <a
      href={`${LEGACY_URLS.invoice}/${id}`}
      className="relative flex min-h-2xl py-xs px-md gap-xs border-b-stroke-thin border-b-stroke-divider hover:bg-surface-action-default-weak-hovered active:bg-surface-action-default-weak-pressed"
      tabIndex={0}
    >
      <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] w-full gap-xs items-center">
        {/* Left column with title and description */}
        <div className="flex items-center gap-xs">
          <div className="flex-1 min-w-0">
            <Body
              htmlVariant="span"
              size="lg"
              className="block truncate break-word"
            >
              {title}
            </Body>
            <Body
              htmlVariant="span"
              size="md"
              color="weak"
              className="block truncate break-word"
            >
              {description}
            </Body>
          </div>
        </div>

        {/* Right column with paid and due amounts */}
        <div className="flex flex-col items-end justify-center gap-2xs">
          <div className="flex items-center">
            <Body htmlVariant="span" size="md">
              {t("notifications.billing.paid")}
            </Body>
            <Body htmlVariant="span" size="md" className="ml-2xs">
              {formatCurrencyValue(paidAmount)}
            </Body>
          </div>
          <div className="flex items-center">
            <Body htmlVariant="span" size="md">
              {t("notifications.billing.due")}
            </Body>
            <Body
              htmlVariant="span"
              size="md"
              color="warning"
              className="ml-2xs"
            >
              {formatCurrencyValue(dueAmount)}
            </Body>
          </div>
        </div>
      </div>
    </a>
  );
};

export default BillingListItem;
