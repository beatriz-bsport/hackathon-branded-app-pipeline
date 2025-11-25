import type { FC } from "react";

import { formatPriceWithCurrency } from "@bsport/currency";
import { Body } from "@bsport/kaizen-primitive-core";

import { NavigationLink } from "#src/components/NavigationLink";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { NotificationItemLayout } from "./NotificationItemLayout";
import { useNotificationsNavigation } from "./NotificationsNavigationContext";

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
  const { navigateAndClose } = useNotificationsNavigation();

  const formatCurrencyValue = (amount: number) => {
    return formatPriceWithCurrency(amount, currencySymbol);
  };

  const renderItem = () => (
    <NotificationItemLayout
      leftContent={
        <>
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
        </>
      }
      rightContent={
        <>
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
        </>
      }
    />
  );

  return (
    <NavigationLink
      item={{ id, href: `${LEGACY_URLS.invoice}/${id}`, revamped: false }}
      renderElement={renderItem}
      navigate={navigateAndClose}
      wrapperConfig={{
        withOnClick: true,
        className: [
          "relative flex",
          "min-h-2xl py-xs px-md gap-xs",
          "border-b-stroke-thin border-b-stroke-divider",
          "hover:bg-surface-action-default-weak-hovered",
          "hover:cursor-pointer",
          "active:bg-surface-action-default-weak-pressed",
        ].join(" "),
        tabIndex: 0,
      }}
    />
  );
};

export default BillingListItem;
