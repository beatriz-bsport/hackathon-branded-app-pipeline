import type { FC } from "react";

import { formatPriceWithCurrency } from "@bsport/currency";
import { Body } from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { Trans } from "#src/utils/i18n";

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
const OrdersListItem: FC<OrdersListItemProps & { id: string }> = ({
  id,
  title,
  price,
  currencySymbol,
  name,
}) => {
  return (
    <a
      href={`${LEGACY_URLS.order}/${id}`}
      className="relative flex min-h-2xl py-xs px-md gap-xs border-b-stroke-thin border-b-stroke-divider hover:bg-surface-action-default-weak-hovered active:bg-surface-action-default-weak-pressed"
      tabIndex={0}
    >
      <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] w-full gap-xs items-center">
        {/* Left column with title, description, and member name */}
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
              <Trans
                i18nKey="notifications.orders.paidByFormat"
                values={{ name }}
                components={{
                  strong: <strong></strong>,
                }}
              />
            </Body>
          </div>
        </div>

        {/* Right column with price */}
        <div className="flex flex-col items-end justify-center">
          <Body htmlVariant="span" size="md" className="font-medium">
            {formatPriceWithCurrency(price, currencySymbol)}
          </Body>
        </div>
      </div>
    </a>
  );
};

export default OrdersListItem;
