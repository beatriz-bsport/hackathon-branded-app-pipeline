// @flow

import type { State } from '../../state/types';
import type { Member } from './types';

const getAll = (state: State): Array<Member> => state.member.all;

const get = (state: State, id: ?number): ?Member =>
  getAll(state).find((member) => member.id === id);

const getSearched = (state: State): Array<Member> => state.member.search.items;

const getByOffer = (state: State) => state.member.byOffer.items;

export default { get, getAll, getSearched, getByOffer };
