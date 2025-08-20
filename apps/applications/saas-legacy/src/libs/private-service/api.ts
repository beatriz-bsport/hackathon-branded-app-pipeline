import type { FranchiseProductTemplateQueryParams } from '#src/libs/franchise/types';
import type { CancelPrivateBookingParams } from '#src/libs/booking/types';
import {
  getAuth,
  post,
  postAuth,
  putAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
  postBaseAuth,
} from '#src/http';
import type {
  PrivateBooking,
  PrivatePassCategory,
  PrivateBookingFilterParams,
  PrivateConsumerPassREST,
  ServiceCompatibilityPass,
  PrivatePassMassExtensionParams,
  PrivatePassMassExtensionCreate,
  PrivatePassMassExtension,
  PrivateConsumerPassExtensionParams,
  PrivateConsumerPassExtension,
  PrivateConsumerPassExtensionCreate,
  PrivatePassTemplateAPI,
  ResourceSlotsByDate,
} from './types';
import type { PaginatedResponse } from '#src/state/types';
import type { AssociatedEstablishment } from '#src/libs/establishment/types';
import Config from '#src/config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;

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
    restriction_on_associated_establishments?: Array<number>;
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
    restriction_on_associated_establishments: number[];
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
  dates: string[],
  associatedEstablishmentIdList: Array<number>,
) => {
  return post<ResourceSlotsByDate>(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_slot/${privateSlotId}/find_slots_by_resource_batched/`,
    {
      coaches: associatedCoachIdList,
      dates,
      ...(associatedEstablishmentIdList
        ? { establishments: associatedEstablishmentIdList }
        : {}),
    },
    {},
    undefined,
    { bypassLock: true },
  );
};
export const searchFirstvailableSlots = (
  privateServiceId: number,
  privateSlotId: number,
  associatedCoachIdList: Array<number>,
  associatedEstablishmentIdList: Array<number>,
  cancelToken?: any,
) => {
  return post(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/private_slot/${privateSlotId}/find_nearest_available_datetime/`,
    {
      coaches: associatedCoachIdList,
      ...(associatedEstablishmentIdList
        ? { establishments: associatedEstablishmentIdList }
        : {}),
    },
    {},
    cancelToken,
  );
};

export const fetchPrivatePassList = (params: any = {}) => {
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

export const fetchPrivateServiceCompatiblePassList = (params: {
  private_service__in: number[];
}) => {
  return getAuth<ServiceCompatibilityPass[]>(
    `${API_V1_URI}/private_service/private_service_compatibility_pass/${buildUrlParams(
      params,
    )}`,
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

export const fetchNonCompatiblePrivateConsumerPass = (
  private_slot: number,
  params: any,
) => {
  return getAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/noncompatible_with_slot/${buildUrlParams(
      { ...params, private_slot },
    )}`,
  );
};

export async function fetchIncompatibilitiesReasonsBySlotByConsumerPass(
  id: number,
  private_slot: number,
  date: string,
) {
  return getAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/${id}/incompatibility_error_code_list/${buildUrlParams(
      { private_slot, date },
    )}`,
  );
}

export const fetchPrivateConsumerPassList = (params: any) => {
  return getAuth<PaginatedResponse<PrivateConsumerPassREST>>(
    `${API_V1_URI}/private_service/private_consumer_pass/${buildUrlParams({
      ...(params || {}),
    })}`,
  );
};

export const forceRegularizeUnpaid = (
  member: number,
  private_consumer_pass?: number,
) => {
  return postAuth(
    `${API_V1_URI}/private_service/private_consumer_pass/regularize_unpaid/`,
    { member, private_consumer_pass },
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

/**
 * Fetch the list of extensions for a specific private consumer pass
 * @param params Object containing the required `private_consumer_pass` ID + optional pagination params
 */
export const fetchPrivateConsumerPassExtensionList = (
  params: PrivateConsumerPassExtensionParams,
) => {
  return getAuth<PaginatedResponse<PrivateConsumerPassExtension>>(
    `${API_V1_URI}/private_service/private_consumer_pass_extension/${buildUrlParams(
      params,
    )}`,
  );
};

/**
 * Create an extension for a private consumer pass
 * @param data The payload sent for the creation of the extension
 */
export const createPrivateConsumerPassExtension = (
  data: PrivateConsumerPassExtensionCreate,
) => {
  return postAuth<PrivateConsumerPassExtension>(
    `${API_V1_URI}/private_service/private_consumer_pass_extension/`,
    data,
  );
};

/**
 * Delete a private consumer pass extension
 * @param id The ID of the extension to delete
 */
export const deletePrivateConsumerPassExtension = (id: number) => {
  return deleteAuth(
    `${API_V1_URI}/private_service/private_consumer_pass_extension/${id}/`,
  );
};

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
  return getAuth<PaginatedResponse<PrivateBooking>>(
    `${API_V1_URI}/private_service/private_booking/${buildUrlParams(params)}`,
  );
};

export const fetchPrivateBookingsV2 = (params: PrivateBookingFilterParams) => {
  return getAuth<PaginatedResponse<PrivateBooking>>(
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
  member,
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
  member?: number;
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
      member,
    },
  );
};

export const disablePrivateBooking = (
  id: number,
  data: Omit<CancelPrivateBookingParams, 'privateBookingId'>,
) => {
  return postAuth<PrivateBooking>(
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

export const deleteRecurrenceRulePrivateBooking = (id: number, data: any) => {
  return deleteAuth(
    `${API_V1_URI}/private_service/recurrence_rule_private_booking/${id}/`,
    data,
  );
};

/**
 * Fetch the list of mass extensions for a specific private pass
 * @param params Object containing the required `private_pass` ID + optional pagination params
 */
export const fetchPrivatePassMassExtensionList = (
  params: PrivatePassMassExtensionParams,
) => {
  return getAuth<PaginatedResponse<PrivatePassMassExtension>>(
    `${API_V1_URI}/private_service/private_pass_mass_extension/${buildUrlParams(
      params,
    )}`,
  );
};

/**
 * Create an extension for a private pass
 * @param data The payload sent for the creation of the extension
 */
export const createPrivatePassMassExtension = (
  data: PrivatePassMassExtensionCreate,
) => {
  return postAuth<PrivatePassMassExtension>(
    `${API_V1_URI}/private_service/private_pass_mass_extension/`,
    data,
  );
};

/**
 * Delete a private pass extension
 * @param id The ID of the extension to delete
 */
export const deletePrivatePassMassExtension = (id: number) => {
  return deleteAuth(
    `${API_V1_URI}/private_service/private_pass_mass_extension/${id}`,
  );
};

export async function resourceAllocationChecker(
  privateSlotId: number,
  resource_type: string,
  resource_id: number,
  date: string,
  restrict_on_establishment?: number | null,
) {
  return postAuth(
    `${API_V1_URI}/private_service/private_slot/${privateSlotId}/get_resource_allocation/`,
    {
      resource_id,
      resource_type,
      date,
      ...(restrict_on_establishment ? { restrict_on_establishment } : {}),
    },
  );
}

export async function findAvailableEstablishment(
  privateSlotId: number,
  data: {
    date_start: string;
    associated_establishment?: number;
    associated_coach?: number;
  },
) {
  return postAuth<AssociatedEstablishment>(
    `${API_V1_URI}/private_service/private_slot/find_available_establishment/`,
    { private_slot: privateSlotId, ...data },
  );
}

export async function fetchAllPrivatePassCategory({
  companyId,
}: {
  companyId?: number;
}) {
  if (companyId) {
    return getAuth(
      `${API_V1_URI}/private_service/private_pass_category/${buildUrlParams({
        companyId,
      })}`,
    );
  }
  return getAuth(`${API_V1_URI}/private_service/private_pass_category/`);
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

export async function fetchPrivatePassTemplateList(
  params?: FranchiseProductTemplateQueryParams,
) {
  return getAuth(
    `${API_V1_URI}/private_service/private-pass-template/${buildUrlParams(
      params,
    )}`,
  );
}

export async function fetchPrivatePassTemplateBulk(params?: {
  id__in: number[];
}) {
  return getAuth<PrivatePassTemplateAPI[]>(
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

export async function restorePrivatePassTemplate(templateId: number) {
  return postAuth<PrivatePassTemplateAPI>(
    `${API_V1_URI}/private_service/private-pass-template/${templateId}/restore/`,
  );
}

export async function updatePrivateBooking(
  id: number,
  data: Partial<PrivateBooking>,
) {
  return patchAuth<PrivateBooking>(
    `${API_V1_URI}/private_service/private_booking/${id}/`,
    data,
  );
}

export function checkPrivateServiceTagEligibility(
  privateServiceId: number,
  memberId?: number,
) {
  return postAuth<{ eligible: boolean }, { member_id: number }>(
    `${API_V1_URI}/private_service/private_service/${privateServiceId}/check_tags_eligibility/`,
    memberId ? { member_id: memberId } : undefined,
  );
}

export function setPrivateBookingUnpaid(privateBookingId: number) {
  return postAuth<PrivateBooking>(
    `${API_V1_URI}/private_service/private_booking/${privateBookingId}/set_unpaid/`,
  );
}
