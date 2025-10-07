/**
 * Model: PrivatePass
 * Serializer: PrivatePassSerializer
 */
export type AppointmentPass = {
  name: string;
  id: number;
  credits: number | null;
  price: string;
  tax: string;
  private_services: number[];
  manager_only: boolean;
  available: boolean;
  duration_days: number;
  template_instance: number | null;
  editable: boolean;
  duration_months: number;
  duration_years: number;
  available_payment_method_identifiers: number[];
  full_vod_access: boolean;
  expiration_days_before_first_use: number;
  start_date_method: number;
  expiration_date: string | null;
  new_member_only: boolean;
  company: number;
  ordering_in_category: number;
  category: number | null;
  linked_payment_pack: number | null;
  is_unpaid_private_booking_integration: boolean;
  is_usable_by_staff: boolean;
  applies_for_payroll: boolean;
  on_behalf_of_teacher: boolean;
  description: string;
  tags_on_consumer_item_creation: number[];
  bookkeeping_account: number | null;
  member_relation_auto_share: boolean;
  linked_payment_pack_template_instance: number | null;
};

/**
 * Model: PrivatePassCategory
 * Serializer: PrivatePassCategorySerializer
 */
export type AppointmentPassCategory = {
  id: number;
  name: string;
  company_id: number;
  category_ordering: number;
};
