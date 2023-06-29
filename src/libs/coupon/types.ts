import { ErrorAndLoading } from '../types';
import { Company } from '../company/types';
import { Invoice } from '#libs/invoice/types';

// TODO: Should be deleted when importing the enums from common
enum CouponKind {
  COUPON_VIA_CODE = 0,
  COUPON_VIA_UNIQUE_CODE_PER_USAGE = 1,
}

enum UniqueCodeStateStatus {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED',
  USED = 'USED',
  REDEEMED = 'REDEEMED',
}

enum CouponUniqueCodeEditModeOptions {
  COUPON_UNIQUE_CODE_EDIT_MODE_APPEND = 0,
  COUPON_UNIQUE_CODE_EDIT_MODE_REPLACE = 1,
}

export type Discount = {
  id: string;
  coupon: number;
  basket: string;
  invoice: string;
  voucher: number;
  member: number;
  reverted: boolean;
  source_invoice: string;
  company: number;
  name: string;
  memberArchived: string;
  billing_plan: number;
};

export type Coupon = {
  id?: number;
  available: boolean;
  company: number;
  code?: string;
  amount_off: number;
  percent_off: number;
  voucher_type: number;
  only_on_first_checkout: boolean;
  whitelist_members: Array<number>;
  discounts: Array<number>;
  usage_per_member: number;
  usage_total: number;
  applies_to?: number;
  only_on_objects?: number[];
  expiration_date: string;
  is_active: boolean;
  combinable: boolean;
  minimum_amount: number;
  name: string;
  whitelist_tags: number[];
  blacklist_tags: number[];
  subscription_mode: number;
  coupon_template_instance: CouponTemplateInstance;
  coupon_type: CouponKind;
  available_unique_codes?: AvailableUniqueCodes;
};

export type CouponState = {
  discount: {
    items: Discount[];
    page: number | null;
    count: number | null;
    loading: boolean;
    error: null | Error;
  };
  coupon: ErrorAndLoading & {
    currentPage: number;
    items?: Coupon[];
    createOrUpdate: ErrorAndLoading;
  };
  couponTemplate: {
    byId: { [id: number]: CouponTemplate };
    allIds: Array<number>;
    loading: false;
    error: null | Error;
    upsert: ErrorAndLoading;
  };
};

export type UniqueCodeState = {
  status: UniqueCodeStateStatus;
  date_used?: number; // timestamp in second
  member_id?: number;
  invoice_uuid?: number;
};

type AvailableUniqueCodes = Record<string, UniqueCodeState>;

export type CouponTemplateInstance = {
  id: number;
  disabled: boolean;
  company: number;
  coupon: number;
  coupon_template: number;
};

export type CouponTemplateAPI = {
  id: number;
  available: boolean;
  company: number;
  code: string;
  amount_off: number;
  percent_off: number;
  voucher_type: number;
  only_on_first_checkout: boolean;
  usage_per_member: number;
  usage_total: number;
  applies_to: number | null;
  only_on_objects: Array<number>;
  expiration_date: string | null;
  is_active: boolean;
  combinable: boolean;
  minimum_amount: number;
  name: string;
  disabled: boolean;
  coupon_template_instances: Array<CouponTemplateInstance>;
  subscription_mode: number;
  nb_discounts: number;
};

export type UniqueCodeCouponCreationPayload = {
  name: string;
  is_active: boolean;
  only_on_first_checkout: boolean;
  usage_per_member?: number;
  applies_to: number;
  only_on_objects: number[];
  expiration_date?: string;
  coupon_cost_for_company: number;
  codes: string[];
};

export type UniqueCodeCouponUpdatePayload = UniqueCodeCouponCreationPayload & {
  update_mode?: CouponUniqueCodeEditModeOptions;
  codes?: string[];
};

export type CouponTemplate = CouponTemplateAPI & {
  companies: Array<Company>;
};

export type FetchCouponsParams = {
  id__in?: number[];
  whitelist_tags__in?: number[];
  blacklist_tags__in?: number[];
  tags__in?: number[];
  page_size?: number;
};

export type InvoiceParams = {
  invoice_items: Invoice[];
  invoice_amount: number;
};

export type ApplyToContractAPI = {
  can_be_applied: boolean;
  voucher: number;
};

export type FetchDiscountParams = {
  page?: number;
  page_size?: number;
  coupon_template?: number;
};

export type ResetDiscountList = {
  results: Discount[];
  count: number;
  page: number;
};
