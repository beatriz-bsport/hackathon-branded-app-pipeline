// @flow

import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import type { State } from '../../../state/types';
import type { PrivateBooking } from '../types';

import {
  getMemberListData,
  getMemberDetailData,
  getAllMembers,
} from '../../member/selectors';

import { getAllPrivateSlotsDict } from './private-slot';
import { _getPrivateServicesById } from './private-service';

import { getAllCoachesDict } from '../../associated-coach/selectors';
import { getAllEstablishmentsDict } from '../../establishment/selectors';

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

export const getPrivateBookingDict: (State) => {
  [id: number]: PrivateBooking,
} = (state) => state.privateService.privateBooking.byId;

export const withRelatedFields = memoize((selector) =>
  createSelector(
    [
      selector,
      getAllCoachesDict,
      getAllEstablishmentsDict,

      _getPrivateServicesById,
      getAllPrivateSlotsDict,

      getMemberListData,
      getMemberDetailData,
    ],
    (
      bookings,
      coachData,
      estalbishmentData,
      serviceData,
      slotData,
      memberData,
      memberDetailData,
    ) => {
      if (!bookings) return null;
      if (!Array.isArray(bookings)) {
        return {
          ...bookings,
          coach: coachData[bookings.coach],
          establishment: estalbishmentData[bookings.establishment],
          private_service: serviceData[bookings.private_service],
          private_slot: slotData[bookings.private_slot],
          member:
            memberData[bookings.member] || memberDetailData[bookings.member],
        };
      }
      return bookings.map((b) => ({
        ...b,
        coach: coachData[b.coach],
        establishment: estalbishmentData[b.establishment],
        private_service: serviceData[b.private_service],
        private_slot: slotData[b.private_slot],
        member: memberData[b.member] || memberDetailData[b.member],
      }));
    },
  ),
);

export const getPrivateBooking = (state, id) =>
  getPrivateBookingDict(state)[id];

const _getPrivateBookingListId: (State) => Array<number> = (state) =>
  state.privateService.privateBooking.allIds;

export const getPrivateBookingListBase: (State) => Array<PrivateBooking> = createSelector(
  [_getPrivateBookingListId, getPrivateBookingDict],
  (ids, data) => ids.map((id) => data[id]).filter((b) => !!b),
);

export const getPrivateBookingFutureAvailable = createSelector(
  getPrivateBookingListBase,
  (bookings) =>
    bookings.filter((b) => b.booking_status_code === BOOKING_STATUS_OK.id),
);

// eslint-disable-next-line
export const getPrivateBookingList: (State) => Array<PrivateBookingWithRelatedFields> = createSelector(
  [
    getPrivateBookingListBase,
    getMemberListData,
    _getPrivateServicesById,
    getAllPrivateSlotsDict,
  ],
  (bookings, memberData, services, slots) =>
    bookings.map((b) => ({
      ...b,
      member: memberData[b.member],
      private_service: services[b.private_service],
      private_slot: slots[b.private_slot],
    })),
);

const paramFilter = (state, params, periodFilter) => [params, periodFilter];

export const withMember = memoize((selector) =>
  createSelector([selector, getMemberListData], (bookings, memberData) =>
    bookings.map((b) => ({
      ...b,
      member: memberData[b.member],
    })),
  ),
);

export const withService = memoize((selector) =>
  createSelector([selector, getAllMembers], (bookings, services) =>
    bookings.map((b) => ({
      ...b,
      private_service: services[b.private_service],
    })),
  ),
);
export const withSlot = memoize((selector) =>
  createSelector([selector, getAllMembers], (bookings, slots) =>
    bookings.map((b) => ({
      ...b,
      private_slot: slots[b.private_slot],
    })),
  ),
);

export const bookingWithAllRelatedField = memoize((selector) =>
  withService(withSlot(withMember(selector))),
);

export const getPrivateBookingListFiltered = createSelector(
  [getPrivateBookingDict, paramFilter],
  (bookingData, [params, { start, end }]) => {
    return Object.values(bookingData).filter(
      (b) =>
        (!params ||
          Object.entries(params).reduce(
            (acc, [k, v]) => b[k] === v && acc,
            true,
          )) &&
        moment(b.date_end).isSameOrAfter(start, 'day') &&
        moment(b.date_start).isSameOrBefore(end, 'day'),
    );
  },
);

const _getRecurrenceRulePrivateBookingData = (state) =>
  state.privateService.recurrenceRule.byId;
const _getRecurrenceRulePrivateBookingListIds = (state) =>
  state.privateService.recurrenceRule.allIds;

export const getRecurrenceRulePrivateBookingList = createSelector(
  [
    _getRecurrenceRulePrivateBookingListIds,
    _getRecurrenceRulePrivateBookingData,
    getMemberListData,
    getMemberDetailData,
    getAllPrivateSlotsDict,
    getAllCoachesDict,
    getAllEstablishmentsDict,
  ],
  (
    ids,
    data,
    memberData,
    memberDetailData,
    privateSlotData,
    coachData,
    establishmentData,
  ) =>
    ids
      .map((id) => data[id])
      .map((rpb) => ({
        ...rpb,
        member: memberData[rpb.member] || memberDetailData[rpb.member],
        private_slot: privateSlotData[rpb.private_slot],
        associated_coach: coachData[rpb.associated_coach],
        associated_establishment:
          establishmentData[rpb.associated_establishment],
      })),
);
