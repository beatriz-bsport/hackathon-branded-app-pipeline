import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';
import {
  getUsersPaginatedWithRole,
  UsersPaginatedWithRoleSelector,
} from '#src/libs/role/selectors';
import { RootState } from '../../reducers';

const _getClockinState = (state: RootState) => state.clockIn;

export const getLastClockin = (state: RootState) =>
  _getClockinState(state).lastClockIn;

const _getAttendanceClockinDataByUser = (state: RootState) =>
  _getClockinState(state).currentAttendance.byUserId;

const _getHistoryClockinData = (state: RootState) =>
  _getClockinState(state).attendanceRecords.byId;

const _getHistoryClockinList = (state: RootState) =>
  _getClockinState(state).attendanceRecords.allIds;

const getHistoryDataList = createSelector(
  [_getHistoryClockinList, _getHistoryClockinData],
  (list, dict) => list.map((id) => dict[id]),
);

const _getTotalAttendanceByUser = (state: RootState) => {
  return _getClockinState(state).totalAttendance.byUserId;
};

export const getUsersPaginatedWithRolesWithRealTimeAttendance = createSelector(
  [getUsersPaginatedWithRole, _getAttendanceClockinDataByUser],
  (usersPaginated, attendanceByUserDict) => {
    if (!usersPaginated?.results) return usersPaginated;
    return {
      ...usersPaginated,
      results: usersPaginated.results.map((user) => ({
        ...user,
        attendance: attendanceByUserDict[user.id],
      })),
    };
  },
);

export const withHistoryAttendance = memoize(
  (selector: (state: RootState) => UsersPaginatedWithRoleSelector) =>
    createSelector(
      [selector, _getTotalAttendanceByUser, getHistoryDataList],
      (usersPaginated, attendanceByUserDict, attendanceHistory) => {
        if (!usersPaginated?.results) return usersPaginated;
        return {
          ...usersPaginated,
          results: usersPaginated.results.map((user) => ({
            ...user,
            history: (attendanceHistory ?? []).filter(
              (data) => data.user === user.id,
            ),
            totalAttendance:
              attendanceByUserDict[user.id]?.working_time_in_seconds ?? 0,
          })),
        };
      },
    ),
);
