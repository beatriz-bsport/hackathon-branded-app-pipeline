// @flow

import Immutable from 'seamless-immutable';

const _BASE_EVENT_STATE = Immutable({
  page: 1,
  error: null,
  loading: null,
  items: [],
});

export const getEventState = (state: State, identifier: string) => {
  if (state.byIdentifier[identifier]) {
    return state.byIdentifier[identifier];
  }
  return _BASE_EVENT_STATE;
};
