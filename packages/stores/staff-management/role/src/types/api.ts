/**
 * Data type to create a new Staff in a Company
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
