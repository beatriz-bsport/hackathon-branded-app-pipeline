// @flow

import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import type { State } from '../../state/types';
import type { OrderWithProducts } from './types';
import { getAllMembers } from '../member/selectors';

const getAll = (state: State): Array<OrderWithProducts> =>
  state.order.order.items;

export const getOrder = (state: State, id: ?string): ?OrderWithProducts =>
  getAll(state).find((order) => order.id === id);

const getDeliveryFees = (state: State): Array<DeliveryFee> =>
  state.order.deliveryFee.items;

export const getDeliveryFeesActive: (State) => Array<DeliveryFee> = createSelector(
  getDeliveryFees,
  (fees) => fees.filter((df) => !df.disabled),
);

export const withMember = memoize((selector) =>
  createSelector(
    [selector, getAllMembers],
    (orders, memberList) => {
      if (Array.isArray(orders)) {
        return orders.map((o) => ({
          ...o,
          member: memberList.find((m) => m.id === o.member),
        }));
      }
      if (orders) {
        return {
          ...orders,
          member: memberList.find((m) => m.id === orders.member),
        };
      }
      return orders;
    },
  ),
);

export default { get: getOrder, getAll };
