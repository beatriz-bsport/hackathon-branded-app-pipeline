import { UpsellPackage } from '#src/libs/company/types';
import {
  BLOCK_BACKOFFICE,
  DO_NOTHING,
  WARN,
  DISPUTED_PAYMENT,
  FAILED_PAYMENT,
} from './constant';

export type PlatformSubscriptionPaymentStatus = {
  failed: Array<{
    payment_backend_id: number;
    date: string;
  }>;
  disputed: Array<{
    date: string;
  }>;
  action: typeof DO_NOTHING | typeof WARN | typeof BLOCK_BACKOFFICE;
  blocking: typeof FAILED_PAYMENT | typeof DISPUTED_PAYMENT;
};

export type UpdatePlatformCustomerEntityVatInformationParams = {
  vatId?: string;
  hasAttributedVatId: boolean;
};

export type PlatformCustomerEntity = {
  id: number;
  company: number;
  vat_id: string | null;
  vat_id_type: string | null;
  vat_id_verification_status: string;
  has_attributed_vat_id: boolean;
  is_vat_id_collection_required: boolean;
  is_valid_vat_id_missing: boolean;
};

export type PlatformInvoice = {
  id: string;
  payment_backend_id: string;
  month: number;
  year: number;
  total_price_cts: number;
  pdf_url: string;
  status: string;
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
  is_using_bundled_pricing: boolean;
};
