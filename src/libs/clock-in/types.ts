import { ErrorAndLoading } from '#src/libs/types';
import type { UserRole, Role } from '#src/libs/role/types';
import { withHistoryAttendance } from './selectors';

export type ClockInQueryParams = {
  user_id__in?: number[];
  id__in?: number[];
  current?: boolean;
  completed?: boolean;
  min_date?: number;
  max_date?: number;
};

export type LastClockIn = {
  id?: number;
  dateEnd?: number;
  dateStart?: number;
  onGoing: boolean;
};

export type UserCurrentAttendance = {
  firstname: string;
  lastname: string;
  email: string;
  user: number;
  role: number;
  lastClockIn: string;
  ongoing: boolean;
};

export type UserAttendanceRecord = {
  id: number;
  user: number;
  date_start: number;
  date_end: number;
  on_going: boolean;
  company: number;
};

export type ClockInData = {
  user: number;
  company: number;
  id: number;
  date_start: number | null;
  date_end: number | null;
  on_going: boolean;
};

export type ClockInState = {
  lastClockIn: LastClockIn & ErrorAndLoading;
  currentAttendance: {
    next_page: number;
    previous_page: number;
    count: number;
    allIds: number[];
    byId: Record<number, UserCurrentAttendance>;
    byUserId: Record<number, UserCurrentAttendance>;
  } & ErrorAndLoading;
  attendanceRecords: {
    next_page: number;
    previous_page: number;
    count: number;
    allIds: number[];
    byId: Record<number, UserAttendanceRecord>;
  } & ErrorAndLoading;
} & ErrorAndLoading;

export type UserWithRealTimeAttendance = UserRole<Role> & {
  attendance: ClockInData;
};

export type UserAttendanceHistory = ReturnType<
  ReturnType<typeof withHistoryAttendance>
>['results'][number];
