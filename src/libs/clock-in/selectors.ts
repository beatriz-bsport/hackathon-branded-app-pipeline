import { createSelector } from 'reselect';
import memoize from 'lodash/memoize';
import { RootState } from '../../reducers';
import {
  getUsersPaginatedWithRole,
  UsersPaginatedWithRoleSelector,
} from '#libs/role/selectors';

const _getClockinState = (state: RootState) => state.clockIn;

export const getLastClockin = (state: RootState) =>
  _getClockinState(state).lastClockIn;

const _getAttendanceClockinDataByUser = (state: RootState) =>
  _getClockinState(state).currentAttendance.byUserId;

const _getHistoryClockinData = (state: RootState) =>
  _getClockinState(state).history.byId;

const _getHistoryClockinList = (state: RootState) =>
  _getClockinState(state).history.allIds;

const getHistoryDataList = createSelector(
  [_getHistoryClockinList, _getHistoryClockinData],
  (list, dict) => list.map((id) => dict[id]),
);

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
      [selector, getHistoryDataList],
      (usersPaginated, attendanceHistory) => {
        if (!usersPaginated?.results) return usersPaginated;
        return {
          ...usersPaginated,
          results: usersPaginated.results.map((u) => ({
            ...u,
            history: attendanceHistory?.filter((data) => data.user === u.id),
          })),
        };
      },
    ),
);
