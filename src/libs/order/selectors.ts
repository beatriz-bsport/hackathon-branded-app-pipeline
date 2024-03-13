import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import type { RootState } from '../../reducers';
import type { OrderWithProducts } from '#libs/order/types';
import { getMemberDetailData } from '#libs/member/selectors';

const getOrderState = (state: RootState) => state.order.order;

export const getAllOrdersItems = (state: RootState) =>
  getOrderState(state).items;
export const getOrdersListLoading = (state: RootState) =>
  getOrderState(state).loading;
export const getOrdersListCount = (state: RootState) =>
  getOrderState(state).count;

export const getOrder = (state: RootState, id: string) =>
  getAllOrdersItems(state).find((order) => order.id === id);

const getDeliveryFees = (state: RootState) => state.order.deliveryFee.items;

export const getDeliveryFeesActive = createSelector(getDeliveryFees, (fees) =>
  fees.filter((df) => !df.disabled),
);

export const getOrderConfigurationData = (state: RootState) =>
  state.order.configuration.data;

export const withMember = memoize(
  (
    selector: (
      state: RootState,
    ) => OrderWithProducts | Array<OrderWithProducts>,
  ) =>
    createSelector([selector, getMemberDetailData], (orders, memberData) => {
      if (Array.isArray(orders)) {
        return orders.map((o) => ({
          ...o,
          member: memberData[o.member],
        }));
      }
      if (orders) {
        return {
          ...orders,
          member: memberData[orders.member],
        };
      }
      return orders;
    }),
);

export default {
  get: getOrder,
  getAllOrdersItems,
  getOrdersListLoading,
  getOrdersListCount,
};
