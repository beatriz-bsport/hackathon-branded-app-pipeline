import type { FC } from "react";
import { Link } from "react-router";

import { Breadcrumbs, ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary";
import { ContractList } from "#src/features/contract-list";
import { useSearchContractsInput } from "#src/hooks/layout/use-search-contracts-input";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const ContractArchivedListPage: FC = () => {
  const { t } = useTranslation("contract-list");

  const { searchInput, setSearchInput, clearSearchInput } =
    useSearchContractsInput();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.contractArchivedList")}
        searchConfig={{
          id: "search-archived-contracts",
          inputValue: searchInput,
          onInputValueChange: setSearchInput,
          onClear: clearSearchInput,
          tooltipConfig: {},
        }}
        BreadcrumbsItems={[
          <Link key="to-active-contracts" to={URLS.INDEX}>
            <Breadcrumbs.Item
              id="breadcrumb-active-contracts"
              text={t("pages.contractList")}
            />
          </Link>,
        ]}
      />
      <ListLayout.Content>
        <QueryBoundary>
          <ContractList archived={true} searchQuery={searchInput} />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ContractArchivedListPage;
