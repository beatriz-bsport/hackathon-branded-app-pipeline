import React, { useEffect, useState } from "react";

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

  // Hide headers on mobile (< 500px)
  const [hideHeader, setHideHeader] = useState(
    typeof window !== "undefined" && window.innerWidth < 500,
  );

  useEffect(() => {
    const handleResize = () => {
      setHideHeader(window.innerWidth < 500);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        className="overflow-x-auto mt-md max-h-[370px] min-h-[var(--card-min-height)] w-full"
        style={{ "--card-min-height": "100px" }}
      >
        <Table
          columns={columns}
          rows={rows}
          withVerticalBorders={false}
          hideHeader={hideHeader}
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
