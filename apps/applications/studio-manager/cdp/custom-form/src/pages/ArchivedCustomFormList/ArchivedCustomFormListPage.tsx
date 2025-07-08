import { useEffect, useMemo } from "react";
import { Link } from "react-router";

import { Breadcrumbs, ListLayout } from "@bsport/kaizen-primitive-core";

import { CustomFormTable } from "#src/components/CustomFormTable";
import { useFetchCustomForms } from "#src/hooks/useFetchCustomForms";
import { useFilterCustomForms } from "#src/hooks/useFilterCustomForms";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { getCustomFormTableColumns } from "#src/utils/table";

const ArchivedCustomFormListPage: React.FC = () => {
  const { t } = useTranslation("common");
  const { searchInput, setSearchInput, clearSearchInput } =
    useFilterCustomForms();
  const {
    customForms,
    isLoading,
    isEmpty,
    isEmptySearch,
    paginationParams,
    fetchCustomForms,
    refreshCustomForms,
    resetCustomForms,
    fuzzySearchCustomForms,
  } = useFetchCustomForms({ searchInput, archived: true });

  const customFormTableItems = useMemo(
    () =>
      getCustomFormTableColumns({
        customForms,
      }),
    [customForms],
  );

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
        pageTitle={t("pages.archived")}
        BreadcrumbsItems={[
          <Link key="to-active-teacher" to={ROUTES.ACTIVE}>
            <Breadcrumbs.Item text={t("pages.active")} />
          </Link>,
        ]}
        searchConfig={{
          id: "form-archived-search",
          inputValue: searchInput,
          onInputValueChange: setSearchInput,
          onClear: clearSearchInput,
        }}
      />
      <ListLayout.Content>
        <CustomFormTable
          customFormsItems={customFormTableItems}
          isEmpty={isEmpty}
          isEmptySearch={isEmptySearch}
          isLoading={isLoading}
          paginationProps={paginationParams}
          mode="archived"
          refreshCustomForms={handleRefreshCustomForms}
          resetCustomForms={handleResetCustomForms}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ArchivedCustomFormListPage;
