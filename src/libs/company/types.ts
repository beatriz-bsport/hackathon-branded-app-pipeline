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
};

export type CompanyWithTheme = Company & {
  primaryRGB: [number, number, number];
  secondaryRGB: [number, number, number];
};

export type FeatureList = {
  upsell: [
    {
      upsell_identifier: number;
      readable_identifier: string;
    },
  ];
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

export type UpsellSumup = {
  upsell_identifier: number;
  readable_identifier: number;
};

export type CompanyState = {
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
