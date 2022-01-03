import { Company } from '../company/types';
import { WithPagination } from '../types';

export enum ResourceAttributionEnum {
  auto = 0,
  consumer = 1,
  manager = 3,
  home = 4,
}

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

export type PrivatePass = {
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
};

export type PrivatePassWithDetailedPrivateServices = PrivatePass & {
  private_services: Array<PrivateService>;
};

export type PrivatePassWithCompatibility = {
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
};

export type PrivateConsumerPass = {
  id: number;
  used_credits: number;
  private_pass: PrivatePass;
  consumer: number;
  date_created: string;
  reverted: boolean;
  date_bought: string;
  extension_days: number;
  member: number;
};

export type PrivateBooking = {
  id: number;
  date_start: string;
  date_end: string;
  private_consumer_pass: number;
  member: number;
  name: string;
  private_slot: number;
  private_service: number;
  address: string;
  booking_status_code: number;
  is_discardable: boolean;
  associated_coach: number;
  associated_establishment: number;
  coach: number;
  establishment: number;
  date_created: string;
  source: number;
  was_refunded: boolean;
  timezone_name: string;
  date_canceled: string;
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
};

export type ResourceData = {
  resourceDatatype: string;
  resourceIdentifier: number;
  color: string;
  resourceData: any;
};

export type RecurrenceRulePrivateBooking = {
  id: number;
  day_of_week: number;
  hour: number;
  minute: number;
  nb_of_weeks: number;
  member: number;
  private_slot: PrivateSlot;
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

type ErrorAndLoading = {
  error?: Error;
  loading: boolean;
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
    byId: { [id: string]: PrivateSlot };
    createOrUpdate: ErrorAndLoading;
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
  };
  privateConsumerPass: ErrorAndLoading & {
    allIds: Array<number>;
    byId: { [id: string]: PrivateConsumerPass };
    update: ErrorAndLoading;
    compatible: ErrorAndLoading & { allIds: string[] };
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
      items: any[];
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
