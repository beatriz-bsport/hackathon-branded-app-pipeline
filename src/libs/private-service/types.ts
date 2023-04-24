// @ts-nocheck
import { CancelTokenSource } from 'axios';
import { Company } from '../company/types';
import { ErrorAndLoading, WithPagination } from '../types';
import type {
  PrivateBookingModificationActionIdentifier,
  StaffModificationHistory,
} from '#libs/role/types';

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
  description?: string;
  is_usable_by_staff: boolean;
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
  template_instance: number;
  linked_payment_pack?: LPP;
  is_usable_by_staff: boolean;
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
  dst_private_consumer_pass?: Array<PrivateConsumerPass>;
  src_private_consumer_pass?: Array<PrivateConsumerPass>;
  disabled?: boolean;
};

export type PrivateBooking<
  PrivateSlotId = number,
  CoachId = number,
  EstablishmentId = number,
  PrivateServiceId = number,
  MemberId = number,
  RecurrenceRulePrivateBooking = number,
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
  recurrence_rule_private_booking: RecurrenceRulePrivateBooking;
  staff_history: StaffHistory;
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
  id: number;
  note: string;
  private_consumer_pass: number;
  date_created: string;
  nd_days: number;
};
export type PrivateConsumerPassMassExtension = {
  id: number;
  private_pass: number;
  min_ending_date: string;
  max_ending_date: string;
  note: string;
  nb_days: number;
  date_created: string;
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
};

export type PrivatePassTemplate = PrivatePassTemplateAPI & {
  companies: Array<Company>;
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
      items: PrivateConsumerPassExtension[];
      create: ErrorAndLoading;
      delete: ErrorAndLoading;
      updatingConsumerPass: [];
    };
    massExtension: ErrorAndLoading &
      WithPagination & {
        byId: { [key: string]: PrivateConsumerPassMassExtension };
        allIds: number[];
        firstLoadDone: boolean;
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
  };
  privateBooking: ErrorAndLoading & {
    byId: { [id: string]: PrivateBooking };
    allIds: Array<number>;
    createOrUpdate: ErrorAndLoading;
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
