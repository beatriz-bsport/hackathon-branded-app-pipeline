import type { TeacherState } from "./store";

export const selectTeachers = (state: TeacherState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectFlatTeachers = (state: TeacherState) => {
  const { flatIds, byId } = state;
  return flatIds.map((id) => byId[id]);
};

export const selectFuzzySearchTeachers = (state: TeacherState) => {
  const { fuzzyIds, byId } = state;
  return fuzzyIds.map((id) => byId[id]);
};

export const selectTeacher = (state: TeacherState, id: number) =>
  state.byId[id];

export const selectCount = (state: TeacherState) => state.count;

export const selectTeachersById = (state: TeacherState) => state.byId;
