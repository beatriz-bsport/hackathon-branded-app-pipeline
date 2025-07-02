import React from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import { formatCurrency } from "#src/utils/currency";
import { useTranslation } from "#src/utils/i18n";

export interface BillingListItemProps {
  title: string;
  description: string;
  paidAmount: number;
  dueAmount: number;
  currency: string;
  language: string;
  isSelectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

/**
 * Custom ListItem component for billing notifications
 */
const BillingListItem: React.FC<BillingListItemProps> = ({
  title,
  description,
  paidAmount,
  dueAmount,
  currency,
  language,
}) => {
  const { t } = useTranslation("default");
  const formatCurrencyValue = (amount: number) => {
    return formatCurrency(amount, currency, language);
  };

  return (
    <div
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
    </div>
  );
};

export default BillingListItem;
