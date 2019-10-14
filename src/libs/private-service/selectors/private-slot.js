// @flow

import type { State } from '../../../state/types';
import type { PrivateSlot } from '../types';

export const getAllPrivateSlotsDict: (State) => {
  [id: number]: PrivateSlot,
} = (state: State) => state.privateService.privateSlot.byId;

export const getPrivateSlot: (State, number) => PrivateSlot = (state, id) =>
  getAllPrivateSlotsDict(state)[id];
