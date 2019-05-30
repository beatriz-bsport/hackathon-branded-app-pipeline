// @flow

import type { State } from '../../state/types';

const getAll = (state: State) => state.member.quickFetched;

const get = (state: State, id: number) =>
  getAll(state).find((member) => member.id === id);

export default { get, getAll };
