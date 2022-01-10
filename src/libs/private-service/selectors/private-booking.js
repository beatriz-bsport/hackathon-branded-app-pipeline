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
import { getPrivateConsumerPassDict } from './private-consumer-pass';

import { getAllCoachesDict } from '../../associated-coach/selectors';
import { getAllEstablishmentsDict } from '../../establishment/selectors';
import { getTagGroupsDict, getTagsDict } from '../../tag/selectors';

import {
  getMemberProgramByMemberDict,
  getMemberProgramDict,
  getMetricDict,
  getProgramDict,
} from '#libs/performance-tracking/selector';
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
        return {
          ...bookings,
          coach: coachData[bookings.coach],
          establishment: estalbishmentData[bookings.establishment],
          private_service: serviceData[bookings.private_service],
          private_slot: slotData[bookings.private_slot],
          private_consumer_pass:
            privateConsumerPassData[bookings.private_consumer_pass] ||
            bookings.private_consumer_pass,
          member: {
            ...memberData[bookings.member],
            tags: memberData[bookings.member]?.tags?.map((tag_id: number) => ({
              ...tagDict[tag_id],
              group: tagGroupData[tagDict[tag_id]?.group],
            })),
          } || {
            ...memberDetailData[bookings.member],
            tags: memberDetailData[bookings.member]?.tags?.map(
              (tag_id: number) => ({
                ...tagDict[tag_id],
                group: tagGroupData[tagDict[tag_id]?.group],
              }),
            ),
          },
        };
      }
      return bookings.map((b) => ({
        ...b,
        coach: coachData[b.coach],
        establishment: estalbishmentData[b.establishment],
        private_service: serviceData[b.private_service],
        private_slot: slotData[b.private_slot],
        member: {
          ...memberData[b.member],
          tags: memberData[b.member]?.tags?.map((tag_id: number) => ({
            ...tagDict[tag_id],
            group: tagGroupData[tagDict[tag_id]?.group],
          })),
        } || {
          ...memberDetailData[b.member],
          tags: memberDetailData[b.member]?.tags?.map((tag_id: number) => ({
            ...tagDict[tag_id],
            group: tagGroupData[tagDict[tag_id]?.group],
          })),
        },
        private_consumer_pass:
          privateConsumerPassData[b.private_consumer_pass] ||
          b.private_consumer_pass,
      }));
    },
  ),
);

export const composeBookingsWithMemberProgram = memoize(
  (selector: (state: RootState) => Array<PrivateBookingWithRelatedFields>) =>
    createSelector(
      [
        selector,
        getMemberProgramByMemberDict,
        getMemberProgramDict,
        getProgramDict,
        getMetricDict,
      ],
      (
        bookings,
        memberProgramByMemberDict,
        memberProgramDict,
        programDict,
        metricDict,
      ) => {
        if (!bookings) return bookings;
        if (Array.isArray(bookings)) {
          return bookings?.map((booking) => {
            return {
              ...booking,
              member: {
                ...booking.member,
                memberProgramList: memberProgramByMemberDict[booking.member.id]
                  ?.map((id) => memberProgramDict[id])
                  ?.filter((mp) => !mp.is_disabled)
                  ?.filter(
                    (mp) => programDict[mp.program]?.is_disabled === false,
                  )
                  .map((memberProgram) => ({
                    ...memberProgram,
                    program: programDict[memberProgram.program],

                    metric_record: {
                      ...memberProgram.metric_record,
                      general: {
                        ...memberProgram?.metric_record?.general,
                        metrics:
                          memberProgram?.metric_record?.general?.metric_ids
                            ?.filter((id) => metricDict[id])
                            .map(
                              (id) =>
                                memberProgram?.metric_record?.general?.metrics[
                                  id
                                ],
                            )
                            .map((metricRecord) => ({
                              ...metricRecord,
                              metric: metricDict[metricRecord.metric_id],
                            })),
                      },
                    },
                  })),
              },
            };
          });
        }

        return {
          ...bookings,
          member: {
            ...bookings?.member,
            memberProgramList: memberProgramByMemberDict[bookings?.member.id]
              ?.map((id) => memberProgramDict[id])
              ?.filter((mp) => !mp.is_disabled)
              ?.filter((mp) => programDict[mp.program]?.is_disabled === false)
              .map((memberProgram) => ({
                ...memberProgram,
                program: programDict[memberProgram.program],

                metric_record: {
                  ...memberProgram.metric_record,
                  general: {
                    ...memberProgram?.metric_record?.general,
                    metrics: memberProgram?.metric_record?.general?.metric_ids
                      ?.filter((id) => metricDict[id])
                      .map(
                        (id) =>
                          memberProgram?.metric_record?.general?.metrics[id],
                      )
                      .map((metricRecord) => ({
                        ...metricRecord,
                        metric: metricDict[metricRecord.metric_id],
                      })),
                  },
                },
              })),
          },
        };
      },
    ),
);

export const getPrivateBooking = (state, id) =>
  getPrivateBookingDict(state)[id];

const _getPrivateBookingListId: (State) => Array<number> = (state) =>
  state.privateService.privateBooking.allIds;

export const getPrivateBookingListBase: (State) => Array<PrivateBooking> =
  createSelector(
    [_getPrivateBookingListId, getPrivateBookingDict],
    (ids, data) => ids.map((id) => data[id]).filter((b) => !!b),
  );

export const getPrivateBookingFutureAvailable = createSelector(
  getPrivateBookingListBase,
  (bookings) =>
    bookings.filter((b) => b.booking_status_code === BOOKING_STATUS_OK.id),
);

export const getPrivateBookingList: (State) => Array<PrivateBookingWithRelatedFields> =
  createSelector(
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
