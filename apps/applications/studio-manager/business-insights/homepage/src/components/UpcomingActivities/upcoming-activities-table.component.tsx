import type { FC } from "react";

import { Table } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useUpcomingActivitiesColumns } from "./columns";
import { useUpcomingActivitiesRows } from "./rows";

type UpcomingActivitiesTableProps = {
  isLoading: boolean;
};

export const UpcomingActivitiesTable: FC<UpcomingActivitiesTableProps> = ({
  isLoading,
}) => {
  const { t } = useTranslation("default");

  const rows = useUpcomingActivitiesRows();
  const hideSubstitute = !rows.some(
    (row) => row.teacherSubstituteRequired || row.teacherSubstituteName,
  );
  const columns = useUpcomingActivitiesColumns({ hideSubstitute });

  return (
    <Table
      id="upcoming-classes-table"
      columns={columns}
      rows={rows}
      withVerticalBorders={false}
      emptyStateProps={{
        isEmpty: rows.length === 0,
        emptyConfig: {
          title: t("upcomingClassesPanel.emptyList"),
        },
      }}
      loadingProps={{
        isLoading,
        className: "h-[var(--card-min-height)]",
      }}
      withHorizontalDivider={false}
    />
  );
};
