import { useSuspenseQueries } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type EstablishmentBillingGroup,
  type Teacher,
  fetchEstablishmentBillingGroups,
  fetchFlatTeachers,
  teacherKeys,
} from "@bsport/api-core";
import {
  fetchRoleDefinitionsQueryOptions,
  paginatedUserRolesQueryOptions,
} from "@bsport/api-staff-management/role";
import { RoleType } from "@bsport/common/lib/master-data/user-role";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import type { StaffRowData } from "#src/components/staff-table/types";
import { fetch } from "#src/utils/fetch";

export type StaffActiveFilters = {
  role__in?: number[];
};

const TEACHERS_STALE_TIME = 2 * 60 * 1000;
const BILLING_GROUPS_STALE_TIME = 5 * 60 * 1000;

export const useStaffListQuery = (activeFilters: StaffActiveFilters = {}) => {
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const staffListQueryOptions = paginatedUserRolesQueryOptions(fetch, {
    page: currentPage,
    page_size: currentPageSize,
    ...activeFilters,
  });

  const [
    { data: staffData, isFetching: isFetchingStaff },
    { data: roles },
    { data: teachers = [] },
    { data: billingGroups = [] },
  ] = useSuspenseQueries({
    queries: [
      staffListQueryOptions,
      fetchRoleDefinitionsQueryOptions(fetch),
      {
        queryKey: teacherKeys.list({ company: companyId }),
        queryFn: () =>
          companyId !== undefined
            ? fetchFlatTeachers(fetch, { company: companyId })
            : Promise.resolve([] as Teacher[]),
        staleTime: TEACHERS_STALE_TIME,
      },
      {
        queryKey: [
          "@api-core",
          "establishment-billing-groups",
          "list",
          { company: companyId },
        ] as const,
        queryFn: () =>
          companyId !== undefined
            ? fetchEstablishmentBillingGroups(fetch, { company: companyId })
            : Promise.resolve([] as EstablishmentBillingGroup[]),
        select: (
          data:
            | EstablishmentBillingGroup[]
            | { results: EstablishmentBillingGroup[] },
        ): EstablishmentBillingGroup[] =>
          Array.isArray(data) ? data : (data.results ?? []),
        staleTime: BILLING_GROUPS_STALE_TIME,
      },
    ],
  });

  const staff = staffData.results;
  const totalItems = staffData.count;
  const isEmpty = totalItems === 0;

  const staffRows = useMemo<StaffRowData[]>(() => {
    const rolesById = new Map(roles.map((role) => [role.id, role]));
    const teachersById = new Map(
      teachers.map((teacher) => [teacher.id, teacher.name]),
    );
    const billingGroupsById = new Map(
      billingGroups.map((billingGroup) => [billingGroup.id, billingGroup.name]),
    );

    return staff.map((staffMember) => {
      const name =
        `${staffMember.first_name} ${staffMember.last_name}`.trim() ||
        staffMember.email;

      const role =
        staffMember.role !== null
          ? (rolesById.get(staffMember.role) ?? null)
          : null;

      return {
        id: staffMember.id,
        name,
        email: staffMember.email,
        roleName: role?.name ?? null,
        roleIsDefault: role !== null && !role.editable,
        isOwner: staffMember.role === RoleType.USER_ROLE_NO_RESTRICTION,
        billingGroupName:
          staffMember.staff_establishment_billing_group !== null
            ? (billingGroupsById.get(
                staffMember.staff_establishment_billing_group,
              ) ?? null)
            : null,
        assignedTeachers: staffMember.coaches_selected_in_role
          .map((teacherId) => teachersById.get(teacherId))
          .filter((teacherName): teacherName is string => Boolean(teacherName)),
        commission: `${staffMember.staff_commission_percentage}%`,
      };
    });
  }, [billingGroups, roles, staff, teachers]);

  const paginationProps: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageSettingsChange: (page, pageSize) => {
      if (pageSize !== currentPageSize) {
        setPageSettings(DEFAULT_PAGE, pageSize);
      } else {
        setPageSettings(page, pageSize);
      }
    },
    showRowsPerPageSelector: true,
  };

  return {
    staffRows,
    isEmpty,
    isFetching: isFetchingStaff,
    paginationProps,
    staffQueryKey: staffListQueryOptions.queryKey,
  };
};
