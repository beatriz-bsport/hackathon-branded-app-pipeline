import type { FC } from "react";
import { useNavigate } from "react-router";

import {
  Button,
  type ButtonProps,
  ListLayout,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary";
import { ContractList } from "#src/features/contract-list";
import { useSearchContractsInput } from "#src/hooks/layout/use-search-contracts-input";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

function GoToArchivedListButton(props: ButtonProps) {
  const { t } = useTranslation("contract-list");

  return (
    <Tooltip label={t("pages.contractArchivedList")} placement="bottom-left">
      <Button {...props} />
    </Tooltip>
  );
}

const ContractListPage: FC = () => {
  const { t } = useTranslation("contract-list");
  const navigate = useNavigate();

  const navigateToArchivePage = () => navigate(URLS.ARCHIVED);

  const { searchInput, setSearchInput, clearSearchInput } =
    useSearchContractsInput();

  const { endGroupActions } = ListLayout.useAdaptiveActions({
    endGroupActions: [
      <GoToArchivedListButton
        key="btn-to-navigate-to-archive-page"
        kind="icon-button"
        icon="box"
        intent="default"
        color="main"
        size="md"
        label={t("pages.contractArchivedList")}
        onClick={navigateToArchivePage}
      />,
    ],
  });

  const cta = (
    <ListLayout.Button
      iconLeft="plus"
      intent="call-to-action"
      color="main"
      label={t("header.createContract")}
      onClick={() => alert("Not implemented yet")}
    />
  );

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.contractList")}
        callToActionButton={cta}
        endGroupActions={endGroupActions}
        searchConfig={{
          id: "search-contracts",
          inputValue: searchInput,
          onInputValueChange: setSearchInput,
          onClear: clearSearchInput,
          tooltipConfig: {},
        }}
      />
      <ListLayout.Content>
        <QueryBoundary>
          <ContractList archived={false} searchQuery={searchInput} />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ContractListPage;
