import { useId } from "react";
import { useNavigate } from "react-router";

import { Button, ListLayout } from "@bsport/kaizen-primitive-core";

import { PackTable } from "#src/components/PackTable";
import { useSearchPacks } from "#src/hooks/useSearchPacks";
import type { Pack } from "#src/temp-api";
import { useTranslation } from "#src/utils/i18n";

import MOCK_DATA from "./mock-data.json";

const ListPage: React.FC = () => {
  const { t } = useTranslation("list");

  const navigate = useNavigate();
  const onAddPackClick = () => {
    navigate("/combo?create=true");
  };

  const { searchInput, setSearchInput, clearSearchInput } = useSearchPacks();

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
          packList={MOCK_DATA as Array<Pack>}
          paginationProps={{
            currentPage: 1,
            rowsPerPage: 10,
            totalItems: 10,
          }}
          handleArchive={({ id }) => alert(`Delete item ${id}`)}
          onAddPackClick={onAddPackClick}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
