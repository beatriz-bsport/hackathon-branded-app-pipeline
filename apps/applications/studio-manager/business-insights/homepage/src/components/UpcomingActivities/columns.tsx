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
    header: t("upcomingClassesPanel.headers.class"),
    cellsClassName: "max-w-[180px] md:max-w-[250px]",
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
    header: t("upcomingClassesPanel.headers.teacher"),
    cellsClassName: "max-w-[140px] md:max-w-[200px]",
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
    header: t("upcomingClassesPanel.headers.teacherSubstitution"),
    cellsClassName: "max-w-[140px] md:max-w-[200px]",
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
    header: t("upcomingClassesPanel.headers.classFillRate"),
    render: (row) => {
      const rate = row.fillRate;
      const hasPeopleInWaitingList =
        row.hasWaitingList && row.waitingListCount > 0;

      let rateColor: ChipProps["color"];
      let rateIcon: IconName;
      if (rate < 50) {
        rateColor = "critical";
        rateIcon = "alert-circle";
      } else if (rate < 70) {
        rateColor = "warning";
        rateIcon = "contrast-02";
      } else if (rate <= RATE_FULL && !hasPeopleInWaitingList) {
        rateColor = "positive";
        rateIcon = "check-circle";
      } else {
        // Display waiting list info instead
        rateColor = "info";
        rateIcon = "user-02";
      }

      /**
       * Badge label: 2 cases, whether there is a waiting list
       * If yes, display the number of people waiting
       */
      const label = hasPeopleInWaitingList
        ? t("upcomingClassesPanel.rates.badge.waitingCount", {
            count: row.waitingListCount,
          })
        : `${rate}%`;

      /**
       * Tooltip: 3 cases, whether there is a waiting list and empty spots
       */
      let tooltip: string = "";
      if (rate === RATE_FULL) {
        tooltip = t("upcomingClassesPanel.rates.tooltip.classIsFull");
      } else {
        const waitlistSpotsMessage = t(
          // @ts-expect-error Can not detect plural for now
          "upcomingClassesPanel.rates.tooltip.hasEmptySpotsForWaitlist",
          { count: row.emptySpotsCount },
        ) as string;
        const emptySpotsMessage = t(
          // @ts-expect-error Can not detect plural for now
          "upcomingClassesPanel.rates.tooltip.hasEmptySpots",
          { count: row.emptySpotsCount },
        ) as string;
        tooltip = hasPeopleInWaitingList
          ? waitlistSpotsMessage
          : emptySpotsMessage;
      }

      return (
        <Tooltip placement="top-right" label={tooltip}>
          <Chip
            type="weak"
            size="lg"
            color={rateColor}
            iconLeft={rateIcon}
            label={label}
          />
        </Tooltip>
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
