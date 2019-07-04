// @flow

import type { State } from '../../state/types';
import type { OrderWithProducts } from './types';

const getAll = (state: State): Array<OrderWithProducts> =>
  state.order.order.items;

const get = (state: State, id: ?string): ?OrderWithProducts =>
  getAll(state).find((order) => order.id === id);

export default { get, getAll };
