import React, { useEffect } from "react";

import { Card, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { HomepageSection } from "#src/components/HomepageSection";
import { useFetchSessions } from "#src/hooks/useFetchSessions";
import { useFetchSubstitutionRequests } from "#src/hooks/useFetchSubstitutionRequests";
import { useFetchTeachers } from "#src/hooks/useFetchTeachers";
import { useTranslation } from "#src/utils/i18n";

import { UpcomingActivitiesList } from "./upcoming-activities-list.component";
import { UpcomingActivitiesTable } from "./upcoming-activities-table.component";

export const UpcomingActivities: React.FC = () => {
  const { t } = useTranslation("default");
  const { isLoading: isLoadingTeachers, fetchTeachers } = useFetchTeachers();

  const isMobile = !useMatchMedia("md");

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

  useEffect(() => {
    fetchManagerSessions();
  }, [fetchManagerSessions, fetchSubstitutionRequests]);

  const isLoading =
    isLoadingSessions || isLoadingTeachers || isLoadingSubstitutionRequests;

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
        {isMobile ? (
          <UpcomingActivitiesList isLoading={isLoading} />
        ) : (
          <UpcomingActivitiesTable isLoading={isLoading} />
        )}
      </Card>
    </HomepageSection>
  );
};
