import { buildById } from "@bsport/store-base";

import { attendanceStore } from "#src/store";
import type { Attendance } from "#src/types";

export const updateAttendance = (updatedAttendance: Attendance) => {
  attendanceStore.setState((state) => {
    if (!updatedAttendance) return state;

    const id = updatedAttendance.id;

    if (!id) return state;

    return {
      byId: { ...state.byId, [id]: updatedAttendance },
    };
  });
};

export const setAttendances = ({
  attendances,
  count,
  page,
}: {
  attendances: Attendance[];
  count: number;
  page: number;
}) => {
  attendanceStore.setState((state) => {
    return {
      ids: attendances.map((attendance) => attendance.id),
      byId: buildById<Attendance>({
        initial: state.byId,
        newItems: attendances,
      }),
      count,
      page,
    };
  });
};
