import type { FC } from "react";

import type { BillingPlanPause } from "@bsport/api-buyables/billing-plan";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Body, Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type Props = {
  pauses: BillingPlanPause[];
};

const formatPauseDate = (date: string) =>
  formatDateTime(date, DATETIME_FORMATS.DAY_MONTH);

const toLocalMidnight = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const MembershipPlanPauseList: FC<Props> = ({ pauses }) => {
  const { t } = useTranslation("membership-plan");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <section className="flex flex-col gap-xs">
      <Body size="md" weight="strong">
        {t("panel.details.pauses.title")}
      </Body>

      {pauses.length === 0 ? (
        <Body size="sm" color="weak">
          {t("panel.details.pauses.empty")}
        </Body>
      ) : (
        <div className="flex flex-col gap-xs">
          {pauses.map((pause) => {
            const isOngoing =
              toLocalMidnight(pause.from_date) <= today &&
              today <= toLocalMidnight(pause.until_date);

            return (
              <div key={pause.id} className="flex flex-row items-center gap-xs">
                <div className="flex flex-col gap-2xs flex-1">
                  <Body size="md">
                    {t("panel.details.pauses.range", {
                      fromDate: formatPauseDate(pause.from_date),
                      untilDate: formatPauseDate(pause.until_date),
                    })}
                  </Body>
                  <Body size="sm" color="weak">
                    {pause.name}
                  </Body>
                </div>
                <div className="flex flex-row gap-2xs">
                  <Button
                    kind="icon-button"
                    intent="flat"
                    color="default"
                    size="sm"
                    icon="calendar-minus-02"
                    label={t("panel.details.pauses.cancel")}
                    disabled={isOngoing}
                    // TODO: wire to cancel-pause endpoint
                    onClick={() => {}}
                  />
                  <Button
                    kind="icon-button"
                    intent="flat"
                    color="default"
                    size="sm"
                    icon="calendar"
                    label={t("panel.details.pauses.reschedule")}
                    disabled={isOngoing}
                    // TODO: wire to reschedule-pause endpoint
                    onClick={() => {}}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
