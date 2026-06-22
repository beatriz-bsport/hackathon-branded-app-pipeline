import type { FC } from "react";

import { FillRateChip } from "@bsport/kaizen-business-components/booking/fill-rate-chip";
import { Chip, Tooltip } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type UpcomingActivityFillRateProps = {
  fillRate: number;
  waitingListCount: number;
  hasWaitingList: boolean;
  emptySpotsCount: number;
  tooltipPlacement?: "top" | "top-right";
};

const RATE_FULL = 100;

export const UpcomingActivityFillRate: FC<UpcomingActivityFillRateProps> = ({
  fillRate,
  waitingListCount,
  hasWaitingList,
  emptySpotsCount,
  tooltipPlacement = "top",
}) => {
  const { t } = useTranslation("default");

  const hasPeopleInWaitingList = hasWaitingList && waitingListCount > 0;

  const occupancyTooltip: string =
    fillRate >= RATE_FULL
      ? t("upcomingClassesPanel.rates.tooltip.classIsFull")
      : t("upcomingClassesPanel.rates.tooltip.hasEmptySpots", {
          count: emptySpotsCount,
        });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2xs ">
      <div className="h-6 flex items-center">
        <FillRateChip
          fillRate={fillRate}
          tooltipLabel={occupancyTooltip}
          tooltipPlacement={tooltipPlacement}
        />
      </div>
      {hasPeopleInWaitingList && (
        <div className="h-6 flex items-center">
          <Tooltip
            placement={tooltipPlacement}
            label={t("upcomingClassesPanel.rates.badge.waitingCount", {
              count: waitingListCount,
            })}
          >
            <Chip
              type="weak"
              size="lg"
              color="info"
              iconLeft="clock"
              label={waitingListCount.toString()}
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
};
