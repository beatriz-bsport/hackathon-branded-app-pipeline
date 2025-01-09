import {
  CouponKind,
  UniqueCodeStateStatus,
  CouponUniqueCodeEditModeOptions,
} from '@bsport/common/lib/master-data/coupon.js';
import type { LuxonDateTime } from '#src/types';
import { ErrorAndLoading } from '../types';
import type { Company } from '#src/libs/company/types';
import { InvoiceItem } from '#src/libs/invoice/invoice-item/types';
import {
  FranchiseProductTemplatePaginatedQueryParams,
  FranchiseProductTemplateQueryParams,
} from '#src/libs/franchise/types';

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
  coupon_cost_for_company: number;
  nb_unique_codes: number;
  nb_discounts: number;
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
  couponTemplatePaginated: {
    activeCoupons: {
      page: number;
      next_page: number | null;
      previous_page: number | null;
      count: number;
      page_size: number;
      allIds: number[];
      byId: Record<number, CouponTemplateAPI>;
    } & ErrorAndLoading;
    expiredActiveCoupons: {
      page: number;
      next_page: number | null;
      previous_page: number | null;
      count: number;
      page_size: number;
      allIds: number[];
      byId: Record<number, CouponTemplateAPI>;
    } & ErrorAndLoading;
    inactiveCoupons: {
      page: number;
      next_page: number | null;
      previous_page: number | null;
      count: number;
      page_size: number;
      allIds: number[];
      byId: Record<number, CouponTemplateAPI>;
    } & ErrorAndLoading;
  };
  exportCodes: {
    loading: boolean;
    error: null | Error;
  };
};

export type UniqueCodeState = {
  status: UniqueCodeStateStatus;
  date_used?: number; // timestamp in second
  member_id?: number;
  invoice_uuid?: number;
};

export type AvailableUniqueCodes = Record<string, UniqueCodeState>;

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
  expiration_date?: LuxonDateTime | string;
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

export type CouponTemplateParams = {
  companies: Company[];
  coupon_template: number;
};

export type FetchCouponsParams = {
  id__in?: number[];
  whitelist_tags__in?: number[];
  blacklist_tags__in?: number[];
  tags__in?: number[];
  page_size?: number;
  available?: boolean;
};

export type FetchCouponTemplateQueryParams =
  FranchiseProductTemplateQueryParams & {
    active?: boolean;
    expired?: boolean;
  };

export type FetchCouponTemplatePaginatedQueryParams =
  FranchiseProductTemplatePaginatedQueryParams & {
    active?: boolean;
    expired?: boolean;
  };

export type AppliesToInvoiceBody = {
  codes: string[];
  member: number;
  already_applied_coupons: Array<{ coupon_id: number; code: string }>;
  invoice: {
    invoice_items: InvoiceItem[];
  };
};

export type AppliesToInvoiceResponse = {
  can_be_applied: boolean;
  applied_coupons: Array<{
    voucher: number;
    coupon_partially_applied: boolean;
    id: number;
    code: string;
  }>;
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

export enum CouponFilterOptions {
  VIA_CODE = 0,
  VIA_UNIQUE_CODE_PER_USAGE = 3,
  DEFAULT = -1,
}

export type CheckCouponCodePayload = {
  code: string;
  coupon_ids_to_ignore: number[];
};

export type CheckCouponCodeResponsePayload = { is_used: boolean };
