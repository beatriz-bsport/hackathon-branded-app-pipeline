import { roleStore } from "#src/store";
import type { Role } from "#src/types";

export const updateRole = (updatedRole: Role) => {
  roleStore.setState((state) => {
    if (!updatedRole) return state;

    const id = updatedRole.id;

    if (!id) return state;

    /**
     * @indication
     * Zustand automatically merges the return state with the current state
     * Meaning we don't have to provide ...state as long as we keep a flat store
     */
    return {
      byId: { ...state.byId, [id]: updatedRole },
    };
  });
};

export const setRoles = ({
  roles,
  count,
  page,
}: {
  roles: Role[];
  count: number;
  page: number;
}) => {
  roleStore.setState((state) => {
    const byId = roles.reduce((acc, role) => {
      acc[role.id] = role;
      return acc;
    }, state.byId);

    return {
      ids: roles.map((role) => role.id),
      byId,
      count,
      page,
    };
  });
};
