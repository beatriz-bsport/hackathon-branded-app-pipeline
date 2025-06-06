import type { CompanyRolePermissions } from "./company-role-permissions";
import type { ObjectLevelPermissions } from "./object-level-permissions";

/** Related to UserRoleSerializer */
export interface Staff {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_restricted: boolean;
  role: number;
  franchise_role: number;
  franchise_role_identifier: number;
  coaches_selected_in_role: number[];
  establishments_selected_in_role: number[];
  allowed_franchisees: number[];
  staff_commission_percentage: string;
  franchise_user?: number;
}

/** Related to Role Model and RoleSerializer */
export interface CompanyRole {
  id: number;
  name: string;
  description: string;
  editable: boolean;
  company: number | null;
  permissions: CompanyRolePermissions;
  object_level_permissions: ObjectLevelPermissions;
  has_booking_override_control: boolean;
  is_franchisor: boolean;
}
