import type { MemberState } from "./store";

export const selectMembers = (state: MemberState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectMember = (state: MemberState, id: number) => state.byId[id];

export const selectCount = (state: MemberState) => state.count;

export const selectIrregularities = (state: MemberState) =>
  state.irregularities;
