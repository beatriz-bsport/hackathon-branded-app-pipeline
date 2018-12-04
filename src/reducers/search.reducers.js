// @flow

import Immutable from 'seamless-immutable';

import type { SearchAction, SearchState } from '../state/search/types';

import actionTypes from '../actions/search.types';

const initialState = Immutable({
  path: '',
  text: '',
  detail: null,
  selectedId: null,
});

export default function searchReducer(
  state: SearchState = initialState,
  action: SearchAction = { type: null },
): SearchState {
  switch (action.type) {
    case actionTypes.SEARCH_TEXT_START: {
      const path = state.path || action.path;
      return state.merge({ text: action.text, path, selectedId: null });
    }

    case actionTypes.SEARCH_SELECT_ENTITY_START:
      return state.merge({
        selectedId: action.entity && action.entity.data.id,
      });

    case actionTypes.SEARCH_SELECT_ENTITY_SUCCESS:
      return state.merge({ detail: action.response });

    default:
      return state;
  }
}
