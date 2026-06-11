import { formatClockTimeFromParts } from "@bsport/datetime-formatting";
import {
  Avatar,
  Body,
  type GenericTableColumn,
  Icon,
} from "@bsport/kaizen-primitive-core";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { LEGACY_URLS } from "#src/urls";
import type { TFunction } from "#src/utils/i18n";

import type { RecurringBookingRow } from "./build-recurring-booking-rows";
import { getWeekdayTranslationKey } from "./schedule-label";

export const buildRecurringBookingColumns = (
  t: TFunction,
  canAccessProfile: boolean,
  locale?: string,
): GenericTableColumn<RecurringBookingRow>[] => [
  {
    header: t("sessionPanel.recurringBookings.columns.client"),
    id: "client",
    type: "custom",
    render: (row) => (
      <div className="flex items-center gap-md">
        <Avatar
          shape="round"
          src={row.memberPhoto}
          initials={row.memberInitials}
          alt={row.memberName}
        />
        <Body size="lg">{row.memberName}</Body>
      </div>
    ),
  },
  {
    header: t("sessionPanel.recurringBookings.columns.schedule"),
    id: "schedule",
    type: "custom",
    render: (row) => (
      <Body htmlVariant="span">
        {t("sessionPanel.recurringBookings.schedule", {
          weekday: t(getWeekdayTranslationKey(row.dayOfWeek), { ns: "common" }),
          time: formatClockTimeFromParts(row.hour, row.minute, { locale }),
        })}
      </Body>
    ),
  },
  {
    header: t("sessionPanel.recurringBookings.columns.week"),
    id: "week",
    type: "custom",
    render: (row) => <Body htmlVariant="span">{row.week}</Body>,
  },
  {
    header: "",
    id: "open",
    type: "custom",
    align: "end",
    render: (row) => {
      const icon = <Icon icon="link-external-02" size="sm" />;
      return canAccessProfile ? (
        <a
          href={LEGACY_URLS.MEMBER_BOOKINGS(row.memberId)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("sessionPanel.recurringBookings.openMemberAriaLabel")}
          // mr-xs: right-edge inset to mirror the series/occurrence table trailing link.
          className="mr-xs text-onsurface-weak hover:text-onsurface-default"
          onClick={(e) => e.stopPropagation()}
        >
          {icon}
        </a>
      ) : (
        <ResponsiveTooltip
          label={t("sessionPanel.recurringBookings.noAccessTooltip")}
          placement="left"
          className="whitespace-normal"
        >
          <span className="mr-xs text-onsurface-disabled cursor-not-allowed">
            {icon}
          </span>
        </ResponsiveTooltip>
      );
    },
  },
];
