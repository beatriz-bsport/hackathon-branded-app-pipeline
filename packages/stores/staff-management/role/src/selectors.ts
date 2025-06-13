import type { RoleState } from "./store";

export const selectCompanyRoles = (state: RoleState) => {
  const { ids, byId } = state.companyRoles;
  return ids.map((id) => byId[id]);
};

export const selectCompanyRole = (state: RoleState, id: number) =>
  state.companyRoles.byId[id];

export const selectCompanyRoleCount = (state: RoleState) =>
  state.companyRoles.count;
