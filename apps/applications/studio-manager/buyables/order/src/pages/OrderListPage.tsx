import { useEffect } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { OrderTable } from "#src/components/OrderTable";
import { useFetchOrders } from "#src/hooks/useFetchOrders";
import { useFilterOrders } from "#src/hooks/useFilterOrders";
import { useTranslation } from "#src/utils/i18n";

const OrderListPage: React.FC = () => {
  const { t } = useTranslation("list");

  const { filterConfig, activeFilters, handleClearFilters } = useFilterOrders();

  const {
    isLoading,
    isEmpty,
    isEmptySearch,
    paginationParams,
    orders,
    fetchOrdersPage,
  } = useFetchOrders({ status: activeFilters });

  useEffect(() => {
    fetchOrdersPage();
  }, [fetchOrdersPage]);

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pageTitle")}
        filterConfig={filterConfig}
        // Search is not available on the backend for now
        // searchConfig={{
        //   id: "order-search-input",
        //   tooltipConfig: {}, // Enable default tooltip
        // }}
      />
      <ListLayout.Content>
        <OrderTable
          orderList={orders}
          paginationProps={paginationParams}
          isLoading={isLoading}
          isEmpty={isEmpty}
          isEmptySearch={isEmptySearch}
          filterStatus={activeFilters}
          handleClearFilters={handleClearFilters}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default OrderListPage;
