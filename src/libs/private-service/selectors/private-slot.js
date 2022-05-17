// @flow
import { createSelector } from 'reselect';
import type { State } from '../../../state/types';
import type { PrivateSlot } from '../types';

export const getAllPrivateSlotsDict: (State) => {
  [id: number]: PrivateSlot,
} = (state: State) => state.privateService.privateSlot.byId;

export const getAllPrivateSlotsIds = (state: State) =>
  state.privateService.privateSlot.allIds;

export const getPrivateSlot: (State, number) => PrivateSlot = (state, id) =>
  getAllPrivateSlotsDict(state)[id];

export const getAllPrivateSlots = createSelector(
  [getAllPrivateSlotsIds, getAllPrivateSlotsDict],
  (list, data) => list.map((id) => data[id]),
);
