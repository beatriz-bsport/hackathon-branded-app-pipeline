// @flow

import {
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
  API_V1_URI,
} from '../../http';

export const fetchAvailabilitySlots = (params: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/availability_slot/${buildUrlParams(params)}`,
  );
};

export const disableCoachAvailabilitySlot = (
  coach: number,
  { date_start, date_end, recurrence_until, all_date_start },
) => {
  return postAuth(
    `${API_V1_URI}/private_service/availability_slot/remove_availability/`,
    {
      coach,
      date_start,
      date_end,
      recurrence_until,
      all_date_start,
    },
  );
};
export const enableCoachAvailabilitySlot = (
  coach: number,
  { date_start, date_end, recurrence_until, all_date_start },
) => {
  return postAuth(
    `${API_V1_URI}/private_service/availability_slot/add_availability/`,
    { coach, date_start, date_end, recurrence_until, all_date_start },
  );
};

export const fetchAllPrivateServices = (params: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_service/${buildUrlParams(params)}`,
  );
};

export const deletePrivateService = (id: number) => {
  return deleteAuth(`${API_V1_URI}/private_service/private_service/${id}/`);
};

export const fetchPrivateService = (id: number, params: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_service/${id}/${buildUrlParams(
      params,
    )}`,
  );
};

export const createOrUpdatePrivateService = (data: any) => {
  if (data.id) {
    return patchAuth(
      `${API_V1_URI}/private_service/private_service/${data.id}/`,
      data,
    );
  }
  return postAuth(`${API_V1_URI}/private_service/private_service/`, data);
};

export const createOrUpdatePrivateServiceSlot = (id: number, data: any) => {
  if (id) {
    return patchAuth(
      `${API_V1_URI}/private_service/private_service_slot/${id}/`,
      data,
    );
  }
  return postAuth(`${API_V1_URI}/private_service/private_service_slot/`, data);
};

export const createPrivateCoach = (
  associatedCoachId: number,
  privateServiceId: number,
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_coach/`,
    {
      associated_coach: associatedCoachId,
      private_service: privateServiceId,
    },
  );
};

export const deletePrivateCoach = (
  associatedCoachId: number,
  privateServiceId: number,
) => {
  return deleteAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_coach/${associatedCoachId}/`,
  );
};

export const createPrivateEstablishment = (
  establishmentId: number,
  privateServiceId: number,
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_establishment/`,
    {
      associated_establishment: establishmentId,
      private_service: privateServiceId,
    },
  );
};

export const deletePrivateEstablishment = (
  establishmentId: number,
  privateServiceId: number,
) => {
  return deleteAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_establishment/${establishmentId}/`,
  );
};

export const fetchPrivateSlotList = (privateServiceId: number) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_slot/`,
  );
};

export const fetchAllPrivateSlots = () => {
  return getAuth(`${API_V1_URI}/private_service/private_slot/`);
};

export const fetchPrivateSlotRetrieve = (
  privateServiceId: number,
  privateSlotId: number,
) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_slot/${privateSlotId}/`,
  );
};

export const deletePrivateSlot = (privateServiceId: number, slotId: number) => {
  return deleteAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_slot/${slotId}/`,
  );
};

export const createOrUpdatePrivateSlot = (
  privateServiceId: number,
  data: any,
  slotId?: number,
) => {
  if (slotId) {
    return patchAuth(
      `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_slot/${slotId}/`,
      data,
    );
  }
  return postAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_slot/`,
    data,
  );
};

export const searchAvailableSlots = (
  privateServiceId: number,
  privateSlotId: number,
  associatedCoachIdList: Array<number>,
  date: string,
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_slot/${privateSlotId}/search_slots/`,
    {
      coaches: associatedCoachIdList,
      date,
    },
  );
};

export const fetchPrivatePassList = (companyId?: number) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_pass/${
      companyId ? `?company=${companyId}` : ''
    }`,
  );
};

export const fetchPrivatePass = (id: number) => {
  return getAuth(`${API_V1_URI}/private_service/private_pass/${id}/`);
};

export const createOrUpdatePrivatePass = (data: any, id?: number) => {
  if (id) {
    return patchAuth(`${API_V1_URI}/private_service/private_pass/${id}/`, data);
  }
  return postAuth(`${API_V1_URI}/private_service/private_pass/`, data);
};

export const deletePrivatePass = (id: number) => {
  return deleteAuth(`${API_V1_URI}/private_service/private_pass/${id}/`);
};

export const deleteCompatibleServicePass = (
  privatePassId: number,
  privateServiceId: number,
) => {
  return deleteAuth(
    `${API_V1_URI}/private_service/private_pass/${privatePassId}/private_service_compatibility_pass/${privateServiceId}/`,
  );
};

export const createCompatibleServicePass = (
  privatePassId: number,
  privateServiceId: number,
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_pass/${privatePassId}/private_service_compatibility_pass/`,
    {
      private_service: privateServiceId,
      private_pass: privatePassId,
    },
  );
};

export const fetchCompatiblePrivateConsumerPass = (
  private_slot: number,
  params: any,
) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/compatible_with_slot/${buildUrlParams(
      params,
    ) || '?'}&private_slot=${private_slot}`,
  );
};

export const fetchPrivateConsumerPassList = (params: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/${buildUrlParams(
      params,
    )}`,
  );
};

export const retrievePrivateConsumerPass = (private_consumer_pass: number) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/${private_consumer_pass}/`,
  );
};

export const fetchCompatiblePrivatePass = (
  privateSlotId: number,
  params: any,
) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_pass/compatible_with_slot/${buildUrlParams(
      params,
    ) || '?'}&private_slot=${privateSlotId}`,
  );
};

export const fetchPrivateBookingPreview = (
  private_slot: number,
  coach: number,
  date: string,
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_booking/preview_booking/`,
    { private_slot, coach, date },
  );
};

export const fetchPrivateBookings = (params: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_booking/${buildUrlParams(params)}`,
  );
};

export const registerPrivateBookings = ({
  private_slot,
  private_consumer_pass,
  date_start,
  address,
  coach,
}: {
  private_slot: number,
  private_consumer_pass: number,
  date_start: string,
  address: ?string,
  coach: number,
}) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/${private_consumer_pass}/book/`,
    {
      private_slot,
      address,
      date_start,
      coach,
    },
  );
};

export const disablePrivateBooking = (
  id: number,
  data: { force_refund: boolean },
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_booking/${id}/disable/`,
    data,
  );
};

export const deletePrivateBooking = (id: number) => {
  return deleteAuth(`${API_V1_URI}/private_service/private_booking/${id}/`);
};
