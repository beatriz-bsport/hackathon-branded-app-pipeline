import { queryOptions } from "@tanstack/react-query";

import { type ApiConfig, type Fetch, buildUrlParams } from "@bsport/store-base";

import {
  API_V1_URL,
  BOOKING_QUERY_KEY,
  DEFAULT_STALE_TIME,
} from "#src/constants";

import type {
  Appointment,
  AppointmentSlot,
  FetchAppointmentSlotsParams,
  FetchAppointmentsParams,
} from "./types";

// ----------------------------------------------------------------------------

const APPOINTMENT_URL = `${API_V1_URL}/private_service/private_service`;
const APPOINTMENT_SLOT_URL = `${API_V1_URL}/private_service/private_slot`;

export const appointmentKeys = {
  all: [BOOKING_QUERY_KEY, "appointments"] as const,

  lists: () => [...appointmentKeys.all, "list"] as const,
  list: (params: FetchAppointmentsParams = {}) =>
    [...appointmentKeys.lists(), params] as const,

  slotLists: () => [...appointmentKeys.all, "slot-list"] as const,
  slotList: (params: FetchAppointmentSlotsParams) =>
    [...appointmentKeys.slotLists(), params] as const,
} as const;

// ----------------------------------------------------------------------------

/**
 * Fetches the list of appointments. The endpoint is not paginated and returns
 * a flat array.
 */
const fetchAppointmentsAPIConfig = (
  params: FetchAppointmentsParams,
): ApiConfig => [`${APPOINTMENT_URL}/${buildUrlParams(params)}`];

export const fetchAppointmentsAPI = async (
  fetch: Fetch<Appointment[]>,
  params: FetchAppointmentsParams = {},
): Promise<Appointment[]> => {
  const [uri, init] = fetchAppointmentsAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const fetchAppointmentsQueryOptions = (
  fetch: Fetch<Appointment[]>,
  params: FetchAppointmentsParams = {},
) =>
  queryOptions({
    queryKey: appointmentKeys.list(params),
    queryFn: () => fetchAppointmentsAPI(fetch, params),
    staleTime: DEFAULT_STALE_TIME,
  });

// ----------------------------------------------------------------------------

/**
 * Fetches the slots of a single appointment. The endpoint is not paginated and
 * returns a flat array.
 */
const fetchAppointmentSlotsAPIConfig = (
  params: FetchAppointmentSlotsParams,
): ApiConfig => [`${APPOINTMENT_SLOT_URL}/${buildUrlParams(params)}`];

export const fetchAppointmentSlotsAPI = async (
  fetch: Fetch<AppointmentSlot[]>,
  params: FetchAppointmentSlotsParams,
): Promise<AppointmentSlot[]> => {
  const [uri, init] = fetchAppointmentSlotsAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const fetchAppointmentSlotsQueryOptions = (
  fetch: Fetch<AppointmentSlot[]>,
  params: FetchAppointmentSlotsParams,
) =>
  queryOptions({
    queryKey: appointmentKeys.slotList(params),
    queryFn: () => fetchAppointmentSlotsAPI(fetch, params),
    staleTime: DEFAULT_STALE_TIME,
  });
