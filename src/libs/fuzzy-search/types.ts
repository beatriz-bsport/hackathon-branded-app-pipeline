import type { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import type { Coupon, FetchCouponsParams } from '#libs/coupon/types';
import type { PaginatedResponse } from '#state/types';

import type { EmailTemplate } from '#libs/email-editor/types';
import type {
  Establishment,
  EstablishmentGroupAPI,
  FetchEstablishmentParams,
} from '#libs/establishment/types';
import type { Giftcard } from '#libs/giftcard/types';
import type { InstalmentPayment } from '#libs/instalment-payment-configuration/types';
import type { Level, LevelFilterSet } from '#libs/level/types';
import type {
  MetaActivity,
  MetaActivityFilter,
} from '#libs/meta-activity/types';
import type {
  PaymentCombo,
  PaymentComboAPIParams as PaymentComboAPIQueryParams,
} from '#libs/payment-combo/types';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackQueryParams,
} from '#libs/payment-packs/types';
import type { PerformanceTrackingProgram } from '#libs/performance-tracking/types';
import type {
  PrivatePass,
  PrivatePassCategory,
  PrivatePassQueryParams,
  PrivatePassTemplate,
  PrivateService,
  PrivateServiceQueryParams,
  PrivateSlot,
  PrivateSlotQueryParams,
} from '#libs/private-service/types';
import type { Cadence } from '#libs/sequential_marketing/types';
import type {
  ShopItem,
  ShopItemListFilterParams,
  SubShop,
} from '#libs/shop/types';
import type { SmartList, SmartListQueryParams } from '#libs/smart-list/types';
import type { Contract, ContractQueryParams } from '#libs/subscription/types';
import type { Tag } from '#libs/tag/types';
import type { Video, VideoQueryParams } from '#libs/video/types';
import { AssociatedCoachFilters, Coach } from '#libs/associated-coach/types';

export type ObjectSearchResult = ResultsMap[SearchObjectType]['result'];
export type ObjectSearchArray = ResultsMap[SearchObjectType]['array'];
export type ObjectSearchPaginated = ResultsMap[SearchObjectType]['paginated'];

export type ObjectSearchState<T extends SearchObjectType> = {
  error: Error | null;
  isLoading: boolean;
  results: {
    currentResults: ResultsMap[T]['array'];
    page: number;
    count: number;
    byId: Record<number, ResultsMap[T]['result']>;
    allIds: number[];
  };
};

export type SearchState = {
  [key in SearchObjectType]: ObjectSearchState<key>;
};

/**
 * Add your new object identifier here
 */

export const searchObjectIdentifiers = [
  'coach_payment_rules',
  'coupon',
  'coupon_template',
  'email_design',
  'establishment',
  'giftcard',
  'giftcard_template',
  'meta_activity',
  'custom_level',
  'instalment_payment',
  'payment_combo',
  'payment_pack',
  'payment_pack_category',
  'performance_tracking_program',
  'private_service',
  'private_slot',
  'private_pass',
  'private_pass_category',
  'private_pass_template',
  'cadence',
  'sub_shop',
  'sub_shop_template',
  'shop_item',
  'shop_item_template',
  'smart_list',
  'contract',
  'tag',
  'video',
  'associated_coach',
  'establishment_group',
] as const;

export type SearchObjectType = (typeof searchObjectIdentifiers)[number];

/**
 * Identifies the type of the returned objects
 */

type ResultsTypes = {
  coach_payment_rules: CoachPaymentRule;
  coupon: Coupon;
  coupon_template: Coupon;
  email_design: EmailTemplate;
  establishment: Establishment;
  giftcard: Giftcard;
  giftcard_template: Giftcard;
  meta_activity: MetaActivity;
  custom_level: Level;
  instalment_payment: InstalmentPayment;
  payment_combo: PaymentCombo;
  payment_pack: PaymentPack;
  payment_pack_category: PaymentPackCategory;
  performance_tracking_program: PerformanceTrackingProgram;
  private_service: PrivateService;
  private_slot: PrivateSlot;
  private_pass: PrivatePass;
  private_pass_category: PrivatePassCategory;
  private_pass_template: PrivatePassTemplate;
  cadence: Cadence;
  sub_shop: SubShop;
  sub_shop_template: SubShop;
  shop_item: ShopItem;
  shop_item_template: ShopItem;
  smart_list: SmartList;
  contract: Contract;
  tag: Tag;
  video: Video;
  associated_coach: Coach;
  establishment_group: EstablishmentGroupAPI;
};

type ResultTypeMap<T extends SearchObjectType> = {
  result: ResultsTypes[T];
  array: ResultsTypes[T][];
  paginated: PaginatedResponse<ResultsTypes[T]>;
  full: PaginatedResponse<ResultsTypes[T]> & { searchedObjectType: T };
};
export type ResultsMap = { [key in SearchObjectType]: ResultTypeMap<key> };

/**
 * The different props that can be passed to the ObjectSearch component depending on the searched object
 */

export type ObjectSearchProps = {
  [key in SearchObjectType]: {
    searchedObjectType: key;
    additionalParams?: CommonParams & APIParamsMap[key];
  };
}[SearchObjectType];

/**
 * The Query params that can be given to the API depending on the object you are searching for
 */

type APIParamsMap = {
  coach_payment_rules: CoachPaymentRuleAPIParams;
  coupon: CouponAPIParams;
  coupon_template: CouponTemplateAPIParams;
  email_design: EmailDesignAPIParams;
  establishment: EstablishmentAPIParams;
  giftcard: GiftcardAPIParams;
  giftcard_template: GifcardTemplateAPIParams;
  meta_activity: MetaActivityAPIParams;
  custom_level: CustomLevelAPIParams;
  instalment_payment: InstalmentPaymentAPIParams;
  payment_combo: PaymentComboAPIParams;
  payment_pack: PaymentPackAPIParams;
  payment_pack_category: PaymentPackCategoryAPIParams;
  performance_tracking_program: PerformanceTrackingProgramAPIParams;
  private_service: PrivateServiceAPIParams;
  private_slot: PrivateSlotAPIParams;
  private_pass: PrivatePassAPIParams;
  private_pass_category: PrivatePassCategoryAPIParams;
  private_pass_template: PrivatePassTemplateAPIParams;
  cadence: CadenceAPIParams;
  sub_shop: SubShopAPIParams;
  sub_shop_template: SubShopTemplateAPIParams;
  shop_item: ShopItemAPIParams;
  shop_item_template: ShopItemTemplateAPIParams;
  smart_list: SmartListAPIParams;
  contract: ContractAPIParams;
  tag: TagAPIParams;
  video: VideoAPIParams;
  report: ReportAPIParams;
  associated_coach: AssociatedCoachAPIParams;
  establishment_group: EstablishmentGroupAPIParams;
};

export type FuzzySearchAPIParams = APIParamsMap[SearchObjectType] & {
  searchObjectURI: string;
  q: string;
};

type CommonParams = {
  page_size?: number;
  page?: number;
};

type AssociatedCoachAPIParams = CommonParams & AssociatedCoachFilters;

type CoachPaymentRuleAPIParams = CommonParams;

type CouponAPIParams = CommonParams & FetchCouponsParams;

type CouponTemplateAPIParams = CommonParams & FetchCouponsParams;

type EmailDesignAPIParams = CommonParams;

type EstablishmentAPIParams = CommonParams & FetchEstablishmentParams;

type GiftcardAPIParams = CommonParams & { id__in?: number };

type GifcardTemplateAPIParams = CommonParams & { id__in?: number };

type MetaActivityAPIParams = CommonParams & MetaActivityFilter;

type CustomLevelAPIParams = CommonParams & LevelFilterSet;

type InstalmentPaymentAPIParams = CommonParams & { company?: number };

type PaymentComboAPIParams = CommonParams & PaymentComboAPIQueryParams;

type PaymentPackAPIParams = CommonParams & PaymentPackQueryParams;

type PaymentPackCategoryAPIParams = CommonParams;

type PerformanceTrackingProgramAPIParams = CommonParams & {
  is_disabled?: boolean;
  company?: number;
  id__in?: number[];
};

type PrivateServiceAPIParams = CommonParams & PrivateServiceQueryParams;

type PrivateSlotAPIParams = CommonParams & PrivateSlotQueryParams;

type PrivatePassAPIParams = CommonParams & PrivatePassQueryParams;

type PrivatePassCategoryAPIParams = CommonParams;

type PrivatePassTemplateAPIParams = CommonParams;

type CadenceAPIParams = CommonParams & { id__in?: number };

type SubShopAPIParams = CommonParams & { company?: number };

type SubShopTemplateAPIParams = CommonParams;

type ShopItemAPIParams = CommonParams & ShopItemListFilterParams;

type ShopItemTemplateAPIParams = CommonParams;

type SmartListAPIParams = CommonParams & SmartListQueryParams;

type ContractAPIParams = CommonParams & ContractQueryParams;

type TagAPIParams = CommonParams;

type VideoAPIParams = CommonParams & VideoQueryParams;

type ReportAPIParams = CommonParams;

type EstablishmentGroupAPIParams = CommonParams & { id__in?: number[] };
