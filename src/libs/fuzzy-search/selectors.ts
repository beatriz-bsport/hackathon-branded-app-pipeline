import { RootState } from '../../reducers';
import { DEFAULT_SELECTOR_ID } from './constants';
import { SearchObjectType } from './types';

export const getSearchState = (state: RootState) => state.objectSearch;

export const getSelectorState = (
  state: RootState,
  searchedObjectType: SearchObjectType,
  selectorId: string,
) => {
  const objectState = getSearchState(state)[searchedObjectType];
  /**
   * The redux state corresponding to the selector id is initialized on mount. Therefore until mount we
   * fallback on the default selector state for the component to render and connect to its true state on mount.
   */
  return (
    objectState.bySelectorId[selectorId] ??
    objectState.bySelectorId[DEFAULT_SELECTOR_ID]
  );
};

export const getResultsById = (
  state: RootState,
  searchedObjectType: SearchObjectType,
) => {
  return getSearchState(state)[searchedObjectType].byId;
};
