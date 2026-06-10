import { FC } from "react";

import type { GroupSession, MetaActivity } from "@bsport/api-book";
import { Level } from "@bsport/api-core";
import { Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const GroupSessionHeader: FC<{
  groupSession: GroupSession;
  metaActivity: MetaActivity;
  level: Level;
}> = ({ groupSession, metaActivity, level }) => {
  const { t } = useTranslation("sessionManagement");

  const seriesRule = groupSession.full_booking_only
    ? groupSession.allow_booking_after_start
      ? t("bookingFlow.sessionSelection.openSeries")
      : t("bookingFlow.sessionSelection.fullSeries")
    : t("bookingFlow.sessionSelection.flexibleSeries");

  const rows = [
    [t("bookingFlow.sessionSelection.series"), groupSession.name],
    [t("bookingFlow.sessionSelection.classTemplate"), metaActivity.name],
    [t("bookingFlow.sessionSelection.level"), level.name],
    [t("bookingFlow.sessionSelection.seriesRule"), seriesRule],
  ] as const;

  return (
    <div className="flex gap-md">
      <div className="flex flex-col gap-2xs">
        {rows.map(([label]) => (
          <Body key={label} size="md" weight="weak" color="weak">
            {label}
          </Body>
        ))}
      </div>
      <div className="flex flex-col gap-2xs">
        {rows.map(([label, value]) => (
          <Body key={label} size="md" weight="weak">
            {value}
          </Body>
        ))}
      </div>
    </div>
  );
};
