import React, { useEffect } from "react";

import { Card, Table } from "@bsport/kaizen-primitive-core";

import { HomepageSection } from "#src/components/HomepageSection";
import { useFetchSessions } from "#src/hooks/useFetchSessions";
import { useFetchSubstitutionRequests } from "#src/hooks/useFetchSubstitutionRequests";
import { useFetchTeachers } from "#src/hooks/useFetchTeachers";
import { useTranslation } from "#src/utils/i18n";

import { useUpcomingActivitiesColumns } from "./columns";
import { useUpcomingActivitiesRows } from "./rows";

export const UpcomingActivities: React.FC = () => {
  const { t } = useTranslation("default");

  const { isLoading: isLoadingTeachers, fetchTeachers } = useFetchTeachers();

  const {
    isLoading: isLoadingSubstitutionRequests,
    fetchSubstitutionRequests,
  } = useFetchSubstitutionRequests();

  const { isLoading: isLoadingSessions, fetchManagerSessions } =
    useFetchSessions({
      onSuccess: ({ teacherIds, sessionIds }) => {
        fetchTeachers({ teacherIds });
        if (sessionIds.length > 0) {
          fetchSubstitutionRequests({ sessionIds });
        }
      },
    });

  const rows = useUpcomingActivitiesRows();
  const hideSubstitute = !rows.some(
    (row) => row.teacherSubstituteRequired || row.teacherSubstituteName,
  );
  const columns = useUpcomingActivitiesColumns({ hideSubstitute });

  useEffect(() => {
    fetchManagerSessions();
  }, [fetchManagerSessions, fetchSubstitutionRequests]);

  return (
    <HomepageSection
      title={t("upcomingClassesPanel.title")}
      className="-mt-[12px]"
    >
      <Card
        elevated
        padding="none"
        className="overflow-scroll mt-md max-h-[370px] min-h-[var(--card-min-height)]"
        style={{ "--card-min-height": "100px" }}
      >
        <Table
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
            isLoading:
              isLoadingSessions ||
              isLoadingTeachers ||
              isLoadingSubstitutionRequests,
            className: "h-[var(--card-min-height)]",
          }}
          withHorizontalDivider={false}
        />
      </Card>
    </HomepageSection>
  );
};
