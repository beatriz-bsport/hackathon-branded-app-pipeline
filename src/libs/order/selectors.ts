import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import type { RootState } from '../../reducers';
import type { OrderWithProducts } from '#libs/order/types';
import { getMemberDetailData } from '#libs/member/selectors';

const getAll = (state: RootState) => state.order.order.items;

export const getOrder = (state: RootState, id: string) =>
  getAll(state).find((order) => order.id === id);

const getDeliveryFees = (state: RootState) => state.order.deliveryFee.items;

export const getDeliveryFeesActive = createSelector(getDeliveryFees, (fees) =>
  fees.filter((df) => !df.disabled),
);

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

export default { get: getOrder, getAll };
