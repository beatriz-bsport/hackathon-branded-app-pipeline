// @ts-nocheck
import { ErrorAndLoading } from '#libs/types';
import type { UserRole, Role } from '#libs/role/types';

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
  history: {
    next_page: number;
    previous_page: number;
    count: number;
    allIds: number[];
    byId: Record<number, UserCurrentAttendance>;
  } & ErrorAndLoading;
} & ErrorAndLoading;

export type UserWithRealTimeAttendance = UserRole<Role> & {
  attendance: ClockInData;
};
