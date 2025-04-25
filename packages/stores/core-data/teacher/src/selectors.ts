import type { TeacherState } from "./store";

export const selectTeachers = (state: TeacherState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectTeacher = (state: TeacherState, id: number) =>
  state.byId[id];

export const selectCount = (state: TeacherState) => state.count;
