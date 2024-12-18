import { createAction } from 'redux-actions';
import { Dispatch } from '../../state/types';
import { DynamicFilterDataType } from './types';

export const setDynamicDataHasBeenLoadedAction =
  createAction<DynamicFilterDataType>('DATA_SOURCE/FILTER/DYNAMIC/LOADED');

export function setDynamicDataHasBeenLoaded(type: DynamicFilterDataType) {
  return async (dispatch: Dispatch) => {
    dispatch(setDynamicDataHasBeenLoadedAction(type));
  };
}

export const resetDynamicDataHasBeenLoadedAction = createAction(
  'DATA_SOURCE/FILTER/DYNAMIC/RESET',
);

export function resetDynamicDataHasBeenLoaded() {
  return async (dispatch: Dispatch) => {
    dispatch(resetDynamicDataHasBeenLoadedAction());
  };
}
