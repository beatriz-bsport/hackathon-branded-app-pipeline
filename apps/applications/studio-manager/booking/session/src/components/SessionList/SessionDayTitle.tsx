import React, { memo } from "react";

import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import type { DateTime } from "@bsport/datetime-manipulation";
import { Body, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { EnrichedSession } from "../../types";
import { computeDayOccupancyRate } from "./compute-day-occupancy-rate";

export type SessionDayTitleProps = {
  date: DateTime;
  sessions: EnrichedSession[];
};

const SessionDayTitle: React.FC<SessionDayTitleProps> = ({
  date,
  sessions,
}: SessionDayTitleProps) => {
  const { t } = useTranslation("sessionList");
  const todayTitle = formatDateTimeFromDate(date, DATETIME_FORMATS.HUGE_DATE);

  const occupancyRate = computeDayOccupancyRate(sessions);

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

export default memo(SessionDayTitle);
