import type { AttendanceState } from "./store";

export const selectAttendances = (state: AttendanceState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectAttendance = (state: AttendanceState, id: number) =>
  state.byId[id];

export const selectCount = (state: AttendanceState) => state.count;
