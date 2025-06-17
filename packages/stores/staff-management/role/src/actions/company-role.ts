import { Result } from "typescript-result";

import {
  type Action,
  createErrorWithContext,
  serializeContext,
} from "@bsport/store-base";

import {
  type CreateCompanyRoleParams,
  type UpdateCompanyRoleParams,
  createCompanyRoleAPI,
  deleteCompanyRoleAPI,
  fetchCompanyRolesAPI,
  updateCompanyRoleAPI,
} from "#src/api/company-role";
import type { CompanyRole } from "#src/types";

import { setCompanyRoles, updateCompanyRole } from "./store";

/**
 * Fetch the list of Roles of the company
 */
export const fetchCompanyRolesAction: Action<void, Array<CompanyRole>> = async (
  fetch,
) => {
  const [uri, init] = fetchCompanyRolesAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCompanyRoles({
        roles: data,
        count: data.length,
        page: 1,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, { message: "Failed to fetch roles" }),
  );
};

/**
 * Create a Role in the company with the provided data
 * @param data.name Name of the Role
 * @param data.description Description of the Role
 * @param data.permissions RolePermissions of the Role
 * @param data.has_booking_override_control Whether to enable booking override
 */
export const createCompanyRoleAction: Action<
  CreateCompanyRoleParams,
  CompanyRole
> = async (fetch, params) => {
  const [uri, init] = createCompanyRoleAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateCompanyRole(data);

      return data;
    },
    (error) => {
      return createErrorWithContext(error, {
        message: "Failed to create new role",
        params: serializeContext(params.data),
      });
    },
  );
};

/**
 * Update the Role related to the provided id with the partial data
 * @param id Id of the Role to update
 * @param data Specific fields of the Role to update
 */
export const updateCompanyRoleAction: Action<
  UpdateCompanyRoleParams,
  CompanyRole
> = async (fetch, params) => {
  const [uri, init] = updateCompanyRoleAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateCompanyRole(data);

      return data;
    },
    (error) => {
      return createErrorWithContext(error, {
        message: "Failed to update role",
        params: {
          data: serializeContext(params.data),
          id: params.id,
        },
      });
    },
  );
};

/**
 * Delete the Role related to the provided id
 * @param id Id of the Role to delete
 */
export const deleteCompanyRoleAction: Action<{ id: number }, void> = async (
  fetch,
  params,
) => {
  const [uri, init] = deleteCompanyRoleAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to delete role",
        params,
      }),
  );
};
