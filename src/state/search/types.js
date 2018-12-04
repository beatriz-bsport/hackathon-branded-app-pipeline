// @flow

import type { Immutable } from 'seamless-immutable';

export type SearchState = Immutable<{
  text: string,
  path: string,
  selectedId: ?number,
  detail: *,
}>;
export type SearchAction =
  | { type: null }
  | {
      type: 'SEARCH_SELECT_ENTITY_SUCCESS',
      response: {},
    }
  | {
      type: 'SEARCH_SELECT_ENTITY_START',
      entity: { data: { id: number } },
    }
  | {
      type: 'SEARCH_TEXT_START',
      text: string,
      path: string,
    };
