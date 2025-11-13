import { useEffect } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SessionTable } from "../components/SessionList/SessionTable";
import { useFetchSessions } from "../hooks/useFetchSessions";

const ListPage: React.FC = () => {
  const { t } = useTranslation("sessionList");
  const { sessions, isLoading, fetchManagerSessions } = useFetchSessions();

  // -- Load data
  useEffect(() => {
    fetchManagerSessions();
  }, [fetchManagerSessions]);

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("header")} />
      <ListLayout.Content>
        <SessionTable sessions={sessions} isLoading={isLoading} />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
