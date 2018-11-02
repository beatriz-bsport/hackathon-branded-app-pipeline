// @flow

import Immutable from 'seamless-immutable';

import actionTypes from '../actions/search.types';

const initialState = Immutable({
  text: '',
  detail: null,
});

export default function searchReducer(state = initialState, action = {}) {
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
