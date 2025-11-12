import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
  Button,
  type ButtonProps,
  ListLayout,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { CustomFormTable } from "#src/components/CustomFormTable";
import { CreateFormModal } from "#src/components/Modal/CreateFormModal";
import { useFetchCustomForms } from "#src/hooks/useFetchCustomForms";
import { useFilterCustomForms } from "#src/hooks/useFilterCustomForms";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { getCustomFormTableColumns } from "#src/utils/table";

const CustomFormListPage: React.FC = () => {
  const [isCreateFormModalOpen, setIsCreateFormModalOpen] = useState(false);
  const { t } = useTranslation("common");
  const { searchInput, setSearchInput, clearSearchInput } =
    useFilterCustomForms();
  const {
    customForms,
    isLoading,
    isEmpty,
    isEmptySearch,
    paginationParams,
    resetCustomForms,
    refreshCustomForms,
    fetchCustomForms,
    fuzzySearchCustomForms,
  } = useFetchCustomForms({ searchInput, archived: false });

  const navigate = useNavigate();

  const { endGroupActions } = ListLayout.useAdaptiveActions({
    endGroupActions: [
      <GoToArchivedListButton
        key="bt-navigate-to-archive-page"
        kind="icon-button"
        icon="box"
        intent="default"
        color="main"
        size="md"
        label={t("pages.archived")}
        onClick={() => navigate(ROUTES.ARCHIVED)}
      />,
    ],
  });

  const customFormTableItems = useMemo(
    () =>
      getCustomFormTableColumns({
        customForms,
      }),
    [customForms],
  );

  const handleOpenCreateFormModal = () => {
    setIsCreateFormModalOpen(true);
  };
  const handleCloseCreateFormModal = () => {
    setIsCreateFormModalOpen(false);
  };

  const handleRefreshCustomForms = () => {
    if (searchInput) {
      clearSearchInput();
    }

    refreshCustomForms();
  };

  const handleResetCustomForms = () => {
    if (searchInput) {
      clearSearchInput();
    }

    resetCustomForms();
  };

  useEffect(() => {
    if (searchInput) {
      fuzzySearchCustomForms();
      return;
    }
    fetchCustomForms();
  }, [searchInput, fuzzySearchCustomForms, fetchCustomForms]);

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.active")}
        callToActionButton={
          <ListLayout.Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            label={t("activeList.actions.addForm")}
            onClick={handleOpenCreateFormModal}
          />
        }
        endGroupActions={endGroupActions}
        searchConfig={{
          id: "form-active-search",
          inputValue: searchInput,
          onInputValueChange: setSearchInput,
          onClear: clearSearchInput,
        }}
      />
      <ListLayout.Content>
        <CustomFormTable
          customFormsItems={customFormTableItems}
          customForms={customForms}
          isEmpty={isEmpty}
          isEmptySearch={isEmptySearch}
          isLoading={isLoading}
          paginationProps={paginationParams}
          mode="active"
          onCreateForm={handleOpenCreateFormModal}
          resetCustomForms={handleResetCustomForms}
          refreshCustomForms={handleRefreshCustomForms}
        />
      </ListLayout.Content>

      {isCreateFormModalOpen ? (
        <CreateFormModal
          isOpen
          onClose={handleCloseCreateFormModal}
          onSuccess={resetCustomForms}
        />
      ) : null}
    </ListLayout>
  );
};

function GoToArchivedListButton(props: ButtonProps) {
  const { t } = useTranslation("common");

  return (
    <Tooltip label={t("pages.archived")} placement="bottom-left">
      <Button {...props} />
    </Tooltip>
  );
}

export default CustomFormListPage;
