import type { Dispatch, SetStateAction } from 'react';
import { ImmutableArray } from 'seamless-immutable';
import type { OptionProps } from 'react-select/lib/components/Option';

import type { Coupon, FetchCouponsParams } from '#src/libs/coupon/types';
import type { PaginatedResponse } from '#src/state/types';
import type { EmailTemplate } from '#src/libs/email-editor/types';
import type {
  CoachPaymentRule,
  CoachPaymentRuleGroupAPI,
} from '#src/libs/coach-payment-rules/types';

import type {
  Establishment,
  EstablishmentGroupAPI,
  FetchEstablishmentParams,
} from '#src/libs/establishment/types';
import type { Giftcard } from '#src/libs/giftcard/types';
import type { InstalmentPayment } from '#src/libs/instalment-payment-configuration/types';
import type { Level, LevelFilterSet } from '#src/libs/level/types';
import type {
  MetaActivity,
  MetaActivityFilter,
} from '#src/libs/meta-activity/types';
import type {
  PaymentCombo,
  PaymentComboAPIParams as PaymentComboAPIQueryParams,
} from '#src/libs/payment-combo/types';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackQueryParams,
  PaymentPackTemplateAPI,
} from '#src/libs/payment-packs/types';
import type { PerformanceTrackingProgram } from '#src/libs/performance-tracking/types';
import type {
  PrivatePass,
  PrivatePassCategory,
  PrivatePassQueryParams,
  PrivatePassTemplate,
  PrivateService,
  PrivateServiceQueryParams,
  PrivateSlot,
  PrivateSlotQueryParams,
} from '#src/libs/private-service/types';
import type { Cadence } from '#src/libs/sequential_marketing/types';
import type {
  ShopItem,
  ShopItemFilterParams,
  ShopItemTemplate,
  ShopItemTemplateFilterParams,
  SubShop,
} from '#src/libs/shop/types';
import type {
  SmartList,
  SmartListQueryParams,
} from '#src/libs/smart-list/types';
import type {
  Contract,
  ContractQueryParams,
  ContractTemplate,
  ContractTemplatePaginatedQueryParams as ContractTemplateAPIParams,
} from '#src/libs/subscription/types';
import type { Tag } from '#src/libs/tag/types';
import type { Video, VideoQueryParams } from '#src/libs/video/types';
import type {
  AssociatedCoachFilters,
  Coach,
} from '#src/libs/associated-coach/types';
import type {
  CustomForm,
  CustomFormQueryParams,
} from '#src/libs/custom-form/types';
import type { PaginationFilterParams, SelectOption } from '#src/libs/types';
import type { OptionsType } from 'react-select/lib/types';
import type {
  FranchiseProductTemplateQueryParams,
  FranchiseUserPass,
  FranchiseUserPrivatePass,
  PassesSearchPaginatedQueryParams,
} from '#src/libs/franchise/types';
import type {
  ReportConfiguration,
  ReportQueryParams,
} from '#src/libs/reporting/common/types';
import type { CommunicationSentGroupConfig } from '#src/libs/communication/types';

export type SearchIdentifier = {
  searchedObjectType: SearchObjectType;
  selectorId: string;
};

export type IdentifiedValue<T> = {
  value: T;
} & SearchIdentifier;

export type ObjectSearchResult = ResultsMap[SearchObjectType]['result'];
export type ObjectSearchArray = ResultsMap[SearchObjectType]['array'];
export type ObjectSearchPaginated = ResultsMap[SearchObjectType]['paginated'];

export type ObjectSearchState<T extends SearchObjectType> = {
  error: Error | null;
  loading: boolean;
  results: {
    currentResults: ResultsMap[T]['immutableArray'];
    page: number;
    next_page: number | null;
    count: number;
    allIds: number[];
  };
};

export type SearchState = {
  [key in SearchObjectType]: {
    byId: Record<number, ResultsMap[key]['result']>; // All the results of the search on this object
    bySelectorId: Record<string, ObjectSearchState<key>>; // The state of the search for a specific selector
  };
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
  'payment_pack_template',
  'universal_payment_pack_template',
  'franchise_user_private_pass',
  'franchise_user_payment_pack',
  'cadence',
  'sub_shop',
  'sub_shop_template',
  'shop_item',
  'shop_item_template',
  'smart_list',
  'contract',
  'contract_template',
  'tag',
  'video',
  'associated_coach',
  'establishment_group',
  'custom_form',
  'coach_payment_rule_groups',
  'reportV2',
  'communication_sent_group_config',
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
  franchise_user_private_pass: FranchiseUserPrivatePass;
  franchise_user_payment_pack: FranchiseUserPass;
  cadence: Cadence;
  sub_shop: SubShop;
  sub_shop_template: SubShop;
  shop_item: ShopItem;
  shop_item_template: ShopItemTemplate;
  smart_list: SmartList;
  contract: Contract;
  contract_template: ContractTemplate;
  tag: Tag;
  video: Video;
  associated_coach: Coach;
  establishment_group: EstablishmentGroupAPI;
  custom_form: CustomForm;
  coach_payment_rule_groups: CoachPaymentRuleGroupAPI;
  reportV2: ReportConfiguration;
  payment_pack_template: PaymentPackTemplateAPI;
  universal_payment_pack_template: PaymentPackTemplateAPI;
  communication_sent_group_config: CommunicationSentGroupConfig;
};

/* eslint-disable-next-line */
const variantType = ['default', 'mui-selector', 'underlined'] as const;

export type VariantType = (typeof variantType)[number];

type ResultTypeMap<T extends SearchObjectType> = {
  result: ResultsTypes[T];
  array: ResultsTypes[T][];
  immutableArray: ImmutableArray<ResultsTypes[T]>;
  paginated: PaginatedResponse<ResultsTypes[T]>;
  full: PaginatedResponse<ResultsTypes[T]> & { searchedObjectType: T };
};
export type ResultsMap = { [key in SearchObjectType]: ResultTypeMap<key> };

/**
 * The different props that can be passed to the ObjectSearch component depending on the searched object
 */

export type ObjectSelectOption =
  | SelectOption<number>
  | { label: string; options: SelectOption<number>[] };

export type SelectOptions = OptionsType<ObjectSelectOption>;

export type ObjectSearchProps = {
  [key in SearchObjectType]: {
    searchedObjectType: key;
    /**
     * Function used to format the results into options. Use this when your onChange function needs additional data other
     * than label and value. By default the optionsFormatter will return an object with keys label and value.
     *
     * @param results The results that are fetched from the API
     * @returns An object with keys label, value and optionally other keys
     */
    optionsFormatter?: (results: ResultsMap[key]['array']) => SelectOptions;
    /**
     * The query filters that can be passed to the API when fetching the results. Can be used to filter the results
     * and to handle pagination.
     */
    additionalParams?: ReplaceArrayTypes<
      PaginationFilterParams & APIParamsMap[key]
    >;
    /**
     * The initial values that need to be hydrated. ObjectSearch will use these values to perform a first search that
     * will store the results in the corresponding byId section of the store.
     */
    initialValues?: number[];
    /**
     * The redux identifier that will be used to store the results. This is used to differentiate between different
     * selectors searching the same object type. By default, the id is "default".
     * If you are using multiple selectors for the same object type simultaneously, make sure to pass a unique id to each of them.
     */
    selectorId?: string;
    /**
     * Variant of the ObjectSearchProps
     */
    variant?: VariantType;
    objectId?: number;
    setHydratedLoading?: Dispatch<SetStateAction<boolean>>;
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
  franchise_user_private_pass: PassesSearchPaginatedQueryParams;
  franchise_user_payment_pack: PassesSearchPaginatedQueryParams;
  cadence: CadenceAPIParams;
  sub_shop: SubShopAPIParams;
  sub_shop_template: SubShopTemplateAPIParams;
  shop_item: ShopItemAPIParams;
  shop_item_template: ShopItemTemplateAPIParams;
  smart_list: SmartListAPIParams;
  contract: ContractAPIParams;
  contract_template: ContractTemplateAPIParams;
  tag: TagAPIParams;
  video: VideoAPIParams;
  report: ReportAPIParams;
  associated_coach: AssociatedCoachAPIParams;
  establishment_group: EstablishmentGroupAPIParams;
  custom_form: CustomFormAPIParams;
  coach_payment_rule_groups: CoachPaymentRuleGroupAPIParams;
  reportV2: ReportAPIParams;
  payment_pack_template: FranchiseProductTemplateQueryParams;
  universal_payment_pack_template: FranchiseProductTemplateQueryParams;
  communication_sent_group_config: void;
  from_subscription: boolean;
};

export type FuzzySearchFilterParams<T extends SearchObjectType> =
  ReplaceArrayTypes<PaginationFilterParams & APIParamsMap[T]>;

export type FuzzySearchAPIParams = APIParamsMap[SearchObjectType] & {
  searchObjectURI: string;
  q: string;
};

type AssociatedCoachAPIParams = PaginationFilterParams & AssociatedCoachFilters;

type CouponAPIParams = PaginationFilterParams & FetchCouponsParams;

type CoachPaymentRuleAPIParams = PaginationFilterParams & { kind__in?: number };

type CouponTemplateAPIParams = PaginationFilterParams & FetchCouponsParams;

type EmailDesignAPIParams = PaginationFilterParams & { available?: boolean };

type EstablishmentAPIParams = PaginationFilterParams & FetchEstablishmentParams;

type GifcardTemplateAPIParams = PaginationFilterParams & { id__in?: number };

type MetaActivityAPIParams = PaginationFilterParams & MetaActivityFilter;

type CustomLevelAPIParams = PaginationFilterParams & LevelFilterSet;

type InstalmentPaymentAPIParams = PaginationFilterParams & { company?: number };

type PaymentComboAPIParams = PaginationFilterParams &
  PaymentComboAPIQueryParams;

type PaymentPackAPIParams = PaginationFilterParams & PaymentPackQueryParams;

type PaymentPackCategoryAPIParams = PaginationFilterParams;
type GiftcardAPIParams = PaginationFilterParams & {
  id__in?: number;
  company?: number;
  disabled?: boolean;
  value__gt?: number;
  manager_only?: boolean;
};

type PerformanceTrackingProgramAPIParams = PaginationFilterParams & {
  is_disabled?: boolean;
  company?: number;
  id__in?: number[];
};

type PrivateServiceAPIParams = PaginationFilterParams &
  PrivateServiceQueryParams;

type PrivateSlotAPIParams = PaginationFilterParams & PrivateSlotQueryParams;

type PrivatePassAPIParams = PaginationFilterParams & PrivatePassQueryParams;

type PrivatePassCategoryAPIParams = PaginationFilterParams;

type PrivatePassTemplateAPIParams = PaginationFilterParams & {
  id__not_in?: number[];
  disabled?: boolean;
};

type CadenceAPIParams = PaginationFilterParams & { id__in?: number };

type SubShopAPIParams = PaginationFilterParams & { company?: number };

type SubShopTemplateAPIParams = PaginationFilterParams;

type ShopItemAPIParams = PaginationFilterParams & ShopItemFilterParams;

type ShopItemTemplateAPIParams = PaginationFilterParams &
  ShopItemTemplateFilterParams;

type SmartListAPIParams = PaginationFilterParams & SmartListQueryParams;

type ContractAPIParams = PaginationFilterParams & ContractQueryParams;

type TagAPIParams = PaginationFilterParams;

type VideoAPIParams = PaginationFilterParams & VideoQueryParams;

type ReportAPIParams = PaginationFilterParams & ReportQueryParams;

type EstablishmentGroupAPIParams = PaginationFilterParams & {
  id__in?: number[];
  companyId?: number;
};

type CustomFormAPIParams = PaginationFilterParams & CustomFormQueryParams;

type CoachPaymentRuleGroupAPIParams = PaginationFilterParams;

type ExtendedArray<T> = T[] | ReadonlyArray<T> | ImmutableArray<T>;

type ReplaceArrayTypes<T> = T extends Array<infer U>
  ? ExtendedArray<U>
  : T extends ReadonlyArray<infer U>
  ? ExtendedArray<U>
  : T extends ImmutableArray<infer U>
  ? ExtendedArray<U>
  : T extends object
  ? { [K in keyof T]: ReplaceArrayTypes<T[K]> }
  : T;

export type OptionPropsWithData<T> = Omit<
  OptionProps<SelectOption<number>>,
  'data'
> & {
  data: T;
};
