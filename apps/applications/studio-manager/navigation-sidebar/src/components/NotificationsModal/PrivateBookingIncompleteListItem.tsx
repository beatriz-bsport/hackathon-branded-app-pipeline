import type { FC } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { useDateFormatter } from "#src/utils/use-date-formatter";

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

  const url = `${LEGACY_URLS.member}/${memberId}/private-booking/${privateBooking}`;

  return (
    <a
      id={id}
      href={url}
      className="relative flex min-h-2xl py-xs px-md gap-xs border-b-stroke-thin border-b-stroke-divider hover:bg-surface-action-default-weak-hovered active:bg-surface-action-default-weak-pressed"
      tabIndex={0}
    >
      <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] w-full gap-xs items-center">
        <div className="flex items-center gap-xs">
          <div className="flex-1 min-w-0">
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
          </div>
        </div>
      </div>
    </a>
  );
};

export default PrivateBookingIncompleteListItem;
