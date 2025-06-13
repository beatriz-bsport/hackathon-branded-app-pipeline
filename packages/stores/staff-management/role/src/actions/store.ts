import { buildById } from "@bsport/store-base";

import { roleStore } from "#src/store";
import type { CompanyRole, Staff } from "#src/types";

export const updateCompanyRole = (updatedRole: CompanyRole) => {
  roleStore.setState((state) => {
    if (!updatedRole?.id) return state;
    return {
      companyRoles: {
        ...state.companyRoles,
        byId: { ...state.companyRoles.byId, [updatedRole.id]: updatedRole },
      },
    };
  });
};

export const setCompanyRoles = ({
  roles,
  count,
  page,
}: {
  roles: CompanyRole[];
  count: number;
  page: number;
}) => {
  roleStore.setState((state) => {
    return {
      companyRoles: {
        ...state.companyRoles,
        ids: roles.map((role) => role.id),
        byId: buildById({ initial: state.companyRoles.byId, newItems: roles }),
        count,
        page,
      },
    };
  });
};

export const updateStaff = (updatedStaff: Staff) => {
  roleStore.setState((state) => {
    if (!updatedStaff?.id) return state;
    return {
      staff: {
        ...state.staff,
        byId: { ...state.staff.byId, [updatedStaff.id]: updatedStaff },
      },
    };
  });
};

export const setStaff = ({
  staffList,
  count,
  page,
}: {
  staffList: Staff[];
  count: number;
  page: number;
}) => {
  roleStore.setState((state) => {
    return {
      staff: {
        ...state.staff,
        ids: staffList.map((role) => role.id),
        byId: buildById({ initial: state.staff.byId, newItems: staffList }),
        count,
        page,
      },
    };
  });
};
