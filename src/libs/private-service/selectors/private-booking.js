// @flow

import { createSelector } from 'reselect';
import type { State } from '../../../state/types';
import type { PrivateBooking } from '../types';

import { getAll as getAllMembers } from '../../member/selectors';

import { getAllPrivateSlotsDict } from './private-slot';
import { _getPrivateServicesById } from './private-service';

/*
export const getPrivateConsumerPassListWithPass = createSelector(
  [getPrivatePassList, _getPrivatePassDict],
  (consumerPassList, passDict) =>
    consumerPassList.map((cp) => ({
      ...cp,
      private_pass: passDict[cp.private_pass],
    })),
);
*/

export const getPrivateBookingDict: (State) => { [id: number]: PrivateBooking } = (
  state,
) => state.privateService.privateBooking.byId;

const _getPrivateBookingListId: (State) => Array<number> = (state) =>
  state.privateService.privateBooking.allIds;

export const getPrivateBookingListBase: (State) => Array<PrivateBooking> = createSelector(
  [_getPrivateBookingListId, getPrivateBookingDict],
  (ids, data) => ids.map((id) => data[id]),
);

// eslint-disable-next-line
export const getPrivateBookingList: (State) => Array<PrivateBookingWithRelatedFields> = createSelector(
  [
    getPrivateBookingListBase,
    getAllMembers,
    _getPrivateServicesById,
    getAllPrivateSlotsDict,
  ],
  (bookings, members, services, slots) =>
    bookings.map((b) => ({
      ...b,
      member: members.find((m) => m.id === b.member),
      private_service: services[b.private_service],
      private_slot: slots[b.private_slot],
    })),
);
