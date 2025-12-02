import { useEffect, useId, useState } from "react";

import { getEnv } from "@bsport/envs";
import { ListLayout } from "@bsport/kaizen-primitive-core";

import { PackCreateModal } from "#src/components/PackCreateModal";
import { PackDeleteModal } from "#src/components/PackDeleteModal";
import { PackTable } from "#src/components/PackTable";
import { useDisclosure } from "#src/hooks/useDisclosure";
import { useFetchPacks } from "#src/hooks/useFetchPacks";
import { useSearchPacks } from "#src/hooks/useSearchPacks";
import { LEGACY_URLS } from "#src/urls";
import { USE_REVAMP_DETAILS } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

export const PackListPage: React.FC = () => {
  const { t } = useTranslation("list");
  const [packToDelete, setPackToDelete] = useState<
    { id: number; name: string } | undefined
  >(undefined);

  const {
    onClose: closeCreateModal,
    isOpen: isCreateModalOpen,
    onOpen: openCreateModal,
  } = useDisclosure();

  const onAddPackClick = () => {
    const env = getEnv();

    // WIP - Display Create modal in local, dev and FB
    if (USE_REVAMP_DETAILS || !["production", "staging"].includes(env)) {
      openCreateModal();
    } else {
      // Use window history to navigate to legacy backoffice
      window.location.assign(LEGACY_URLS.CREATE);
    }
  };

  const { searchInput, setSearchInput, clearSearchInput } = useSearchPacks();

  const {
    packs,
    paginationParams,
    fuzzySearchPacks,
    fetchPacks,
    isEmpty,
    isEmptySearch,
    isLoading,
  } = useFetchPacks({ searchInput });

  // ----- Load data -----

  useEffect(() => {
    fuzzySearchPacks();
  }, [fuzzySearchPacks]);

  useEffect(() => {
    fetchPacks();
  }, [fetchPacks]);

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("title")}
        callToActionButton={
          <ListLayout.Button
            color="main"
            intent="call-to-action"
            label={t("actions.addAPack")}
            iconLeft="plus"
            onClick={onAddPackClick}
          />
        }
        searchConfig={{
          id: useId(),
          inputValue: searchInput,
          onInputValueChange: setSearchInput,
          onClear: clearSearchInput,
          tooltipConfig: {},
        }}
      />
      <ListLayout.Content>
        <PackTable
          handleArchive={setPackToDelete}
          isEmpty={isEmpty}
          isEmptySearch={isEmptySearch}
          isLoading={isLoading}
          onAddPackClick={onAddPackClick}
          packList={packs}
          paginationProps={paginationParams}
        />

        {packToDelete && (
          <PackDeleteModal
            packId={packToDelete.id}
            packName={packToDelete.name}
            isOpen={!!packToDelete}
            onClose={() => setPackToDelete(undefined)}
            onDeleteSuccess={fetchPacks}
            onUndoSuccess={fetchPacks}
          />
        )}

        <PackCreateModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};
