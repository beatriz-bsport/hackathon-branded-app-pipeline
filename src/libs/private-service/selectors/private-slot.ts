import { createSelector } from 'reselect';
import { RootState } from '../../../reducers';
import type { PrivateSlot } from '#src/libs/private-service/types';
import { CLASSPASS_COMPATIBLE_BOOKING_INTERVALS } from '#src/libs/private-service/constants';

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

/**
 * Get if the available private slots related to a private service are compatible
 * with classpass
 *
 * @param state - The current state
 * @param privateServiceId - The private service id
 *
 * @returns {[slotId: number]: boolean} - A dict with the slot id as key pointing if it's compatible with partnership
 */
export const getPrivateSlotCompatibilityWithPartnershipById = createSelector(
  [getAllPrivateSlots],
  (slots) => {
    return slots.reduce(
      (acc: { [slotId: number]: boolean }, slot: PrivateSlot) => {
        acc[slot.id] =
          slot.people_capacity_used === 1 &&
          CLASSPASS_COMPATIBLE_BOOKING_INTERVALS.includes(
            slot.booking_interval_minutes,
          );
        return acc;
      },
      {},
    );
  },
);
