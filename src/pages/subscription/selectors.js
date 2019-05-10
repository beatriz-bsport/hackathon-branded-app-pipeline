// @flow

import type { State } from '../../state/types';

const get = (state: State, id: number) => state.subscription.items[id];

export default { get }
