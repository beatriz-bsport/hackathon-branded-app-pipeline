
export enum ResourceAttributionEnum {
  auto = 0,
  consumer = 1,
  manager = 3,
  home = 4,
}

export type AvailabilitySlot = {
  associated_coach: number,
  coach: number,
  date_start: string,
  date_end: string,
};

export type PrivateService = {
  id: number;
  name: string;
  description: string;
  coaches: Array<number | PrivateCoach>;
  available: boolean;
  establishments: Array<number | PrivateEstablishment>;
  slots: Array<number | PrivateSlot>;
  slots_duration_minute: Array<number>;
  is_home_service: boolean;
  establishment_attribution: ResourceAttributionEnum;
  booking_interval_minutes: number;
  coach_attribution: ResourceAttributionEnum;
  cover_main: string;
  private_service_group?: number
};


export type PrivateSlot = {
  id: number,
  name: string,
  private_service: number,
  cedit: number,
  duration_minutes: number,
  people_capacity_used: number;
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
  }
};

export type PrivatePass = {
  id: number,
  name: string,
  credits: number,
  price: number,
  tax: number,
  private_services: Array<number>,
  manager_only: boolean,
  duration_days: any , // TODO TYPES
  duration_months: any, // TODO TYPES
  duration_years: any // TODO TYPES
};

export type PrivateConsumerPass = {
  id: number,
  used_credits: number,
  consumer: number,
  private_pass: PrivatePass,
  date_bought: any // TODO TYPES
  extension_days: any // TODO TYPES
};

export type PrivateBooking = {
  id: number,
  date_start: string,
  date_end: string,
  private_consumer_pass: number,
  member: number,
  name: string,
  private_slot: number,
};

export type PrivateBookingPreview = {
  coach: {
    photo: string,
    name: string,
  },
  title: string,
  subtitle: string,
  date_Start: string,
  date_end: string,
  credit_cost: number,
  company: number,
};

export type ResourceData = {
  resourceDatatype: string,
  resourceIdentifier: number,
  color: string,
  resourceData: any,
};

export type RecurrenceRulePrivateBooking = {
  id: number,
  day_of_week: number,
  hour: number,
  minute: number,
  nb_of_weeks: number,
  member: number,
  private_slot: PrivateSlot,
}

export type PrivateServiceState = {
  availabilitySlot: {
    existsByResourceTypeById: {
      [resourceDatatype: string]: {
        [resourceIdentifier: number]: {
          exists: boolean,
          error?: Error,
          loading: boolean,
        },
      },
    },
    items: Array<AvailabilitySlot>,
    loading: boolean,
    error?: Error,
    createOrUpdate: {
      loading: boolean,
      error?: Error,
    },
    searched: {
      items: Array<string>,
      loading: boolean,
      error?: Error,
    },
  };
  privatePass: {
    allIds: Array<number>,
    asConsumer: {
      allIds: Array<number>,
      loading: boolean,
      error?: Error,
    },
    byId: { [id: string]: PrivatePass },
    loading: boolean,
    error?: Error,
    createOrUpdate: {
      loading: boolean,
      error?: Error,
    },
  };
  privateConsumerPass: {
    allIds: Array<number>,
    byId: { [id: string]: PrivateConsumerPass },
    loading: boolean,
    error?: Error,
  };
  privateSlot: {
    byId: { [id: string]: PrivateSlot },
    loading: boolean,
    error?: Error,
    createOrUpdate: {
      loading: boolean,
      error?: Error,
    },
  };
  privateService: {
    byId: { [id: string]: PrivateService },
    marketplaceIds: string[]
    allIds: Array<number>,
    loading: boolean,
    error?: Error,
    createOrUpdate: {
      loading: boolean,
      error?: Error,
    },
  };
  privateBooking: {
    byId: { [id: string]: PrivateBooking },
    allIds: Array<number>,
    loading: boolean,
    error?: Error,
    preview: {
      data?: PrivateBookingPreview,
      loading: boolean,
      error?: Error,
    },
  },
  recurrenceRulePrivateBooking: {
    byId: { [id: number]: RecurrenceRulePrivateBooking },
    allIds: Array<number>,
    loading: boolean,
    error?: Error,
    createOrUpdate: {
      loading: boolean,
      error?: Error,
    },
    delete: {
      loading: boolean,
      error?: Error,
    },
  },
};
