export interface UserAccess {
  is_coach: boolean;
  is_manager: boolean;
  is_franchisor: boolean;
  is_consumer: boolean;
  is_restricted: boolean;
  role: number;
  franchise_role: number;
  franchise_role_identifier: number;
  coaches_selected_in_role: number[];
  establishments_selected_in_role: number[];
  allowed_franchisees: number[];
  name: string;
  username: string;
  has_completed_account_configuration_on_boarding: boolean;
  id: number;
  email_confirmed: boolean;
}

export interface TemporaryPassword {
  password: string;
  expiration_date: string;
}
