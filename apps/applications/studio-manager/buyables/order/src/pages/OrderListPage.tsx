import { useEffect } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { OrderTable } from "#src/components/OrderTable";
import { useFetchOrders } from "#src/hooks/useFetchOrders";
import { useOrderFilters } from "#src/hooks/useOrderFilters";
import { useTranslation } from "#src/utils/i18n";

const OrderListPage: React.FC = () => {
  const { t } = useTranslation("list");

  const { filterConfig, activeFilters } = useOrderFilters();

  const {
    isLoading,
    isEmpty,
    isEmptySearch,
    paginationParams,
    orders,
    fetchOrdersPage,
  } = useFetchOrders({ status: activeFilters.status });

  useEffect(() => {
    fetchOrdersPage();
  }, [fetchOrdersPage]);

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
          orderList={orders}
          paginationProps={paginationParams}
          isLoading={isLoading}
          isEmpty={isEmpty}
          isEmptySearch={isEmptySearch}
          filterStatus={activeFilters.status}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default OrderListPage;
