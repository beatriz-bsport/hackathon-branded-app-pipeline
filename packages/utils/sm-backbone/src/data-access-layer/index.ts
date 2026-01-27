import { selectUserAccess, useAuthStore } from "@bsport/store-auth";
import {
  selectFeatures,
  useCompanyStore,
} from "@bsport/store-core-data-company";
import {
  selectCompanyTheme,
  updateCompanyThemeAction,
  useCompanyThemeStore,
} from "@bsport/store-core-data-company-theme";
import {
  selectCompanyRole,
  selectCompanyRoles,
  useRoleStore,
} from "@bsport/store-staff-management-role";

const useCompanyFeatures = () => {
  return useCompanyStore(selectFeatures);
};

const useCompanyTheme = () => {
  return useCompanyThemeStore(selectCompanyTheme);
};

const useUserAccess = () => {
  return useAuthStore(selectUserAccess);
};

const useCompanyRoles = () => {
  return useRoleStore(selectCompanyRoles);
};

const useUserRole = () => {
  const roleId = useUserAccess()?.role;
  return useRoleStore((state) => selectCompanyRole(state, roleId ?? -1));
};

const useUserRestrictedTeachers = () => {
  return useUserAccess()?.coaches_selected_in_role ?? [];
};

export const dataAccessLayer = {
  useCompanyFeatures,
  useCompanyTheme,
  useUserAccess,
  useUserRole,
  useCompanyRoles,
  updateCompanyThemeAction,
  useUserRestrictedTeachers,
};
