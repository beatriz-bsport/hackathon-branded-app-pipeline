import { FC } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import { useFetchActiveBookingOptionsCount } from "#src/hooks/waitlist/use-fetch-active-booking-options-count.js";
import { useTranslation } from "#src/utils/i18n.js";

export const WaitlistCounter: FC<{
  sessionId: number;
  waitlistCapacity: number;
}> = ({ sessionId, waitlistCapacity }) => {
  const { t } = useTranslation("sessionManagement");

  const activeBookingOptionsCount =
    useFetchActiveBookingOptionsCount(sessionId);

  return (
    <div className="flex gap-sm items-center">
      <Body size="lg" weight="weak" color="weaker">
        •
      </Body>
      <Body size="lg" weight="weak" color="weaker">
        {t("waitlistSectionSubtitle", {
          bookingOptionsCount: activeBookingOptionsCount,
          waitlistCapacity,
        })}
      </Body>
    </div>
  );
};
