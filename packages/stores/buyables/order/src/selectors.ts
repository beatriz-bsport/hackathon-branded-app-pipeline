import type { OrderState } from "./store";

export const selectOrders = (state: OrderState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectOrder = (state: OrderState, id: number) => state.byId[id];

export const selectCount = (state: OrderState) => state.count;
