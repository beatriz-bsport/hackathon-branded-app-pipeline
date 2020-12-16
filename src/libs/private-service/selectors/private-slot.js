// @flow

import type { State } from '../../../state/types.ts';
import type { PrivateSlot } from '../types.ts';

export const getAllPrivateSlotsDict: (State) => {
  [id: number]: PrivateSlot,
} = (state: State) => state.privateService.privateSlot.byId;

export const getPrivateSlot: (State, number) => PrivateSlot = (state, id) =>
  getAllPrivateSlotsDict(state)[id];
