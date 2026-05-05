// ----- Query params -----

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

// ----- Models -----

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

export type Role = {
  id: number;
  name: string;
  description: string;
  editable: boolean;
  company: number;
  has_booking_override_control: boolean;
};

// ----- Params -----

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
