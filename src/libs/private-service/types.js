// @flow

export type AvailabilitySlot = {
  associated_coach: number,
  coach: number,
  associated_coach: number,
  date_start: string,
  date_end: string,
};

export type PrivateService = {
  id: number,
  name: string,
  description: string,
  coaches: Array<number>,
  available: boolean,
  establishments: Array<number>,
  slots: Array<number>,
};

export type PrivateSlot = {
  id: number,
  name: string,
  private_service: number,
  cedit: number,
  duration_minutes: number,
};

export type PrivateCoach = {
  id: number,
  private_service: number,
  associated_coach: number,
};

export type PrivateEstablishment = {
  id: number,
  private_service: number,
  associated_establishment: number,
};

export type PrivatePass = {
  id: number,
  name: string,
  credits: number,
  price: number,
  tax: number,
  private_services: Array<number>,
  manager_only: boolean,
};

export type PrivateConsumerPass = {
  id: number,
  used_credits: number,
  consumer: number,
  private_pass: PrivatePass,
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

export type PrivateServiceState = {
  availabilitySlot: {
    items: Array<AvailabilitySlot>,
    loading: boolean,
    error: ?Error,
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
    searched: {
      items: Array<string>,
      loading: boolean,
      error: ?Error,
    },
  },
  privatePass: {
    allIds: Array<number>,
    asConsumer: {
      allIds: Array<number>,
      loading: boolean,
      error: ?Error,
    },
    byId: { [id: number]: PrivatePass },
    loading: boolean,
    error: ?Error,
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
  },
  privateConsumerPass: {
    allIds: Array<number>,
    byId: { [id: number]: PrivateConsumerPass },
    loading: boolean,
    error: ?Error,
  },
  privateSlot: {
    byId: { [id: number]: PrivateSlot },
    loading: boolean,
    error: ?Error,
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
  },
  privateService: {
    byId: { [id: number]: PrivateService },
    allIds: Array<number>,
    loading: boolean,
    error: ?Error,
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
  },
  privateBooking: {
    byId: { [id: number]: PrivateBooking },
    allIds: Array<number>,
    loading: boolean,
    error: ?Error,
    preview: {
      data: ?PrivateBookingPreview,
      loading: boolean,
      error: ?Error,
    },
  },
};
