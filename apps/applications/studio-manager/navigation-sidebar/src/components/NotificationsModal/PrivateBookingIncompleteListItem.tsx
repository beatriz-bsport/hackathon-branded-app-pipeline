import type { FC } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import { NavigationLink } from "#src/components/NavigationLink";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { useDateFormatter } from "#src/utils/use-date-formatter";

import { NotificationItemLayout } from "./NotificationItemLayout";
import { useNotificationsNavigation } from "./NotificationsNavigationContext";

export type PrivateBookingIncompleteListItemProps = {
  id: string;
  name: string;
  userName: string;
  dateStart: string;
  memberId: number;
  privateBooking: number;
};
const PrivateBookingIncompleteListItem: FC<
  PrivateBookingIncompleteListItemProps
> = ({ id, name, userName, dateStart, memberId, privateBooking }) => {
  const { t } = useTranslation("default");
  const { formatShort } = useDateFormatter();
  const { navigateAndClose } = useNotificationsNavigation();

  const url = `${LEGACY_URLS.member}/${memberId}/private-booking/${privateBooking}`;

  const renderItem = () => (
    <NotificationItemLayout
      leftContent={
        <>
          <Body
            htmlVariant="span"
            size="lg"
            className="block truncate break-word"
          >
            {name}
          </Body>
          <Body
            htmlVariant="span"
            size="md"
            color="weak"
            className="block truncate break-word"
          >
            {t("notifications.privateBookingIncomplete.member", { userName })}
          </Body>
          <Body
            htmlVariant="span"
            size="md"
            color="weak"
            className="block truncate break-word"
          >
            {t("notifications.privateBookingIncomplete.date", {
              date: formatShort(dateStart),
            })}
          </Body>
        </>
      }
    />
  );

  return (
    <NavigationLink
      item={{ id, href: url, revamped: false }}
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

export default PrivateBookingIncompleteListItem;
