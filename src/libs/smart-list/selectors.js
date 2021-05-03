// @flow

import objectAssign from 'object-assign';
import { createSelector } from 'reselect';

import Immutable from 'seamless-immutable';
import type { State } from '../../state/types';
import type { email_template_state } from './types';

export const getSmartListDict = (state: State): email_template_state =>
  state.smartList.byId;

export const getSmartListId = (state: State): email_template_state =>
  state.smartList.allIds;

export const getAllSmartList = createSelector(
  [getSmartListDict, getSmartListId],
  (smartListDict, IdList) => Immutable(IdList.map((id) => smartListDict[id])),
);

export const getSmartList = (state: State, id: number): any =>
  state.smartList.byId[id];

export const getSmartListFilters = (state: State, id: number): any =>
  Immutable(
    Object.values(state.smartList.filtersByCategoryId)
      .map((OneFilterDict) => Object.values(OneFilterDict))
      .flat()
      .filter((filter) => filter.smartlist === id),
  );

export const getSmartListMembers = (state: State, id: number): any =>
  state.smartList.membersBySmartListId[id];

export const getFreshSmartListIds = createSelector(getAllSmartList, (sl) =>
  sl.map((list) => list.id),
);

export const getSmartListAutoTagDict = (state: State) =>
  state.smartList.smartListTagRules.byId;

export const getSmartListAutoTagIds = (state: State) =>
  state.smartList.smartListTagRules.allIds;

export const getSmartListAutoTag = createSelector(
  [getSmartListAutoTagDict, getSmartListAutoTagIds],
  (smartListAutoTagDict, IdList) =>
    Immutable(IdList.map((pk) => smartListAutoTagDict[pk])),
);

export const getSmartListAutoTagFiltered = (state: State, id: number) =>
  objectAssign
    .values(state.smartList.smartListTagRules.byId)
    .filter((tg) => tg.smartlist === id);
