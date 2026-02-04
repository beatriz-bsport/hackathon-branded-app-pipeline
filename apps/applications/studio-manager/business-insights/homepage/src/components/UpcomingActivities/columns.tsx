import React from "react";

import {
  Body,
  type GenericTableColumn,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { UpcomingActivityFillRate } from "./fill-rate.component";
import type { TableRowData } from "./types";

type TableColumn = GenericTableColumn<TableRowData>;

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

  const isLargeScreen = useMatchMedia("lg");

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
      return (
        <UpcomingActivityFillRate
          emptySpotsCount={row.emptySpotsCount}
          fillRate={row.fillRate}
          hasWaitingList={row.hasWaitingList}
          waitingListCount={row.waitingListCount}
          tooltipPlacement={isLargeScreen ? "top" : "top-right"}
        />
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
