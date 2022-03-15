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
    history: {
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
    [editClockInActions.success.toString()]: (state, { payload }) =>
      state.setIn(['history', 'byId', payload.id], payload),
    [deleteClockInActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [deleteClockInActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),
    [deleteClockInActions.success.toString()]: (state, { payload }) =>
      state.setIn(
        ['history', 'allIds'],
        state.history.allIds.filter((id) => id !== payload.clockInId),
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
        .setIn(['currentAttendance', 'count'], payload.count)
        .setIn(['currentAttendance', 'next_page'], payload.next_page)
        .setIn(['currentAttendance', 'previous_page'], payload.previous_page)
        .setIn(
          ['currentAttendance', 'allIds'],
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
    ) => state.setIn(['history', 'loading'], payload),
    [getStaffsAttendanceHistoryActions.error.toString()]: (
      state,
      { payload },
    ) => state.setIn(['history', 'error'], payload),
    [getStaffsAttendanceHistoryActions.success.toString()]: (
      state,
      { payload },
    ) =>
      state
        .setIn(['history', 'count'], payload.count)
        .setIn(['history', 'next_page'], payload.next_page)
        .setIn(['history', 'previous_page'], payload.previous_page)
        .setIn(
          ['history', 'allIds'],
          payload.results.map((r) => r.id),
        )
        .merge(
          {
            history: {
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
