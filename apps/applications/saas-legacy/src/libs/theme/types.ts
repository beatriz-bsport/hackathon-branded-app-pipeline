import {
  MarketPlaceCoachDisplay,
  MarketPlaceDaysFormatDisplay,
  MarketPlaceSessionTimeDisplay,
} from '@bsport/common/lib/master-data/personalization.js';
import { BOOKING_FOR_GUEST_FREQUENCY } from '#src/libs/offer/types';

export enum DefaultPageOption {
  SCHEDULE = 'Membership',
  BOOKINGS = 'Bookings',
  ACTIVITIES = 'Home',
  STUDIO = 'Marketplace',
  PROFILE = 'Profile',
}

export type Theme = {
  id: string;
  default_booking_ordering: string;
  general_terms_and_conditions: string;
  general_terms_of_use: string;
  waiver: string;
  email_sender_address: string;
  company: number;
  company_name: string;
  timezone_name: string;
  // Style
  primary_color: string;
  secondary_color: string;
  cover?: string;
  locale: string;
  // Marketing
  contact_email: string;
  websiteURL: string;
  scheduleURL: string;
  instagramURL: string;
  facebookURL: string;
  android_app_url: string;
  ios_app_url: string;
  gtmId?: string;
  facebookPixelId?: string;
  extra_info: string;
  // Payment
  payment_method_available: number[];
  payment_method_available_basket: number[];
  payment_method_available_subscription: number[];
  payment_method_available_manager: number[];
  currency: string;
  currency_display: string;
  is_default_for_region: boolean;
  stripe_pk_key: string;
  provincial_tax_name?: string;
  provincial_tax_value?: number;
  stripe_id: string | null;
  is_paypal_available_in_country: boolean;
  is_fiskaly_operational: boolean;
  invoice_exporter_id: number | null;
  // Config
  is_whereby_integration_allowed: boolean;
  is_whereby_integration_enabled: boolean;
  hideCoach: boolean;
  show_cancelled_offers_customer: boolean;
  show_cancelled_offers_manager: boolean;
  hide_least_specific_payment_pack: boolean;
  default_attendance: boolean;
  consumer_regularize_debt: boolean;
  allow_consumer_to_use_internal_account: boolean;
  accept_double_booking: boolean;
  accept_double_booking_workshop: boolean;
  allow_guest: boolean;
  allow_guest_activatable: boolean;
  allow_guest_frequency: BOOKING_FOR_GUEST_FREQUENCY;
  allow_guest_max_number: number;
  vod: boolean;
  show_booked_gender_offer: boolean;
  is_checking_balance: boolean;
  hidden_from_marketplace: boolean;
  show_workshops_customer: boolean;
  hide_unnecessary_compatible_purchase_method: boolean;
  enable_multi_localization: boolean;
  show_offers_filling: boolean;
  is_quickbook_integration_allowed: boolean;
  is_quickbook_integration_enabled: boolean;
  coach_can_edit_attendance: boolean;
  hide_member_details_in_app_private_booking_for_coach: boolean;
  is_premium: boolean;
  is_tax_excluded_in_marketplace?: boolean;
  hide_sessions_with_tags_when_not_eligible: boolean;
  has_partnership: boolean;
  nb_to_check_balance: number;
  gender_max_shift_for_booking: number;
  max_future_booking: number;
  basket_expiration_days: number;
  refund_blocking_limit: number;
  schedule_timerange_begin: string;
  schedule_timerange_end: string;
  vod_providers: Array<number>;
  has_stripe_location: boolean;
  widget_theme: WidgetCustomCSS;
  franchisor: number | null;
  online_payment_enabled: boolean;
  is_coach_access_enabled_by_default: boolean;
  has_coach_access_to_calendar: boolean;
  has_coach_access_to_compensation: boolean;
  has_coach_access_to_compensation_downloading: boolean;
  has_coach_access_to_replacement_request: boolean;
  churn_last_paid_month: Date;
  confirm_email_url_redirection: string;
  requires_email_confirmation_when_signing_up: boolean;
  hide_intercom: boolean;
  is_roll_call_mandatory: boolean;
  no_show_validated_number_of_hours: number;
  no_show_email_sent_number_of_hours: number;
  is_two_way_email_activated: boolean;
  show_establishment: boolean;
  show_level: boolean;
  show_activity_color: boolean;
  session_time_display: MarketPlaceSessionTimeDisplay;
  coach_display: MarketPlaceCoachDisplay;
  days_format_display: MarketPlaceDaysFormatDisplay;
  is_auto_debit_activated: boolean;
  show_free_session_label: boolean;
  hide_credits_for_customers: boolean;
  hide_book_button: boolean;
  is_sequential_marketing_active: boolean;
  is_multi_location_webshop_enabled: boolean;
  /**
   * @deprecated Do not use this field for conditional feature checks.
   * This is always set to true on the backend.
   */
  display_new_checkout_flow: boolean;
  is_referral_program_activated: boolean;
  force_billing_details_on_cards: boolean;
  payment_method_available_recurringly: number[];
  display_bubble_background: boolean;
  show_past_sessions_calendar: boolean;
  mobile_app_default_page: DefaultPageOption;
  checkin_tablet_visible_session_cutoff_minute: number;
  has_limited_access_to_sequential_marketing: boolean;
  simplifyUI: boolean;
  reset_password_url_redirection: string;
  earliest_hour_to_send_communications: number;
  latest_hour_to_send_communications: number;
  first_warning_payment_method_expiration_days: string;
  second_warning_payment_method_expiration_days: string;
  display_credit_price_for_offer: boolean;
  display_stop_subscription_from_member_side: boolean;
  // Member profile
  show_member_account_balance: boolean;
  show_barcode_button: boolean;
  show_membership_number: boolean;
  display_new_webshop: boolean;
  zoho_member_import_enabled: boolean;
  one_click_checkout_enabled: boolean;
  revamped_passes_page_enabled: boolean;
  revamped_backoffice_enabled: boolean;
};

export type ThemeState = {
  theme: Theme;
  createOrUpdate: {
    loading: boolean;
    error?: Error;
  };
  provincialTax: {
    createOrUpdate: {
      loading: boolean;
      error?: Error;
    };
  };
  loading: boolean;
  error?: Error;
};

export type WidgetCustomCSS = {
  fontFamily?: string;
  spacing?: number;
  border?: number;
  backgroundPaper?: string;
  secondaryBackgroundPaper?: string;
  background?: string;
  primaryColor?: string;
  secondaryColor?: string;
  greyDark?: string;
  grey?: string;
  greyLight?: string;
  borderColor?: string;
};

export type CompanyTheme = Theme;

export type MemberProfileSettingsPayload = Pick<
  CompanyTheme,
  | 'show_member_account_balance'
  | 'show_barcode_button'
  | 'show_membership_number'
>;
