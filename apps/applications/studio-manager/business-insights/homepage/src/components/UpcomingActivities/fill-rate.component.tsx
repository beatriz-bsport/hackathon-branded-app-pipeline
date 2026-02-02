import type { FC } from "react";

import type { ChipProps, IconName } from "@bsport/kaizen-primitive-core";
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

  // Determine occupancy chip color and icon
  let rateColor: ChipProps["color"];
  let rateIcon: IconName;
  if (fillRate < 50) {
    rateColor = "critical";
    rateIcon = "alert-circle";
  } else if (fillRate < 70) {
    rateColor = "warning";
    rateIcon = "contrast-02";
  } else {
    rateColor = "positive";
    rateIcon = "check-circle";
  }

  // Occupancy tooltip
  const occupancyTooltip: string =
    fillRate >= RATE_FULL
      ? t("upcomingClassesPanel.rates.tooltip.classIsFull")
      : t("upcomingClassesPanel.rates.tooltip.hasEmptySpots", {
          count: emptySpotsCount,
        });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2xs ">
      <div className="h-6 flex items-center">
        <Tooltip placement={tooltipPlacement} label={occupancyTooltip}>
          <Chip
            type="weak"
            size="lg"
            color={rateColor}
            iconLeft={rateIcon}
            label={`${fillRate}%`}
          />
        </Tooltip>
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
