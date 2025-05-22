import { useId } from "react";
import { useNavigate } from "react-router";

import { Button, ListLayout } from "@bsport/kaizen-primitive-core";

import { useSearchPacks } from "#src/hooks/useSearchPacks";
import { useTranslation } from "#src/utils/i18n";

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
        {/* TEMPORARY - Just for testing purposes */}
        <p>Search with param : {searchInput}</p>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
