import { ListLayout } from "@bsport/kaizen-primitive-core";

import { OrderTable } from "#src/components/OrderTable";
import { Order } from "#src/components/OrderTable/constants";
import { useOrderFilters } from "#src/hooks/useOrderFilters";
import { useTranslation } from "#src/utils/i18n";

import data from "./mock_data.json";

const OrderListPage: React.FC = () => {
  const { t } = useTranslation("list");

  const { filterConfig, activeFilters } = useOrderFilters();

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
        <OrderTable
          orderList={data.results as Array<Order>}
          paginationProps={{
            currentPage: 1,
            rowsPerPage: 10,
            totalItems: data.count,
            showRowsPerPageSelector: true,
          }}
          isLoading={false}
          isEmpty={false}
          isEmptySearch={false}
          filterStatus={activeFilters.status}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default OrderListPage;
