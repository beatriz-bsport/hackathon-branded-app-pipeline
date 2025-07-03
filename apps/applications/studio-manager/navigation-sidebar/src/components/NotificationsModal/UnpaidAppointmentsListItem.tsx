import { type FC } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export type UnpaidAppointmentsListItemProps = {
  id: string;
  memberId: number;
  title: string;
  memberName: string;
  dateStart: string;
  creditsDue: number;
};

/**
 * UnpaidAppointmentsListItem displays unpaid appointment notification information.
 *
 * This component renders a list item with appointment details including title, description,
 * member name, appointment date, and the number of credits due.
 *
 * @param {UnpaidAppointmentsListItemProps} props - The component props
 * @param {string} props.id - The ID of the private booking
 * @param {string} props.memberId - The ID of the member
 * @param {string} props.title - The main title of the notification
 * @param {string} props.memberName - The name of the member with the unpaid appointment
 * @param {string} props.dateStart - The start date of the appointment
 * @param {number} props.creditsDue - The number of credits due for the appointment
 *
 * @returns {JSX.Element} A styled list item component for unpaid appointment notifications
 */
const UnpaidAppointmentsListItem: FC<UnpaidAppointmentsListItemProps> = ({
  id,
  memberId,
  title,
  memberName,
  dateStart,
  creditsDue,
}) => {
  const { t, i18n } = useTranslation("default");
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStart));

  return (
    <a
      href={`${LEGACY_URLS.member}/${memberId}/private-booking/${id}`}
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
              weight="bold"
              className="block truncate break-word"
            >
              {title}
            </Body>
            <Body
              htmlVariant="span"
              size="sm"
              color="weak"
              className="block truncate break-word"
            >
              {memberName}
            </Body>
          </div>
        </div>

        {/* Right column with credits due and date */}
        <div className="flex flex-col items-end justify-center gap-2xs">
          <div className="flex items-center">
            <Body htmlVariant="span" size="md" color="warning">
              {t("notifications.unpaidAppointments.credits")}:
            </Body>
            <Body
              htmlVariant="span"
              size="md"
              color="warning"
              className="ml-2xs"
            >
              ({creditsDue})
            </Body>
          </div>
          <Body htmlVariant="span" size="sm" color="weak">
            {formattedDate}
          </Body>
        </div>
      </div>
    </a>
  );
};

export default UnpaidAppointmentsListItem;
