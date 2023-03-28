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
  stripe_pk_key: string;
  provincial_tax_name?: string;
  provincial_tax_value?: number;
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
  allow_guest: boolean;
  allow_guest_activatable: boolean;
  allow_guest_frequency: string;
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
  has_coach_access_to_replacement_request: boolean;
  confirm_email_url_redirection: string;
  requires_email_confirmation_when_signing_up: boolean;
  hide_intercom: boolean;
  is_roll_call_mandatory: boolean;
  no_show_validated_number_of_hours: number;
  no_show_email_sent_number_of_hours: number;
  is_two_way_email_activated: boolean;
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
  background?: string;
  primaryColor?: string;
  secondaryColor?: string;
  greyDark?: string;
  grey?: string;
  greyLight?: string;
};

export type CompanyTheme = Theme;
