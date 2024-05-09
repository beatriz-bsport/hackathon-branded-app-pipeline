import type { Company } from '#src/libs/company/types';
import type {
  PaymentPack,
  PaymentPackTemplate,
} from '#src/libs/payment-packs/types';
import type { PrivatePassTemplate } from '#src/libs/private-service/types';
import type { CouponTemplate } from '#src/libs/coupon/types';
import type { PaginationFilterParams } from '#src/libs/types';
import type {
  ConsumerGiftcard,
  GiftcardTemplate,
} from '#src/libs/giftcard/types';
import type { ConsumerInvoiceREST } from '#src/libs/invoice/types';

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

export type FranchiseUserPassesQueryParams = {
  user_id: number;
} & PassesPaginatedQueryParams;

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

export type FranchisePassFiltersOpener = {
  expiration?: boolean;
  reverted?: boolean;
  credit_left?: boolean;
  companies?: boolean;
  company_groups?: boolean;
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
