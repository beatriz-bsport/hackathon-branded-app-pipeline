import { useNavigate } from "react-router";

import { Button, ListLayout, Tooltip } from "@bsport/kaizen-primitive-core";

import {
  ImportLeadsModal,
  useImportLeadsModal,
} from "#src/components/ImportLeadsModal";
import { useAddMember } from "#src/hooks/useAddMember";
import { useFetchMembers } from "#src/hooks/useFetchMembers";
import { useFilterMembers } from "#src/hooks/useFilterMembers";
import { useMemberPermissions } from "#src/hooks/useMemberPermissions";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { MemberListContent } from "./MemberListContent";

export const MemberListPage: React.FC = () => {
  const { t } = useTranslation("common");

  const { filterConfig, handleClearFilters, activeFilters, filterRef } =
    useFilterMembers();

  const { handleAddMember } = useAddMember();

  const navigate = useNavigate();

  const {
    openImportLeadsModal,
    handleCloseImportLeads,
    handleOpenImportLeads,
  } = useImportLeadsModal();

  const { refreshMemberList } = useFetchMembers({
    archived: false,
    activeFilters,
  });

  const permissions = useMemberPermissions();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.memberList")}
        filterConfig={filterConfig}
        filterRef={filterRef}
        callToActionButton={
          permissions.create ? (
            <Button
              iconLeft="plus"
              intent="call-to-action"
              color="main"
              size="md"
              label={t("actions.addMember")}
              onClick={handleAddMember}
            />
          ) : undefined
        }
        endGroupActions={[
          <Tooltip
            key="button-navigate-to-archive-page"
            label={t("pages.archivedMemberList")}
            placement="bottom-left"
          >
            <Button
              iconLeft="box"
              intent="default"
              color="main"
              size="md"
              onClick={() => navigate(URLS.ARCHIVED)}
            />
          </Tooltip>,
          permissions.importLeads ? (
            <Button
              key="button-import-leads"
              iconLeft="upload-cloud-02"
              intent="default"
              color="main"
              size="md"
              label={t("actions.importLeads")}
              onClick={handleOpenImportLeads}
            />
          ) : undefined,
        ]}
      />
      <ListLayout.Content>
        <MemberListContent
          onClearFiltersClick={handleClearFilters}
          activeFilters={activeFilters}
          onAddMemberClick={handleAddMember}
          permissions={permissions}
        />
        {permissions.importLeads && (
          <ImportLeadsModal
            open={openImportLeadsModal}
            handleCloseModal={handleCloseImportLeads}
            refreshMemberList={refreshMemberList}
            handleOpenModal={handleOpenImportLeads}
          />
        )}
      </ListLayout.Content>
    </ListLayout>
  );
};
