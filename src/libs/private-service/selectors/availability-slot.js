// @flow

import type { State } from '../../../state/types';

import type { AvailabilitySlot } from '../types';

export const getAvailabilitySlots: (State) => Array<AvailabilitySlot> = (
  state,
) => state.privateService.availabilitySlot.items;

export const getCoachAvailabilitySlots: (
  State,
  number,
) => Array<AvailabilitySlot> = (state, coach) => {
  if (coach) {
    return getAvailabilitySlots(state).filter((s) => s.coach === coach);
  }
  return getAvailabilitySlots(state);
};
