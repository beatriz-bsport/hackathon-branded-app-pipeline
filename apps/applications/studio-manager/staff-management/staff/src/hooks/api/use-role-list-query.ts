import { useSuspenseQueries } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  fetchRoleDefinitionsQueryOptions,
  flatUserRolesQueryOptions,
} from "@bsport/api-staff-management/role";

import type {
  RolePermissionGroupKey,
  RolePermissionSummary,
  RoleRowData,
} from "#src/components/role-table/types";
import { fetch } from "#src/utils/fetch";

type PermissionGroup = {
  key: RolePermissionGroupKey;
  value: unknown;
};

const countEnabledPermissions = (value: unknown): number => {
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  if (Array.isArray(value) || typeof value !== "object" || value === null) {
    return 0;
  }

  return Object.values(value).reduce(
    (count, childValue) => count + countEnabledPermissions(childValue),
    0,
  );
};

const getPermissionSummary = (
  groups: PermissionGroup[],
): RolePermissionSummary[] =>
  groups
    .map(({ key, value }) => ({
      key,
      count: countEnabledPermissions(value),
    }))
    .filter(({ count }) => count > 0);

export const useRoleListQuery = () => {
  const [
    { data: roles, isFetching: isFetchingRoles },
    { data: staff, isFetching: isFetchingStaff },
  ] = useSuspenseQueries({
    queries: [
      fetchRoleDefinitionsQueryOptions(fetch),
      flatUserRolesQueryOptions(fetch),
    ],
  });

  const roleRows = useMemo<RoleRowData[]>(() => {
    const staffCountByRoleId = staff.reduce<Map<number, number>>(
      (counts, staffMember) => {
        if (staffMember.role !== null) {
          counts.set(staffMember.role, (counts.get(staffMember.role) ?? 0) + 1);
        }

        return counts;
      },
      new Map(),
    );

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      editable: role.editable,
      isDefault: !role.editable,
      permissions: getPermissionSummary([
        {
          key: "navigationMenu",
          value: {
            ...role.permissions.navigationMenu,
            accessMonitoring: undefined,
          },
        },
        {
          key: "accessMonitoring",
          value: role.permissions.navigationMenu.accessMonitoring,
        },
        {
          key: "appBarButtons",
          value: role.permissions.appbarButtons,
        },
        {
          key: "generalAccess",
          value: {
            checkin: role.permissions.checkin,
            navigation: role.permissions.navigation,
            clockIn: role.permissions.clockIn,
            appbarActions: role.permissions.appbarActions,
          },
        },
        {
          key: "billing",
          value: role.object_level_permissions.billing,
        },
        {
          key: "export",
          value: role.object_level_permissions.export,
        },
        {
          key: "management",
          value: role.object_level_permissions.management,
        },
        {
          key: "memberManagement",
          value: role.object_level_permissions.member,
        },
        {
          key: "planning",
          value: role.object_level_permissions.planning,
        },
        {
          key: "productManagement",
          value: role.object_level_permissions.product,
        },
        {
          key: "reports",
          value: role.object_level_permissions.report,
        },
        {
          key: "reservationManagement",
          value: role.object_level_permissions.reservation,
        },
        {
          key: "sessionManagement",
          value: role.object_level_permissions.session,
        },
      ]),
      staffAssignedCount: staffCountByRoleId.get(role.id) ?? 0,
    }));
  }, [roles, staff]);

  return {
    roleRows,
    isEmpty: roles.length === 0,
    isFetching: isFetchingRoles || isFetchingStaff,
  };
};
