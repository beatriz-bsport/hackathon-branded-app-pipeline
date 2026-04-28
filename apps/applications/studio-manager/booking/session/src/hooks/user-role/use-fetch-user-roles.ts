import { useQuery } from "@tanstack/react-query";

import {
  UserRole,
  flatUserRolesQueryOption,
} from "@bsport/api-staff-management/role";

import { fetch } from "#src/utils/fetch";

const USER_ROLES_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const useFetchUserRole = <T = UserRole[]>(options?: {
  select?: (data: UserRole[]) => T;
}) =>
  useQuery({
    ...flatUserRolesQueryOption(fetch),
    staleTime: USER_ROLES_STALE_TIME,
    select: options?.select,
  });
