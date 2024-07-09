import type { Company } from '#src/libs/company/types';
import type {
  PaymentPack,
  PaymentPackTemplate,
} from '#src/libs/payment-packs/types';
import type { PrivatePassTemplate } from '#src/libs/private-service/types';
import type { CouponTemplate } from '#src/libs/coupon/types';
import type { ErrorAndLoading, PaginationFilterParams } from '#src/libs/types';
import type {
  ConsumerGiftcard,
  GiftcardTemplate,
} from '#src/libs/giftcard/types';
import type { ConsumerInvoiceREST, Invoice } from '#src/libs/invoice/types';
import type { TagGroup, TagTemplate } from '#src/libs/tag/types';
import type { SubscriptionInterval } from '#src/libs/subscription/types';

export type FranchiseState = {
  error: null | boolean;
  loading: boolean;
  franchisor?: Franchise | FranchiseDetails;
  searchedUsers: {
    results: FranchiseUser[];
    loading: boolean;
    error: Error | null;
    previousURI: string;
  };
  users: {
    page: number;
    count: number;
    allIds: number[];
    byId: Record<number, FranchiseUser>;
    loading: boolean;
  };
  companies: {
    byId: Record<number, FranchiseCompany>;
    allIds: number[];
  };
  companyGroup: {
    allIds: number[];
    byId: { [id: number]: CompanyGroup };
    loading: boolean;
    error: Error | null;
  };
  userProfile: {
    generalInformation: {
      franchiseUser: FranchiseUser;
      loading: boolean;
      error: Error | null;
    };
    associatedMembers: {
      page: number;
      next_page: number;
      count: number;
      allIds: number[];
      byId: Record<number, FranchiseUserMember>;
      loading: boolean;
      error: Error | null;
    };
    tags: {
      page: number;
      next_page: number;
      count: number;
      allIds: number[];
      byId: Record<number, FranchiseUserTag>;
      loading: boolean;
      error: Error | null;
      update: ErrorAndLoading;
    };
    passes: {
      page: number;
      next_page: number;
      count: number;
      allIds: number[];
      byId: Record<number, FranchiseUserPass>;
      loading: boolean;
      error: Error | null;
    };
    sharedConsumerGiftcards: {
      asReceiver: {
        allIds: number[];
        byId: { [consumerGiftcardId: number]: SharedConsumerGiftcard };
        loading: boolean;
        error: Error | null;
        page: number;
        count: number;
      };
      asSender: {
        allIds: number[];
        byId: { [consumerGiftcardId: number]: SharedConsumerGiftcard };
        loading: boolean;
        error: Error | null;
        page: number;
        count: number;
      };
    };
    billingPlans: {
      page: number;
      next_page: number;
      count: number;
      allIds: number[];
      byId: Record<number, FranchiseUserBillingPlan>;
      loading: boolean;
      error: Error | null;
      invoices: {
        page: number;
        next_page: number;
        count: number;
        allIds: string[];
        byId: Record<string, Invoice>;
      } & ErrorAndLoading;
    };
  };
};
export type Franchise = {
  id: number;
  name: string;
  companies: Company[];
  cover?: string;
  primaryRGB: [number, number, number];
  secondaryRGB: [number, number, number];
  marketing_email?: string;
  sync_members_across_companies: boolean;
  marketing_custom_domain: string | null;
  hide_shop_supplier_price_for_franchisees: boolean;
  display_new_webshop_for_franchisees: boolean;
};

export type CompanyGroup = {
  id: number;
  name: string;
  companies: number[];
};

export type FranchiseUser = {
  birthday?: string;
  companies: number[];
  company_member: Record<number, number>;
  email: string;
  id: number;
  name: string;
  phone: number;
  photo: string;
  vaccination_status?: boolean;
  address?: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    country: string;
    zipcode: string;
    state: string;
  };
};

export type FranchiseProductTemplateQueryParams = {
  franchisor?: number;
  id__in?: number[];
  manager_only?: boolean;
  is_usable_by_staff?: boolean;
  available_for_sale?: boolean;
};

export type FranchiseCompany = {
  id: number;
  cover: string;
  email: string;
  name: string;
  primaryRGB: [number, number, number];
  secondaryRGB: [number, number, number];
  websiteURL: string;
  isAllowed: boolean;
  company_group: number;
};

export type FranchiseDetails = Franchise & {
  companies: FranchiseCompany[];
  primary_color: string;
  secondary_color: string;
};

export type GenericProductTemplate =
  | PaymentPackTemplate
  | PrivatePassTemplate
  | CouponTemplate
  | GiftcardTemplate;

export type WithFranchiseCompanies<T> = T & {
  companies: FranchiseCompany[];
};

export type FranchiseTheme = Franchise | FranchiseDetails | FranchiseCompany;
export type FranchiseThemeData = {
  primary_color: string;
  secondary_color: string;
  cover: File;
};
export type CreateUpdateCompanyGroupData = {
  id?: number;
  name: string;
  companies: number[];
};

export type SearchUsersPayload = {
  text: string;
  count?: number;
};

export type PassesSearchPaginatedQueryParams = PaginationFilterParams &
  FranchisePassFilters;

export type PassesPaginatedQueryParams = PaginationFilterParams & {
  filters?: FranchisePassFilters;
};

export type BillingPlansPaginatedQueryParams = PaginationFilterParams & {
  filters?: FranchiseBillingPlanFilters;
};

export type FranchiseUserPassesQueryParams = {
  user_id: number;
} & PassesPaginatedQueryParams;

export type FranchiseUserBillingPlansQueryParams = {
  user_id: number;
} & BillingPlansPaginatedQueryParams;

export type FranchiseUserBillingPlanInvoicesQueryParams = {
  user_id: number;
  billing_plan_id: number;
} & PaginationFilterParams;

export type FranchiseUserPass = {
  id: number;
  used_credits: number;
  initial_price: number;
  payment_pack_id: string;
  payment_pack_name: string;
  payment_pack: number;
  starting_date: string;
  ending_date: string;
  member_id: number;
  disabled: boolean;
  reverted: boolean;
  invoice: string;
  created_from_payment_pack_template_instance: number;
  consumer_payment_pack_source: number | null;
  company_source_id: string;
  company_source_name: string;
  company_source_primary_color: string;
};

export type FranchiseUserPassWithPaymentPack = {
  id: number;
  used_credits: number;
  initial_price: number;
  payment_pack_id: string;
  payment_pack_name: string;
  payment_pack: PaymentPack;
  starting_date: string;
  ending_date: string;
  member_id: number;
  disabled: boolean;
  reverted: boolean;
  invoice: string;
  created_from_payment_pack_template_instance: number;
  consumer_payment_pack_source: number | null;
  company_source_id: string;
  company_source_name: string;
  company_source_primary_color: string;
};

export type FranchisePassFilters = {
  is_expired?: boolean;
  is_valid_today?: boolean;
  reverted?: boolean;
  has_credit_left?: boolean;
  company__in?: number[];
  company_group__in?: number[];
};

export type FranchiseBillingPlanFilters = {
  company__in?: number[];
  company_group__in?: number[];
  is_canceled?: boolean;
  is_expired?: boolean;
  is_paused?: boolean;
  is_valid?: boolean;
};

export type FranchisePassFiltersOpener = {
  expiration?: boolean;
  reverted?: boolean;
  credit_left?: boolean;
  companies?: boolean;
  company_groups?: boolean;
};

export type FranchiseBillingPlanFiltersOpener = {
  companies?: boolean;
  company_groups?: boolean;
  status?: boolean;
};

export type CompanyOptionTypeBase = { label: string; value: string };

export type FranchisePrivatePass = {
  company: number;
  credits: number;
  duration_days: number;
  duration_months: number;
  duration_years: number;
  expiration_days_before_first_use: number;
  id: number;
  name: string;
  price: string;
  start_date_method: number;
  template_instance: number;
};

export type FranchiseUserPrivatePass = {
  company_source_id: string;
  company_source_name: string;
  company_source_primary_color: string;
  consumer: number;
  date_bought: string;
  date_created: string;
  disabled: boolean;
  extension_days: number;
  id: number;
  initial_price: string;
  invoice: string;
  member_id: number;
  no_private_booking_active: boolean;
  private_consumer_pass_source: number | null;
  private_pass: FranchisePrivatePass;
  reverted: boolean;
  used_credits: number;
};

export type FranchiseUserMember = {
  archived: boolean;
  company_id: string;
  company_name: string;
  id: number;
};

export type FranchiseUserMembersQueryParams = {
  user_id: number;
} & PaginationFilterParams;

export type SharedConsumerGiftcard = ConsumerGiftcard & {
  invoice_id: string;
};

export type GiftcardsPaginatedQueryParams = {
  page?: number;
  page_size?: number;
  current_item_id?: number;
};

export type WithInvoice<T> = T & { invoice: ConsumerInvoiceREST };

export type FranchiseTag = {
  id: number;
  name: string;
  group: number;
  color: string;
  icon: string;
  tag_template: number;
};

export type FranchiseTagGroup = {
  id: number;
  name: string;
  tags: number[];
  kind: number;
  tag_group_template: number;
};

export type FranchiseUserTag = {
  id: number;
  sub_tag: FranchiseTag;
  member: number;
  tag_group: FranchiseTagGroup;
};

export type FranchiseUserTagsUpdate = {
  user_id: number;
  data: { user_tag_ids: number[] };
};

export type FranchiseUserTagDict = {
  [key: number]: number;
};

export type FranchiseUserTagOption = {
  label: string;
  value: number;
  tag: TagTemplate<TagGroup>;
};

export type FranchiseUserBillingPlanPause = {
  from_date: string;
  id: number;
  until_date: string;
};

export type FranchiseUserBillingPlan = {
  canceled_at: string | null;
  company_group_id: number;
  company_id: number;
  company_name: string;
  company_primary_color: string;
  contract_name: string;
  contract_template_id: number;
  date_start: string;
  first_billing_date: string;
  has_ended: boolean;
  id: number;
  interval: SubscriptionInterval;
  member: number;
  name: string;
  nb_interval: number;
  pauses: FranchiseUserBillingPlanPause[];
  payment_pack_template?: number;
  private_pass_template?: number;
  recurrence_basis: number;
  recurrent_price: string;
  status: number;
};
