// Query parameters for GET staff-management/v1/role/user/
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

export type UserRole = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_restricted: boolean;
  role: number | null;
  franchise_role: number | null;
  franchise_role_identifier: string | null;
  coaches_selected_in_role: number[];
  establishments_selected_in_role: number[];
  staff_establishment_billing_group: number | null;
  allowed_franchisees: number[];
  staff_commission_percentage: string;
  franchise_user: number | null;
};
