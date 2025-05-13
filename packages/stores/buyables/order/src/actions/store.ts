import { orderStore } from "#src/store";
import type { Order } from "#src/types";

export const updateOrder = (updatedOrder: Order) => {
  orderStore.setState((state) => {
    if (!updatedOrder) return state;

    const id = updatedOrder.id;

    if (!id) return state;

    return {
      byId: { ...state.byId, [id]: updatedOrder },
    };
  });
};

export const setOrders = ({
  orders,
  count,
  page,
}: {
  orders: Order[];
  count: number;
  page: number;
}) => {
  orderStore.setState((state) => {
    const byId = orders.reduce((acc, order) => {
      acc[order.id] = order;
      return acc;
    }, state.byId);

    return {
      ids: orders.map((order) => order.id),
      byId,
      count,
      page,
    };
  });
};
