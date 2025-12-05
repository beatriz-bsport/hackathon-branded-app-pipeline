import { useNavigate } from "react-router";

import {
  Button,
  type ButtonProps,
  ListLayout,
  Tooltip,
} from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import {
  ImportLeadsModal,
  useImportLeadsModal,
} from "#src/components/ImportLeadsModal";
import { useAddMember } from "#src/hooks/useAddMember";
import { useDebouncedSearch } from "#src/hooks/useDebouncedSearch";
import { useFetchMembers } from "#src/hooks/useFetchMembers";
import { useFilterMembers } from "#src/hooks/useFilterMembers";
import { useMemberPermissions } from "#src/hooks/useMemberPermissions";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { MemberListContent } from "./MemberListContent";

export const MemberListPage: React.FC = () => {
  const { t } = useTranslation("common");

  const { setPage } = usePaginationQueryParams();

  const { filterConfig, handleClearFilters, activeFilters, filterRef } =
    useFilterMembers({
      onFiltersChange: () => setPage(DEFAULT_PAGE),
    });

  const searchConfig = useDebouncedSearch();

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
  const { endGroupActions } = ListLayout.useAdaptiveActions({
    endGroupActions: [
      <GoToArchivedListButton
        key="button-navigate-to-archive-page"
        kind="icon-button"
        icon="box"
        intent="default"
        color="main"
        size="md"
        label={t("pages.archivedMemberList")}
        onClick={() => navigate(URLS.ARCHIVED)}
      />,
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
    ].filter((e) => e !== undefined),
  });

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.memberList")}
        filterConfig={filterConfig}
        filterRef={filterRef}
        callToActionButton={
          permissions.create ? (
            <ListLayout.Button
              iconLeft="plus"
              intent="call-to-action"
              color="main"
              label={t("actions.addMember")}
              onClick={handleAddMember}
            />
          ) : undefined
        }
        endGroupActions={endGroupActions}
        searchConfig={searchConfig}
      />
      <ListLayout.Content>
        <MemberListContent
          onClearFiltersClick={handleClearFilters}
          activeFilters={activeFilters}
          onAddMemberClick={handleAddMember}
          permissions={permissions}
          searchInput={searchConfig.inputValue}
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

function GoToArchivedListButton(props: ButtonProps) {
  const { t } = useTranslation("common");

  return (
    <Tooltip
      key="button-navigate-to-archive-page"
      label={t("pages.archivedMemberList")}
      placement="bottom-left"
    >
      <Button {...props} />
    </Tooltip>
  );
}
