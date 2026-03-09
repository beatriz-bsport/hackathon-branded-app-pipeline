import { createAction } from 'redux-actions';
import { PRIVATE_BOOKING_INCOMPLETE_ALERT } from '@bsport/common/lib/master-data/alerting_kind.js';
import { PRIVATE_SERVICE_NOT_COMPATIBLE_WITH_PARTNERSHIP } from '@bsport/common/lib/master-data/error-codes/private-service.js';
import { PRIVATE_SLOT_NOT_COMPATIBLE_WITH_PARTNERSHIP } from '@bsport/common/lib/master-data/error-codes/private-slot.js';
import {
  CONSUMER_PRIVATE_PASS_CAN_NOT_BOOK_COACH_UNAVAILABLE,
  CONSUMER_PRIVATE_PASS_CAN_NOT_BOOK_ESTABLISHMENT_UNAVAILABLE,
} from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';

import { DateTime } from 'luxon';
import uniq from 'lodash/uniq';
import axios from 'axios';
import type {
  PrivateBookingFilterParams,
  PrivateConsumerPassExtension,
  PrivateConsumerPassExtensionCreate,
  PrivateConsumerPassExtensionParams,
  PrivateConsumerPassREST,
  PrivatePassMassExtensionCreate,
  PrivatePassMassExtensionParams,
  PrivatePassTemplate,
  ResourceSlotsByDate,
} from '#src/libs/private-service/types';
import type { FranchiseProductTemplateQueryParams } from '#src/libs/franchise/types';
// @ts-expect-error
import type { CancelPrivateBookingFilterParams } from '#src/libs/booking/types';
import {
  EXCEPTION_STAFF_ROLE_OVERRIDE_ESTABLISHMENT_NOT_ALLOWED,
  EXCEPTION_STAFF_ROLE_OVERRIDE_COACH_NOT_ALLOWED,
  EXCEPTION_STAFF_ROLE_CAN_NOT_CHANGE_DATE_BECAUSE_NO_COACH_OVERRIDE,
  EXCEPTION_STAFF_ROLE_CAN_NOT_CHANGE_DATE_BECAUSE_NO_ESTABLISHMENT_OVERRIDE,
} from '#src/libs/role/constants';
import { isErrorWithCustomCode } from '#src/libs/utils';
import { refreshAlertingByKind } from '../alerting/actions';

import type { RootState } from '#src/reducers';
import {
  snackbarSuccess,
  snackbarError,
  snackbarWarning,
} from '../snackbar/actions';
import {
  // availability-slot
  fetchAvailabilitySlots as fetchAvailabilitySlotsAPI,
  checkExistsAvailabilitySlots as checkExistsAvailabilitySlotsAPI,
  fetchPrivateBookings as fetchPrivateBookingsAPI,
  fetchPrivateBooking as fetchPrivateBookingAPI,
  disableResourceAvailabilitySlot as disableResourceAvailabilitySlotAPI,
  disableAvailabilitySlotMultipleResource as disableAvailabilitySlotMultipleResourceAPI,
  enableResourceAvailabilitySlot as enableResourceAvailabilitySlotAPI,
  enableAvailabilitySlotMultipleResource as enableAvailabilitySlotMultipleResourceAPI,
  searchAvailableSlots as searchAvailableSlotsAPI,
  searchFirstvailableSlots as searchFirstvailableSlotsAPI,
  // private-service
  fetchAllPrivateServices as fetchAllPrivateServicesAPI,
  fetchPrivateService as fetchPrivateServiceAPI,
  switchServiceHasOwnAvailabilitySlots as switchServiceHasOwnAvailabilitySlotsAPI,
  createOrUpdatePrivateService as createOrUpdatePrivateServiceAPI,
  deleteServiceGroup as deleteServiceGroupAPI,
  deletePrivateService as deletePrivateServiceAPI,

  // resources
  fetchPrivateServiceResourceData as fetchPrivateServiceResourceDataAPI,
  fetchResourceList as fetchResourceListAPI,
  updateServiceResourceConfiguration as updateServiceResourceConfigurationAPI,
  // private-coach
  // service-group
  fetchServiceGroupList as fetchServiceGroupListAPI,
  createOrUpdateServiceGroup as createOrUpdateServiceGroupAPI,
  // private-slot
  fetchAllPrivateSlots as fetchAllPrivateSlotsAPI,
  fetchPrivateSlotRetrieve as fetchPrivateSlotRetrieveAPI,
  createOrUpdatePrivateSlot as createOrUpdatePrivateSlotAPI,
  deletePrivateSlot as deletePrivateSlotAPI,
  checkUnpaidPrivateBookingEligility as checkUnpaidPrivateBookingEligilityAPI,
  // private-pass
  fetchPrivatePassList as fetchPrivatePassListAPI,
  fetchPrivatePass as fetchPrivatePassRetrieveAPI,
  createOrUpdatePrivatePass as createOrUpdatePrivatePassAPI,
  deletePrivatePass as deletePrivatePassAPI,
  restorePrivatePass as restorePrivatePassAPI,
  createCompatibleServicePass as createCompatibleServicePassAPI,
  deleteCompatibleServicePass as deleteCompatibleServicePassAPI,
  updateCompatibleServicePass as updateCompatibleServicePassAPI,
  fetchCompatibleServicePassList as fetchCompatibleServicePassListAPI,
  fetchPrivateServiceCompatiblePassList as fetchPrivateServiceCompatiblePassListAPI,
  editOrderPrivatePass as editOrderPrivatePassAPI,
  isPrivatePassUsedInCombo as isPrivatePassUsedInComboAPI,
  // private-consumer-pass
  fetchCompatiblePrivateConsumerPass as fetchCompatiblePrivateConsumerPassAPI,
  fetchNonCompatiblePrivateConsumerPass as fetchNonCompatiblePrivateConsumerPassAPI,
  fetchIncompatibilitiesReasonsBySlotByConsumerPass as fetchIncompatibilitiesReasonsBySlotByConsumerPassAPI,
  fetchCompatiblePrivatePass as fetchCompatiblePrivatePassAPI,
  retrievePrivateConsumerPass as retrievePrivateConsumerPassAPI,
  updatePrivateConsumerPassCredits as updatePrivateConsumerPassCreditsAPI,
  fetchPrivateConsumerPassList as fetchPrivateConsumerPassListAPI,
  fetchPrivateConsumerPassCompatibleList as fetchPrivateConsumerPassCompatibleListAPI,
  forceRegularizeUnpaid as forceRegularizeUnpaidAPI,
  // private-booking
  registerPrivateBookings as registerPrivateBookingsAPI,
  disablePrivateBooking as disablePrivateBookingAPI,
  deletePrivateBooking as deletePrivateBookingAPI,
  restorePrivateBooking as restorePrivateBookingAPI,
  setPrivateBookingUnpaid as setPrivateBookingUnpaidAPI,
  fetchCalendarEventList as fetchCalendarEventListAPI,
  updatePrivateBookingDatetime as updatePrivateBookingDatetimeAPI,
  updatePrivateBookingCoach as updatePrivateBookingCoachAPI,
  attachCoach as attachCoachAPI,
  // recurrence-rule-private-booking
  fetchRecurrenceRulePrivateBookingList as fetchRecurrenceRulePrivateBookingListAPI,
  createOrUpdateRecurrenceRulePrivateBooking as createOrUpdateRecurrenceRulePrivateBookingAPI,
  deleteRecurrenceRulePrivateBooking as deleteRecurrenceRulePrivateBookingAPI,

  // extension
  fetchPrivateConsumerPassExtensionList as fetchPrivateConsumerPassExtensionListAPI,
  createPrivateConsumerPassExtension as createPrivateConsumerPassExtensionAPI,
  deletePrivateConsumerPassExtension as deletePrivateConsumerPassExtensionAPI,

  // custom event
  fetchCustomEventList as fetchCustomEventListAPI,
  createOrUpdateCustomEvent as createOrUpdateCustomEventAPI,
  deleteCustomEvent as deleteCustomEventAPI,
  fetchPrivatePassMassExtensionList as fetchPrivatePassMassExtensionListAPI,
  createPrivatePassMassExtension as createPrivatePassMassExtensionAPI,
  deletePrivatePassMassExtension as deletePrivatePassMassExtensionAPI,

  // category
  fetchAllPrivatePassCategory as fetchAllPrivatePassCategoryAPI,
  createPrivatePassCategory as createPrivatePassCategoryAPI,
  deletePrivatePassCategory as deletePrivatePassCategoryAPI,
  updatePrivatePassCategory as updatePrivatePassCategoryAPI,
  editCategoryOrder,

  // template
  fetchPrivatePassTemplateList as fetchPrivatePassTemplateListAPI,
  fetchPrivatePassTemplateBulk as fetchPrivatePassTemplateBulkAPI,
  retrievePrivatePassTemplate as retrievePrivatePassTemplateAPI,
  createOrUpdatePrivatePassTemplate as createOrUpdatePrivatePassTemplateAPI,
  deletePrivatePassTemplate as deletePrivatePassTemplateAPI,
  restorePrivatePassTemplate as restorePrivatePassTemplateAPI,
  createPrivatePassTemplateInstance as createPrivatePassTemplateInstanceAPI,
  deletePrivatePassTemplateInstance as deletePrivatePassTemplateInstanceAPI,
  updatePrivateBooking as updatePrivateBookingAPI,
  checkPrivateServiceTagEligibility as checkPrivateServiceTagEligibilityAPI,
} from './api';

import { monitorBackgroundTask } from '../background-task/actions';

import {
  Dispatch,
  ThunkAction,
  OptionCallback,
  PaginatedResponse,
  OptionBackgroundCallback,
} from '../../state/types';

import {
  PrivateBooking,
  PrivatePassMassExtension,
  PrivatePassCategory,
  PrivatePassCategoryWithPasses,
  PrivateService,
  PrivateSlot,
  PrivatePass,
  ServiceCompatibilityPass,
  ResourceDataTypeForAllocation,
  PrivatePassTemplateAPI,
} from './types';

import {
  PRIVATE_CONSUMER_PASS_EXTENSION_PAGE_SIZE,
  PRIVATE_PASS_MASS_EXTENSION_PAGE_SIZE,
} from './constants';

export const privateBookingAttachCoachActions = {
  error: createAction('PRIVATE_BOOKING/ATTACH_COACH/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/ATTACH_COACH/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/ATTACH_COACH/SUCCESS'),
};

export const listTaskByMemberActions = {
  error: createAction('REMINDER/TASK_BY_MEMBER/ERROR'),
  isLoading: createAction('REMINDER/TASK_BY_MEMBER/LOADING'),
  success: createAction('REMINDER/TASK_BY_MEMBER/SUCCESS'),
};

export const refreshIncompletePrivateBookingAlerting = () =>
  refreshAlertingByKind(PRIVATE_BOOKING_INCOMPLETE_ALERT.alert_kind);

export function attachCoachToPrivateBooking(
  id: number,
  data: {
    notify: boolean;
    coach: number;
  },
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingAttachCoachActions.isLoading(true));
    dispatch(privateBookingAttachCoachActions.error(null));
    try {
      const response = await attachCoachAPI(id, data);

      dispatch(privateBookingAttachCoachActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
        dispatch(refreshIncompletePrivateBookingAlerting());
      }
      dispatch(snackbarSuccess('privateBooking.attachCoach.success'));
    } catch (err) {
      console.error(err);
      dispatch(privateBookingAttachCoachActions.error(null));
      if (options && options.onError) options.onError();
      dispatch(snackbarError('privateBooking.attachCoach.error'));
    }
    dispatch(privateBookingAttachCoachActions.isLoading(false));
  };
}

export const calendarEventListActions = {
  error: createAction('CALENDAR_EVENT/LIST/ERROR'),
  isLoading: createAction('CALENDAR_EVENT/LIST/IS_LOADING'),
  success: createAction('CALENDAR_EVENT/LIST/SUCCESS'),
  reset: createAction('CALENDAR_EVENT/LIST/RESET'),
};

export function fetchCalendarEventList(params: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(calendarEventListActions.isLoading(true));
    dispatch(calendarEventListActions.error(null));
    try {
      const response = await fetchCalendarEventListAPI(params);
      dispatch(calendarEventListActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(calendarEventListActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(calendarEventListActions.isLoading(false));
  };
}

export const availabilitySlotExistsActions = {
  error: createAction('AVAILABILITY_SLOT/EXISTS/ERROR'),
  isLoading: createAction('AVAILABILITY_SLOT/EXISTS/IS_LOADING'),
  success: createAction('AVAILABILITY_SLOT/EXISTS/SUCCESS'),
};

export function checkExistsAvailabilitySlots(
  resourceDatatype: string,
  resourceIdentifier: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(
      availabilitySlotExistsActions.isLoading({
        resourceDatatype,
        resourceIdentifier,
        loading: true,
      }),
    );
    dispatch(
      availabilitySlotExistsActions.error({
        resourceDatatype,
        resourceIdentifier,
        error: null,
      }),
    );
    try {
      const response = await checkExistsAvailabilitySlotsAPI({
        is_restriction: false,
        date_start__gte: DateTime.now().toISODate(),
        [resourceDatatype]: resourceIdentifier,
      });
      dispatch(
        availabilitySlotExistsActions.success({
          resourceDatatype,
          resourceIdentifier,
          // @ts-expect-error
          ...response.data,
        }),
      );
    } catch (err) {
      console.error(err);
      dispatch(
        availabilitySlotExistsActions.error({
          resourceDatatype,
          resourceIdentifier,
          error: err,
        }),
      );
    }
    dispatch(
      availabilitySlotExistsActions.isLoading({
        resourceDatatype,
        resourceIdentifier,
        loading: false,
      }),
    );
  };
}

export const updateResourceConfigurationActions = {
  error: createAction('RESOURCE/UPDATE/ERROR'),
  isLoading: createAction('RESOURCE/UPDATE/IS_LOADING'),
  success: createAction('RESOURCE/UPDATE/SUCCESS'),
};

export function updateServiceResourceConfiguration(
  privateServiceId: number,
  resourceIdentifier: string,
  data: any,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateResourceConfigurationActions.isLoading(true));
    dispatch(updateResourceConfigurationActions.error(null));
    try {
      const response = await updateServiceResourceConfigurationAPI(
        privateServiceId,
        resourceIdentifier,
        data,
      );
      dispatch(updateResourceConfigurationActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateResourceConfigurationActions.error(null));
      if (options && options.onError) options.onError(err);
    }
    dispatch(updateResourceConfigurationActions.isLoading(false));
  };
}

export const availabilitySlotListActions = {
  error: createAction('AVAILABILITY_SLOT/LIST/ERROR'),
  isLoading: createAction('AVAILABILITY_SLOT/LIST/IS_LOADING'),
  success: createAction('AVAILABILITY_SLOT/LIST/SUCCESS'),
  reset: createAction('AVAILABILITY_SLOT/RESET/DONE'),
};

export const resetAvailabilitySlots = availabilitySlotListActions.reset;

export function fetchAvailabilitySlots(params: any = {}): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availabilitySlotListActions.isLoading(true));
    dispatch(availabilitySlotListActions.error(null));
    try {
      const response = await fetchAvailabilitySlotsAPI({
        is_restriction: false,
        ...params,
      });
      dispatch(availabilitySlotListActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(availabilitySlotListActions.error(null));
    }
    dispatch(availabilitySlotListActions.isLoading(false));
  };
}

export const availabilitySlotUpdateActions = {
  error: createAction('AVAILABILITY_SLOT/UPDATE/ERROR'),
  isLoading: createAction('AVAILABILITY_SLOT/UPDATE/IS_LOADING'),
  success: createAction('AVAILABILITY_SLOT/UPDATE/SUCCESS'),
};

export function enableResourceAvailabilitySlot(
  resourceData: ResourceDataTypeForAllocation,
  {
    date_start,
    date_end,
    recurrence_until,
    all_date_start,
    company,
    restriction_on_associated_establishments,
  }: {
    date_start: string;
    date_end: string;
    recurrence_until?: string;
    all_date_start: string[];
    company?: number;
    restriction_on_associated_establishments: Array<number>;
  },
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availabilitySlotUpdateActions.isLoading(true));
    dispatch(availabilitySlotUpdateActions.error(null));
    try {
      await enableResourceAvailabilitySlotAPI(resourceData, {
        date_start,
        date_end,
        recurrence_until,
        all_date_start,
        company,
        restriction_on_associated_establishments:
          restriction_on_associated_establishments || [],
      });
      dispatch(availabilitySlotUpdateActions.success());
      dispatch(availabilitySlotListActions.reset(resourceData));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      console.error(err);
      dispatch(availabilitySlotListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(availabilitySlotUpdateActions.isLoading(false));
  };
}

export function enableAvailabilitySlotMultipleResource(
  resources: ResourceDataTypeForAllocation[],
  {
    date_start,
    date_end,
    recurrence_until,
    all_date_start,
    restriction_on_associated_establishments,
  }: {
    date_start: string;
    date_end: string;
    recurrence_until?: string;
    all_date_start?: string[];
    restriction_on_associated_establishments?: number[];
  },
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availabilitySlotUpdateActions.isLoading(true));
    dispatch(availabilitySlotUpdateActions.error(null));
    try {
      await enableAvailabilitySlotMultipleResourceAPI(resources, {
        date_start,
        date_end,
        recurrence_until,
        all_date_start,
        restriction_on_associated_establishments,
      });
      dispatch(availabilitySlotUpdateActions.success());
      dispatch(availabilitySlotListActions.reset());
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      console.error(err);
      dispatch(availabilitySlotListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(availabilitySlotUpdateActions.isLoading(false));
  };
}

export function disableResourceAvailabilitySlot(
  resourceData: ResourceDataTypeForAllocation,
  {
    date_start,
    date_end,
    recurrence_until,
    all_date_start,
    company,
  }: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start?: string[];
    company?: number;
  },
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availabilitySlotUpdateActions.isLoading(true));
    dispatch(availabilitySlotUpdateActions.error(null));
    try {
      await disableResourceAvailabilitySlotAPI(resourceData, {
        date_start,
        date_end,
        recurrence_until,
        all_date_start,
        company,
      });
      dispatch(availabilitySlotUpdateActions.success());
      dispatch(availabilitySlotListActions.reset(resourceData));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(availabilitySlotListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(availabilitySlotUpdateActions.isLoading(false));
  };
}

export function disableAvailabilitySlotMultipleResource(
  resourceData: ResourceDataTypeForAllocation[],
  {
    date_start,
    date_end,
    recurrence_until,
    all_date_start,
  }: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start?: string[];
  },
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availabilitySlotUpdateActions.isLoading(true));
    dispatch(availabilitySlotUpdateActions.error(null));
    try {
      await disableAvailabilitySlotMultipleResourceAPI(resourceData, {
        date_start,
        date_end,
        recurrence_until,
        all_date_start,
      });
      dispatch(availabilitySlotUpdateActions.success());
      dispatch(availabilitySlotListActions.reset(resourceData));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(availabilitySlotListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(availabilitySlotUpdateActions.isLoading(false));
  };
}

export const disableCoachAvailabilitySlot = (
  coach: any, // TODO CHECK THIS
  obj: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start?: string[];
    company?: number;
  },
  options: OptionCallback,
) => disableResourceAvailabilitySlot({ coach }, obj, options);

export const enableCoachAvailabilitySlot = (
  coach: any, // TODO CHECK THIS
  obj: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start?: string[];
    company?: number;
    restriction_on_associated_establishments?: number[];
  },
  options: OptionCallback,
  // @ts-expect-error
) => enableResourceAvailabilitySlot({ coach }, obj, options);

export const disablePrivateServiceAvailabilitySlot = (
  privateServiceId: number,
  obj: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start: string[];
  },
  options: OptionCallback,
) =>
  disableResourceAvailabilitySlot(
    { private_service: privateServiceId },
    obj,
    options,
  );
export const enablePrivateServiceAvailabilitySlot = (
  privateServiceId: number,
  obj: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start: string[];
  },
  options: OptionCallback,
) =>
  enableResourceAvailabilitySlot(
    { private_service: privateServiceId },
    //@ts-expect-error
    obj,
    options,
  );

export const disableEstablishmentAvailabilitySlot = (
  establishment: any, // TODO CHECK THIS
  obj: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start: string[];
  },
  options: OptionCallback,
) => disableResourceAvailabilitySlot({ establishment }, obj, options);

export const enableEstablishmentAvailabilitySlot = (
  establishment: any, // TODO CHECK THIS
  obj: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start: string[];
  },
  options: OptionCallback,
  // @ts-expect-error
) => enableResourceAvailabilitySlot({ establishment }, obj, options);

export const privateServiceMarketplaceListActions = {
  error: createAction('PRIVATE_SERVICE/MARKETPLACE_LIST/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/MARKETPLACE_LIST/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/MARKETPLACE_LIST/SUCCESS'),
};

export function fetchMarketplacePrivateServices(
  company: number,
  data?: { private_service_group__in?: number[] },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceMarketplaceListActions.isLoading(true));
    dispatch(privateServiceMarketplaceListActions.error(null));
    try {
      const response = await fetchAllPrivateServicesAPI({
        company,
        available: true,
        manager_only: false,
        ...data,
      });
      dispatch(privateServiceMarketplaceListActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateServiceMarketplaceListActions.error(null));
      if (options && options.onError) options.onError(err);
    }
    dispatch(privateServiceMarketplaceListActions.isLoading(false));
  };
}

export const privateServiceListActions = {
  error: createAction('PRIVATE_SERVICE/LIST/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/LIST/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/LIST/SUCCESS'),
};

export function fetchAllPrivateServices(
  params: any = {},
  options?: OptionCallback<PrivateService[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceListActions.isLoading(true));
    dispatch(privateServiceListActions.error(null));
    try {
      const response = await fetchAllPrivateServicesAPI(params);
      dispatch(privateServiceListActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateServiceListActions.error(null));
      if (options && options.onError) options.onError(err);
    }
    dispatch(privateServiceListActions.isLoading(false));
  };
}

export const privateServiceRetrieveActions = {
  error: createAction('PRIVATE_SERVICE/RETRIEVE/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/RETRIEVE/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/RETRIEVE/SUCCESS'),
};

export function fetchPrivateService(
  id: number,
  options?: OptionCallback<PrivateService>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceRetrieveActions.isLoading(true));
    dispatch(privateServiceRetrieveActions.error(null));
    try {
      const response = await fetchPrivateServiceAPI(id);
      dispatch(privateServiceRetrieveActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateServiceRetrieveActions.error(null));
      if (options && options.onError) options.onError(err);
    }
    dispatch(privateServiceRetrieveActions.isLoading(false));
  };
}

export const resourceListActions = {
  error: createAction('PRIVATE_SERVICE/RESOURCE/LIST/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/RESOURCE/LIST/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/RESOURCE/LIST/SUCCESS'),
};

export function fetchPrivateServiceResourceData(
  id: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(resourceListActions.isLoading(true));
    dispatch(resourceListActions.error(null));
    try {
      const response = await fetchPrivateServiceResourceDataAPI(id);
      dispatch(resourceListActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(resourceListActions.error(null));
      if (options && options.onError) options.onError(err);
    }
    dispatch(resourceListActions.isLoading(false));
  };
}

export function fetchResourceList(
  params: any = {},
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(resourceListActions.isLoading(true));
    dispatch(resourceListActions.error(null));
    try {
      const response = await fetchResourceListAPI(params);
      dispatch(resourceListActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(resourceListActions.error(null));
      if (options && options.onError) options.onError(err);
    }
    dispatch(resourceListActions.isLoading(false));
  };
}

export const privateServiceCreateOrUpdateActions = {
  error: createAction('PRIVATE_SERVICE/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdatePrivateService(
  data: any,
  options?: OptionCallback<PrivateService>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceCreateOrUpdateActions.isLoading(true));
    dispatch(privateServiceCreateOrUpdateActions.error(null));
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          // @ts-expect-error
          formData.append(key, value);
        }
      }

      const response = await createOrUpdatePrivateServiceAPI(formData, data.id);
      dispatch(privateServiceCreateOrUpdateActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      if (
        err.response?.data?.error_code ===
        PRIVATE_SERVICE_NOT_COMPATIBLE_WITH_PARTNERSHIP
      ) {
        dispatch(snackbarError('privateService.notCompatibleWithPartnership'));
      }

      console.error(err);
      dispatch(privateServiceCreateOrUpdateActions.error(null));
      options?.onError?.(err);
    }
    dispatch(privateServiceCreateOrUpdateActions.isLoading(false));
  };
}

export const serviceGroupDeleteActions = {
  error: createAction('PRIVATE_SERVICE/DELETE/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/DELETE/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/DELETE/SUCCESS'),
};

export function deleteServiceGroup(
  id: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(serviceGroupDeleteActions.isLoading(true));
    dispatch(serviceGroupDeleteActions.error(null));
    try {
      await deleteServiceGroupAPI(id);
      dispatch(serviceGroupDeleteActions.success(id));
      // @ts-expect-error
      options?.onSuccess?.(id);
    } catch (err) {
      console.error(err);
      dispatch(serviceGroupDeleteActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(serviceGroupDeleteActions.isLoading(false));
  };
}

export function deletePrivateService(
  id: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceCreateOrUpdateActions.isLoading(true));
    dispatch(privateServiceCreateOrUpdateActions.error(null));
    try {
      await deletePrivateServiceAPI(id);
      dispatch(fetchAllPrivateServices());
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateServiceCreateOrUpdateActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateServiceCreateOrUpdateActions.isLoading(false));
  };
}

export const privateSlotRetrieveActions = {
  error: createAction('PRIVATE_SLOT/RETRIEVE/ERROR'),
  isLoading: createAction('PRIVATE_SLOT/RETRIEVE/IS_LOADING'),
  success: createAction('PRIVATE_SLOT/RETRIEVE/SUCCESS'),
};

export function fetchPrivateSlot(
  privateServiceId: number,
  privateSlotId: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateSlotRetrieveActions.isLoading(true));
    dispatch(privateSlotRetrieveActions.error(null));
    try {
      const response = await fetchPrivateSlotRetrieveAPI(
        privateServiceId,
        privateSlotId,
      );
      dispatch(privateSlotRetrieveActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privateSlotRetrieveActions.error(null));
    }
    dispatch(privateSlotRetrieveActions.isLoading(false));
  };
}

export const privateSlotListActions = {
  error: createAction('PRIVATE_SLOT/LIST/ERROR'),
  isLoading: createAction('PRIVATE_SLOT/LIST/IS_LOADING'),
  success: createAction('PRIVATE_SLOT/LIST/SUCCESS'),
  all: createAction('PRIVATE_SLOT/LIST/ALL'),
};

export const privateSlotBulkActions = {
  error: createAction('PRIVATE_SLOT/BULK/ERROR'),
  isLoading: createAction('PRIVATE_SLOT/BULK/IS_LOADING'),
  success: createAction('PRIVATE_SLOT/BULK/SUCCESS'),
};

export function fetchPrivateSlotBulk(
  ids: Array<number>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    const id__in = uniq(ids);
    if (!id__in.length) return;
    dispatch(privateSlotBulkActions.isLoading(true));
    dispatch(privateSlotBulkActions.error(null));
    try {
      const response = await fetchAllPrivateSlotsAPI({ id__in });
      dispatch(privateSlotBulkActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateSlotBulkActions.error(null));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(privateSlotBulkActions.isLoading(false));
  };
}

export const privateServiceBulkActions = {
  error: createAction('PRIVATE_SERVICE/BULK/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/BULK/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/BULK/SUCCESS'),
};

export function fetchPrivateServiceBulk(
  ids: Array<number>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    const id__in = uniq(ids);
    if (!id__in.length) return;
    dispatch(privateServiceBulkActions.isLoading(true));
    dispatch(privateServiceBulkActions.error(null));
    try {
      const response = await fetchAllPrivateServicesAPI({ id__in });
      dispatch(privateServiceBulkActions.success(response.data));

      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateServiceBulkActions.error(null));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(privateServiceBulkActions.isLoading(false));
  };
}

export function fetchAllPrivateSlots(
  params: any = {},
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateSlotListActions.isLoading(true));
    dispatch(privateSlotListActions.error(null));
    try {
      const response = await fetchAllPrivateSlotsAPI(params);
      dispatch(privateSlotListActions.all(response.data));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      console.error(err);
      dispatch(privateSlotListActions.error(null));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(privateSlotListActions.isLoading(false));
  };
}

export function fetchMarketplacePrivateSlots(company: number) {
  return async (dispatch: Dispatch) => {
    dispatch(privateSlotListActions.isLoading(true));
    dispatch(privateSlotListActions.error(null));
    try {
      const response = await fetchAllPrivateSlotsAPI({ company });
      dispatch(privateSlotListActions.all(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privateSlotListActions.error(null));
    }
    dispatch(privateSlotListActions.isLoading(false));
  };
}

export const privateSlotCreateOrUpdateActions = {
  error: createAction('PRIVATE_SLOT/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('PRIVATE_SLOT/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('PRIVATE_SLOT/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdatePrivateSlot(
  privateServiceId: number,
  data: any,
  slotId?: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateSlotCreateOrUpdateActions.isLoading(true));
    dispatch(privateSlotCreateOrUpdateActions.error(null));
    try {
      const response = await createOrUpdatePrivateSlotAPI(
        privateServiceId,
        data,
        slotId,
      );
      dispatch(privateSlotCreateOrUpdateActions.success(response.data));
      dispatch(fetchPrivateService(privateServiceId));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      if (
        err.response?.data?.error_code ===
        PRIVATE_SLOT_NOT_COMPATIBLE_WITH_PARTNERSHIP
      ) {
        dispatch(snackbarError('privateSlot.notCompatibleWithPartnership'));
      }
      console.error(err);
      dispatch(privateSlotCreateOrUpdateActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateSlotCreateOrUpdateActions.isLoading(false));
  };
}

export const privateSlotDeleteActions = {
  error: createAction('PRIVATE_SLOT/DELETE/ERROR'),
  isLoading: createAction('PRIVATE_SLOT/DELETE/IS_LOADING'),
  success: createAction('PRIVATE_SLOT/DELETE/SUCCESS'),
};

export function deletePrivateSlot(
  privateServiceId: number,
  slotId: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateSlotDeleteActions.isLoading(true));
    dispatch(privateSlotDeleteActions.error(null));
    try {
      await deletePrivateSlotAPI(privateServiceId, slotId);
      dispatch(privateSlotDeleteActions.success(slotId));
      dispatch(fetchPrivateSlot(privateServiceId, slotId));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateSlotDeleteActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateSlotDeleteActions.isLoading(false));
  };
}

export const switchServiceHasOwnAvailabilitySlotsActions = {
  error: createAction('PRIVATE_SERVICE/SWITCH_HAS_OWN_AVAILABILITY_SLOT/ERROR'),
  isLoading: createAction(
    'PRIVATE_SERVICE/SWITCH_HAS_OWN_AVAILABILITY_SLOT/IS_LOADING',
  ),
  reset: createAction('PRIVATE_SERVICE/SWITCH_HAS_OWN_AVAILABILITY_SLOT/RESET'),
};

export function switchServiceHasOwnAvailabilitySlots(
  privateServiceId: number,
  options: OptionCallback<PrivateService>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(switchServiceHasOwnAvailabilitySlotsActions.isLoading(true));
    dispatch(switchServiceHasOwnAvailabilitySlotsActions.error(null));
    try {
      const response = await switchServiceHasOwnAvailabilitySlotsAPI(
        privateServiceId,
      );
      dispatch(
        switchServiceHasOwnAvailabilitySlotsActions.reset(privateServiceId),
      );
      dispatch(fetchPrivateService(privateServiceId));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(switchServiceHasOwnAvailabilitySlotsActions.error(null));
      options?.onError?.();
    }
    dispatch(switchServiceHasOwnAvailabilitySlotsActions.isLoading(false));
  };
}

export const privateServiceWithSlotListActions = {
  error: createAction('PRIVATE_SERVICE_WITH_SLOT/LIST/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE_WITH_SLOT/LIST/IS_LOADING'),
};

export const privateServiceWithSlotRetrieveActions = {
  error: createAction('PRIVATE_SERVICE_WITH_SLOT/RETRIEVE/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE_WITH_SLOT/RETRIEVE/IS_LOADING'),
};

export function fetchPrivateServiceWithSlotList(
  companyId: number,
  params: any,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceWithSlotListActions.isLoading(true));
    dispatch(privateServiceWithSlotListActions.error(null));
    try {
      const response = await fetchAllPrivateServicesAPI({
        company: companyId,
        with_slots: true,
        ...(params || {}),
      });

      dispatch(
        privateServiceListActions.success(
          // @ts-expect-error
          response.data.map((service: PrivateService) => ({
            ...service,
            // @ts-expect-error
            slots: service.slots.map((slot: PrivateSlot) => slot.id),
          })),
        ),
      );
      dispatch(
        privateSlotListActions.success(
          // @ts-expect-error
          response.data.reduce(
            (acc: PrivateSlot[], service: PrivateService) => [
              ...acc,
              ...service.slots,
            ],
            [],
          ),
        ),
      );

      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateServiceWithSlotListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateServiceWithSlotListActions.isLoading(false));
  };
}

export function fetchPrivateServiceWithSlot(
  privateServiceId: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceWithSlotRetrieveActions.isLoading(true));
    dispatch(privateServiceWithSlotRetrieveActions.error(null));
    try {
      const response = await fetchPrivateServiceAPI(privateServiceId, {
        with_slots: true,
      });

      dispatch(
        privateServiceRetrieveActions.success(
          // @ts-expect-error
          response.data.map((service: PrivateService) => ({
            ...service,
            // @ts-expect-error
            slots: service.slots.map((slot: PrivateSlot) => slot.id),
          })),
        ),
      );
      // @ts-expect-error
      dispatch(privateSlotListActions.success(response.data.slots));

      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateServiceWithSlotRetrieveActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateServiceWithSlotRetrieveActions.isLoading(false));
  };
}

export const availableSlotsActions = {
  error: createAction<Error | null>('AVAILABLE_SLOTS/FETCH/ERROR'),
  isLoading: createAction<boolean>('AVAILABLE_SLOTS/FETCH/IS_LOADING'),
  success: createAction<ResourceSlotsByDate>('AVAILABLE_SLOTS/FETCH/SUCCESS'),
};

/**
 * Fetches available slots for specified resources (e.g., coaches, establishments) on the given dates.
 * This function dispatches actions to indicate loading, success, or error states during the fetch operation.
 * The difference with availabilitySlotSearchActions is that we'll use the data returned by the backend
 * without transforming it.
 * @param {number} privateServiceId - The unique identifier of the private service requesting the slots.
 * @param {number} privateSlotId - The identifier of the specific slot associated with the private service.
 * @param {number[]} associatedCoachIdList - A list of coach IDs to filter available slots for specified coaches.
 * @param {string | string[]} dates - A date or an array of dates (in "YYYY-MM-DD" format) for which to fetch slot availability.
 * @param {number[]} associatedEstablishmentIdList - A list of establishment IDs to filter available slots for specified establishments.
 * @param {OptionCallback<ResourceSlotsByDate>} [options] - Optional callback functions for handling success and error:
 *   - `onSuccess(data)`: Called with fetched data when the request is successful.
 *   - `onError(error)`: Called with an error object if the request fails.
 *
 * @returns {ThunkAction} - A ThunkAction that performs the asynchronous fetch and dispatches actions to update the Redux state.
 *
 * @example
 * // Usage example in a Redux-connected component
 * fetchAvailableSlotsByResource(
 *   123,
 *   456,
 *   [1, 2],
 *   ["2024-10-03", "2024-10-04"],
 *   [10, 20],
 *   {
 *     onSuccess: (data) => console.log("Fetched slots:", data),
 *     onError: (error) => console.error("Error fetching slots:", error),
 *   }
 * );
 *
 * @dispatches
 * - `availableSlotsActions.fetchIsLoading`: Dispatches to set loading state to true or false.
 * - `availableSlotsActions.fetchError`: Dispatches when an error occurs during the fetch operation.
 * - `availableSlotsActions.fetchSuccess`: Dispatches with the fetched data when the fetch operation is successful.
 */
export function fetchAvailableSlotsByResource(
  privateServiceId: number,
  privateSlotId: number,
  associatedCoachIdList: number[],
  dates: string[] | string,
  associatedEstablishmentIdList: number[],
  options?: OptionCallback<ResourceSlotsByDate>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availableSlotsActions.isLoading(true));
    dispatch(availableSlotsActions.error(null));
    try {
      const dateArr = Array.isArray(dates) ? dates : [dates];

      const response = await searchAvailableSlotsAPI(
        privateServiceId,
        privateSlotId,
        associatedCoachIdList,
        dateArr,
        associatedEstablishmentIdList,
      );
      dispatch(availableSlotsActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(availableSlotsActions.error(null));
      options?.onError?.(err);
    }
    dispatch(availableSlotsActions.isLoading(false));
  };
}

export const availabilitySlotSearchActions = {
  error: createAction('AVAILABILITY_SLOT/SEARCH/ERROR'),
  isLoading: createAction('AVAILABILITY_SLOT/SEARCH/IS_LOADING'),
  success: createAction('AVAILABILITY_SLOT/SEARCH/SUCCESS'),
  reset: createAction('AVAILABILITY_SLOT/SEARCH/RESET'),
};

export const resetAvailabilitySlotSearch = availabilitySlotSearchActions.reset;

export function searchAvailableSlots(
  privateServiceId: number,
  privateSlotId: number,
  associatedCoachIdList: Array<number>,
  dates: Array<string> | string,
  associatedEstablishmentIdList: Array<number>,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availabilitySlotSearchActions.isLoading(true));
    dispatch(availabilitySlotSearchActions.error(null));
    try {
      const dateArr = Array.isArray(dates) ? dates : [dates];

      const response = await searchAvailableSlotsAPI(
        privateServiceId,
        privateSlotId,
        associatedCoachIdList,
        dateArr,
        associatedEstablishmentIdList,
      );

      const result = Object.keys(response.data).flatMap((date) => {
        return response.data[date].map((entry) => ({
          resource_identifier: entry.resource_identifier,
          slots: entry.slots,
        }));
      });

      dispatch(availabilitySlotSearchActions.success(result));
      // @ts-expect-error
      options?.onSuccess?.(result);
    } catch (err) {
      console.error(err);
      dispatch(availabilitySlotSearchActions.error(null));
      if (options && options.onError) options.onError(err);
    }
    dispatch(availabilitySlotSearchActions.isLoading(false));
  };
}

export const searchFirstAvailableSlotsActions = {
  error: createAction('AVAILABILITY_SLOT/NEXT/ERROR'),
  isLoading: createAction('AVAILABILITY_SLOT/NEXT/IS_LOADING'),
  success: createAction('AVAILABILITY_SLOT/NEXT/SUCCESS'),
  reset: createAction('AVAILABILITY_SLOT/NEXT/RESET'),
  setCancellationToken: createAction('AVAILABILITY_SLOT/NEXT/TOKEN'),
};

export function searchFirstAvailableSlots(
  privateServiceId: number,
  privateSlotId: number,
  associatedCoachIdList: Array<number>,
  associatedEstablishmentIdList: Array<number>,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      dispatch(searchFirstAvailableSlotsActions.reset());

      if (getState()?.privateService?.availabilitySlot?.next?.cancelToken) {
        const prevCancelationToken =
          getState()?.privateService?.availabilitySlot?.next?.cancelToken;
        prevCancelationToken.cancel();
      }

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      dispatch(searchFirstAvailableSlotsActions.setCancellationToken(source));
      dispatch(searchFirstAvailableSlotsActions.isLoading(true));
      dispatch(searchFirstAvailableSlotsActions.error(null));

      const response = await searchFirstvailableSlotsAPI(
        privateServiceId,
        privateSlotId,
        associatedCoachIdList,
        associatedEstablishmentIdList,
        source.token,
      );

      dispatch(
        searchFirstAvailableSlotsActions.success(response?.data ?? null),
      );
      dispatch(searchFirstAvailableSlotsActions.isLoading(false));
      dispatch(searchFirstAvailableSlotsActions.setCancellationToken());

      // @ts-expect-error
      options?.onSuccess?.(response?.data ?? null);
    } catch (err) {
      if (err?.__CANCEL__) return;
      console.error(err);
      dispatch(searchFirstAvailableSlotsActions.error(err));
      dispatch(searchFirstAvailableSlotsActions.setCancellationToken());
      dispatch(searchFirstAvailableSlotsActions.isLoading(false));
      if (options && options.onError) options.onError(err);
    }
  };
}

export const privatePassListActions = {
  error: createAction('PRIVATE_PASS/LIST/ERROR'),
  isLoading: createAction('PRIVATE_PASS/LIST/IS_LOADING'),
  success: createAction('PRIVATE_PASS/LIST/SUCCESS'),
};

export function fetchPrivatePassList(
  params: any = {},
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassListActions.isLoading(true));
    dispatch(privatePassListActions.error(null));
    try {
      const response = await fetchPrivatePassListAPI(params);
      dispatch(privatePassListActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privatePassListActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(privatePassListActions.isLoading(false));
  };
}

export const privatePassBulkActions = {
  error: createAction('PRIVATE_PASS/BULK/ERROR'),
  isLoading: createAction('PRIVATE_PASS/BULK/IS_LOADING'),
  success: createAction('PRIVATE_PASS/BULK/SUCCESS'),
};

export function fetchPrivatePassBulk(
  ids: Array<number>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    const id__in = uniq((ids ?? []).filter((id) => !!id));
    if (!id__in.length) return;
    dispatch(privatePassBulkActions.isLoading(true));
    dispatch(privatePassBulkActions.error(null));
    try {
      const response = await fetchPrivatePassListAPI({
        id__in,
      });
      dispatch(privatePassBulkActions.success(response.data));

      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privatePassBulkActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(privatePassBulkActions.isLoading(false));
  };
}

export const serviceGroupListActions = {
  error: createAction('SERVICE_GROUP/LIST/ERROR'),
  isLoading: createAction('SERVICE_GROUP/LIST/IS_LOADING'),
  success: createAction('SERVICE_GROUP/LIST/SUCCESS'),
};

export function fetchPrivateServiceGroupList(
  data: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(serviceGroupListActions.isLoading(true));
    dispatch(serviceGroupListActions.error(null));
    try {
      const response = await fetchServiceGroupListAPI(data);
      dispatch(serviceGroupListActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(serviceGroupListActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(serviceGroupListActions.isLoading(false));
  };
}

export const serviceGroupCreateOrUpdateActions = {
  error: createAction('SERVICE_GROUP/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('SERVICE_GROUP/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('SERVICE_GROUP/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateServiceGroup(data: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(serviceGroupCreateOrUpdateActions.isLoading(true));
    dispatch(serviceGroupCreateOrUpdateActions.error(null));
    try {
      const response = await createOrUpdateServiceGroupAPI(data);
      dispatch(serviceGroupCreateOrUpdateActions.success(response.data));

      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(serviceGroupCreateOrUpdateActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(serviceGroupCreateOrUpdateActions.isLoading(false));
  };
}

export const privatePassAsConsumerListActions = {
  error: createAction('PRIVATE_PASS/AS_CONSUMER/ERROR'),
  isLoading: createAction('PRIVATE_PASS/AS_CONSUMER/IS_LOADING'),
  success: createAction('PRIVATE_PASS/AS_CONSUMER/SUCCESS'),
};

export function fetchPrivatePassAsConsumerList(company?: number) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassAsConsumerListActions.isLoading(true));
    dispatch(privatePassAsConsumerListActions.error(null));
    try {
      const response = await fetchPrivatePassListAPI({
        company,
        manager_only: false,
        include_expired: false,
      });
      dispatch(privatePassAsConsumerListActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privatePassAsConsumerListActions.error(err));
    }
    dispatch(privatePassAsConsumerListActions.isLoading(false));
  };
}

export const privatePassRetrieveActions = {
  error: createAction('PRIVATE_PASS/RETRIEVE/ERROR'),
  isLoading: createAction('PRIVATE_PASS/RETRIEVE/IS_LOADING'),
  success: createAction('PRIVATE_PASS/RETRIEVE/SUCCESS'),
};

export function fetchPrivatePassRetrieve(
  id: number,
  options?: OptionCallback<PrivatePass>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassRetrieveActions.isLoading(true));
    dispatch(privatePassRetrieveActions.error(null));
    try {
      const response = await fetchPrivatePassRetrieveAPI(id);
      dispatch(privatePassRetrieveActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privatePassRetrieveActions.error(err));
      options && options.onError && options.onError(err);
    }
    dispatch(privatePassRetrieveActions.isLoading(false));
  };
}

export const privatePassCreateOrUpdateActions = {
  error: createAction('PRIVATE_PASS/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('PRIVATE_PASS/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('PRIVATE_PASS/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdatePrivatePass(
  data: any,
  id: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassCreateOrUpdateActions.isLoading(true));
    dispatch(privatePassCreateOrUpdateActions.error(null));
    try {
      const response = await createOrUpdatePrivatePassAPI(data, id);
      dispatch(privatePassCreateOrUpdateActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
      if (!id) {
        dispatch(fetchPrivatePassList());
      }
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privatePassCreateOrUpdateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(privatePassCreateOrUpdateActions.isLoading(false));
  };
}

export const privatePassUpdateOrderActions = {
  error: createAction('PRIVATE_PASS/UPDATE_ORDER/ERROR'),
  isLoading: createAction('PRIVATE_PASS/UPDATE_ORDER/IS_LOADING'),
  success: createAction('PRIVATE_PASS/UPDATE_ORDER/SUCCESS'),
};

export function editOrderPrivatePass(
  data: Array<{ id: number; ordering_in_category: number }>,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassUpdateOrderActions.isLoading(true));
    dispatch(privatePassUpdateOrderActions.error(null));
    try {
      const response = await editOrderPrivatePassAPI(data);
      dispatch(privatePassUpdateOrderActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privatePassUpdateOrderActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(privatePassUpdateOrderActions.isLoading(false));
  };
}

export const privatePassDeleteActions = {
  error: createAction('PRIVATE_PASS/DELETE/ERROR'),
  isLoading: createAction('PRIVATE_PASS/DELETE/IS_LOADING'),
  success: createAction('PRIVATE_PASS/DELETE/SUCCESS'),
};

export function deletePrivatePass(
  id: number,
  options?: OptionCallback<number>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassDeleteActions.isLoading(true));
    dispatch(privatePassDeleteActions.error(null));
    try {
      const response = await deletePrivatePassAPI(id);
      dispatch(privatePassDeleteActions.success(response.data));
      dispatch(snackbarSuccess('privatePass.del.success'));
      dispatch(fetchPrivatePassRetrieve(id));
      if (options && options.onSuccess) options.onSuccess(id);
    } catch (err) {
      console.error(err);
      dispatch(privatePassDeleteActions.error(err));
      if (options && options.onError) options.onError(err);
      dispatch(snackbarError('privatePass.del.error'));
    }
    dispatch(privatePassDeleteActions.isLoading(false));
  };
}

export function restorePrivatePass(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassCreateOrUpdateActions.isLoading(true));
    dispatch(privatePassCreateOrUpdateActions.error(null));
    try {
      const response = await restorePrivatePassAPI(id);
      dispatch(privatePassCreateOrUpdateActions.success(response.data));
      dispatch(snackbarSuccess('privatePass.restore.success'));
      if (options?.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privatePassCreateOrUpdateActions.error(err));
      dispatch(snackbarError('privatePass.restore.error'));
      if (options?.onError) options.onError();
    }
    dispatch(privatePassCreateOrUpdateActions.isLoading(false));
  };
}

export const isPrivatePassUsedInComboActions = {
  isLoading: createAction('PRIVATE_PASS/COMBO_USE/IS_LOADING'),
  error: createAction('PRIVATE_PASS/COMBO_USE/ERROR'),
  success: createAction('PRIVATE_PASS/COMBO_USE/SUCCESS'),
};

export function isPrivatePassUsedInCombo(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(isPrivatePassUsedInComboActions.error(null));
    dispatch(isPrivatePassUsedInComboActions.isLoading(true));
    try {
      const response = await isPrivatePassUsedInComboAPI(id);
      dispatch(isPrivatePassUsedInComboActions.success(response.data));

      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(isPrivatePassUsedInComboActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(isPrivatePassUsedInComboActions.isLoading(false));
  };
}

export const privateServiceCompatiblePassActions = {
  error: createAction('PRIVATE_SERVICE_COMPATIBLE_PASS/ACTION/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE_COMPATIBLE_PASS/ACTION/LOADING'),
  create: createAction('PRIVATE_SERVICE_COMPATIBLE_PASS/ACTION/CREATE'),
  delete: createAction('PRIVATE_SERVICE_COMPATIBLE_PASS/ACTION/DELETE'),
  success: createAction('PRIVATE_SERVICE_COMPATIBLE_PASS/ACTION/SUCCESS'),
  update: createAction('PRIVATE_SERVICE_COMPATIBLE_PASS/ACTION/UPDATE'),
};

export function fetchCompatibleServicePassList(
  privatePassId: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceCompatiblePassActions.isLoading(true));
    try {
      const response = await fetchCompatibleServicePassListAPI(privatePassId);
      dispatch(privateServiceCompatiblePassActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(privateServiceCompatiblePassActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(privateServiceCompatiblePassActions.isLoading(false));
  };
}

export const privateServiceCompatiblePassListActions = {
  error: createAction<Error | null>(
    'PRIVATE_SERVICE_COMPATIBLE_PASS/LIST/ERROR',
  ),
  isLoading: createAction<boolean>(
    'PRIVATE_SERVICE_COMPATIBLE_PASS/LIST/IS_LOADING',
  ),
  success: createAction<ServiceCompatibilityPass[]>(
    'PRIVATE_SERVICE_COMPATIBLE_PASS/LIST/SUCCESS',
  ),
};

export function fetchPrivateServiceCompatiblePassList(
  params: { private_service__in: number[] },
  options?: OptionCallback<ServiceCompatibilityPass[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceCompatiblePassListActions.isLoading(true));
    dispatch(privateServiceCompatiblePassListActions.error(null));
    try {
      const response = await fetchPrivateServiceCompatiblePassListAPI(params);
      dispatch(privateServiceCompatiblePassListActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateServiceCompatiblePassListActions.error(null));
      if (options && options.onError) options.onError(err);
    }
    dispatch(privateServiceCompatiblePassListActions.isLoading(false));
  };
}

export function updateCompatibleServicePass(
  privatePassId: number,
  privateServiceId: number,
  data: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceCompatiblePassActions.isLoading(true));
    dispatch(privateServiceCompatiblePassActions.error(null));
    try {
      const response = await updateCompatibleServicePassAPI(
        privatePassId,
        privateServiceId,
        data,
      );
      dispatch(privateServiceCompatiblePassActions.update(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateServiceCompatiblePassActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(privateServiceCompatiblePassActions.isLoading(false));
  };
}

export function deleteCompatibleServicePass(
  privatePassId: number,
  privateServiceId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceCompatiblePassActions.isLoading(true));
    dispatch(privateServiceCompatiblePassActions.error(null));
    try {
      await deleteCompatibleServicePassAPI(privatePassId, privateServiceId);
      dispatch(privateServiceCompatiblePassActions.delete(privatePassId));
      dispatch(fetchPrivatePassRetrieve(privatePassId));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateServiceCompatiblePassActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(privateServiceCompatiblePassActions.isLoading(false));
  };
}

export function createCompatibleServicePass(
  privatePassId: number,
  privateServiceId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceCompatiblePassActions.isLoading(true));
    dispatch(privateServiceCompatiblePassActions.error(null));
    try {
      const response = await createCompatibleServicePassAPI(
        privatePassId,
        privateServiceId,
      );
      dispatch(
        privateServiceCompatiblePassActions.create(
          privatePassId,
          privateServiceId,
        ),
      );
      dispatch(fetchPrivatePassRetrieve(privatePassId));
      dispatch(privateServiceCompatiblePassActions.update(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateServiceCompatiblePassActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(privateServiceCompatiblePassActions.isLoading(false));
  };
}

export const privateConsumerPassListActions = {
  error: createAction('PRIVATE_CONSUMER_PASS/LIST/ERROR'),
  isLoading: createAction('PRIVATE_CONSUMER_PASS/LIST/IS_LOADING'),
  success: createAction('PRIVATE_CONSUMER_PASS/LIST/SUCCESS'),
};

export function resetPrivateConsumerPassList() {
  return async (dispatch: Dispatch) => {
    dispatch(privateConsumerPassListActions.success([]));
  };
}

export const byPrivatePass = {
  isLoading: createAction('BY_PRIVATE_PASS/IS_LOADING'),
  error: createAction('BY_PRIVATE_PASS/ERROR'),
  success: createAction('BY_PRIVATE_PASS/SUCCESS'),
};

export function fetchPrivateConsumerPassList(
  params: any,
  options?: OptionCallback<PrivateConsumerPassREST[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateConsumerPassListActions.isLoading(true));
    dispatch(privateConsumerPassListActions.error(null));
    try {
      const response = await fetchPrivateConsumerPassListAPI({
        ...(params || {}),
      });
      if (response.data && response.data.results) {
        dispatch(
          privateConsumerPassListActions.success({
            ...response.data,
            page: (params || {}).page,
          }),
        );
        if (options && options.onSuccess) {
          options.onSuccess(response.data.results);
        }
      } else {
        dispatch(privateConsumerPassListActions.success(response.data));
        if (options && options.onSuccess) options.onSuccess();
      }
    } catch (err) {
      console.error(err);
      dispatch(privateConsumerPassListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateConsumerPassListActions.isLoading(false));
  };
}

//
export function fetchByPrivatePass(
  privatePassId: number,
  page?: number,
  page_size?: number,
  options?: OptionCallback<PrivateConsumerPassREST[]>,
  params?: any,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byPrivatePass.isLoading(true));
    dispatch(byPrivatePass.error(null));
    try {
      const response = await fetchPrivateConsumerPassListAPI({
        private_pass: privatePassId,
        page,
        page_size,
        ...(params || {}),
      });

      // dispatch(byPrivatePass.success({results: response.data,count: 10, page: page || 1,}),);
      dispatch(byPrivatePass.success({ ...response.data, page: page || 1 }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      console.error(err);
      dispatch(byPrivatePass.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(byPrivatePass.isLoading(false));
  };
}

export function resetByPrivatePass() {
  return async (dispatch: Dispatch) => {
    dispatch(byPrivatePass.success({ results: [], count: 0, page: 1 }));
    dispatch(byPrivatePass.isLoading(false));
  };
}

export const byMember = {
  isLoading: createAction('BY_MEMBER/IS_LOADING'),
  error: createAction('BY_MEMBER/ERROR'),
  success: createAction('BY_MEMBER/SUCCESS'),
};

export function fetchPrivateConsumerPassByMember(
  member: number,
  options?: OptionCallback<PaginatedResponse<PrivateConsumerPassREST>>,
  params?: any,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byMember.isLoading(true));
    dispatch(byMember.error(null));
    try {
      const response = await fetchPrivateConsumerPassListAPI({
        ...(params || {}),
        member,
      });
      dispatch(byMember.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(byMember.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(byMember.isLoading(false));
  };
}

// -------------------------

export function fetchCompatiblePrivateConsumerPass(
  privateSlotId: number,
  params: any,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateConsumerPassListActions.isLoading(true));
    dispatch(privateConsumerPassListActions.error(null));
    try {
      const response = await fetchCompatiblePrivateConsumerPassAPI(
        privateSlotId,
        params,
      );
      dispatch(privateConsumerPassListActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateConsumerPassListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateConsumerPassListActions.isLoading(false));
  };
}

export const privateServiceNonCompatiblePassActions = {
  error: createAction('PRIVATE_PASS/LIST_NON_COMPATIBLE/ACTION/ERROR'),
  isLoading: createAction('PRIVATE_PASS/LIST_NON_COMPATIBLE/ACTION/LOADING'),
  create: createAction('PRIVATE_PASS/LIST_NON_COMPATIBLE/ACTION/CREATE'),
  delete: createAction('PRIVATE_PASS/LIST_NON_COMPATIBLE/ACTION/DELETE'),
  success: createAction('PRIVATE_PASS/LIST_NON_COMPATIBLE/ACTION/SUCCESS'),
  update: createAction('PRIVATE_PASS/LIST_NON_COMPATIBLE/ACTION/UPDATE'),
};

export function fetchNonCompatiblePrivateConsumerPass(
  privateSlotId: number,
  params: any,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceNonCompatiblePassActions.isLoading(true));
    dispatch(privateServiceNonCompatiblePassActions.error(null));
    try {
      const response = await fetchNonCompatiblePrivateConsumerPassAPI(
        privateSlotId,
        params,
      );
      dispatch(privateServiceNonCompatiblePassActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateServiceNonCompatiblePassActions.error(null));
      dispatch(snackbarError('privateConsumerPass.nonCompatible.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(privateServiceNonCompatiblePassActions.isLoading(false));
  };
}

export const incompatibilitiesReasonsBySlotByConsumerPassActions = {
  isLoading: createAction(
    'PRIVATE_CONSUMER_PASS/INCOMPATIBILITIES_BY_SLOT_BY_CONSUMER_PASS/IS_LOADING',
  ),
  error: createAction(
    'PRIVATE_CONSUMER_PASS/INCOMPATIBILITIES_BY_SLOT_BY_CONSUMER_PASS/ERROR',
  ),
  success: createAction(
    'PRIVATE_CONSUMER_PASS/INCOMPATIBILITIES_BY_SLOT_BY_CONSUMER_PASS/SUCCESS',
  ),
  reset: createAction(
    'PRIVATE_CONSUMER_PASS/INCOMPATIBILITIES_BY_SLOT_BY_CONSUMER_PASS/RESET',
  ),
};

export function fetchIncompatibilitiesReasonsBySlotByConsumerPass(
  pcp_id: number,
  slot_id: number,
  date: string,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    try {
      const response =
        await fetchIncompatibilitiesReasonsBySlotByConsumerPassAPI(
          pcp_id,
          slot_id,
          date,
        );
      dispatch(
        incompatibilitiesReasonsBySlotByConsumerPassActions.success(
          // @ts-expect-error
          response.data.incompatibilities_with_slot,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(
        snackbarError('privateConsumerPass.incompatibilitiesReasons.error'),
      );
      console.error(error);
      if (options && options.onError) {
        options.onError();
      }
    }
  };
}

export function resetIncompatibilitiesReasonsBySlotByConsumerPass() {
  return async (dispatch: Dispatch) => {
    dispatch(incompatibilitiesReasonsBySlotByConsumerPassActions.reset());
  };
}

export const privateConsumerPassRetrieveActions = {
  error: createAction('PRIVATE_CONSUMER_PASS/RETRIEVE/ERROR'),
  isLoading: createAction('PRIVATE_CONSUMER_PASS/RETRIEVE/IS_LOADING'),
  success: createAction('PRIVATE_CONSUMER_PASS/RETRIEVE/SUCCESS'),
};

export function fetchPrivateConsumerPass(
  private_consumer_pass: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateConsumerPassRetrieveActions.isLoading(true));
    dispatch(privateConsumerPassRetrieveActions.error(null));
    try {
      const response = await retrievePrivateConsumerPassAPI(
        private_consumer_pass,
      );
      dispatch(privateConsumerPassRetrieveActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateConsumerPassRetrieveActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateConsumerPassRetrieveActions.isLoading(false));
  };
}

export const privateConsumerPassUpdateCreditActions = {
  error: createAction('PRIVATE_CONSUMER_PASS/UPDATE_CREDIT/ERROR'),
  isLoading: createAction('PRIVATE_CONSUMER_PASS/UPDATE_CREDIT/IS_LOADING'),
  success: createAction('PRIVATE_CONSUMER_PASS/UPDATE_CREDIT/SUCCESS'),
};

export function updatePrivateConsumerPassCredits(
  id: number,
  credits: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateConsumerPassUpdateCreditActions.isLoading(true));
    dispatch(privateConsumerPassUpdateCreditActions.error(null));
    try {
      const response = await updatePrivateConsumerPassCreditsAPI(id, credits);
      dispatch(privateConsumerPassUpdateCreditActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
      dispatch(snackbarSuccess('privateConsumerPass.creditUpdate.success'));
    } catch (err) {
      console.error(err);
      dispatch(privateConsumerPassUpdateCreditActions.error(null));
      if (options && options.onError) options.onError();
      dispatch(snackbarError('privateConsumerPass.creditUpdate.error'));
    }
    dispatch(privateConsumerPassUpdateCreditActions.isLoading(false));
  };
}

export const privateConsumerPassBulkActions = {
  error: createAction('PRIVATE_CONSUMER_PASS/BULK/ERROR'),
  isLoading: createAction('PRIVATE_CONSUMER_PASS/BULK/IS_LOADING'),
  success: createAction('PRIVATE_CONSUMER_PASS/BULK/SUCCESS'),
};

export function fetchPrivateConsumerPassBulk(ids: Array<number>) {
  return async (dispatch: Dispatch) => {
    const id__in = uniq(ids.filter((id) => !!id));
    if (!id__in.length) return;

    dispatch(privateConsumerPassBulkActions.isLoading(true));
    dispatch(privateConsumerPassBulkActions.error(null));
    try {
      const response = await fetchPrivateConsumerPassListAPI({
        id__in,
      });
      dispatch(privateConsumerPassBulkActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privateConsumerPassBulkActions.error(err));
    }
    dispatch(privateConsumerPassBulkActions.isLoading(false));
  };
}

export function fetchCompatiblePrivatePass(
  privateSlotId: number,
  params?: any,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassListActions.isLoading(true));
    dispatch(privatePassListActions.error(null));
    try {
      const response = await fetchCompatiblePrivatePassAPI(
        privateSlotId,
        params,
      );
      dispatch(privatePassListActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privatePassListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privatePassListActions.isLoading(false));
  };
}

export const privateBookingListActions = {
  error: createAction('PRIVATE_BOOKING/LIST/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/LIST/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/LIST/SUCCESS'),
  reset: createAction('PRIVATE_BOOKING/RESET/DONE'),
};

export const resetPrivateBookings = privateBookingListActions.reset;

export function fetchPrivateBookings(
  params: PrivateBookingFilterParams & {
    member?: number;
    page?: number;
    page_size?: number;
    date_start__gte?: string;
    date_start__lte?: string;
    establishment?: number;
    private_consumer_pass?: number;
    private_service?: number;
  },
  options?: OptionCallback<Array<PrivateBooking>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingListActions.isLoading(true));
    dispatch(privateBookingListActions.error(null));
    try {
      const response = await fetchPrivateBookingsAPI(params);
      if (response.data && response.data.results) {
        dispatch(
          privateBookingListActions.success({
            ...response.data,
            page: (params || {}).page,
          }),
        );
        if (options && options.onSuccess) {
          options?.onSuccess?.(response.data.results);
        }
      } else {
        dispatch(privateBookingListActions.success(response.data));
        // @ts-expect-error
        options?.onSuccess?.(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(privateBookingListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingListActions.isLoading(false));
  };
}

export const privateBookingRetrieveActions = {
  error: createAction('PRIVATE_BOOKING/RETRIEVE/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/RETRIEVE/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/RETRIEVE/SUCCESS'),
};

export function fetchPrivateBooking(
  id: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingRetrieveActions.isLoading(true));
    dispatch(privateBookingRetrieveActions.error(null));
    try {
      const response = await fetchPrivateBookingAPI(id);
      dispatch(privateBookingRetrieveActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateBookingRetrieveActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingRetrieveActions.isLoading(false));
  };
}

export function registerPrivateBooking(
  params: any,
  options: OptionCallback,
  asConsumer = false,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingCreateOrUpdateActions.isLoading(true));
    dispatch(privateBookingCreateOrUpdateActions.error(null));
    try {
      const response = await registerPrivateBookingsAPI(params);
      dispatch(privateBookingCreateOrUpdateActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        const error_code = err.response.data.error_code;
        switch (error_code) {
          case EXCEPTION_STAFF_ROLE_OVERRIDE_COACH_NOT_ALLOWED:
            if (asConsumer) {
              dispatch(
                snackbarError('privateSlot.notAvailableForBookingAnymore'),
              );
            } else
              dispatch(
                snackbarError('role.noMasterControl.overrideCoachNotAllowed'),
              );
            break;
          case EXCEPTION_STAFF_ROLE_OVERRIDE_ESTABLISHMENT_NOT_ALLOWED:
            if (asConsumer) {
              dispatch(
                snackbarError('privateSlot.notAvailableForBookingAnymore'),
              );
            } else
              dispatch(
                snackbarError(
                  'role.noMasterControl.overrideEstablishmentNotAllowed',
                ),
              );
            break;
          case CONSUMER_PRIVATE_PASS_CAN_NOT_BOOK_COACH_UNAVAILABLE:
            dispatch(snackbarError('privateSlot.coachNotAvailable'));
            break;
          case CONSUMER_PRIVATE_PASS_CAN_NOT_BOOK_ESTABLISHMENT_UNAVAILABLE:
            dispatch(snackbarError('privateSlot.establishmentNotAvailable'));
            break;
          default:
            dispatch(
              snackbarWarning(
                `privateBooking.register.warning.${err.response.data.error_code}`,
              ),
            );
            break;
        }
      } else {
        dispatch(privateBookingCreateOrUpdateActions.error(null));
        dispatch(snackbarError('privateBooking.register.error'));
      }
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingCreateOrUpdateActions.isLoading(false));
  };
}

export const privateBookingCreateOrUpdateActions = {
  error: createAction('PRIVATE_BOOKING/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/CREATE_OR_UPDATE/SUCCESS'),
};

export function updatePrivateBookingDatetime(
  id: number,
  datetime: string,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingCreateOrUpdateActions.isLoading(true));
    dispatch(privateBookingCreateOrUpdateActions.error(null));
    try {
      const response = await updatePrivateBookingDatetimeAPI(id, datetime);
      dispatch(privateBookingCreateOrUpdateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateBookingCreateOrUpdateActions.error(null));
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        const error_code = err.response.data.error_code;
        switch (error_code) {
          case EXCEPTION_STAFF_ROLE_CAN_NOT_CHANGE_DATE_BECAUSE_NO_COACH_OVERRIDE:
            dispatch(
              snackbarError('role.noMasterControl.changeDateCoachUnaivalable'),
            );
            break;
          case EXCEPTION_STAFF_ROLE_CAN_NOT_CHANGE_DATE_BECAUSE_NO_ESTABLISHMENT_OVERRIDE:
            dispatch(
              snackbarError(
                'role.noMasterControl.changeDateEstablishmentUnaivalable',
              ),
            );
            break;
          default:
            dispatch(snackbarError('privateBooking.register.error'));
            break;
        }
      }
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingCreateOrUpdateActions.isLoading(false));
  };
}

export function updatePrivateBookingCoach(
  privateBookingId: number,
  updatedCoachId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingCreateOrUpdateActions.isLoading(true));
    dispatch(privateBookingCreateOrUpdateActions.error(null));
    try {
      const response = await updatePrivateBookingCoachAPI(
        privateBookingId,
        updatedCoachId,
      );
      dispatch(privateBookingCreateOrUpdateActions.success(response.data));
      dispatch(snackbarSuccess('privateBooking.updateCoach.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateBookingCreateOrUpdateActions.error(err));
      dispatch(snackbarError('privateBooking.updateCoach.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingCreateOrUpdateActions.isLoading(false));
  };
}
export function disablePrivateBooking(
  id: number,
  data: CancelPrivateBookingFilterParams,
  options?: OptionCallback<PrivateBooking>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingCreateOrUpdateActions.isLoading(true));
    dispatch(privateBookingCreateOrUpdateActions.error(null));
    try {
      const response = await disablePrivateBookingAPI(id, data);
      dispatch(privateBookingCreateOrUpdateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateBookingCreateOrUpdateActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingCreateOrUpdateActions.isLoading(false));
  };
}

export function restorePrivateBooking(
  id: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingCreateOrUpdateActions.isLoading(true));
    dispatch(privateBookingCreateOrUpdateActions.error(null));
    try {
      const response = await restorePrivateBookingAPI(id);
      dispatch(privateBookingCreateOrUpdateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
      dispatch(snackbarSuccess('privateBooking.restore.success'));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        dispatch(snackbarError('privateBooking.restore.error'));
      }
    }
    dispatch(privateBookingCreateOrUpdateActions.isLoading(false));
  };
}

export const setPrivateBookingUnpaidActions = {
  error: createAction('PRIVATE_BOOKING/SET_UNPAID/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/SET_UNPAID/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/SET_UNPAID/SUCCESS'),
};

export function setPrivateBookingUnpaid(
  id: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(setPrivateBookingUnpaidActions.isLoading(true));
    dispatch(setPrivateBookingUnpaidActions.error(null));
    try {
      const response = await setPrivateBookingUnpaidAPI(id);
      const updatedBooking = response.data;
      dispatch(setPrivateBookingUnpaidActions.success(updatedBooking));

      // Fetch the newly created unpaid pass
      if (updatedBooking.private_consumer_pass) {
        // Fetch the private consumer pass details to get the updated information
        dispatch(
          fetchPrivateConsumerPass(updatedBooking.private_consumer_pass),
        );
      }

      if (options && options.onSuccess) options.onSuccess();
      dispatch(snackbarSuccess('privateBooking.setUnpaid.success'));
    } catch (error) {
      dispatch(setPrivateBookingUnpaidActions.error(error));
      if (options && options.onError) options.onError();
      dispatch(snackbarError('privateBooking.setUnpaid.error'));
    }
    dispatch(setPrivateBookingUnpaidActions.isLoading(false));
  };
}

export const privateBookingDeleteActions = {
  error: createAction('PRIVATE_BOOKING/DELETE/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/DELETE/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/DELETE/SUCCESS'),
};

export function deletePrivateBooking(
  id: number,
  data: { force_refund: boolean; send_mail: boolean },
  options: OptionCallback<number>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingDeleteActions.isLoading(true));
    dispatch(privateBookingDeleteActions.error(null));
    try {
      await deletePrivateBookingAPI(id);
      dispatch(privateBookingDeleteActions.success(id));
      if (options && options.onSuccess) options.onSuccess(id);
    } catch (err) {
      console.error(err);
      dispatch(privateBookingDeleteActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingDeleteActions.isLoading(false));
  };
}

export const listRecurrenceRulePrivateBookingActions = {
  isLoading: createAction('RECURENCE_RULE_PRIVATE_BOOKING/LIST/IS_LOADING'),
  error: createAction('RECURENCE_RULE_PRIVATE_BOOKING/LIST/ERROR'),
  success: createAction('RECURENCE_RULE_PRIVATE_BOOKING/LIST/SUCCESS'),
};

export function fetchRecurrenceRulePrivateBooking(
  params: any,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(listRecurrenceRulePrivateBookingActions.isLoading(true));
    dispatch(listRecurrenceRulePrivateBookingActions.error(null));
    try {
      const response = await fetchRecurrenceRulePrivateBookingListAPI(params);
      dispatch(listRecurrenceRulePrivateBookingActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listRecurrenceRulePrivateBookingActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(listRecurrenceRulePrivateBookingActions.isLoading(false));
  };
}

export const createOrUpdateRecurrenceRulePrivateBookingActions = {
  error: createAction('RECURENCE_RULE_PRIVATE_BOOKING/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction(
    'RECURENCE_RULE_PRIVATE_BOOKING/CREATE_OR_UPDATE/IS_LOADING',
  ),
  success: createAction(
    'RECURENCE_RULE_PRIVATE_BOOKING/CREATE_OR_UPDATE/SUCCESS',
  ),
};

export function createOrUpdateRecurrenceRulePrivateBooking(
  data: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdateRecurrenceRulePrivateBookingActions.isLoading(true));
    dispatch(createOrUpdateRecurrenceRulePrivateBookingActions.error(null));
    try {
      const response = await createOrUpdateRecurrenceRulePrivateBookingAPI(
        data,
      );
      dispatch(
        createOrUpdateRecurrenceRulePrivateBookingActions.success(
          response.data,
        ),
      );
      dispatch(snackbarSuccess('privateRecurrentRule.createOrUpdate.success'));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      if (err && err.response && err.response.status === 423) {
        dispatch(snackbarWarning('privateRecurrentRule.createOrUpdate.locked'));
      } else {
        dispatch(createOrUpdateRecurrenceRulePrivateBookingActions.error(err));
      }
      if (options && options.onError) options.onError(err);
    }
    dispatch(
      createOrUpdateRecurrenceRulePrivateBookingActions.isLoading(false),
    );
  };
}

export const deleteRecurrenceRulePrivateBookingActions = {
  isLoading: createAction('RECURENCE_RULE_PRIVATE_BOOKING/DELETE/IS_LOADING'),
  error: createAction('RECURENCE_RULE_PRIVATE_BOOKING/DELETE/ERROR'),
  success: createAction('RECURENCE_RULE_PRIVATE_BOOKING/DELETE/SUCCESS'),
};

export function deleteRecurrenceRulePrivateBooking(
  id: number,
  data: { cancel_related_bookings: boolean },
  options: OptionCallback<number>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteRecurrenceRulePrivateBookingActions.isLoading(true));
    dispatch(deleteRecurrenceRulePrivateBookingActions.error(null));
    try {
      await deleteRecurrenceRulePrivateBookingAPI(id, data);
      dispatch(deleteRecurrenceRulePrivateBookingActions.success(id));
      dispatch(snackbarSuccess('privateRecurrentRule.delete.success'));
      if (options && options.onSuccess) options.onSuccess(id);
    } catch (error) {
      console.error(error);
      dispatch(deleteRecurrenceRulePrivateBookingActions.error(error));
      dispatch(snackbarError('privateRecurrentRule.delete.error'));
      if (options && options.onError) options.onError(error);
    }
    dispatch(deleteRecurrenceRulePrivateBookingActions.isLoading(false));
  };
}

export const fetchPrivatePassMassExtensionListActions = {
  isLoading: createAction<boolean>('PRIVATE_PASS/MASS_EXTENSION/LOADING'),
  error: createAction<Error | null>('PRIVATE_PASS/MASS_EXTENSION/ERROR'),
  success: createAction<PaginatedResponse<PrivatePassMassExtension>>(
    'PRIVATE_PASS/MASS_EXTENSION/SUCCESS',
  ),
};

/**
 * Fetch the list of mass extensions for a specific private pass
 * @param params Object containing the required `private_pass` ID + optional pagination params
 */
export function fetchPrivatePassMassExtensionList(
  params: PrivatePassMassExtensionParams,
  options?: OptionCallback<PaginatedResponse<PrivatePassMassExtension>>,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchPrivatePassMassExtensionListActions.isLoading(true));
    dispatch(fetchPrivatePassMassExtensionListActions.error(null));

    const page = getState().privateService.privatePass.massExtension.page ?? 1;
    try {
      const response = await fetchPrivatePassMassExtensionListAPI({
        ...params,
        page: params.page ?? page,
        page_size: PRIVATE_PASS_MASS_EXTENSION_PAGE_SIZE,
      });

      dispatch(fetchPrivatePassMassExtensionListActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(fetchPrivatePassMassExtensionListActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(fetchPrivatePassMassExtensionListActions.isLoading(false));
    }
  };
}

export const createPrivatePassMassExtensionActions = {
  isLoading: createAction<boolean>(
    'PRIVATE_PASS/MASS_EXTENSION/CREATE/LOADING',
  ),
  error: createAction<Error | null>('PRIVATE_PASS/MASS_EXTENSION/CREATE/ERROR'),
};

/**
 * Create an extension for a private pass
 * @param data The payload sent for the creation of the extension
 */
export function createPrivatePassMassExtension(
  data: PrivatePassMassExtensionCreate,
  options?: OptionCallback<PrivatePassMassExtension>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createPrivatePassMassExtensionActions.isLoading(true));
    dispatch(createPrivatePassMassExtensionActions.error(null));
    try {
      const response = await createPrivatePassMassExtensionAPI(data);

      options?.onSuccess?.(response.data);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask<PrivatePassMassExtension>(backgroundTaskUuid, {
          // @ts-expect-error
          onSuccess: options?.onSuccess,
        }),
      );
    } catch (error) {
      console.error(error);
      dispatch(createPrivatePassMassExtensionActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(createPrivatePassMassExtensionActions.isLoading(false));
    }
  };
}

export const deletePrivatePassMassExtensionActions = {
  isLoading: createAction<boolean>(
    'PRIVATE_PASS/MASS_EXTENSION/DELETE/LOADING',
  ),
  error: createAction<Error | null>('PRIVATE_PASS/MASS_EXTENSION/DELETE/ERROR'),
};

/**
 * Delete a private pass extension
 * @param id The ID of the extension to delete
 */
export function deletePrivatePassMassExtension(
  id: number,
  options?: OptionCallback<number>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePrivatePassMassExtensionActions.isLoading(true));
    dispatch(deletePrivatePassMassExtensionActions.error(null));
    try {
      const response = await deletePrivatePassMassExtensionAPI(id);

      options?.onSuccess?.(id);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask<number>(backgroundTaskUuid, {
          // @ts-expect-error
          onSuccess: options?.onSuccess,
        }),
      );
    } catch (error) {
      console.error(error);
      dispatch(deletePrivatePassMassExtensionActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(deletePrivatePassMassExtensionActions.isLoading(false));
    }
  };
}

export const fetchPrivateConsumerPassExtensionListActions = {
  isLoading: createAction<boolean>(
    'PRIVATE_CONSUMER_PASS/EXTENSION_LIST/LOADING',
  ),
  error: createAction<Error | null>(
    'PRIVATE_CONSUMER_PASS/EXTENSION_LIST/ERROR',
  ),
  success: createAction<PaginatedResponse<PrivateConsumerPassExtension>>(
    'PRIVATE_CONSUMER_PASS/EXTENSION_LIST/SUCCESS',
  ),
};

/**
 * Fetch the list of extensions for a specific private consumer pass
 * @param params Object containing the required `private_consumer_pass` ID + optional pagination params
 */
export function fetchPrivateConsumerPassExtensionList(
  params: PrivateConsumerPassExtensionParams,
  options?: OptionCallback<PaginatedResponse<PrivateConsumerPassExtension>>,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchPrivateConsumerPassExtensionListActions.isLoading(true));
    dispatch(fetchPrivateConsumerPassExtensionListActions.error(null));

    const page =
      getState().privateService.privateConsumerPass.extension.page ?? 1;
    try {
      const response = await fetchPrivateConsumerPassExtensionListAPI({
        ...params,
        page: params.page ?? page,
        page_size: PRIVATE_CONSUMER_PASS_EXTENSION_PAGE_SIZE,
      });

      dispatch(
        fetchPrivateConsumerPassExtensionListActions.success(response.data),
      );
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(fetchPrivateConsumerPassExtensionListActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(fetchPrivateConsumerPassExtensionListActions.isLoading(false));
    }
  };
}

export const createPrivateConsumerPassExtensionActions = {
  isLoading: createAction<boolean>(
    'PRIVATE_CONSUMER_PASS/EXTENSION/CREATE/LOADING',
  ),
  error: createAction<Error | null>(
    'PRIVATE_CONSUMER_PASS/EXTENSION/CREATE/ERROR',
  ),
};

/**
 * Create an extension for a private consumer pass
 * @param data The payload sent for the creation of the extension
 */
export function createPrivateConsumerPassExtension(
  data: PrivateConsumerPassExtensionCreate,
  options?: OptionCallback<PrivateConsumerPassExtension>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createPrivateConsumerPassExtensionActions.isLoading(true));
    dispatch(createPrivateConsumerPassExtensionActions.error(null));
    try {
      const response = await createPrivateConsumerPassExtensionAPI(data);

      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(createPrivateConsumerPassExtensionActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(createPrivateConsumerPassExtensionActions.isLoading(false));
    }
  };
}

export const deletePrivateConsumerPassExtensionActions = {
  isLoading: createAction<boolean>(
    'PRIVATE_CONSUMER_PASS/EXTENSION/DELETE/LOADING',
  ),
  error: createAction<Error | null>(
    'PRIVATE_CONSUMER_PASS/EXTENSION/DELETE/ERROR',
  ),
};

/**
 * Delete a private consumer pass extension
 * @param id The ID of the extension to delete
 */
export function deletePrivateConsumerPassExtension(
  id: number,
  options?: OptionCallback<number>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePrivateConsumerPassExtensionActions.isLoading(true));
    dispatch(deletePrivateConsumerPassExtensionActions.error(null));
    try {
      await deletePrivateConsumerPassExtensionAPI(id);

      options?.onSuccess?.(id);
    } catch (error) {
      console.error(error);
      dispatch(deletePrivateConsumerPassExtensionActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(deletePrivateConsumerPassExtensionActions.isLoading(false));
    }
  };
}

export const createOrUpdateCustomEventActions = {
  error: createAction('CUSTOM_EVENT/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('CUSTOM_EVENT/CREATE_OR_UPDATE/LOADING'),
  success: createAction('CUSTOM_EVENT/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateCustomEvent(data: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdateCustomEventActions.isLoading(true));
    dispatch(createOrUpdateCustomEventActions.error(null));
    try {
      const response = await createOrUpdateCustomEventAPI(data);
      dispatch(createOrUpdateCustomEventActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(createOrUpdateCustomEventActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createOrUpdateCustomEventActions.isLoading(false));
  };
}

export const listCustomEventActions = {
  error: createAction('CUSTOM_EVENT/LIST/ERROR'),
  isLoading: createAction('CUSTOM_EVENT/LIST/LOADING'),
  success: createAction('CUSTOM_EVENT/LIST/SUCCESS'),
  reset: createAction('CUSTOM_EVENT/LIST/RESET'),
};

export const resetCustomEvent = listCustomEventActions.reset;

export function fetchCustomEventList(
  params: any = {},
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listCustomEventActions.isLoading(true));
    dispatch(listCustomEventActions.error(null));
    try {
      const response = await fetchCustomEventListAPI(params);
      dispatch(listCustomEventActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listCustomEventActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(listCustomEventActions.isLoading(false));
  };
}

export const deleteCustomEventActions = {
  error: createAction('CUSTOM_EVENT/DELETE/ERROR'),
  isLoading: createAction('CUSTOM_EVENT/DELETE/LOADING'),
  success: createAction('CUSTOM_EVENT/DELETE/SUCCESS'),
};

export function deleteCustomEvent(id: number, options: OptionCallback<number>) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteCustomEventActions.isLoading(true));
    dispatch(deleteCustomEventActions.error(null));
    try {
      await deleteCustomEventAPI(id);
      dispatch(deleteCustomEventActions.success(id));
      if (options && options.onSuccess) options.onSuccess(id);
    } catch (err) {
      console.error(err);
      dispatch(deleteCustomEventActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deleteCustomEventActions.isLoading(false));
  };
}

export const listPrivateConsumerPassCompatibleActions = {
  isLoading: createAction('PRIVATE_CONSUMER_PASS/COMPATIBLE_LIST/IS_LOADING'),
  error: createAction('PRIVATE_CONSUMER_PASS/COMPATIBLE_LIST/ERROR'),
  success: createAction('PRIVATE_CONSUMER_PASS/COMPATIBLE_LIST/SUCCESS'),
  reset: createAction('PRIVATE_CONSUMER_PASS/COMPATIBLE_LIST/RESET'),
};

export function fetchPrivateConsumerPassCompatibleList(
  params: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPrivateConsumerPassCompatibleActions.isLoading(true));
    dispatch(listPrivateConsumerPassCompatibleActions.error(null));
    try {
      const response = await fetchPrivateConsumerPassCompatibleListAPI(params);
      dispatch(listPrivateConsumerPassCompatibleActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(listPrivateConsumerPassCompatibleActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(listPrivateConsumerPassCompatibleActions.isLoading(false));
  };
}

export const forceRegularizeUnpaidActions = {
  isLoading: createAction(
    'PRIVATE_CONSUMER_PASS/FORCE_REGULARIZE_UNPAID/IS_LOADING',
  ),
  error: createAction('PRIVATE_CONSUMER_PASS/FORCE_REGULARIZE_UNPAID/ERROR'),
  success: createAction(
    'PRIVATE_CONSUMER_PASS/FORCE_REGULARIZE_UNPAID/SUCCESS',
  ),
};

export function forceRegularizeUnpaid(
  member?: number,
  private_consumer_pass?: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(forceRegularizeUnpaidActions.isLoading(true));
    dispatch(forceRegularizeUnpaidActions.error(null));
    try {
      const response = await forceRegularizeUnpaidAPI(
        member,
        private_consumer_pass,
      );
      dispatch(forceRegularizeUnpaidActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(forceRegularizeUnpaidActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(forceRegularizeUnpaidActions.isLoading(false));
  };
}

export const listAllPrivatePassCategoryActions = {
  isLoading: createAction('PRIVATE_PASS_CATEGORY/LIST/IS_LOADING'),
  error: createAction('PRIVATE_PASS_CATEGORY/LIST/ERROR'),
  success: createAction('PRIVATE_PASS_CATEGORY/LIST/SUCCESS'),
};

export function fetchAllPrivatePassCategory(
  companyId?: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listAllPrivatePassCategoryActions.error(null));
    dispatch(listAllPrivatePassCategoryActions.isLoading(true));
    try {
      const response = await fetchAllPrivatePassCategoryAPI({ companyId });
      const privatePasses = response.data;
      dispatch(listAllPrivatePassCategoryActions.success(privatePasses));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listAllPrivatePassCategoryActions.error(err));
    }
    dispatch(listAllPrivatePassCategoryActions.isLoading(false));
  };
}

export const updatePrivatePassCategoryOrderActions = {
  isLoading: createAction('PRIVATE_PASS_CATEGORY/UPDATE_ORDER/IS_LOADING'),
  error: createAction('PRIVATE_PASS_CATEGORY/UPDATE_ORDER/ERROR'),
  success: createAction('PRIVATE_PASS_CATEGORY/UPDATE_ORDER/SUCCESS'),
};

export function updatePrivatePassCategoryOrder(
  data: Array<{ id: number; category_ordering: number }>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePrivatePassCategoryOrderActions.isLoading(true));
    try {
      const response = await editCategoryOrder(data);
      dispatch(updatePrivatePassCategoryOrderActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`paymentPack.category.update.error`));
      dispatch(
        updatePrivatePassCategoryOrderActions.error(error.response.data),
      );
      if (options && options.onError) options.onError();
    }
    dispatch(updatePrivatePassCategoryOrderActions.isLoading(false));
  };
}

export const upsertPrivatePassCategoryActions = {
  isLoading: createAction('PRIVATE_PASS_CATEGORY/UPSERT/IS_LOADING'),
  error: createAction('PRIVATE_PASS_CATEGORY/UPSERT/ERROR'),
  success: createAction('PRIVATE_PASS_CATEGORY/UPSERT/SUCCESS'),
};

export function upsertPrivatePassCategory(
  category: PrivatePassCategory,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertPrivatePassCategoryActions.isLoading(true));
    dispatch(upsertPrivatePassCategoryActions.error(null));
    const kind = category.id ? 'update' : 'create';
    try {
      const response = category.id
        ? await updatePrivatePassCategoryAPI(category)
        : await createPrivatePassCategoryAPI(category);
      dispatch(upsertPrivatePassCategoryActions.success(response.data));
      dispatch(snackbarSuccess(`paymentPack.category.${kind}.success`));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`paymentPack.category.${kind}.error`));
      dispatch(upsertPrivatePassCategoryActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(upsertPrivatePassCategoryActions.isLoading(false));
  };
}

export const deletePrivatePassCategoryActions = {
  error: createAction('PRIVATE_PASS_CATEGORY/DELETE/ERROR'),
  isLoading: createAction('PRIVATE_PASS_CATEGORY/DELETE/IS_LOADING'),
  success: createAction('PRIVATE_PASS_CATEGORY/DELETE/SUCCESS'),
};

export function deletePrivatePassCategory(
  category: PrivatePassCategoryWithPasses,
  options?: OptionCallback<PrivatePassCategoryWithPasses>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePrivatePassCategoryActions.isLoading(true));
    try {
      await deletePrivatePassCategoryAPI(category);
      dispatch(deletePrivatePassCategoryActions.success(category));
      dispatch(snackbarSuccess('paymentPack.category.delete.success'));
      if (options && options.onSuccess) options.onSuccess(category);
    } catch (_error) {
      dispatch(deletePrivatePassCategoryActions.error(category));
      dispatch(snackbarError('paymentPack.category.delete.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(deletePrivatePassCategoryActions.isLoading(false));
  };
}

export const listPrivatePassTemplateActions = {
  isLoading: createAction('PRIVATE_PASS_TEMPLATE/LIST/IS_LOADING'),
  error: createAction('PRIVATE_PASS_TEMPLATE/LIST/ERROR'),
  success: createAction<PrivatePassTemplateAPI[]>(
    'PRIVATE_PASS_TEMPLATE/BULK/SUCCESS',
  ),
  bulkSuccess: createAction('PRIVATE_PASS_TEMPLATE/LIST/SUCCESS'),
};

export function fetchPrivatePassTemplateList(
  params?: FranchiseProductTemplateQueryParams,
  options?: OptionCallback<PrivatePassTemplate[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPrivatePassTemplateActions.error(null));
    dispatch(listPrivatePassTemplateActions.isLoading(true));
    try {
      const response = await fetchPrivatePassTemplateListAPI(params);
      dispatch(
        listPrivatePassTemplateActions.success(
          // @ts-expect-error
          response.data.results || response.data,
        ),
      );

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results || response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPrivatePassTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(listPrivatePassTemplateActions.isLoading(false));
  };
}
export function fetchPrivatePassTemplateBulk(
  params: { id__in: number[] },
  options?: OptionCallback<PrivatePassTemplateAPI[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPrivatePassTemplateActions.error(null));
    dispatch(listPrivatePassTemplateActions.isLoading(true));
    try {
      const response = await fetchPrivatePassTemplateBulkAPI(params);
      dispatch(listPrivatePassTemplateActions.bulkSuccess(response.data));

      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listPrivatePassTemplateActions.error(err));
      options?.onError?.(err);
    }
    dispatch(listPrivatePassTemplateActions.isLoading(false));
  };
}

export const createOrUpdatePrivatePassTemplateActions = {
  isLoading: createAction('PRIVATE_PASS_TEMPLATE/CREATE_OR_UPDATE/IS_LOADING'),
  error: createAction('PRIVATE_PASS_TEMPLATE/CREATE_OR_UPDATE/ERROR'),
  success: createAction('PRIVATE_PASS_TEMPLATE/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdatePrivatePassTemplate(
  data: any = {},
  options?: OptionCallback<PrivatePassTemplateAPI>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdatePrivatePassTemplateActions.error(null));
    dispatch(createOrUpdatePrivatePassTemplateActions.isLoading(true));
    try {
      const response = await createOrUpdatePrivatePassTemplateAPI(data);
      dispatch(createOrUpdatePrivatePassTemplateActions.success(response.data));

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(createOrUpdatePrivatePassTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createOrUpdatePrivatePassTemplateActions.isLoading(false));
  };
}

export const retrievePrivatePassTemplateActions = {
  isLoading: createAction('PRIVATE_PASS_TEMPLATE/RETRIEVE/IS_LOADING'),
  error: createAction('PRIVATE_PASS_TEMPLATE/RETRIEVE/ERROR'),
  success: createAction('PRIVATE_PASS_TEMPLATE/RETRIEVE/SUCCESS'),
};

export function retrievePrivatePassTemplate(
  id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrievePrivatePassTemplateActions.error(null));
    dispatch(retrievePrivatePassTemplateActions.isLoading(true));
    try {
      const response = await retrievePrivatePassTemplateAPI(id);
      dispatch(retrievePrivatePassTemplateActions.success(response.data));

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrievePrivatePassTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(retrievePrivatePassTemplateActions.isLoading(false));
  };
}

export const deletePrivatePassTemplateActions = {
  isLoading: createAction('PRIVATE_PASS_TEMPLATE/DELETE/IS_LOADING'),
  error: createAction('PRIVATE_PASS_TEMPLATE/DELETE/ERROR'),
  success: createAction('PRIVATE_PASS_TEMPLATE/DELETE/SUCCESS'),
};

export const restorePrivatePassTemplateActions = {
  isLoading: createAction<boolean>('PRIVATE_PASS_TEMPLATE/RESTORE/IS_LOADING'),
  error: createAction<Error | null>('PRIVATE_PASS_TEMPLATE/RESTORE/ERROR'),
  success: createAction<PrivatePassTemplateAPI>(
    'PRIVATE_PASS_TEMPLATE/RESTORE/SUCCESS',
  ),
};

export function deletePrivatePassTemplate(
  id: number,
  options?: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePrivatePassTemplateActions.error(null));
    dispatch(deletePrivatePassTemplateActions.isLoading(true));
    try {
      const response = await deletePrivatePassTemplateAPI(id);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            options?.onBackgroundSuccess?.();
            dispatch(deletePrivatePassTemplateActions.success(id));
          },
          onError: options?.onBackgroundError,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(deletePrivatePassTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deletePrivatePassTemplateActions.isLoading(false));
  };
}

export function restorePrivatePassTemplate(
  id: number,
  options?: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(restorePrivatePassTemplateActions.error(null));
    dispatch(restorePrivatePassTemplateActions.isLoading(true));
    try {
      const response = await restorePrivatePassTemplateAPI(id);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            options?.onBackgroundSuccess?.();
            dispatch(restorePrivatePassTemplateActions.success(response.data));
          },
          onError: options?.onBackgroundError,
        }),
      );
      options?.onSuccess?.();
    } catch (err) {
      dispatch(restorePrivatePassTemplateActions.error(err as Error));
      options?.onError?.(err as Error);
    } finally {
      dispatch(restorePrivatePassTemplateActions.isLoading(false));
    }
  };
}

export const createPrivatePassTemplateInstanceActions = {
  isLoading: createAction('PRIVATE_PASS_TEMPLATE_INSTANCE/CREATE/IS_LOADING'),
  error: createAction('PRIVATE_PASS_TEMPLATE_INSTANCE/CREATE/ERROR'),
  success: createAction('PRIVATE_PASS_TEMPLATE_INSTANCE/CREATE/SUCCESS'),
};

export function createPrivatePassTemplateInstance(
  data: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createPrivatePassTemplateInstanceActions.error(null));
    dispatch(createPrivatePassTemplateInstanceActions.isLoading(true));
    try {
      const response = await createPrivatePassTemplateInstanceAPI(data);
      dispatch(createPrivatePassTemplateInstanceActions.success(response.data));

      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(createPrivatePassTemplateInstanceActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createPrivatePassTemplateInstanceActions.isLoading(false));
  };
}

export const deletePrivatePassTemplateInstanceActions = {
  isLoading: createAction('PRIVATE_PASS_TEMPLATE_INSTANCE/DELETE/IS_LOADING'),
  error: createAction('PRIVATE_PASS_TEMPLATE_INSTANCE/DELETE/ERROR'),
  success: createAction('PRIVATE_PASS_TEMPLATE_INSTANCE/DELETE/SUCCESS'),
};

export function deletePrivatePassTemplateInstance(
  id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePrivatePassTemplateInstanceActions.error(null));
    dispatch(deletePrivatePassTemplateInstanceActions.isLoading(true));
    try {
      const response = await deletePrivatePassTemplateInstanceAPI(id);
      dispatch(deletePrivatePassTemplateInstanceActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(deletePrivatePassTemplateInstanceActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deletePrivatePassTemplateInstanceActions.isLoading(false));
  };
}

export const privateSlotCheckUnpaidBookingEligibilityActions = {
  error: createAction('PRIVATE_SLOT/UNPAID_BOOKING_ELIGIBILITY/ERROR'),
  isLoading: createAction('PRIVATE_SLOT/UNPAID_BOOKING_ELIGIBILITY/IS_LOADING'),
  success: createAction('PRIVATE_SLOT/UNPAID_BOOKING_ELIGIBILITY/SUCCESS'),
};

export function checkPrivateSlotUnpaidBookingEligibility(
  { privateSlotId, consumer }: { privateSlotId: number; consumer?: number },
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateSlotCheckUnpaidBookingEligibilityActions.isLoading(true));
    try {
      await checkUnpaidPrivateBookingEligilityAPI({ privateSlotId, consumer });
      dispatch(
        privateSlotCheckUnpaidBookingEligibilityActions.success(privateSlotId),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(
        privateSlotCheckUnpaidBookingEligibilityActions.error(privateSlotId),
      );
      if (options && options.onError) options.onError();
    }
    dispatch(privateSlotCheckUnpaidBookingEligibilityActions.isLoading(false));
  };
}

export function updatePrivateBooking(
  privateBookingId: number,
  data: Partial<PrivateBooking>,
  options?: OptionCallback<PrivateBooking>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingCreateOrUpdateActions.isLoading(true));
    try {
      const response = await updatePrivateBookingAPI(privateBookingId, data);
      dispatch(privateBookingCreateOrUpdateActions.success(response.data));
      dispatch(snackbarSuccess('dashboard.save.success'));
      options?.onSuccess(response.data);
    } catch (error) {
      dispatch(privateBookingCreateOrUpdateActions.error(error));
      dispatch(snackbarError('dashboard.save.error'));
      options?.onError(error);
    }
    dispatch(privateBookingCreateOrUpdateActions.isLoading(false));
  };
}

export const checkPrivateServiceTagEligibilityActions = {
  success: createAction('PRIVATE_SERVICE/TAG_ELIGIBILITY/SUCCESS'),
  error: createAction('PRIVATE_SERVICE/TAG_ELIGIBILITY/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/TAG_ELIGIBILITY/IS_LOADING'),
};

export function checkPrivateServiceTagEligibility(
  privateServiceId: number,
  memberId?: number,
  options?: OptionCallback<boolean>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(checkPrivateServiceTagEligibilityActions.isLoading(true));
    dispatch(checkPrivateServiceTagEligibilityActions.error(null));

    try {
      const response = await checkPrivateServiceTagEligibilityAPI(
        privateServiceId,
        memberId,
      );
      if (response.status === 200) {
        if (options && options.onSuccess) {
          options.onSuccess(response.data.eligible);
        }
        dispatch(
          checkPrivateServiceTagEligibilityActions.success({
            id: privateServiceId,
            is_eligible: response.data.eligible,
          }),
        );
      }
    } catch (error) {
      dispatch(checkPrivateServiceTagEligibilityActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(checkPrivateServiceTagEligibilityActions.isLoading(false));
  };
}
