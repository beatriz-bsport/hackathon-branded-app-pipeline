import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  retrieveLastClockInActions,
  clockInActions,
  editClockInActions,
  deleteClockInActions,
  listStaffAttendanceRealTimeActions,
  getStaffsAttendanceHistoryActions,
  exportStaffAttendanceHistoryActions,
} from './actions';
import { ClockInState } from './types';

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
    loading: false,
    error: null,
  },
);

export default handleActions(
  {
    [retrieveLastClockInActions.loading.toString()]: (state, { payload }) =>
      state.setIn(['lastClockIn', 'loading'], payload),
    [retrieveLastClockInActions.error.toString()]: (state, { payload }) =>
      state.setIn(['lastClockIn', 'error'], payload),
    [retrieveLastClockInActions.success.toString()]: (state, { payload }) =>
      state
        // @ts-expect-error
        .setIn(['lastClockIn', 'dateStart'], payload?.date_start)
        // @ts-expect-error
        .setIn(['lastClockIn', 'dateEnd'], payload?.date_end)
        // @ts-expect-error
        .setIn(['lastClockIn', 'onGoing'], payload?.on_going)
        // @ts-expect-error
        .setIn(['lastClockIn', 'id'], payload?.id),

    [clockInActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [clockInActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),

    [editClockInActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [editClockInActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),
    [editClockInActions.success.toString()]: (state, { payload }) =>
      // @ts-expect-error
      state.setIn(['attendanceRecords', 'byId', payload.id], payload),
    [deleteClockInActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [deleteClockInActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),
    [deleteClockInActions.success.toString()]: (state, { payload }) =>
      state.setIn(
        ['attendanceRecords', 'allIds'],
        // @ts-expect-error
        state.attendanceRecords.allIds.filter((id) => id !== payload.clockInId),
      ),
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
        // @ts-expect-error
        .setIn(['currentAttendance', 'count'], payload.count)
        // @ts-expect-error
        .setIn(['currentAttendance', 'next_page'], payload.next_page)
        // @ts-expect-error
        .setIn(['currentAttendance', 'previous_page'], payload.previous_page)
        .setIn(
          ['currentAttendance', 'allIds'],
          // @ts-expect-error
          payload.results.map((r) => r.id),
        )
        .merge(
          {
            currentAttendance: {
              // @ts-expect-error
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
          // @ts-expect-error
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
        // @ts-expect-error
        .setIn(['attendanceRecords', 'count'], payload.count)
        // @ts-expect-error
        .setIn(['attendanceRecords', 'next_page'], payload.next_page)
        // @ts-expect-error
        .setIn(['attendanceRecords', 'previous_page'], payload.previous_page)
        .setIn(
          ['attendanceRecords', 'allIds'],
          // @ts-expect-error
          payload.results.map((r) => r.id),
        )
        .merge(
          {
            attendanceRecords: {
              // @ts-expect-error
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
  },
  initialState,
);
