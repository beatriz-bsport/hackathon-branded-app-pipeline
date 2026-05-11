import type { FC } from "react";
import { useNavigate } from "react-router";

import { Button, ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { RoleTable } from "#src/components/role-table/role-table";
import { RoleCreateModal } from "#src/features/role-create-modal/role-create-modal";
import { useRoleListQuery } from "#src/hooks/api/use-role-list-query";
import { useDisclosure } from "#src/hooks/use-disclosure";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type RoleListPageContentProps = {
  onCreateRole: () => void;
};

const RoleListPageContent: FC<RoleListPageContentProps> = ({
  onCreateRole,
}) => {
  const { roleRows, isEmpty, isFetching } = useRoleListQuery();

  return (
    <RoleTable
      rows={roleRows}
      isEmpty={isEmpty}
      isLoading={isFetching}
      onCreateRole={onCreateRole}
    />
  );
};

const RoleListPage: FC = () => {
  const { t } = useTranslation("role-list");
  const navigate = useNavigate();
  const {
    isOpen: isCreateModalOpen,
    onClose: closeCreateModal,
    onOpen: openCreateModal,
  } = useDisclosure();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("page.title")}
        callToActionButton={
          <ListLayout.Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            label={t("page.addRole")}
            onClick={openCreateModal}
          />
        }
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
          <RoleListPageContent onCreateRole={openCreateModal} />
        </QueryBoundary>
      </ListLayout.Content>

      <RoleCreateModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
    </ListLayout>
  );
};

export default RoleListPage;
