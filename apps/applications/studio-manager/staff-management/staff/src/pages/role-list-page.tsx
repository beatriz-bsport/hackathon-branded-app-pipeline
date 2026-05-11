import type { FC } from "react";
import { useNavigate } from "react-router";

import { Button, ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { RoleTable } from "#src/components/role-table/role-table";
import { useRoleListQuery } from "#src/hooks/api/use-role-list-query";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const RoleListPageContent: FC = () => {
  const { roleRows, isEmpty, isFetching } = useRoleListQuery();

  return <RoleTable rows={roleRows} isEmpty={isEmpty} isLoading={isFetching} />;
};

const RoleListPage: FC = () => {
  const { t } = useTranslation("role-list");
  const navigate = useNavigate();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("page.title")}
        endGroupActions={[
          <Button
            key="to-staff"
            intent="default"
            color="main"
            kind="default"
            size="md"
            label={t("page.toStaff")}
            onClick={() => navigate(URLS.INDEX)}
          />,
        ]}
      />
      <ListLayout.Content>
        <QueryBoundary>
          <RoleListPageContent />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default RoleListPage;
