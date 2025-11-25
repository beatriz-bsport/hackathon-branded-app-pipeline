import React from "react";

import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { toDateTime } from "@bsport/datetime-manipulation";
import { Body, Title } from "@bsport/kaizen-primitive-core";

import type { EnrichedSession } from "../../stores/session-list";
import { useTranslation } from "../../utils/i18n";

export type SessionDayTitleProps = {
  date: Date;
  sessions: EnrichedSession[];
};

export const SessionDayTitle: React.FC<SessionDayTitleProps> = ({
  date,
  sessions,
}) => {
  const { t } = useTranslation("sessionList");
  const todayTitle = formatDateTimeFromDate(
    toDateTime(date),
    DATETIME_FORMATS.HUGE_DATE,
  );

  const totalEffectif = sessions.reduce(
    (acc, session) => acc + session.effectif,
    0,
  );
  const totalOccupancy = sessions.reduce(
    (acc, session) => acc + session.nb_bookings,
    0,
  );

  const occupancyRate = totalEffectif
    ? Math.round((totalOccupancy / totalEffectif) * 100)
    : 0;

  return (
    <div className="mb-sm flex items-center gap-xs px-md">
      <Title htmlVariant="h2" weight="strong">
        {todayTitle}
      </Title>
      <Body size="md" weight="weak" color="weak" htmlVariant="span">
        · {t("title.occupancyRate", { rate: occupancyRate })}
      </Body>
    </div>
  );
};
