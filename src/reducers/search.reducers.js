// @flow

import Immutable from 'seamless-immutable';

import type { SearchAction, SearchState } from '../state/search/types';

import actionTypes from '../actions/search.types';

const initialState = Immutable({
  path: '',
  text: '',
  detail: null,
  selectedId: null,
  loading: false,
});

export default function searchReducer(
  state: SearchState = initialState,
  action: SearchAction = { type: null },
): SearchState {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      const { pathname, search } = action.payload.location;
      if (pathname === '/search/results') {
        return state.merge({
          text: search.substr(search.indexOf('=') + 1),
          selectedId: null,
        });
      }
      return state.merge({ text: '', selectedId: null });
    }

    case actionTypes.SEARCH_FINISHED: {
      return state.merge({ loading: false });
    }
    case actionTypes.SEARCH_TEXT_START: {
      return state.merge({ loading: true });
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
