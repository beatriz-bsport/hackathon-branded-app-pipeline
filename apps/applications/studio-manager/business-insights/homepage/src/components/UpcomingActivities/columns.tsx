import React from "react";

import {
  Body,
  Chip,
  type ChipProps,
  type GenericTableColumn,
  type IconName,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { TableRowData } from "./types";

type TableColumn = GenericTableColumn<TableRowData>;

const RATE_FULL = 100;

// eslint-disable-next-line react-refresh/only-export-components
const BodyWithSubtext: React.FC<{
  text: string;
  subtext: string;
  hasErrorStatus?: boolean;
}> = ({ text, subtext, hasErrorStatus }) => {
  return (
    <div className="min-w-0">
      <Body
        size="lg"
        color={hasErrorStatus ? "critical" : "default"}
        className="break-words whitespace-normal"
      >
        {text}
      </Body>
      <Body color="weak" className="break-words whitespace-normal text-sm">
        {subtext}
      </Body>
    </div>
  );
};

export const useUpcomingActivitiesColumns = ({
  hideSubstitute = false,
}: {
  hideSubstitute: boolean;
}) => {
  const { t } = useTranslation("default");

  const columnName: TableColumn = {
    id: "homepage-activities-name",
    type: "custom",
    align: "start",
    header: (
      <span className="whitespace-normal">
        {t("upcomingClassesPanel.headers.class")}
      </span>
    ),
    cellsClassName: "max-w-[100px] md:max-w-none",
    render: (row) => {
      return (
        <BodyWithSubtext text={row.activityName} subtext={row.activityDate} />
      );
    },
  };

  const columnTeacher: TableColumn = {
    id: "homepage-activities-teacher",
    type: "custom",
    align: "start",
    header: (
      <span className="whitespace-normal">
        {t("upcomingClassesPanel.headers.teacher")}
      </span>
    ),
    cellsClassName: "max-w-[90px] md:max-w-none",
    render: (row) => {
      return (
        <BodyWithSubtext
          text={row.teacherName}
          subtext={t("upcomingClassesPanel.teacher.helperText")}
        />
      );
    },
  };

  const columnSubstitute: TableColumn = {
    id: "homepage-activities-substitute",
    type: "custom",
    align: "start",
    header: (
      <span className="whitespace-normal">
        {t("upcomingClassesPanel.headers.teacherSubstitution")}
      </span>
    ),
    cellsClassName: "max-w-[90px] md:max-w-none",
    render: (row) => {
      const { teacherSubstituteName, teacherSubstituteRequired } = row;

      if (!teacherSubstituteName && !teacherSubstituteRequired) return null;

      const hasErrorStatus = !teacherSubstituteName;
      const text = hasErrorStatus
        ? t("upcomingClassesPanel.substitution.errorMissingReplacement")
        : teacherSubstituteName;

      return (
        <BodyWithSubtext
          text={text}
          subtext={t("upcomingClassesPanel.substitution.helperText")}
          hasErrorStatus={hasErrorStatus}
        />
      );
    },
  };

  const columnFillRate: TableColumn = {
    id: "homepage-activities-fill-rate",
    type: "custom",
    align: "center",
    header: (
      <span className="whitespace-normal">
        {t("upcomingClassesPanel.headers.classFillRate")}
      </span>
    ),
    render: (row) => {
      const rate = row.fillRate;
      const hasPeopleInWaitingList =
        row.hasWaitingList && row.waitingListCount > 0;

      // Determine occupancy chip color and icon
      let rateColor: ChipProps["color"];
      let rateIcon: IconName;
      if (rate < 50) {
        rateColor = "critical";
        rateIcon = "alert-circle";
      } else if (rate < 70) {
        rateColor = "warning";
        rateIcon = "contrast-02";
      } else {
        rateColor = "positive";
        rateIcon = "check-circle";
      }

      // Occupancy tooltip
      const occupancyTooltip: string =
        rate >= RATE_FULL
          ? t("upcomingClassesPanel.rates.tooltip.classIsFull")
          : t("upcomingClassesPanel.rates.tooltip.hasEmptySpots", {
              count: row.emptySpotsCount,
            });

      return (
        <div className="flex flex-col sm:flex-row items-center gap-2xs ">
          <div className="h-6 flex items-center">
            <Tooltip placement="top" label={occupancyTooltip}>
              <Chip
                type="weak"
                size="lg"
                color={rateColor}
                iconLeft={rateIcon}
                label={`${rate}%`}
              />
            </Tooltip>
          </div>
          {hasPeopleInWaitingList && (
            <div className="h-6 flex items-center">
              <Tooltip
                placement="top"
                label={t("upcomingClassesPanel.rates.badge.waitingCount", {
                  count: row.waitingListCount,
                })}
              >
                <Chip
                  type="weak"
                  size="lg"
                  color="info"
                  iconLeft="clock"
                  label={`${row.waitingListCount}`}
                />
              </Tooltip>
            </div>
          )}
        </div>
      );
    },
  };

  return [
    columnName,
    columnTeacher,
    hideSubstitute ? undefined : columnSubstitute,
    columnFillRate,
  ].filter((col) => !!col);
};
