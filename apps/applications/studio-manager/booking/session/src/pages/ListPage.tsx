import { ListLayout } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SessionTable } from "../components/SessionList/SessionTable";
import { useTableRowData } from "../hooks/stores-interface";
import { useFetchEstablishments } from "../hooks/useFetchEstablishments";
import { useFetchSessions } from "../hooks/useFetchSessions";
import { useFetchTeachers } from "../hooks/useFetchTeachers";

const ListPage: React.FC = () => {
  const { t } = useTranslation("sessionList");
  const { isLoading: isLoadingTeachers, fetchTeachers } = useFetchTeachers();
  const { isLoading: isLoadingEstablishments, fetchEstablishments } =
    useFetchEstablishments();
  const { isLoading: isLoadingSessions } = useFetchSessions({
    onSuccess: ({ teacherIds, establishmentIds }) => {
      if (teacherIds.length > 0) {
        fetchTeachers({ teacherIds });
      }
      if (establishmentIds.length > 0) {
        fetchEstablishments({ establishmentIds });
      }
    },
  });

  // TODO: merge all the fetching hooks together for clarity.
  const renderedSessions = useTableRowData();

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
