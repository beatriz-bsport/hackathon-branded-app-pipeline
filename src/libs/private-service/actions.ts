import { createAction } from 'redux-actions';
import moment from 'moment-timezone';
import uniq from 'lodash/uniq';

import {
  snackbarSuccess,
  snackbarError,
  snackbarWarning,
} from '../../actions/snackbar.actions';

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
  // private-consumer-pass
  fetchCompatiblePrivateConsumerPass as fetchCompatiblePrivateConsumerPassAPI,
  fetchCompatiblePrivatePass as fetchCompatiblePrivatePassAPI,
  retrievePrivateConsumerPass as retrievePrivateConsumerPassAPI,
  updatePrivateConsumerPassCredits as updatePrivateConsumerPassCreditsAPI,
  fetchPrivateConsumerPassList as fetchPrivateConsumerPassListAPI,
  fetchPrivateConsumerPassCompatibleList as fetchPrivateConsumerPassCompatibleListAPI,
  // private-booking
  registerPrivateBookings as registerPrivateBookingsAPI,
  disablePrivateBooking as disablePrivateBookingAPI,
  deletePrivateBooking as deletePrivateBookingAPI,
  restorePrivateBooking as restorePrivateBookingAPI,
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
  fetchPrivatePassMassExtensions as fetchPrivatePassMassExtensionsAPI,
  createPrivatePassMassExtension as createPrivatePassMassExtensionAPI,
  deletePrivatePassMassExtension as deletePrivatePassMassExtensionAPI,
} from './api';

import { monitorBackgroundTask } from '../background-task/actions';

import { fetchAll as fetchAlerting } from '../alerting/actions';

import { Dispatch, ThunkAction, OptionCallback } from '../../state/types';
import {
  PrivateConsumerPassMassExtension,
  PrivateService,
  PrivateSlot,
} from './types';

export const privateBookingAttachCoachActions = {
  error: createAction('PRIVATE_BOOKING/ATTACH_COACH/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/ATTACH_COACH/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/ATTACH_COACH/SUCCESS'),
};

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
        options.onSuccess(response.data);
        dispatch(fetchAlerting());
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
      if (options && options.onSuccess) options.onSuccess(response.data);
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
        date_start__gte: moment().format('YYYY-MM-DD'),
        [resourceDatatype]: resourceIdentifier,
      });
      dispatch(
        availabilitySlotExistsActions.success({
          resourceDatatype,
          resourceIdentifier,
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
      if (options && options.onSuccess) options.onSuccess(response.data);
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
  reset: createAction('AVAILABILITY_SLOT/RESET/SUCCESS'),
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
  isLoading: createAction('AVAILABILITY_SLOT/UPDTAE/IS_LOADING'),
  success: createAction('AVAILABILITY_SLOT/UPDATE/SUCCESS'),
};

export function enableResourceAvailabilitySlot(
  resourceData: any,
  {
    date_start,
    date_end,
    recurrence_until,
    all_date_start,
  }: {
    date_start: string;
    date_end: string;
    recurrence_until?: string;
    all_date_start: string[];
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
      });
      dispatch(availabilitySlotUpdateActions.success());
      dispatch(availabilitySlotListActions.reset(resourceData));
      dispatch(
        fetchAvailabilitySlots({ ...resourceData, date_start, date_end }),
      );
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
  resources: {
    associated_establishment?: number;
    establishment?: number;
    associated_coach?: number;
    coach?: number;
    private_service?: number;
  }[],
  {
    date_start,
    date_end,
    recurrence_until,
    all_date_start,
  }: {
    date_start: string;
    date_end: string;
    recurrence_until?: string;
    all_date_start: string[];
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
  resourceData: any,
  {
    date_start,
    date_end,
    recurrence_until,
    all_date_start,
  }: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start: string[];
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
      });
      dispatch(availabilitySlotUpdateActions.success());
      dispatch(availabilitySlotListActions.reset(resourceData));
      dispatch(
        fetchAvailabilitySlots({ ...resourceData, date_start, date_end }),
      );
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
  resourceData: any[],
  {
    date_start,
    date_end,
    recurrence_until,
    all_date_start,
  }: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start: string[];
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
    all_date_start: string[];
  },
  options: OptionCallback,
) => disableResourceAvailabilitySlot({ coach }, obj, options);

export const enableCoachAvailabilitySlot = (
  coach: any, // TODO CHECK THIS
  obj: {
    recurrence_until?: string;
    date_start: string;
    date_end: string;
    all_date_start: string[];
  },
  options: OptionCallback,
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
      if (options && options.onSuccess) options.onSuccess(response.data);
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
      if (options && options.onSuccess) options.onSuccess(response.data);
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
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceRetrieveActions.isLoading(true));
    dispatch(privateServiceRetrieveActions.error(null));
    try {
      const response = await fetchPrivateServiceAPI(id);
      dispatch(privateServiceRetrieveActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
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
      if (options && options.onSuccess) options.onSuccess(response.data);
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
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(resourceListActions.isLoading(true));
    dispatch(resourceListActions.error(null));
    try {
      const response = await fetchResourceListAPI(params);
      dispatch(resourceListActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
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
  options?: OptionCallback,
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
          formData.append(key, value);
        }
      }

      const response = await createOrUpdatePrivateServiceAPI(formData, data.id);
      dispatch(privateServiceCreateOrUpdateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateServiceCreateOrUpdateActions.error(null));
      if (options && options.onError) options.onError();
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
      if (options && options.onSuccess) options.onSuccess(id);
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
  options: OptionCallback,
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
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    const id__in = uniq(ids);
    if (!id__in.length) return;
    dispatch(privateSlotBulkActions.isLoading(true));
    dispatch(privateSlotBulkActions.error(null));
    try {
      const response = await fetchAllPrivateSlotsAPI({ id__in });
      dispatch(privateSlotBulkActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
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
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
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

export function fetchAllPrivateSlots(params: any = {}): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateSlotListActions.isLoading(true));
    dispatch(privateSlotListActions.error(null));
    try {
      const response = await fetchAllPrivateSlotsAPI(params);
      dispatch(privateSlotListActions.all(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privateSlotListActions.error(null));
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
  success: createAction(
    'PRIVATE_SERVICE/SWITCH_HAS_OWN_AVAILABILITY_SLOT/SUCCESS',
  ),
};

export function switchServiceHasOwnAvailabilitySlots(
  privateServiceId: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(switchServiceHasOwnAvailabilitySlotsActions.isLoading(true));
    dispatch(switchServiceHasOwnAvailabilitySlotsActions.error(null));
    try {
      await switchServiceHasOwnAvailabilitySlotsAPI(privateServiceId);
      dispatch(fetchPrivateService(privateServiceId, options));
    } catch (err) {
      console.error(err);
      dispatch(switchServiceHasOwnAvailabilitySlotsActions.error(null));
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
          response.data.map((service: PrivateService) => ({
            ...service,
            slots: service.slots.map((slot: PrivateSlot) => slot.id),
          })),
        ),
      );
      dispatch(
        privateSlotListActions.success(
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
          response.data.map((service: PrivateService) => ({
            ...service,
            slots: service.slots.map((slot: PrivateSlot) => slot.id),
          })),
        ),
      );
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
  date: Array<string> | string,
  associatedEstablishmentIdList: Array<number>,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availabilitySlotSearchActions.isLoading(true));
    dispatch(availabilitySlotSearchActions.error(null));
    try {
      const dateArr = Array.isArray(date) ? date : [date];
      let result: any[] = [];

      for (let i = 0; i < dateArr.length; i += 1) {
        const response = await searchAvailableSlotsAPI(
          privateServiceId,
          privateSlotId,
          associatedCoachIdList,
          dateArr[i],
          associatedEstablishmentIdList,
        );

        result = [...result, ...response.data];
      }

      dispatch(availabilitySlotSearchActions.success(result));
      if (options && options.onSuccess) options.onSuccess(result);
    } catch (err) {
      console.error(err);
      dispatch(availabilitySlotSearchActions.error(null));
      if (options && options.onError) options.onError(err);
    }
    dispatch(availabilitySlotSearchActions.isLoading(false));
  };
}

export const privatePassListActions = {
  error: createAction('PRIVATE_PASS/LIST/ERROR'),
  isLoading: createAction('PRIVATE_PASS/LIST/IS_LOADING'),
  success: createAction('PRIVATE_PASS/LIST/SUCCESS'),
};

export function fetchPrivatePassList() {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassListActions.isLoading(true));
    dispatch(privatePassListActions.error(null));
    try {
      const response = await fetchPrivatePassListAPI();
      dispatch(privatePassListActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privatePassListActions.error(err));
    }
    dispatch(privatePassListActions.isLoading(false));
  };
}

export const privatePassBulkActions = {
  error: createAction('PRIVATE_PASS/BULK/ERROR'),
  isLoading: createAction('PRIVATE_PASS/BULK/IS_LOADING'),
  success: createAction('PRIVATE_PASS/BULK/SUCCESS'),
};

export function fetchPrivatePassBulk(ids: Array<number>) {
  return async (dispatch: Dispatch) => {
    const id__in = uniq(ids.filter((id) => !!id));
    if (!id__in.length) return;
    dispatch(privatePassBulkActions.isLoading(true));
    dispatch(privatePassBulkActions.error(null));
    try {
      const response = await fetchPrivatePassListAPI({
        id__in,
      });
      dispatch(privatePassBulkActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privatePassBulkActions.error(err));
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
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
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
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
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

export function fetchPrivatePassRetrieve(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassRetrieveActions.isLoading(true));
    dispatch(privatePassRetrieveActions.error(null));
    try {
      const response = await fetchPrivatePassRetrieveAPI(id);
      dispatch(privatePassRetrieveActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
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
      if (options && options.onSuccess) options.onSuccess(response.data);
      if (!id) {
        dispatch(fetchPrivatePassList());
      }
    } catch (err) {
      console.error(err);
      dispatch(privatePassCreateOrUpdateActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(privatePassCreateOrUpdateActions.isLoading(false));
  };
}

export const privatePassDeleteActions = {
  error: createAction('PRIVATE_PASS/DELETE/ERROR'),
  isLoading: createAction('PRIVATE_PASS/DELETE/IS_LOADING'),
  success: createAction('PRIVATE_PASS/DELETE/SUCCESS'),
};

export function deletePrivatePass(id: number, options: OptionCallback) {
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

export function restorePrivatePass(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassCreateOrUpdateActions.isLoading(true));
    dispatch(privatePassCreateOrUpdateActions.error(null));
    try {
      const response = await restorePrivatePassAPI(id);
      dispatch(privatePassCreateOrUpdateActions.success(response.data));
      dispatch(snackbarSuccess('privatePass.restore.success'));
    } catch (err) {
      console.error(err);
      dispatch(privatePassCreateOrUpdateActions.error(err));
      dispatch(snackbarError('privatePass.restore.error'));
    }
    dispatch(privatePassCreateOrUpdateActions.isLoading(false));
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
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(privateServiceCompatiblePassActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(privateServiceCompatiblePassActions.isLoading(false));
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
  options?: OptionCallback,
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
  options?: OptionCallback,
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
  options?: OptionCallback,
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

export const privateConsumerPassRetrieveActions = {
  error: createAction('PRIVATE_CONSUMER_PASS/RETRIEVE/ERROR'),
  isLoading: createAction('PRIVATE_CONSUMER_PASS/RETRIEVE/IS_LOADING'),
  success: createAction('PRIVATE_CONSUMER_PASS/RETRIEVE/SUCCESS'),
};

export function fetchPrivateConsumerPass(
  private_consumer_pass: number,
  options: OptionCallback,
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
  reset: createAction('PRIVATE_BOOKING/RESET/SUCCESS'),
};

export const resetPrivateBookings = privateBookingListActions.reset;

export function fetchPrivateBookings(
  params: any,
  options?: OptionCallback,
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
          options.onSuccess(response.data.results);
        }
      } else {
        dispatch(privateBookingListActions.success(response.data));
        if (options && options.onSuccess) {
          options.onSuccess(response.data);
        }
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
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingCreateOrUpdateActions.isLoading(true));
    dispatch(privateBookingCreateOrUpdateActions.error(null));
    try {
      const response = await registerPrivateBookingsAPI(params);
      dispatch(privateBookingCreateOrUpdateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateBookingCreateOrUpdateActions.error(null));
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
  // @ts-ignore
  data: { force_refund?: boolean; send_mail?: boolean } = {},
  options?: OptionCallback,
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

export const privateBookingDeleteActions = {
  error: createAction('PRIVATE_BOOKING/DELETE/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/DELETE/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/DELETE/SUCCESS'),
};

export function deletePrivateBooking(
  id: number,
  data: { force_refund: boolean; send_mail: boolean },
  options: OptionCallback,
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
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      if (err && err.response && err.response.status === 423) {
        dispatch(snackbarWarning('privateRecurrentRule.createOrUpdate.locked'));
      } else {
        dispatch(createOrUpdateRecurrenceRulePrivateBookingActions.error(err));
        dispatch(snackbarError('privateRecurrentRule.createOrUpdate.error'));
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
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteRecurrenceRulePrivateBookingActions.isLoading(true));
    dispatch(deleteRecurrenceRulePrivateBookingActions.error(null));
    try {
      await deleteRecurrenceRulePrivateBookingAPI(id);
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

export const listPrivateConsumerPassExtensionActions = {
  error: createAction('PRIVATE_CONSUMER_PASS_EXTENSION/LIST/ERROR'),
  isLoading: createAction('PRIVATE_CONSUMER_PASS_EXTENSION/LIST/LOADING'),
  success: createAction('PRIVATE_CONSUMER_PASS_EXTENSION/LIST/SUCCESS'),
  reset: createAction('PRIVATE_CONSUMER_PASS_EXTENSION/LIST/RESET'),
};

export const createPrivateConsumerPassExtensionActions = {
  error: createAction('PRIVATE_CONSUMER_PASS_EXTENSION/CREATE/ERROR'),
  isLoading: createAction('PRIVATE_CONSUMER_PASS_EXTENSION/CREATE/LOADING'),
  success: createAction('PRIVATE_CONSUMER_PASS_EXTENSION/CREATE/SUCCESS'),
};

export const deletePrivateConsumerPassExtensionActions = {
  error: createAction('PRIVATE_CONSUMER_PASS_EXTENSION/DELETE/ERROR'),
  isLoading: createAction('PRIVATE_CONSUMER_PASS_EXTENSION/DELETE/LOADING'),
  success: createAction('PRIVATE_CONSUMER_PASS_EXTENSION/DELETE/SUCCESS'),
};

export const privateConsumerPassMassExtensionActions = {
  isLoading: createAction('CONSUMER_PACK_MASS_EXTENSION/IS_LOADING'),
  error: createAction('CONSUMER_PACK_MASS_EXTENSION/ERROR'),
  success: createAction('CONSUMER_PACK_MASS_EXTENSION/SUCCESS'),
  create: createAction('CONSUMER_PACK_MASS_EXTENSION/CREATE'),
};

export function fetchPrivatePassMassExtensionList(
  params: {
    privatePass: number;
    page: number;
    page_size: number;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateConsumerPassMassExtensionActions.isLoading(true));
    dispatch(privateConsumerPassMassExtensionActions.error(null));
    try {
      const response = await fetchPrivatePassMassExtensionsAPI(params);
      response.data.page = params.page;
      dispatch(privateConsumerPassMassExtensionActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (e) {
      console.error(e);
      dispatch(privateConsumerPassMassExtensionActions.error(e));
      if (options && options.onError) options.onError();
    }
    dispatch(privateConsumerPassMassExtensionActions.isLoading(false));
  };
}

export function createPrivatePassMassExtension(
  data: Pick<
    PrivateConsumerPassMassExtension,
    Exclude<keyof PrivateConsumerPassMassExtension, 'id' | 'date_created'>
  >,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateConsumerPassMassExtensionActions.isLoading(true));
    dispatch(privateConsumerPassMassExtensionActions.error(null));
    try {
      const response = await createPrivatePassMassExtensionAPI(data);
      dispatch(privateConsumerPassMassExtensionActions.create(response.data));
      options && options.onSuccess && options.onSuccess();
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options.onSuccess,
        }),
      );
    } catch (e) {
      console.error(e);
      dispatch(privateConsumerPassMassExtensionActions.error(e));
      if (options && options.onError) options.onError();
    }
    dispatch(privateConsumerPassMassExtensionActions.isLoading(false));
  };
}

export function deletePrivatePassMassExtension(
  id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateConsumerPassMassExtensionActions.isLoading(true));
    try {
      const response = await deletePrivatePassMassExtensionAPI(id);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options.onSuccess,
        }),
      );
    } catch (e) {
      console.error(e);
      dispatch(privateConsumerPassMassExtensionActions.error(e));
      if (options && options.onError) options.onError();
    }
    dispatch(privateConsumerPassMassExtensionActions.isLoading(false));
  };
}

export function deletePrivateConsumerPassExtension(
  id: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePrivateConsumerPassExtensionActions.isLoading(true));
    dispatch(deletePrivateConsumerPassExtensionActions.error(null));
    try {
      await deletePrivateConsumerPassExtensionAPI(id);
      dispatch(deletePrivateConsumerPassExtensionActions.success(id));
      if (options && options.onSuccess) options.onSuccess(id);
    } catch (err) {
      console.error(err);
      dispatch(deletePrivateConsumerPassExtensionActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deletePrivateConsumerPassExtensionActions.isLoading(false));
  };
}

export function createPrivateConsumerPassExtension(
  data: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createPrivateConsumerPassExtensionActions.isLoading(true));
    dispatch(createPrivateConsumerPassExtensionActions.error(null));
    try {
      const response = await createPrivateConsumerPassExtensionAPI(data);
      dispatch(
        createPrivateConsumerPassExtensionActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(createPrivateConsumerPassExtensionActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createPrivateConsumerPassExtensionActions.isLoading(false));
  };
}

export function fetchPrivateConsumerPassExtensionList(
  privateConsumerPassId: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(listPrivateConsumerPassExtensionActions.reset());
    dispatch(listPrivateConsumerPassExtensionActions.isLoading(true));
    dispatch(listPrivateConsumerPassExtensionActions.error(null));
    try {
      const response = await fetchPrivateConsumerPassExtensionListAPI(
        privateConsumerPassId,
      );
      // TODO handle pagination
      dispatch(
        listPrivateConsumerPassExtensionActions.success(response.data.results),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPrivateConsumerPassExtensionActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(listPrivateConsumerPassExtensionActions.isLoading(false));
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
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listCustomEventActions.isLoading(true));
    dispatch(listCustomEventActions.error(null));
    try {
      const response = await fetchCustomEventListAPI(params);
      dispatch(listCustomEventActions.success(response.data));
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

export function deleteCustomEvent(id: number, options: OptionCallback) {
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
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPrivateConsumerPassCompatibleActions.isLoading(true));
    dispatch(listPrivateConsumerPassCompatibleActions.error(null));
    try {
      const response = await fetchPrivateConsumerPassCompatibleListAPI(params);
      dispatch(listPrivateConsumerPassCompatibleActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(listPrivateConsumerPassCompatibleActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(listPrivateConsumerPassCompatibleActions.isLoading(false));
  };
}
