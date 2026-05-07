import type { DeepPartial } from "@bsport/store-base";

import type { CompanyRolePermissions } from "./company-role-permissions";
import type { ObjectLevelPermissions } from "./object-level-permissions";

export type UserRoleListParams = {
  role?: number;
  role__in?: number[];
  role_exclude?: number[];
};

export type PaginatedParameters = {
  page?: number;
  page_size?: number;
  paginated?: boolean;
};

export type PaginatedUserRoleListParams = UserRoleListParams &
  PaginatedParameters;

/**
 * Data type to create a new Staff in a Company.
 */
export interface CompanyStaffData {
  id?: number;
  email: string;
  password: string;
  role: number;
  first_name: string;
  last_name: string;
  coaches_in_role_ids: number[];
  establishments_in_role_ids: number[];
}

export type CreateUserRoleParams = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: number;
  staff_commission_percentage?: number;
  coaches_in_role_ids?: number[];
  establishments_in_role_ids?: number[];
  staff_establishment_billing_group?: number | null;
};

export type UpdateUserRoleParams = {
  id: number;
  data: Partial<
    Pick<
      CreateUserRoleParams,
      | "role"
      | "staff_commission_percentage"
      | "coaches_in_role_ids"
      | "establishments_in_role_ids"
      | "staff_establishment_billing_group"
    >
  >;
};

export type CreateRoleDefinitionParams = {
  name: string;
  description: string;
  permissions: CompanyRolePermissions;
  object_level_permissions: ObjectLevelPermissions;
  has_booking_override_control: boolean;
};

export type UpdateRoleDefinitionParams = {
  id: number;
  data: DeepPartial<
    Omit<CreateRoleDefinitionParams, "name"> & { name: string }
  >;
};
