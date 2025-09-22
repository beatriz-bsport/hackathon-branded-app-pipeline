import {
  BLOCK_BACKOFFICE,
  DO_NOTHING,
  WARN,
} from '#src/libs/platform-billing/constant';
import type { ErrorAndLoading } from '#src/libs/types';
import {
  BANK_ACCOUNT_CONFIGURATION_STEP,
  ACCOUNT_CONFIGURATION_FINAL_STEP,
  PAYMENT_METHOD_CONFIGURATION_STEP,
  STRIPE_CONFIGURATION_STEP,
  PAYPAL_NOT_CONNECTED,
  PAYPAL_CONNECTED,
  PAYPAL_CONNECTED_WITHOUT_VAULTING,
  PAYPAL_PRIMARY_EMAIL_CONFIRMATION,
  PAYPAL_REQUIRES_MORE_INFORMATION,
  PAYPAL_ISSUE_CHECK_ACCOUNT,
  PAYPAL_ISSUE_REPEAT_ONBOARDING,
} from './constants';

export type Company = {
  company_group: number | null;
  cover: string;
  email: string;
  hidden_from_marketplace: boolean;
  id: number;
  name: string;
  primaryRGB: string;
  secondaryRGB: string;
  timezone_name: string;
  websiteURL: string;
};

export type CompanyWithTheme = Company & {
  primaryRGB: [number, number, number];
  secondaryRGB: [number, number, number];
};

export type UpsellSumup = {
  upsell_identifier: number;
  readable_identifier: string;
  is_free_trial: boolean;
  trial_remaining_days: number | null;
};

export type FeatureList = {
  upsell: UpsellSumup[];
};

export type CompanySetup = {
  id: number;
  name: string;
  email: string;
  representative_first_name: string;
  representative_last_name: string;
  payout_schedule: string;
  address: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
  region: string;
  currency: string;
  business_name: string;
  business_tax_id: string;
  owner_address: string;
  owner_city: string;
  owner_postal_code: string;
  owner_state: string;
  owner_country: string;
  iban: string;
  bank_account_holder: string;
  external_account_last4: string;
  bank_account_entity_type: string;
};

export type StripeAccountStatus = {
  action: typeof BLOCK_BACKOFFICE | typeof WARN | typeof DO_NOTHING;
  reason: string;
  date_account_blocked: string;
};

export type StripePaymentElementConfig = {
  isDefaultForRegion: boolean;
  stripeId: string | null;
};

export type PayPalCompany = {
  account_primary_email: string;
  account_legal_name: string;
};

export type PayPalAccountStatus =
  | typeof PAYPAL_NOT_CONNECTED
  | typeof PAYPAL_CONNECTED
  | typeof PAYPAL_CONNECTED_WITHOUT_VAULTING
  | typeof PAYPAL_PRIMARY_EMAIL_CONFIRMATION
  | typeof PAYPAL_REQUIRES_MORE_INFORMATION
  | typeof PAYPAL_ISSUE_CHECK_ACCOUNT
  | typeof PAYPAL_ISSUE_REPEAT_ONBOARDING;

export type PayPalProblematicAccountStatus =
  | typeof PAYPAL_PRIMARY_EMAIL_CONFIRMATION
  | typeof PAYPAL_REQUIRES_MORE_INFORMATION
  | typeof PAYPAL_ISSUE_CHECK_ACCOUNT
  | typeof PAYPAL_ISSUE_REPEAT_ONBOARDING;

export type PayPalCompanyStatus = {
  account_status: string;
  paypal_company: PayPalCompany;
};

export type UpsellPackage = {
  id: number;
  name: string;
  description: string;
  is_recurrent: boolean;
  upsell_identifier: number;
  readable_identifier: string;
  price_cts: number;
  hidden: boolean;
  tax: string;
  subscribe_from_backoffice: boolean;
  is_subscription_time_consuming: boolean;
};

/**
 * Describes the UpsellPackageSubscribed model as returned by the API.
 */
export type UpsellPackageSubscribedAPI = {
  id: number;
  upsell_package: number;
  platform_subscription: number;
  has_been_billed_once: boolean;
};

export type PlatformBillingGroup = {
  id: number;
  country: string;
  currency: string;
  is_active: boolean;
  is_default_for_country: boolean;
  is_default_for_currency: boolean;
  tax: string;
  upsell_packages: UpsellPackage[];
  platform_billing_plans: PlatformBillingPlan[];
};
export type PlatformBillingStage = {
  id: number;
  platform_billing_plan: number;
  max_booking_per_month: number;
  next_platform_billing_stage: number;
  price_cts: number;
};
export type PlatformBillingPlan = {
  id: number;
  description: string;
  description_html: string;
  platform_billing_plan_group: number;
  platform_billing_stages: PlatformBillingStage[];
  max_coach: number;
  max_establishment: number;
  name: string;
  next_platform_billing_plan: number;
};

export type PlatformSubscription = {
  id: number;
  company: number;
  date_start: string;
  platformBillingGroup: PlatformBillingGroup;
  current_platform_billing_stage: PlatformBillingStage;
  current_platform_billing_plan: PlatformBillingPlan;
  minimal_platform_billing_stage: number;
  maximum_platform_billing_stage: number;
  coupon_cts: number;
  default_currency_display: string;
};

export type CompanyState = {
  stripeAccountStatus: ErrorAndLoading & { data: StripeAccountStatus };
  setupLoading: boolean;
  stripeCompany?: { data: StripeCompany } & ErrorAndLoading;
  paypalCompanyStatus: { data: PayPalCompanyStatus } & ErrorAndLoading;
  paypalOnboardingLink: {
    data: string;
    redirecting: boolean;
  } & ErrorAndLoading;
  byId: {
    [id: number]: Company;
  };
  feature: {
    data: FeatureList;
    loading: boolean;
    error: Error | null;
  };
  search: {
    loading: boolean;
    error: Error | null;
    allIds: number[];
  };
  setup: CompanySetup | null;
};

export type StripeCompany = {
  currently_due_verifications: number;
  currently_due_deadline?: string;
  past_due_verifications: number;
  company: number;
  stripe_id: string;
  has_no_need_for_stripe_configuration: boolean;
  has_no_need_for_bank_account_configuration: boolean;
  has_no_need_for_payment_method_configuration: boolean;
  has_completed_stripe_configuration: boolean;
  has_completed_bank_account_configuration: boolean;
  has_completed_payment_method_configuration: boolean;
  has_completed_account_configuration_on_boarding: boolean;
};

export type AccountConfigurationStep =
  | typeof STRIPE_CONFIGURATION_STEP
  | typeof BANK_ACCOUNT_CONFIGURATION_STEP
  | typeof PAYMENT_METHOD_CONFIGURATION_STEP
  | typeof ACCOUNT_CONFIGURATION_FINAL_STEP;

export type CompanyCreationParams = {
  locale: string;
  name: string;
  access_code?: string;
  timezone_name?: string;
  email: string;
  password: string;
};

export type GetOnboardingLinkParams = {
  account_token: string;
  return_url?: string;
};

export type GetPayPalOnboardingLinkParams = {
  return_url?: string;
};

export type FetchCompanyListParams = {
  search?: string;
  id__in?: number[];
};
