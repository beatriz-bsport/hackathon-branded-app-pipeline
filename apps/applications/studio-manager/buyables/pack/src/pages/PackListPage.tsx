import { useEffect, useId } from "react";
import { useNavigate } from "react-router";

import { Button, ListLayout } from "@bsport/kaizen-primitive-core";

import { PackTable } from "#src/components/PackTable";
import { useFetchPacks } from "#src/hooks/useFetchPacks";
import { useSearchPacks } from "#src/hooks/useSearchPacks";
import { useTranslation } from "#src/utils/i18n";

const ListPage: React.FC = () => {
  const { t } = useTranslation("list");

  const navigate = useNavigate();
  const onAddPackClick = () => {
    navigate("/combo?create=true");
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
          <Button
            color="main"
            intent="call-to-action"
            size="md"
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
        }}
      />
      <ListLayout.Content>
        <PackTable
          handleArchive={({ id }) => alert(`Delete item ${id}`)}
          isEmpty={isEmpty}
          isEmptySearch={isEmptySearch}
          isLoading={isLoading}
          onAddPackClick={onAddPackClick}
          packList={packs}
          paginationProps={paginationParams}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
