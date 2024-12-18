// @flow

import Immutable from 'seamless-immutable';
import { createAction, handleActions } from 'redux-actions';

const initialState = Immutable({
  isAvailable: true,
});

export const networkActions = {
  isAvailable: createAction('IS_AVAILABLE'),
  isUnavailable: createAction('IS_UNAVAILABLE'),
};

export default handleActions(
  {
    [networkActions.isAvailable]: (state) => {
      return state.set('isAvailable', true);
    },
    [networkActions.isUnavailable]: (state) => {
      return state.set('isAvailable', false);
    },
  },
  initialState,
);
