// @ts-nocheck
import {
  BLOCK_BACKOFFICE,
  DO_NOTHING,
  WARN,
} from '#libs/platform-billing/constant';
import { ErrorAndLoading } from '#libs/types';
import {
  BANK_ACCOUNT_CONFIGURATION_STEP,
  ACCOUNT_CONFIGURATION_FINAL_STEP,
  PAYMENT_METHOD_CONFIGURATION_STEP,
  STRIPE_CONFIGURATION_STEP,
} from './constants';

export type Company = {
  id: number;
  name: string;
  email: string;
  websiteURL: string;
  cover: string;
  primaryRGB: string;
  secondaryRGB: string;
  company_group: number | null;
  hidden_from_marketplace: boolean;
};

export type CompanyWithTheme = Company & {
  primaryRGB: [number, number, number];
  secondaryRGB: [number, number, number];
};

export type UpsellSumup = {
  upsell_identifier: number;
  readable_identifier: string;
};

export type FeatureList = {
  upsell: Array<UpsellSumup>;
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

type StripeAccountStatus = {
  action: typeof BLOCK_BACKOFFICE | typeof WARN | typeof DO_NOTHING;
  reason: string;
  date_account_blocked: string;
};

export type UpsellPackage = {
  id: number;
  name: string;
  description: string;
  is_recurrent: boolean;
  upsell_identifier: number;
  readable_identifier: string;
  price_cts: number;
  subscribed: boolean;
  hidden: boolean;
  tax: string;
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
  byId: {
    [id: number]: Company;
  };
  feature: {
    data: {
      upsell: UpsellSumup[];
    };
    loading: boolean;
    error: Error | null;
  };
  search: {
    loading: boolean;
    error: Error | null;
    allIds: Array<number>;
  };
  setup: CompanySetup | null;
};

export type StripeCompany = {
  currently_due_verifications: number;
  currently_due_deadline: number;
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
