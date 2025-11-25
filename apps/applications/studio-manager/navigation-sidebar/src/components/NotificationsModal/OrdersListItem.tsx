import type { FC } from "react";

import { formatPriceWithCurrency } from "@bsport/currency";
import { Body } from "@bsport/kaizen-primitive-core";

import { NavigationLink } from "#src/components/NavigationLink";
import { LEGACY_URLS } from "#src/urls";
import { Trans } from "#src/utils/i18n";

import { NotificationItemLayout } from "./NotificationItemLayout";
import { useNotificationsNavigation } from "./NotificationsNavigationContext";

export type OrdersListItemProps = {
  id: string;
  title: string;
  price: number;
  currencySymbol: string;
  name: string;
};

/**
 * OrdersListItem displays order notification information in a structured format.
 *
 * This component renders a list item with order details including title, description,
 * member name, and price. It formats currency values using the provided currency symbol.
 *
 * @param {OrdersListItemProps} props - The component props
 * @param {string} props.title - The main title of the order notification
 * @param {number} props.price - The price of the order
 * @param {string} props.currencySymbol - The currency symbol to display with the price
 * @param {string} props.name - The name of the member who placed the order
 *
 * @returns {JSX.Element} A styled list item component for order notifications
 */
const OrdersListItem: FC<OrdersListItemProps> = ({
  id,
  title,
  price,
  currencySymbol,
  name,
}) => {
  const { navigateAndClose } = useNotificationsNavigation();
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
            <Trans
              i18nKey="notifications.orders.paidByFormat"
              values={{ name }}
              components={{
                strong: <strong></strong>,
              }}
            />
          </Body>
        </>
      }
      rightContent={
        <Body htmlVariant="span" size="md" className="font-medium">
          {formatPriceWithCurrency(price, currencySymbol)}
        </Body>
      }
    />
  );

  return (
    <NavigationLink
      item={{ id, href: `${LEGACY_URLS.order}/${id}`, revamped: false }}
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

export default OrdersListItem;
