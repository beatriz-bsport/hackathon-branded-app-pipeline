import { Result } from "typescript-result";

import {
  type Action,
  type PaginatedResponse,
  createErrorWithContext,
  serializeContext,
} from "@bsport/store-base";

import {
  type FetchCompanyStaffsParams,
  type UpdateCompanyStaffParams,
  createCompanyStaffAPI,
  deleteCompanyStaffAPI,
  fetchCompanyStaffListAPI,
  updateCompanyStaffAPI,
} from "#src/api/company-staff";
import type { CompanyStaffData, Staff } from "#src/types";

import { setStaff, updateStaff } from "./store";

/**
 * Fetch the list of Staff of the user company
 * @param page_size [Optional] Size for the pagination. If provided, the fetch will be paginated.
 * @param page [Optional] Page for the pagination. If provided, the fetch will be paginated.
 * @param role__in [Optional] Select Staff that meet the expected roles in the provided list.
 * @param role_exclude [Optional] Filter out Staff that meet the roles in the provided list.
 */
export const fetchCompanyStaffListAction: Action<
  FetchCompanyStaffsParams,
  Array<Staff> | PaginatedResponse<Staff>
> = async (fetch, params) => {
  const [uri, init] = fetchCompanyStaffListAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      if (Array.isArray(data)) {
        setStaff({
          staffList: data,
          count: data.length,
          page: 1,
        });
      } else {
        setStaff({
          staffList: data.results,
          count: data.count,
          page: data.page,
        });
      }

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch company Staff list",
      }),
  );
};

/**
 * Create a Staff (User) with a company Role with the provided data
 * @param data.email Email for the new Staff account.
 * @param data.password Password for the new Staff account.
 * @param data.role Id of the role to assign to the new Staff.
 * @param data.first_name First name for the new Staff account.
 * @param data.last_name Last name for the new Staff account.
 * @param data.coaches_in_role_ids List of Teacher Id that the Staff will have management over.
 * @param data.establishments_in_role_ids List of Establishement Id that the Staff will have management over.
 */
export const createCompanyStaffAction: Action<
  { data: CompanyStaffData },
  Staff
> = async (fetch, params) => {
  const [uri, init] = createCompanyStaffAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateStaff(data);

      return data;
    },
    (error) => {
      return createErrorWithContext(error, {
        message: "Failed to create new company Staff",
        params: serializeContext(params.data),
      });
    },
  );
};

/**
 * Update the Staff related to the provided id with the provided data.
 * @param id Id of the Staff to update.
 * @param data.roleId Id of the Company Role to assign to the Staff.
 * @param data.coaches List of Teacher id to add management permissions over.
 * @param data.establishments List of Establishment id to add management permissions over.
 * /!\ Either update roleId, or coaches & establishments, not both at the same time.
 */
export const updateCompanyStaffAction: Action<
  UpdateCompanyStaffParams,
  Staff
> = async (fetch, params) => {
  const [uri, init] = updateCompanyStaffAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateStaff(data);

      return data;
    },
    (error) => {
      return createErrorWithContext(error, {
        message: "Failed to update company Staff",
        params: {
          data: serializeContext(params.data),
          id: params.id,
        },
      });
    },
  );
};

/**
 * Delete the Company staff related to the provided id
 * @param id Id of the Staff to delete
 */
export const deleteCompanyStaffAction: Action<{ id: number }, void> = async (
  fetch,
  params,
) => {
  const [uri, init] = deleteCompanyStaffAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to delete company Staff",
        params,
      }),
  );
};
