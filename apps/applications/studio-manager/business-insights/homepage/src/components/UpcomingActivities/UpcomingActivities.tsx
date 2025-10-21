import React, { useEffect } from "react";

import { Card, Table, Title } from "@bsport/kaizen-primitive-core";

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
    <section>
      <Title htmlVariant="h2" weight="strong" className="mb-md">
        {t("upcomingActivitiesPanel.title")}
      </Title>
      <Card elevated padding="default" className="overflow-x-scroll">
        <Table
          columns={columns}
          rows={rows}
          withVerticalBorders={false}
          emptyStateProps={{
            isEmpty: rows.length === 0,
            emptyConfig: {
              title: t("upcomingActivitiesPanel.emptyList"),
            },
          }}
          loadingProps={{
            isLoading:
              isLoadingSessions ||
              isLoadingTeachers ||
              isLoadingSubstitutionRequests,
          }}
          hideHeader
        />
      </Card>
    </section>
  );
};
