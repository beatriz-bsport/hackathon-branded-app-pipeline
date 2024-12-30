import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  retrieveMyLastClockInActions,
  clockInActions,
  editClockInActions,
  deleteClockInActions,
  listStaffAttendanceRealTimeActions,
  getStaffsAttendanceHistoryActions,
  exportStaffAttendanceHistoryActions,
  clockinTotalTimeActions,
} from './actions';
import {
  ClockInState,
  UserAttendanceRecord,
  UserTotalAttendance,
} from './types';
import { PaginatedResponse } from '#src/state/types';

type ReduceType<T> = Record<number, T>;

const initialState: Immutable.Immutable<ClockInState> = Immutable<ClockInState>(
  {
    lastClockIn: {
      id: null,
      dateEnd: null,
      dateStart: null,
      onGoing: false,
      loading: false,
      error: null,
    },
    currentAttendance: {
      next_page: 0,
      previous_page: 0,
      count: 0,
      allIds: [],
      byId: {},
      byUserId: {},
      loading: false,
      error: null,
    },
    attendanceRecords: {
      next_page: 0,
      previous_page: 0,
      count: 0,
      allIds: [],
      byId: {},
      loading: false,
      error: null,
    },
    totalAttendance: {
      next_page: 0,
      previous_page: 0,
      count: 0,
      byUserId: {},
      loading: false,
      error: null,
    },
    loading: false,
    error: null,
  },
);

export default handleActions<Immutable.Immutable<ClockInState>, any>(
  {
    [retrieveMyLastClockInActions.loading.toString()]: (state, { payload }) =>
      state.setIn(['lastClockIn', 'loading'], payload),
    [retrieveMyLastClockInActions.error.toString()]: (state, { payload }) =>
      state.setIn(['lastClockIn', 'error'], payload),
    [retrieveMyLastClockInActions.success.toString()]: (state, { payload }) =>
      state
        .setIn(['lastClockIn', 'dateStart'], payload?.date_start)
        .setIn(['lastClockIn', 'dateEnd'], payload?.date_end)
        .setIn(['lastClockIn', 'onGoing'], payload?.on_going)
        .setIn(['lastClockIn', 'id'], payload?.id),
    [clockInActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [clockInActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),

    [editClockInActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [editClockInActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),
    [editClockInActions.success.toString()]: (state, { payload }) => {
      const newRecord = payload as unknown as UserAttendanceRecord; //typecast because of wierdly declared payload type
      const oldRecord = state.attendanceRecords.byId[newRecord.id];
      const totalTimeDelta =
        newRecord.date_end -
        newRecord.date_start -
        (oldRecord.date_end - oldRecord.date_start);
      return state.merge(
        {
          attendanceRecords: { byId: { [newRecord.id]: newRecord } },
          totalAttendance: {
            byUserId: {
              [newRecord.user]: {
                working_time_in_seconds:
                  state.totalAttendance.byUserId[newRecord.user]
                    .working_time_in_seconds + totalTimeDelta,
              },
            },
          },
        },
        { deep: true },
      );
    },
    [deleteClockInActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [deleteClockInActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),
    [deleteClockInActions.success.toString()]: (state, { payload }) => {
      const deletedRecord = state.attendanceRecords.byId[payload.clockInId];
      const deletedDuration = deletedRecord.date_end - deletedRecord.date_start;
      return state
        .setIn(
          ['attendanceRecords', 'allIds'],
          state.attendanceRecords.allIds.filter(
            (id) => id !== payload.clockInId,
          ),
        )
        .setIn(
          [
            'totalAttendance',
            'byUserId',
            deletedRecord.user.toString(),
            'working_time_in_seconds',
          ],
          state.totalAttendance.byUserId[deletedRecord.user]
            .working_time_in_seconds - deletedDuration,
        );
    },
    [listStaffAttendanceRealTimeActions.loading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['currentAttendance', 'loading'], payload),
    [listStaffAttendanceRealTimeActions.error.toString()]: (
      state,
      { payload },
    ) => state.setIn(['currentAttendance', 'error'], payload),
    [listStaffAttendanceRealTimeActions.success.toString()]: (
      state,
      { payload },
    ) =>
      state
        .setIn(['currentAttendance', 'count'], payload.count)
        .setIn(['currentAttendance', 'next_page'], payload.next_page)
        .setIn(['currentAttendance', 'previous_page'], payload.previous_page)
        .setIn(
          ['currentAttendance', 'allIds'],
          //@ts-expect-error
          payload.results.map((r) => r.id),
        )
        .merge(
          {
            currentAttendance: {
              byId: payload.results.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(
          ['currentAttendance', 'byUserId'],
          payload.results.reduce((acc: any, ps: any) => {
            acc[ps.user] = ps;
            return acc;
          }, {}),
        ),
    [getStaffsAttendanceHistoryActions.loading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['attendanceRecords', 'loading'], payload),
    [getStaffsAttendanceHistoryActions.error.toString()]: (
      state,
      { payload },
    ) => state.setIn(['attendanceRecords', 'error'], payload),
    [getStaffsAttendanceHistoryActions.success.toString()]: (
      state,
      { payload },
    ) =>
      state
        .setIn(['attendanceRecords', 'count'], payload.count)
        .setIn(['attendanceRecords', 'next_page'], payload.next_page)
        .setIn(['attendanceRecords', 'previous_page'], payload.previous_page)
        .setIn(
          ['attendanceRecords', 'allIds'],
          //@ts-expect-error
          payload.results.map((r) => r.id),
        )
        .merge(
          {
            attendanceRecords: {
              byId: payload.results.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        ),

    [exportStaffAttendanceHistoryActions.loading.toString()]: (
      state,
      { payload },
    ) => state.set('loading', payload),

    [exportStaffAttendanceHistoryActions.error.toString()]: (
      state,
      { payload },
    ) => state.set('loading', payload),
    [clockinTotalTimeActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['totalAttendance', 'loading'], payload);
    },
    [clockinTotalTimeActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['totalAttendance', 'error'], payload);
    },
    [clockinTotalTimeActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<UserTotalAttendance> },
    ) => {
      return state
        .setIn(['totalAttendance', 'count'], payload.count)
        .setIn(['totalAttendance', 'next_page'], payload.next_page)
        .merge(
          {
            totalAttendance: {
              byUserId: payload.results.reduce<ReduceType<UserTotalAttendance>>(
                (acc, userTotal) => {
                  acc[userTotal.user_id] = userTotal;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },
  },
  initialState,
);
