/**
 * Query parameters for fetching appointment passes (PrivatePass).
 */
export type FetchAppointmentPassesParams = {
  /** Number of items per page. */
  page_size?: number;

  /** Page number. */
  page?: number;

  /** Filter to disabled/enabled passes. */
  disabled?: boolean;

  /** Include only passes whose IDs are in this list. */
  id__in?: number[];

  /** Full-text search query. */
  q?: string;
};

/**
 * Model: PrivatePass
 * Serializer: PrivatePassSerializer
 * Appointment passes are private passes that can be purchased and consumed
 * by members for one-on-one private services.
 */
export type AppointmentPass = {
  id: number;
  name: string;
  credits: number | null;
  price: string;
  tax: string;
  private_services: number[];
  manager_only: boolean;
  available: boolean;
  duration_days: number;
  duration_months: number;
  duration_years: number;
  available_payment_method_identifiers: number[];
  full_vod_access: boolean;
  expiration_days_before_first_use: number;
  expiration_date: string | null;
  start_date_method: number;
  new_member_only: boolean;
  company: number;
  ordering_in_category: number;
  category: number | null;
  template_instance: number | null;
  linked_payment_pack: number | null;
  linked_payment_pack_template_instance: number | null;
  is_unpaid_private_booking_integration: boolean;
  is_usable_by_staff: boolean;
  applies_for_payroll: boolean;
  on_behalf_of_teacher: boolean;
  description: string;
  tags_on_consumer_item_creation: number[];
  bookkeeping_account: number | null;
  member_relation_auto_share: boolean;
  editable: boolean;
};
