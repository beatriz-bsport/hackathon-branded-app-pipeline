import { DateTime } from 'luxon';
import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import { BOOKING_STATUS_OK } from '@bsport/common/master-data/booking_status_code.js';
import {
  getMemberProgramByMemberDict,
  getMemberProgramDict,
  getMetricDict,
  getProgramDict,
} from '#src/libs/performance-tracking/selector';
import { Member } from '#src/libs/member/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Establishment } from '#src/libs/establishment/types';
import { StaffModificationHistory } from '#src/libs/role/types';
import { Period } from '#src/libs/types';
import { RootState } from '../../../reducers';
import {
  PrivateBooking,
  PrivateService,
  PrivateSlot,
  RecurrenceRulePrivateBooking,
} from '../types';
import { getRoleStateById as getUsersById } from '../../role/selectors';

import { getMemberListData, getMemberDetailData } from '../../member/selectors';

import { getAllPrivateSlotsDict } from './private-slot';
import { _getPrivateServicesById } from './private-service';
import { getPrivateConsumerPassDict } from './private-consumer-pass';

import { getAllCoachesDict } from '../../associated-coach/selectors';
import { getAllEstablishmentsDict } from '../../establishment/selectors';
import { getTagGroupsDict, getTagsDict } from '../../tag/selectors';

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

export const getPrivateBookingDict = (state: RootState) =>
  state.privateService.privateBooking.byId;

export const withStaffModificationHistory = memoize((selector) =>
  createSelector([selector, getUsersById], (bookings, staffDict) => {
    if (!bookings) return null;
    if (!Array.isArray(bookings)) {
      return {
        ...bookings,
        staff_history: (bookings?.staff_history || []).map(
          (staffEvent: StaffModificationHistory) => ({
            ...staffEvent,
            staff: staffDict[staffEvent?.staff_id],
          }),
        ),
      };
    }
    return bookings.map((b) => ({
      ...b,
      staff_history: (b?.staff_history || []).map(
        (staffEvent: StaffModificationHistory) => ({
          ...staffEvent,
          staff: staffDict[staffEvent?.staff_id],
        }),
      ),
    }));
  }),
);

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
      getPrivateConsumerPassDict,

      getTagsDict,
      getTagGroupsDict,

      getMemberProgramByMemberDict,
      getMemberProgramDict,
      getProgramDict,
      getMetricDict,
    ],
    (
      bookings,
      coachData,
      estalbishmentData,
      serviceData,
      slotData,
      memberData,
      memberDetailData,
      privateConsumerPassData,

      tagDict,
      tagGroupData,
    ) => {
      if (!bookings) return null;
      if (!Array.isArray(bookings)) {
        return Immutable({
          ...bookings,
          coach: coachData[bookings.coach],
          establishment: estalbishmentData[bookings.establishment],
          private_service: serviceData[bookings.private_service],
          private_slot: slotData[bookings.private_slot],
          private_consumer_pass:
            privateConsumerPassData[bookings.private_consumer_pass] ||
            bookings.private_consumer_pass,
          member: !memberData[bookings.member]
            ? bookings.member
            : {
                ...memberData[bookings.member],
                tags: memberData[bookings.member]?.tags?.map(
                  (tag_id: number) => ({
                    ...tagDict[tag_id],
                    group: tagGroupData[tagDict[tag_id]?.group],
                  }),
                ),
              } || {
                ...memberDetailData[bookings.member],
                tags: memberDetailData[bookings.member]?.tags?.map(
                  (tag_id: number) => ({
                    ...tagDict[tag_id],
                    group: tagGroupData[tagDict[tag_id]?.group],
                  }),
                ),
              },
        });
      }
      return bookings.map((b) =>
        Immutable({
          ...b,
          coach: coachData[b.coach],
          establishment: estalbishmentData[b.establishment],
          private_service: serviceData[b.private_service],
          private_slot: slotData[b.private_slot],
          member: !memberData[b.member]
            ? b.member
            : {
                ...memberData[b.member],
                tags: memberData[b.member]?.tags?.map((tag_id: number) => ({
                  ...tagDict[tag_id],
                  group: tagGroupData[tagDict[tag_id]?.group],
                })),
              } || {
                ...memberDetailData[b.member],
                tags: memberDetailData[b.member]?.tags?.map(
                  (tag_id: number) => ({
                    ...tagDict[tag_id],
                    group: tagGroupData[tagDict[tag_id]?.group],
                  }),
                ),
              },
          private_consumer_pass:
            privateConsumerPassData[b.private_consumer_pass] ||
            b.private_consumer_pass,
        }),
      );
    },
  ),
);

export const composeBookingsWithMemberProgram = memoize((selector) =>
  createSelector(
    [
      selector,
      getMemberProgramByMemberDict,
      getMemberProgramDict,
      getProgramDict,
      getMetricDict,
    ],
    (bookings) => {
      if (!bookings) return bookings;
      if (Array.isArray(bookings)) {
        return bookings;
      }
      return bookings;
    },
  ),
);

export const getPrivateBooking = (state: RootState, id: string) =>
  getPrivateBookingDict(state)[id];

const _getPrivateBookingListId = (state: RootState) =>
  state.privateService.privateBooking.allIds;

export const getPrivateBookingListBase = createSelector(
  [_getPrivateBookingListId, getPrivateBookingDict],
  (ids, data) => ids.map((id) => data[id]).filter((b) => !!b),
);

export const getPrivateBookingFutureAvailable = createSelector(
  getPrivateBookingListBase,
  (bookings) =>
    bookings.filter((b) => b.booking_status_code === BOOKING_STATUS_OK.id),
);

export const getPrivateBookingList: (
  state: RootState,
) => Array<
  PrivateBooking<PrivateSlot, number, number, PrivateService, Member>
> = createSelector(
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

export const withMember = memoize((selector) =>
  createSelector([selector, getMemberListData], (bookings, memberData) =>
    // @ts-expect-error
    bookings.map((b) => ({
      ...b,
      member: memberData[b.member],
    })),
  ),
);

const paramFilter: (
  state: RootState,
  params: { [key in keyof PrivateBooking]: any },
  period: Period,
) => [{ [key in keyof PrivateBooking]: any }, Period] = (
  state,
  params,
  period,
) => [params, period];

export const getPrivateBookingListFiltered = createSelector(
  [getPrivateBookingDict, paramFilter],
  (bookingData, [params, { start, end }]) => {
    return Immutable(
      Object.values(bookingData).filter(
        (b) =>
          (!params ||
            Object.entries(params).reduce(
              (
                acc,
                [k, v]: [
                  keyof PrivateBooking,
                  PrivateBooking[keyof PrivateBooking],
                ],
              ) => b[k] === v && acc,
              true,
            )) &&
          DateTime.fromISO(b.date_end).startOf('day') >=
            DateTime.fromISO(start).startOf('day') &&
          DateTime.fromISO(b.date_start).startOf('day') <=
            DateTime.fromISO(end).startOf('day'),
      ),
    );
  },
);

const _getRecurrenceRulePrivateBookingData = (state: RootState) =>
  state.privateService.recurrenceRule.byId;

const _getRecurrenceRulePrivateBookingListIds = (state: RootState) =>
  state.privateService.recurrenceRule.allIds;

export const getRecurrenceRulePrivateBookingList: (
  state: RootState,
) => Array<
  RecurrenceRulePrivateBooking<Member, PrivateSlot, Coach, Establishment>
> = createSelector(
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
