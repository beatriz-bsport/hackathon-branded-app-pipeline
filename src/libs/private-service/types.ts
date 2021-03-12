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
  private_services: number;
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
  private_service: number;
  private_pass: number;
  excluded_slot_ids: number[];
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

type ErrorAndLoading = {
  error?: Error;
  loading: boolean;
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
}
