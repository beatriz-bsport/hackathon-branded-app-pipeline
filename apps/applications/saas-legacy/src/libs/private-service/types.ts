import { CancelTokenSource } from 'axios';
import type {
  PrivateBookingModificationActionIdentifier,
  StaffModificationHistory,
} from '#src/libs/role/types';
import type { PrivateConsumerPassLink } from '#src/libs/relationship/types';
import { Company } from '../company/types';
import { ErrorAndLoading, WithPagination } from '../types';
import { DayTimeIntervals } from '#src/libs/private-service/constants';
import { Interval as LuxonInterval } from 'luxon';
export enum ResourceAttributionEnum {
  auto = 0,
  consumer = 1,
  manager = 3,
  home = 4,
}

export type PrivatePassFilters<FilterValue = boolean> = {
  is_expired?: FilterValue;
  is_valid_today?: FilterValue;
  reverted?: FilterValue;
  has_credit_left?: FilterValue;
};

export type PrivatePassFiltersOpener = {
  expiration?: boolean;
  reverted?: boolean;
  credit_left?: boolean;
};

export type CustomEvents = {
  id: number;
  name: string;
  description: string;
  coaches: number[];
  associated_coaches: { coach_id: number; id: number }[];
  color: string;
  company: number;
  date_start: string;
  date_end: string;
};

export type AvailabilitySlot = {
  associated_coach: number;
  coach: number;
  date_start: string;
  date_end: string;
  resource_identifier: string;
  is_restriction: boolean;
  restriction_on_associated_establishments: Array<number>;
};

export type PrivateServiceGroup = {
  id: number;
  name: string;
  private_services: number[];
};

export type PrivateServiceGroupWithService = {
  id: number;
  name: string;
  private_services: PrivateService[];
};

export type PrivateService<C = number, E = number, S = number> = {
  id: number;
  name: string;
  description: string;
  available: boolean;
  establishments: Array<E>;
  coach_capacity_used: number;
  use_full_establishment_capacity: boolean;
  coaches: Array<C>;
  color: string;
  company: number;
  slots: Array<S>;
  establishment_attribution: ResourceAttributionEnum;
  is_home_service: boolean;
  coach_attribution: ResourceAttributionEnum;
  manager_only: boolean;
  has_own_availability_slots: boolean;
  last_discard_minutes: number;
  last_booking_minutes: number;
  cover_main: string;
  private_service_group?: number;
  slots_duration_minute: Array<number>;
  availability_padding_start_minutes: number;
  availability_padding_end_minutes: number;
  pad_before_stop: boolean;
  member_whitelist_tags: Array<number>;
  member_blacklist_tags: Array<number>;
  available_on_partnership: boolean;
};
export type PrivateServiceWithSlots<C = number, E = number> = {
  id: number;
  name: string;
  description: string;
  available: boolean;
  establishments: Array<E>;
  coach_capacity_used: number;
  use_full_establishment_capacity: boolean;
  coaches: Array<C>;
  color: string;
  company: number;
  slots: Array<PrivateSlot>;
  establishment_attribution: ResourceAttributionEnum;
  is_home_service: boolean;
  coach_attribution: ResourceAttributionEnum;
  manager_only: boolean;
  has_own_availability_slots: boolean;
  last_discard_minutes: number;
  last_booking_minutes: number;
  cover_main: string;
  private_service_group?: number;
  slots_duration_minute: Array<number>;
  availability_padding_start_minutes: number;
  availability_padding_end_minutes: number;
  pad_before_stop: boolean;
};
export type PrivateSlot = {
  id: number;
  name: string;
  private_service: number;
  credit: number;
  duration_minutes: number;
  available: boolean;
  people_capacity_used: number;
  booking_interval_minutes: number;
};

export type PrivateCoach = {
  id: number;
  private_service: number;
  associated_coach: number;
  name: string;
  photo: string;
};

export type PrivateEstablishment = {
  id: number;
  private_service: number;
  associated_establishment: number;
  cover: string;
  title: string;
  location: {
    address: string;
  };
};

export type IsoDateTime = string; // "2024-10-04T06:00:00Z"
export type IsoDate = string; // "2024-10-04"

export type Slot = [IsoDateTime, IsoDateTime];

export type ResourceSlots = { resource_identifier: string; slots: Slot[] };

export type ResourceSlotsByDate = { [date: IsoDate]: ResourceSlots[] };

export type AvailableResource = {
  resource_identifier: string;
  availableIntervals: LuxonInterval[];
};

export type AvailableIntervalByCoachId = { [coachId: string]: LuxonInterval[] };

export type AvailableIntervalByEstablishmentId = {
  [establishmentId: string]: LuxonInterval[];
};

export type CoachAvailabilitiesByEstablishment = {
  [establishmentId: string]: AvailableIntervalByCoachId;
};

export type AvailabilityByEstablishmentAndCoach = {
  [establishmentId: string]: {
    establishmentAvailabilities: LuxonInterval[];
    coachAvailabilities: AvailableIntervalByCoachId;
  };
};

export type PrivatePass<LPP = number | null> = {
  id: number;
  name: string;
  credits: number;
  price: number;
  tax: number;
  private_services: number[];
  manager_only: boolean;
  available: boolean;
  duration_days: number;
  duration_months: number;
  duration_years: number;
  available_payment_method_identifiers: number[];
  full_vod_access: boolean;
  editable: boolean;
  expiration_days_before_first_use: number;
  start_date_method: number;
  new_member_only: boolean;
  company: number;
  category: number;
  ordering_in_category: number;
  template_instance: number;
  is_unpaid_private_booking_integration: boolean;
  linked_payment_pack?: LPP;
  linked_payment_pack_template_instance?: number;
  description?: string;
  is_usable_by_staff: boolean;
  applies_for_payroll: boolean;
  on_behalf_of_teacher: boolean;
  tags_on_consumer_item_creation?: Array<number>;
  bookkeeping_account?: number;
  grants_door_access?: boolean;
};

export type PrivatePassWithDetailedPrivateServices = PrivatePass & {
  private_services: Array<PrivateService>;
};

export type PrivatePassWithCompatibility<LPP = number | null> = {
  id: number;
  name: string;
  credits: number;
  price: number;
  tax: number;
  compatibility: { private_service: number; excluded_slot_ids: number[] }[];
  manager_only: boolean;
  available: boolean;
  duration_days: number;
  duration_months: number;
  duration_years: number;
  available_payment_method_identifiers: number[];
  full_vod_access: boolean;
  editable: boolean;
  expiration_days_before_first_use: number;
  start_date_method: number;
  new_member_only: boolean;
  company: number;
  category: number;
  ordering_in_category: number;
  template_instance: number | null;
  linked_payment_pack_template_instance?: number;
  linked_payment_pack?: LPP;
  is_usable_by_staff: boolean;
  tags_on_consumer_item_creation?: Array<number>;
  expiration_date: string | null;
};

export type PrivateConsumerPass<AssociatedMember = number> = {
  no_private_booking_active: boolean;
  id: number;
  used_credits: number;
  private_pass: PrivatePass;
  consumer: number;
  date_created: string;
  reverted: boolean;
  date_bought: string;
  extension_days: number;
  member: AssociatedMember;
  linked_consumer_payment_pack: number | null;
  is_universal_consumer_pass_source: boolean;
  dst_private_consumer_pass?: Array<PrivateConsumerPassLink>;
  src_private_consumer_pass?: Array<PrivateConsumerPassLink>;
  private_consumer_pass_source: number | null;
  company_source_name: string;
  company_source_primary_color: string;
  disabled?: boolean;
  linked_consumer_payment_pack_source: number | null;
};

export type PrivateConsumerPassREST = Omit<
  PrivateConsumerPass<number>,
  'dst_private_consumer_pass' | 'src_private_consumer_pass'
> & {
  dst_private_consumer_pass?: number[];
  src_private_consumer_pass?: number[];
};

export type PrivateBooking<
  PrivateSlotId = number,
  CoachId = number,
  EstablishmentId = number,
  PrivateServiceId = number,
  MemberId = number,
  RecurrenceRulePrivateBookingId = number,
  StaffHistory = Array<
    StaffModificationHistory<PrivateBookingModificationActionIdentifier>
  >,
> = {
  id: number;
  date_start: string;
  date_end: string;
  private_consumer_pass: number;
  member: MemberId;
  name: string;
  private_slot: PrivateSlotId;
  private_service: PrivateServiceId;
  address: string;
  booking_status_code: number;
  is_discardable: boolean;
  associated_coach: number;
  associated_establishment: number;
  coach: CoachId;
  establishment: EstablishmentId;
  date_created: string;
  source: number;
  first_in_company: boolean;
  was_refunded: boolean;
  timezone_name: string;
  date_canceled: string;
  is_unpaid: boolean;
  is_at_home: boolean;
  recurrence_rule_private_booking: RecurrenceRulePrivateBookingId;
  staff_history: StaffHistory;
  internal_note?: string;
};

export type PrivateBookingPreview = {
  coach: {
    photo: string;
    name: string;
  };
  title: string;
  subtitle: string;
  date_Start: string;
  date_end: string;
  credit_cost: number;
  company: number;
};

export type PrivateResource = {
  resource_identifier: string;
  resource_id: number;
  name: string;
  color: string;
  private_service: number;
  datatype: string;
  photo: string | null;
};

export type ResourceData = {
  resourceDatatype: string;
  resourceIdentifier: number;
  color: string;
  resourceData: any;
  datatype:
    | 'associated_coach'
    | 'associated_establishment'
    | 'establishment'
    | 'coach'
    | 'private_service';
};

export type RecurrenceRulePrivateBooking<
  MemberType = number,
  PrivateSlotType = number,
  AssociatedCoachType = number,
  AssociatedEstablishmentType = number,
> = {
  id: number;
  day_of_week: number;
  hour: number;
  minute: number;
  nb_of_weeks: number;
  member: MemberType;
  private_slot: PrivateSlotType;
  is_overriding_availabilities: boolean;
  allow_unpaid: boolean;
  associated_coach?: AssociatedCoachType;
  associated_establishment?: AssociatedEstablishmentType;
  notify_if_booked: boolean;
  start_from_date?: string;
  timezone_name: string;
  staff_history: any[];
};

export type ServiceCompatibilityPass = {
  id: number;
  private_service: PrivateService;
  private_pass: number;
  excluded_slot_ids: number[];
  included_slots: PrivateSlot[];
};

export type CompatiblePrivateService = {
  private_service: number;
  excluded_slot_ids: number[];
};

export type CompatiblePrivateServiceWithIncludedSlots = {
  private_service: number;
  excluded_slot_ids: number[];
  included_slots: Array<PrivateSlot>;
};

export type PrivateConsumerPassExtension = {
  date_created: string;
  id: number;
  nb_days: number;
  note: string;
  private_consumer_pass: number;
};

export type PrivateConsumerPassExtensionParams = {
  page_size?: number;
  page: number;
  private_consumer_pass: number;
};

export type PrivateConsumerPassExtensionCreate = {
  nb_days: number;
  note: string;
  private_consumer_pass: number;
};

export type PrivatePassMassExtension = {
  date_created: string;
  id: number;
  max_ending_date: string;
  min_ending_date: string;
  nb_days: number;
  note: string;
  private_pass: number;
};

export type PrivatePassMassExtensionParams = {
  page_size?: number;
  page: number;
  private_pass: number;
};

export type PrivatePassMassExtensionCreate = {
  max_ending_date: string;
  min_ending_date: string;
  nb_days: number;
  note: string;
  private_pass: number;
};

export type PrivatePassCategory = {
  id: number;
  name: string;
  company_id: number;
  category_ordering: number;
};

export type PrivatePassCategoryWithPasses = PrivatePassCategory & {
  passes: Array<PrivatePass>;
};

export type PrivatePassTemplateInstance = {
  tax: number | null;
  id: number;
  price: number | null;
  disabled: boolean;
  company: number;
  private_pass: number;
  private_pass_template: number;
};

export type PrivatePassTemplateAPI = {
  id: number;
  name: string;
  manager_only: boolean;
  credits: number;
  duration_days: number;
  duration_months: number;
  duration_years: number;
  validity_daterange: null | {
    upper: string;
    lower: string;
  };
  disabled: boolean;
  tax: number;
  price: string;
  franchisor: number | null;
  private_pass_template_instances: Array<PrivatePassTemplateInstance>;
  start_date_method: number;
  expiration_days_before_first_use: number;
  is_usable_by_staff: boolean;
  editable: boolean;
};

export type PrivatePassTemplate = PrivatePassTemplateAPI & {
  companies: Array<Company>;
};

export type PrivatePassTemplateInstanceParams = {
  companies: number[];
};

export interface PrivateServiceState {
  customEvent: ErrorAndLoading & {
    byId: { [key: string]: CustomEvents };
    createOrUpdate: ErrorAndLoading;
  };
  privateSlot: ErrorAndLoading & {
    allIds: number[];
    byId: { [id: string]: PrivateSlot };
    createOrUpdate: ErrorAndLoading;
    unpaidBookingAvailability: {
      byId: { [bookingId: number]: boolean };
    };
  };
  availabilitySlot: ErrorAndLoading & {
    existsByResourceTypeById: {
      [resourceDatatype: string]: {
        [resourceIdentifier: number]: ErrorAndLoading & {
          exists: boolean;
        };
      };
    };
    byId: { [key: string]: AvailabilitySlot };
    createOrUpdate: ErrorAndLoading;
    searched: ErrorAndLoading & {
      items: { resource_identifier: string; slots: Array<Array<string>> }[];
    };
    next: ErrorAndLoading & {
      date: string | null;
      cancelToken: CancelTokenSource | null;
    };
    slotsByDate: ErrorAndLoading & {
      byDate: ResourceSlotsByDate;
    };
  };
  privateConsumerPass: ErrorAndLoading & {
    allIds: Array<number>;
    byId: { [id: string]: PrivateConsumerPass };
    update: ErrorAndLoading;
    compatible: ErrorAndLoading & { allIds: string[] };
    noncompatible: ErrorAndLoading & { allIds: string[] };
    incompatibilitiesBySlotByConsumerPass: ErrorAndLoading & {
      byId: { [key: string]: number[] };
    };
    byPrivatePass: ErrorAndLoading &
      WithPagination & {
        privatePassId: string;
        allIds: string[];
      };
    byMember: ErrorAndLoading &
      WithPagination & {
        allIds: string[];
      };
    extension: ErrorAndLoading & {
      allIds: number[];
      byId: { [extensionId: number]: PrivateConsumerPassExtension };
      count: number;
      create: ErrorAndLoading;
      delete: ErrorAndLoading;
      next_page: number;
      page: number;
      updatingConsumerPass: [];
    };
  };
  resource: {
    byId: { [key: string]: PrivateResource };
    allIds: string[];
    loading: boolean;
    error?: Error;
  };
  privateService: ErrorAndLoading & {
    byId: { [id: string]: PrivateService };
    marketplaceIds: string[];
    allIds: Array<number>;
    createOrUpdate: ErrorAndLoading;
  };
  recurrenceRule: {
    byId: { [id: number]: RecurrenceRulePrivateBooking };
    allIds: Array<number>;
    loading: boolean;
    error?: Error;
    createOrUpdate: {
      loading: boolean;
      error?: Error;
    };
    delete: {
      loading: boolean;
      error?: Error;
    };
  };
  serviceGroup: ErrorAndLoading & {
    byId: { [key: string]: PrivateServiceGroup };
    allIds: string[];
    delete: ErrorAndLoading;
    createOrUpdate: ErrorAndLoading;
  };
  privatePass: ErrorAndLoading & {
    byId: { [id: string]: PrivatePass };
    allIds: Array<number>;
    asConsumer: ErrorAndLoading & { allIds: Array<number> };
    archivationWarning: { [id: number]: { used_in_combo: boolean } };
    createOrUpdate: ErrorAndLoading;
    massExtension: ErrorAndLoading & {
      allIds: number[];
      byId: { [extensionId: number]: PrivatePassMassExtension };
      count: number;
      create: ErrorAndLoading;
      delete: ErrorAndLoading;
      next_page: number;
      page: number;
    };
  };
  privateBooking: ErrorAndLoading & {
    byId: { [id: string]: PrivateBooking };
    allIds: Array<number>;
    createOrUpdate: ErrorAndLoading;
    setUnpaid: ErrorAndLoading;
  };
  calendarEvent: ErrorAndLoading & {
    byId: { [key: string]: PrivateSlot };
  };
  compatibleServicePass: ErrorAndLoading & {
    byId: { [id: string]: ServiceCompatibilityPass };
    allIds: Array<number>;
  };
  privatePassCategory: ErrorAndLoading & {
    byId: { [id: number]: PrivatePassCategory };
    allIds: Array<number>;
    upsert: ErrorAndLoading;
  };
  privatePassTemplate: {
    byId: { [id: number]: PrivatePassTemplate };
    allIds: Array<number>;
    loading: boolean;
    error: Error | null;
    upsert: {
      loading: boolean;
      error: Error | null;
    };
  };
  privateServiceTagEligibility: {
    byId: Record<string, boolean>;
  } & ErrorAndLoading;
}

export type Interval = {
  date_start: string;
  date_end: string;
};

export type Selection = {
  startStr: string;
  endStr: string;
};

export type SlotsGroupedByRestriction = Record<string, Array<AvailabilitySlot>>;

export type SlotsGroupedByResourceId = Record<
  string,
  SlotsGroupedByRestriction
>;

export type IntervalsGroupedByRestriction = Record<string, Array<Interval>>;

export type IntervalsGroupedByResourceId = Record<
  string,
  IntervalsGroupedByRestriction
>;

export type ResourceType =
  | 'associated_coach'
  | 'associated_establishment'
  | 'private_service';

export type AvailabilityDetail = {
  resourceType: ResourceType;
  resourceId: number;
  name: string;
  photo: string;
  slots: Array<{
    date_start: string;
    date_end: string;
    restriction_on_associated_establishments: string[];
  }>;
  isFirst?: boolean;
  isLast?: boolean;
};

export type PrivatePassFactoryOptions = {
  isManagerOnly?: boolean;
  isAvailable?: boolean;
  isEditable?: boolean;
  isNewMemberOnly?: boolean;
  isUnpaidPrivateBookingIntegration?: boolean;
  isUsableByStaff?: boolean;
  isAppliesForPayroll?: boolean;
  isOnBehalfOfTeacher?: boolean;
  isGenerateTemplateInstance?: boolean;
};

export type PrivateServiceFactoryOptions = {
  withSlots?: boolean;
  withCoaches?: boolean;
};

export type PrivateBookingFilterParams = {
  before_date_end?: boolean;
  booking_status_code__in?: number[];
  coach?: number[];
  company?: number;
  date_start__gte?: string;
  date_start__lte?: string;
  establishment?: number;
  strictly_future_booking?: boolean;
  id__in?: number[];
  is_recurrent?: boolean;
  is_unpaid?: boolean;
  member?: number;
  page_size?: number;
  page?: number;
  strictly_past_booking?: boolean;
  was_refunded?: boolean;
  ordering?: 'date_start' | '-date_start';
  future_booking?: boolean;
  past_booking?: boolean;
};

/** Transformed Private consumer pass for the consumer page by including full objects */
export type PrivateServiceCompatibilityPass = Omit<
  ServiceCompatibilityPass,
  'private_service'
> & { private_service: PrivateServiceWithSlots };

export type PrivateConsumerPassReworked = Omit<
  PrivateConsumerPassREST,
  'dst_private_consumer_pass' | 'src_private_consumer_pass' | 'private_pass'
> & {
  dst_private_consumer_pass?: PrivateConsumerPassLink;
  src_private_consumer_pass?: PrivateConsumerPassLink[];
  private_pass: Omit<PrivatePass, 'private_services'> & {
    private_services: PrivateServiceCompatibilityPass[];
  };
};

export type PrivateServiceQueryParams = {
  mine?: boolean;
  id__in?: number[];
  private_service_group__in?: number[];
  company?: number;
  available?: boolean;
  manager_only?: boolean;
};

export type PrivateSlotQueryParams = {
  mine?: boolean;
  id__in?: number[];
  company?: number;
  private_service__in?: number[];
  available?: boolean;
  private_service?: number;
};

export type PrivatePassQueryParams = {
  video?: number;
  id__in?: number[];
  id__not_in?: number[];
  include_expired?: boolean;
  company?: number;
  available?: boolean;
  manager_only?: boolean;
};

/**
 * This type is used when calling specific methods to allocate availabilities
 * or unavailabilities for a resource.
 *
 * The generic nature of this type can make it somewhat cumbersome,
 * as the methods and workflows that utilize it.
 */
export type ResourceDataTypeForAllocation = Partial<
  Record<
    | 'associated_coach'
    | 'associated_establishment'
    | 'establishment'
    | 'coach'
    | 'private_service',
    number
  >
>;

export type DayTimeIntervalsType = DayTimeIntervals;
