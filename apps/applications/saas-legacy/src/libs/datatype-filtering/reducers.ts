import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import type {
  DatatypeFilteringState,
  DynamicFilterDataType,
} from '#src/libs/datatype-filtering/types';
import {
  setDynamicDataHasBeenLoadedAction,
  resetDynamicDataHasBeenLoadedAction,
} from './actions';

import { defaultDynamicDataHasBeenLoaded } from './constants';

const initialState: Immutable.Immutable<DatatypeFilteringState> =
  Immutable<DatatypeFilteringState>({
    dynamicDataHasBeenLoaded: defaultDynamicDataHasBeenLoaded,
  });

export default handleActions<
  Immutable.Immutable<DatatypeFilteringState>,
  DynamicFilterDataType
>(
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
