import { ErrorAndLoading } from '../types';
import { Company } from '../company/types';

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
};

export type Coupon = {
  id: number;
  available: boolean;
  company: number;
  code: string;
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

export type CouponTemplate = CouponTemplateAPI & {
  companies: Array<Company>;
};
