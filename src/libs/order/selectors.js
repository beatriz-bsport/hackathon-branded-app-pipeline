// @flow

import type { State } from '../../state/types';
import type { OrderWithProducts } from './types';

const getAll = (state: State): Array<OrderWithProducts> =>
  state.order.order.items;

const get = (state: State, id: ?string): ?OrderWithProducts =>
  getAll(state).find((order) => order.id === id);

const getDeliveryFees = (state: State): Array<DeliveryFee> =>
  state.order.deliveryFee.items;

export const getDeliveryFeesActive = (state: State): Array<DeliveryFee> =>
  getDeliveryFees(state).filter((df) => !df.disabled);

export default { get, getAll };
