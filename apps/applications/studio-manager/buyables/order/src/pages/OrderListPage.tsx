import { Button, ListLayout } from "@bsport/kaizen-primitive-core";

import { useOrderFilters } from "#src/hooks/useOrderFilters";
import { useTranslation } from "#src/utils/i18n";

const OrderListPage: React.FC = () => {
  const { t } = useTranslation("list");

  const { filterConfig, handleClearFilters, activeFilters } = useOrderFilters();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pageTitle")}
        filterConfig={filterConfig}
        searchConfig={{
          id: "order-search-input",
          /** @todo Set it as tooltip when the props is available on the component */
          placeholder: t("header.searchTooltip"),
        }}
      />
      <ListLayout.Content>
        <Button
          onClick={handleClearFilters}
          iconLeft="filter-lines"
          label="Just a button to check the clear handler"
          color="main"
          size="sm"
          intent="call-to-action"
          className="h-fit m-lg"
        />
        <p>Filter :{activeFilters.status}</p>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default OrderListPage;
