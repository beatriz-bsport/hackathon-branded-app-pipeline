import {
  getAuth,
  post,
  postAuth,
  putAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
  API_V1_URI,
  postBaseAuth,
} from '../../http';
import { PrivatePassCategory } from './types';

export const fetchAvailabilitySlots = (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/private_service/availability_slot/${buildUrlParams(params)}`,
  );
};

export const checkExistsAvailabilitySlots = (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/private_service/availability_slot/exists/${buildUrlParams(
      params,
    )}`,
  );
};

/** TODO DEPRECATED */
export const disableResourceAvailabilitySlot = (
  resourceData: any = {},
  obj: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start: string[];
    company?: number;
  },
) => {
  return postAuth(
    `${API_V1_URI}/private_service/availability_slot/remove_availability/`,
    {
      ...resourceData,
      ...obj,
    },
  );
};

export const disableAvailabilitySlotMultipleResource = (
  resources: any = [],
  obj: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start: string[];
  },
) => {
  return postAuth(
    `${API_V1_URI}/private_service/availability_slot/remove_availability_multiple_resource/`,
    {
      resources,
      ...obj,
    },
  );
};

/** TODO DEPRECATED */
export const enableResourceAvailabilitySlot = (
  resourceData: any = {},
  obj: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start: string[];
    company?: number;
  },
) => {
  return postAuth(
    `${API_V1_URI}/private_service/availability_slot/add_availability/`,
    { ...resourceData, ...obj },
  );
};

export const enableAvailabilitySlotMultipleResource = (
  resources: any = [],
  obj: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start: string[];
  },
) => {
  return postAuth(
    `${API_V1_URI}/private_service/availability_slot/add_availability_multiple_resource/`,
    { resources, ...obj },
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

export const fetchPrivateService = (id: number, params?: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_service/${id}/${buildUrlParams(
      params,
    )}`,
  );
};

export const createOrUpdatePrivateService = (data: any, id: number) => {
  if (id !== undefined && id !== null) {
    return patchAuth(
      `${API_V1_URI}/private_service/private_service/${id}/`,
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

export const fetchAllPrivateSlots = (params: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_slot/${buildUrlParams(params)}`,
  );
};

export const fetchServiceGroupList = (params: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_service_group/${buildUrlParams(
      params,
    )}`,
  );
};

export const deleteServiceGroup = (id: number) => {
  return deleteAuth(
    `${API_V1_URI}/private_service/private_service_group/${id}/`,
  );
};

export const createOrUpdateServiceGroup = (data: any) => {
  if (data.id) {
    return patchAuth(
      `${API_V1_URI}/private_service/private_service_group/${data.id}/`,
      data,
    );
  }
  return postAuth(`${API_V1_URI}/private_service/private_service_group/`, data);
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

export const updateServiceResourceConfiguration = (
  privateServiceId: number,
  resource_identifier: string,
  data: { color: string },
) => {
  return putAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/resource/${resource_identifier}/`,
    data,
  );
};

export const updateResourceConfiguration = (
  privateServiceId: number,
  resource_identifier: string,
  data: { color: string },
) => {
  return putAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/resource/${resource_identifier}/`,
    data,
  );
};

export const fetchResourceList = (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/private_service/resource/${buildUrlParams(params)}`,
  );
};

export const switchServiceHasOwnAvailabilitySlots = (
  privateServiceId: number,
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/switch_own_availability/`,
  );
};

export const fetchPrivateServiceResourceData = (privateServiceId: number) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/resource/`,
  );
};

export const fetchCalendarEventList = (params: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/calendar_event/${buildUrlParams(params)}`,
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
  associatedEstablishmentIdList: Array<number>,
) => {
  return post(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_slot/${privateSlotId}/find_slots_by_resource/`,
    {
      coaches: associatedCoachIdList,
      date,
      ...(associatedEstablishmentIdList
        ? { establishments: associatedEstablishmentIdList }
        : {}),
    },
  );
};

export const fetchPrivatePassList = (params?: any = {}) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_pass/${buildUrlParams(params)}`,
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

export const editOrderPrivatePass = (data: any) => {
  return patchAuth(
    `${API_V1_URI}/private_service/private_pass/set_multiple_order/`,
    data,
  );
};

export const deletePrivatePass = (id: number) => {
  return deleteAuth(`${API_V1_URI}/private_service/private_pass/${id}/`);
};

export const restorePrivatePass = (id: number) => {
  return putAuth(`${API_V1_URI}/private_service/private_pass/${id}/restore/`);
};

export async function isPrivatePassUsedInCombo(id: number) {
  return postAuth(
    `${API_V1_URI}/private_service/private_pass/${id}/check_archive_side_effects/`,
  );
}

export const fetchCompatibleServicePassList = (privatePassId: number) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_pass/${privatePassId}/private_service_compatibility_pass/`,
  );
};

export const updateCompatibleServicePass = (
  privatePassId: number,
  privateServiceId: number,
  data: any,
) => {
  return patchAuth(
    `${API_V1_URI}/private_service/private_pass/${privatePassId}/private_service_compatibility_pass/${privateServiceId}/`,
    data,
  );
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
    `${API_V1_URI}/private_service/private_consumer_pass/compatible_with_slot/${
      buildUrlParams(params) || '?'
    }&private_slot=${private_slot}`,
  );
};

export const fetchPrivateConsumerPassList = (params: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/${buildUrlParams({
      ...(params || {}),
    })}`,
  );
};

export const retrievePrivateConsumerPass = (private_consumer_pass: number) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/${private_consumer_pass}/`,
  );
};

export const updatePrivateConsumerPassCredits = (
  id: number,
  credits?: number,
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/${id}/update_credit/`,
    { credits },
  );
};

export async function fetchPrivateConsumerPassExtensionList(
  private_consumer_pass: number,
) {
  return getAuth(
    `${API_V1_URI}/private_service/private_consumer_pass_extension/${buildUrlParams(
      { private_consumer_pass },
    )}`,
  );
}

export async function createPrivateConsumerPassExtension(data: any) {
  return postAuth(
    `${API_V1_URI}/private_service/private_consumer_pass_extension/`,
    data,
  );
}

export async function deletePrivateConsumerPassExtension(id: number) {
  return deleteAuth(
    `${API_V1_URI}/private_service/private_consumer_pass_extension/${id}/`,
  );
}

export const fetchCompatiblePrivatePass = (
  privateSlotId: number,
  params: any,
) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_pass/compatible_with_slot/${
      buildUrlParams(params) || '?'
    }&private_slot=${privateSlotId}`,
  );
};

export const checkUnpaidPrivateBookingEligility = ({
  privateSlotId,
  consumer,
}: {
  privateSlotId: number;
  consumer?: number;
}) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_slot/${privateSlotId}/check_unpaid_booking_eligibility/`,
    {
      consumer,
    },
  );
};

export const fetchPrivateBookings = (params: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_booking/${buildUrlParams(params)}`,
  );
};

export const fetchPrivateBooking = (id: number) => {
  return getAuth(`${API_V1_URI}/private_service/private_booking/${id}/`);
};

export const updatePrivateBookingDatetime = (
  id: number,
  date_start: string,
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_booking/${id}/update_datetime/`,
    {
      date_start,
    },
  );
};

export const updatePrivateBookingCoach = (
  privateBookingId: number,
  updatedCoachId: number,
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_booking/${privateBookingId}/update_coach/`,
    { associated_coach: updatedCoachId },
  );
};

export const registerPrivateBookings = ({
  private_slot,
  private_consumer_pass,
  date_start,
  address,
  coach,
  associated_coach,
  associated_establishment,
  establishment,
  notify_member,
  unpaid,
  consumer,
}: {
  private_slot: number;
  private_consumer_pass: number;
  date_start: string;
  address?: string;
  associated_coach?: number;
  associated_establishment?: number;
  coach: number;
  establishment?: number;
  notify_member: boolean;
  unpaid: boolean;
  consumer: number;
}) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/${private_consumer_pass}/book/`,
    {
      private_slot,
      address,
      date_start,
      coach,
      associated_coach,
      associated_establishment,
      establishment,
      notify_member,
      unpaid,
      consumer,
    },
  );
};

export const disablePrivateBooking = (
  id: number,
  data: { force_refund?: boolean; send_mail?: boolean },
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_booking/${id}/disable/`,
    data,
  );
};

export const deletePrivateBooking = (id: number) => {
  return deleteAuth(`${API_V1_URI}/private_service/private_booking/${id}/`);
};

export const restorePrivateBooking = (id: number) => {
  return putAuth(
    `${API_V1_URI}/private_service/private_booking/${id}/restore/`,
  );
};

export const attachCoach = (
  id: number,
  {
    coach,
    notify,
  }: {
    coach: number;
    notify: boolean;
  },
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_booking/${id}/attach_coach/`,
    { coach, notify },
  );
};

export const fetchCustomEventList = async (params: any = {}) => {
  return getAuth(
    `${API_V1_URI}/private_service/custom_event/${buildUrlParams(params)}`,
  );
};

export const createOrUpdateCustomEvent = async (data: any) => {
  if (!data.id) {
    return postAuth(`${API_V1_URI}/private_service/custom_event/`, data);
  }
  return putAuth(
    `${API_V1_URI}/private_service/custom_event/${data.id}/`,
    data,
  );
};

export const deleteCustomEvent = async (id: number) => {
  return deleteAuth(`${API_V1_URI}/private_service/custom_event/${id}/`);
};

// used for video, soon for everything TODO
export const fetchPrivateConsumerPassCompatibleList = (params: any) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/compatible/`,
    params,
  );
};

export const fetchRecurrenceRulePrivateBookingList = (params: any) => {
  return getAuth(
    `${API_V1_URI}/private_service/recurrence_rule_private_booking/${buildUrlParams(
      params,
    )}`,
  );
};

export const createOrUpdateRecurrenceRulePrivateBooking = async (data: any) => {
  if (!data.id) {
    return postAuth(
      `${API_V1_URI}/private_service/recurrence_rule_private_booking/`,
      data,
    );
  }
  return putAuth(
    `${API_V1_URI}/private_service/recurrence_rule_private_booking/${data.id}/`,
    data,
  );
};

export const deleteRecurrenceRulePrivateBooking = (id: number) => {
  return deleteAuth(
    `${API_V1_URI}/private_service/recurrence_rule_private_booking/${id}/`,
  );
};

export async function fetchPrivatePassMassExtensions(data: any) {
  return getAuth(
    `${API_V1_URI}/private_service/private_pass_mass_extension/?private_pass=${data.privatePass}&page=${data.page}&page_size=${data.page_size}`,
  );
}

export async function createPrivatePassMassExtension(data: any) {
  return postAuth(
    `${API_V1_URI}/private_service/private_pass_mass_extension/`,
    data,
  );
}

export async function deletePrivatePassMassExtension(id: number) {
  return deleteAuth(
    `${API_V1_URI}/private_service/private_pass_mass_extension/${id}`,
  );
}

export async function resourceAllocationChecker(
  privateSlotId: number,
  resource_type: string,
  resource_id: number,
  date: string,
) {
  return postAuth(
    `${API_V1_URI}/private_service/private_slot/${privateSlotId}/get_resource_allocation/`,
    {
      resource_id,
      resource_type,
      date,
    },
  );
}
export async function fetchAllPrivatePassCategory({
  companyId,
}: {
  companyId?: number;
}) {
  return getAuth(
    `${API_V1_URI}/private_service/private_pass_category/${buildUrlParams({
      companyId,
    })}`,
  );
}
export async function updatePrivatePassCategory(
  privatePassCategory: PrivatePassCategory,
) {
  return putAuth(
    `${API_V1_URI}/private_service/private_pass_category/${privatePassCategory.id}/`,
    privatePassCategory,
  );
}

export async function createPrivatePassCategory(
  privatePassCategory: PrivatePassCategory,
) {
  return postBaseAuth(
    `${API_V1_URI}/private_service/private_pass_category/`,
    privatePassCategory,
  );
}
export async function deletePrivatePassCategory(
  privatePassCategory: PrivatePassCategory,
) {
  return deleteAuth(
    `${API_V1_URI}/private_service/private_pass_category/${privatePassCategory.id}/`,
  );
}
export async function editCategoryOrder(data: any) {
  return patchAuth(
    `${API_V1_URI}/private_service/private_pass_category/set_order/`,
    data,
  );
}

export async function fetchPrivatePassTemplateList(params: any = {}) {
  return getAuth(
    `${API_V1_URI}/private_service/private-pass-template/${buildUrlParams(
      params,
    )}`,
  );
}

export async function retrievePrivatePassTemplate(id: number) {
  return getAuth(`${API_V1_URI}/private_service/private-pass-template/${id}/`);
}

export async function createOrUpdatePrivatePassTemplate(data: any) {
  if (!data.id) {
    return postAuth(
      `${API_V1_URI}/private_service/private-pass-template/`,
      data,
    );
  }
  return putAuth(
    `${API_V1_URI}/private_service/private-pass-template/${data.id}/`,
    data,
  );
}

export async function createPrivatePassTemplateInstance(data: any) {
  return postAuth(
    `${API_V1_URI}/private_service/private-pass-template-instance/multi_create/`,
    data,
  );
}

export async function deletePrivatePassTemplateInstance(id: number) {
  return deleteAuth(
    `${API_V1_URI}/private_service/private-pass-template-instance/${id}/`,
  );
}

export async function deletePrivatePassTemplate(id: number) {
  return deleteAuth(
    `${API_V1_URI}/private_service/private-pass-template/${id}/`,
  );
}
