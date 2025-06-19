import { useNavigate } from "react-router";

import { Button, ListLayout, Tooltip } from "@bsport/kaizen-primitive-core";

import {
  ImportLeadsModal,
  useImportLeadsModal,
} from "#src/components/ImportLeadsModal";
import { useAddMember } from "#src/hooks/useAddMember";
import { useFetchPaginatedList } from "#src/hooks/useFetchPaginatedList";
import { useMemberFilters } from "#src/hooks/useMemberFilters";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { MemberListContent } from "./MemberListContent";

export const MemberListPage: React.FC = () => {
  const { t } = useTranslation("common");

  const { filterConfig, handleClearFilters, activeFilters } =
    useMemberFilters();

  const { handleAddMember } = useAddMember();

  const navigate = useNavigate();

  const {
    openImportLeadsModal,
    handleCloseImportLeads,
    handleOpenImportLeads,
  } = useImportLeadsModal();

  const { refreshMemberList } = useFetchPaginatedList({
    archived: false,
    activeFilters,
  });

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.memberList")}
        filterConfig={filterConfig}
        callToActionButton={
          <Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            size="md"
            label={t("actions.addMember")}
            onClick={handleAddMember}
          />
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
              onClick={() => navigate(ROUTES.ARCHIVED)}
            />
          </Tooltip>,
          <Button
            key="button-import-leads"
            iconLeft="upload-cloud-02"
            intent="default"
            color="main"
            size="md"
            label={t("actions.importLeads")}
            onClick={handleOpenImportLeads}
          />,
        ]}
      />
      <ListLayout.Content>
        <MemberListContent
          onClearFiltersClick={handleClearFilters}
          activeFilters={activeFilters}
          onAddMemberClick={handleAddMember}
        />
        <ImportLeadsModal
          open={openImportLeadsModal}
          handleCloseModal={handleCloseImportLeads}
          refreshMemberList={refreshMemberList}
          handleOpenModal={handleOpenImportLeads}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};
