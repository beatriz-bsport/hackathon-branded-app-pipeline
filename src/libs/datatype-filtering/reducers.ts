import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import { DatatypeFilteringState } from './types';
import {
  setDynamicDataHasBeenLoadedAction,
  resetDynamicDataHasBeenLoadedAction,
} from './actions';

import { defaultDynamicDataHasBeenLoaded } from './constants';

const initialState: Immutable.Immutable<DatatypeFilteringState> =
  Immutable<DatatypeFilteringState>({
    dynamicDataHasBeenLoaded: defaultDynamicDataHasBeenLoaded,
  });

export default handleActions<Immutable.Immutable<DatatypeFilteringState>>(
  {
    [setDynamicDataHasBeenLoadedAction.toString()]: (state, { payload }) => {
      return state.setIn(['dynamicDataHasBeenLoaded', payload], true);
    },
    [resetDynamicDataHasBeenLoadedAction.toString()]: (state) => {
      return state.setIn(
        ['dynamicDataHasBeenLoaded'],
        defaultDynamicDataHasBeenLoaded,
      );
    },
  },
  initialState,
);
