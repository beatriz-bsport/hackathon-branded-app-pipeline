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
    // @ts-expect-error
    dynamicDataHasBeenLoaded: defaultDynamicDataHasBeenLoaded,
  });

export default handleActions<Immutable.Immutable<DatatypeFilteringState>>(
  {
    [setDynamicDataHasBeenLoadedAction.toString()]: (state, { payload }) => {
      // @ts-expect-error
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
