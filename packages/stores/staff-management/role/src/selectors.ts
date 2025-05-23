import type { RoleState } from "./store";

export const selectRoles = (state: RoleState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectRole = (state: RoleState, id: number) => state.byId[id];

export const selectCount = (state: RoleState) => state.count;
