import { useMemo } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SessionTable } from "../components/SessionList/SessionTable";
import { useFetchEstablishments } from "../hooks/useFetchEstablishments";
import { useFetchSessions } from "../hooks/useFetchSessions";
import { useFetchTeachers } from "../hooks/useFetchTeachers";

const ListPage: React.FC = () => {
  const { t } = useTranslation("sessionList");
  const {
    teachers,
    isLoading: isLoadingTeachers,
    fetchTeachers,
  } = useFetchTeachers();
  const {
    establishments,
    isLoading: isLoadingEstablishments,
    fetchEstablishments,
  } = useFetchEstablishments();
  const { sessions, isLoading: isLoadingSessions } = useFetchSessions({
    onSuccess: ({ teacherIds, establishmentIds }) => {
      fetchTeachers({ teacherIds });
      fetchEstablishments({ establishmentIds });
    },
  });

  const renderedSessions = useMemo(
    () =>
      sessions.map((session) => {
        const originalTeacher = teachers.find((t) => t.id === session.coach);
        const overrideTeacher = teachers.find(
          (t) => t.id === session.coach_override,
        );
        const establishment = establishments.find(
          (e) => e.id === session.establishment,
        );

        return {
          ...session,
          teacherName: overrideTeacher?.name ?? originalTeacher?.name,
          originalTeacherName: originalTeacher?.name,
          establishmentName: establishment?.title,
        };
      }),
    [sessions, teachers, establishments],
  );

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("header")} />
      <ListLayout.Content>
        <SessionTable
          sessions={renderedSessions}
          isLoading={
            isLoadingSessions || isLoadingTeachers || isLoadingEstablishments
          }
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
