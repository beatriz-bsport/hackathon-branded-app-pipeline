import { createSelector } from 'reselect';
import { RootState } from '../../../reducers';

export const getAllPrivateSlotsDict = (state: RootState) =>
  state.privateService.privateSlot.byId;

export const getAllPrivateSlotsIds = (state: RootState) =>
  state.privateService.privateSlot.allIds;

export const getPrivateSlot = (state: RootState, id: number) =>
  getAllPrivateSlotsDict(state)[id];

export const getAllPrivateSlots = createSelector(
  [getAllPrivateSlotsIds, getAllPrivateSlotsDict],
  (list, data) => list.map((id) => data[id]),
);
