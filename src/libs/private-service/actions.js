// @flow

import { createAction } from 'redux-actions';

import moment from 'moment';

import {
  // availability-slot
  fetchAvailabilitySlots as fetchAvailabilitySlotsAPI,
  checkExistsAvailabilitySlots as checkExistsAvailabilitySlotsAPI,
  fetchPrivateBookings as fetchPrivateBookingsAPI,
  disableResourceAvailabilitySlot as disableResourceAvailabilitySlotAPI,
  enableResourceAvailabilitySlot as enableResourceAvailabilitySlotAPI,
  searchAvailableSlots as searchAvailableSlotsAPI,
  // private-service
  fetchAllPrivateServices as fetchAllPrivateServicesAPI,
  fetchPrivateService as fetchPrivateServiceAPI,
  switchServiceHasOwnAvailabilitySlots as switchServiceHasOwnAvailabilitySlotsAPI,
  createOrUpdatePrivateService as createOrUpdatePrivateServiceAPI,
  deleteServiceGroup as deleteServiceGroupAPI,
  deletePrivateService as deletePrivateServiceAPI,
  fetchPrivateServiceResourceData as fetchPrivateServiceResourceDataAPI,
  updateResourceConfiguration as updateResourceConfigurationAPI,
  // private-coach
  createPrivateCoach as createPrivateCoachAPI,
  deletePrivateCoach as deletePrivateCoachAPI,
  createPrivateEstablishment as createPrivateEstablishmentAPI,
  deletePrivateEstablishment as deletePrivateEstablishmentAPI,
  // service-group
  fetchServiceGroupList as fetchServiceGroupListAPI,
  createOrUpdateServiceGroup as createOrUpdateServiceGroupAPI,
  // private-slot
  fetchPrivateSlotList as fetchPrivateSlotListAPI,
  fetchAllPrivateSlots as fetchAllPrivateSlotsAPI,
  fetchPrivateSlotRetrieve as fetchPrivateSlotRetrieveAPI,
  createOrUpdatePrivateSlot as createOrUpdatePrivateSlotAPI,
  deletePrivateSlot as deletePrivateSlotAPI,
  // private-pass
  fetchPrivatePassList as fetchPrivatePassListAPI,
  fetchPrivatePass as fetchPrivatePassRetrieveAPI,
  createOrUpdatePrivatePass as createOrUpdatePrivatePassAPI,
  deletePrivatePass as deletePrivatePassAPI,
  createCompatibleServicePass as createCompatibleServicePassAPI,
  deleteCompatibleServicePass as deleteCompatibleServicePassAPI,
  // private-consumer-pass
  fetchCompatiblePrivateConsumerPass as fetchCompatiblePrivateConsumerPassAPI,
  fetchCompatiblePrivatePass as fetchCompatiblePrivatePassAPI,
  retrievePrivateConsumerPass as retrievePrivateConsumerPassAPI,
  fetchPrivateConsumerPassList as fetchPrivateConsumerPassListAPI,
  // private-booking
  fetchPrivateBookingPreview as fetchPrivateBookingPreviewAPI,
  registerPrivateBookings as registerPrivateBookingsAPI,
  disablePrivateBooking as disablePrivateBookingAPI,
  deletePrivateBooking as deletePrivateBookingAPI,
  fetchCalendarEventList as fetchCalendarEventListAPI,
} from './api';

import type { Dispatch, ThunkAction } from '../../state/types';

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

export function updateResourceConfiguration(
  privateServiceId: number,
  resourceIdentifier: string,
  data: any,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateResourceConfigurationActions.isLoading(true));
    dispatch(updateResourceConfigurationActions.error(null));
    try {
      const response = await updateResourceConfigurationAPI(
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
  }: { date_start: string, date_end: string, recurrence_until?: string },
  options: OptionCallback,
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

export function disableResourceAvailabilitySlot(
  resourceData: any,
  {
    date_start,
    date_end,
    recurrence_until,
    all_date_start,
  }: { recurrence_until?: string, date_start: string, date_end: string },
  options: ?{ onSuccess: () => void, onError: ?() => void },
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

export const disableCoachAvailabilitySlot = (coach, ...args) =>
  disableResourceAvailabilitySlot({ coach }, ...args);
export const enableCoachAvailabilitySlot = (coach, ...args) =>
  enableResourceAvailabilitySlot({ coach }, ...args);

export const disablePrivateServiceAvailabilitySlot = (
  privateServiceId,
  ...args
) =>
  disableResourceAvailabilitySlot(
    { private_service: privateServiceId },
    ...args,
  );
export const enablePrivateServiceAvailabilitySlot = (
  privateServiceId,
  ...args
) =>
  enableResourceAvailabilitySlot(
    { private_service: privateServiceId },
    ...args,
  );

export const disableEstablishmentAvailabilitySlot = (establishment, ...args) =>
  disableResourceAvailabilitySlot({ establishment }, ...args);
export const enableEstablishmentAvailabilitySlot = (establishment, ...args) =>
  enableResourceAvailabilitySlot({ establishment }, ...args);

export const privateServiceMarketplaceListActions = {
  error: createAction('PRIVATE_SERVICE/MARKETPLACE_LIST/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/MARKETPLACE_LIST/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/MARKETPLACE_LIST/SUCCESS'),
};

export function fetchMarketplacePrivateServices(
  company: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceMarketplaceListActions.isLoading(true));
    dispatch(privateServiceMarketplaceListActions.error(null));
    try {
      const response = await fetchAllPrivateServicesAPI({
        company,
        available: true,
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

export function fetchAllPrivateServices(options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceListActions.isLoading(true));
    dispatch(privateServiceListActions.error(null));
    try {
      const response = await fetchAllPrivateServicesAPI();
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
  options: OptionCallback,
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

export const privateServiceResourceRetrieveActions = {
  error: createAction('PRIVATE_SERVICE/RESOURCE/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/RESOURCE/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/RESOURCE/SUCCESS'),
};

export function fetchPrivateServiceResourceData(
  id: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceResourceRetrieveActions.isLoading(true));
    dispatch(privateServiceResourceRetrieveActions.error(null));
    try {
      const response = await fetchPrivateServiceResourceDataAPI(id);
      dispatch(privateServiceResourceRetrieveActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateServiceResourceRetrieveActions.error(null));
      if (options && options.onError) options.onError(err);
    }
    dispatch(privateServiceResourceRetrieveActions.isLoading(false));
  };
}

export const privateServiceCreateOrUpdateActions = {
  error: createAction('PRIVATE_SERVICE/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdatePrivateService(
  data: any,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceCreateOrUpdateActions.isLoading(true));
    dispatch(privateServiceCreateOrUpdateActions.error(null));
    try {
      const response = await createOrUpdatePrivateServiceAPI(data);
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
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
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

export const privateCoachCreateActions = {
  error: createAction('PRIVATE_COACH/CREATE/ERROR'),
  isLoading: createAction('PRIVATE_COACH/CREATE/IS_LOADING'),
  success: createAction('PRIVATE_COACH/CREATE/SUCCESS'),
};

export function createPrivateCoach(
  associatedCoachId: number,
  privateServiceId: number,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateCoachCreateActions.isLoading(true));
    dispatch(privateCoachCreateActions.error(null));
    try {
      const response = await createPrivateCoachAPI(
        associatedCoachId,
        privateServiceId,
      );
      dispatch(privateCoachCreateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateCoachCreateActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateCoachCreateActions.isLoading(false));
  };
}

export const privateCoachDeleteActions = {
  error: createAction('PRIVATE_COACH/DELETE/ERROR'),
  isLoading: createAction('PRIVATE_COACH/DELETE/IS_LOADING'),
  success: createAction('PRIVATE_COACH/DELETE/SUCCESS'),
};

export function deletePrivateCoach(
  associatedCoachId: number,
  privateServiceId: number,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateCoachDeleteActions.isLoading(true));
    dispatch(privateCoachDeleteActions.error(null));
    try {
      const response = await deletePrivateCoachAPI(
        associatedCoachId,
        privateServiceId,
      );
      dispatch(privateCoachDeleteActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateCoachDeleteActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateCoachDeleteActions.isLoading(false));
  };
}

export const privateEstablishmentCreateActions = {
  error: createAction('PRIVATE_ESTABLISHMENT/CREATE/ERROR'),
  isLoading: createAction('PRIVATE_ESTABLISHMENT/CREATE/IS_LOADING'),
  success: createAction('PRIVATE_ESTABLISHMENT/CREATE/SUCCESS'),
};

export function createPrivateEstablishment(
  establishmentId: number,
  privateServiceId: number,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateEstablishmentCreateActions.isLoading(true));
    dispatch(privateEstablishmentCreateActions.error(null));
    try {
      const response = await createPrivateEstablishmentAPI(
        establishmentId,
        privateServiceId,
      );
      dispatch(privateEstablishmentCreateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateEstablishmentCreateActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateEstablishmentCreateActions.isLoading(false));
  };
}

export const privateEstablishmentDeleteActions = {
  error: createAction('PRIVATE_ESTABLISHMENT/DELETE/ERROR'),
  isLoading: createAction('PRIVATE_ESTABLISHMENT/DELETE/IS_LOADING'),
  success: createAction('PRIVATE_ESTABLISHMENT/DELETE/SUCCESS'),
};

export function deletePrivateEstablishment(
  establishmentId: number,
  privateServiceId: number,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateEstablishmentDeleteActions.isLoading(true));
    dispatch(privateEstablishmentDeleteActions.error(null));
    try {
      const response = await deletePrivateEstablishmentAPI(
        establishmentId,
        privateServiceId,
      );
      dispatch(privateEstablishmentDeleteActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateEstablishmentDeleteActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateEstablishmentDeleteActions.isLoading(false));
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

export function fetchPrivateSlotList(privateServiceId: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateSlotListActions.isLoading(true));
    dispatch(privateSlotListActions.error(null));
    try {
      const response = await fetchPrivateSlotListAPI(privateServiceId);
      dispatch(privateSlotListActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privateSlotListActions.error(null));
    }
    dispatch(privateSlotListActions.isLoading(false));
  };
}

export function fetchAllPrivateSlots(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateSlotListActions.isLoading(true));
    dispatch(privateSlotListActions.error(null));
    try {
      const response = await fetchAllPrivateSlotsAPI();
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
  options: ?{ onSuccess: () => void, onError: ?() => void },
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
  options: ?{ onSuccess: () => void, onError: ?() => void },
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
  options: ?{ onSuccess: () => void, onError: ?() => void },
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
  options: ?{ onSuccess: () => void, onError: ?() => void },
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
          response.data.map((service) => ({
            ...service,
            slots: service.slots.map((slot) => slot.id),
          })),
        ),
      );
      dispatch(
        privateSlotListActions.success(
          response.data.reduce(
            (acc, service) => [...acc, ...service.slots],
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
  options: ?{ onSuccess: () => void, onError: ?() => void },
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
          response.data.map((service) => ({
            ...service,
            slots: service.slots.map((slot) => slot.id),
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

export function searchAvailableSlots(
  privateServiceId: number,
  privateSlotId: number,
  associatedCoachIdList: Array<number>,
  date: string,
  associatedEstablishmentIdList: Array<number>,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availabilitySlotSearchActions.isLoading(true));
    dispatch(availabilitySlotSearchActions.error(null));
    try {
      const response = await searchAvailableSlotsAPI(
        privateServiceId,
        privateSlotId,
        associatedCoachIdList,
        date,
        associatedEstablishmentIdList,
      );
      dispatch(availabilitySlotSearchActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
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

export const serviceGroupListActions = {
  error: createAction('SERVICE_GROUP/LIST/ERROR'),
  isLoading: createAction('SERVICE_GROUP/LIST/IS_LOADING'),
  success: createAction('SERVICE_GROUP/LIST/SUCCESS'),
};

export function fetchPrivateServiceGroupList(options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(serviceGroupListActions.isLoading(true));
    dispatch(serviceGroupListActions.error(null));
    try {
      const response = await fetchServiceGroupListAPI({ mine: true });
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

export function fetchPrivatePassRetrieve(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassRetrieveActions.isLoading(true));
    dispatch(privatePassRetrieveActions.error(null));
    try {
      const response = await fetchPrivatePassRetrieveAPI(id);
      dispatch(privatePassRetrieveActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privatePassRetrieveActions.error(err));
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
  options: ?{ onSuccess: () => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassCreateOrUpdateActions.isLoading(true));
    dispatch(privatePassCreateOrUpdateActions.error(null));
    try {
      const response = await createOrUpdatePrivatePassAPI(data, id);
      dispatch(privatePassCreateOrUpdateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
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

export function deletePrivatePass(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassDeleteActions.isLoading(true));
    dispatch(privatePassDeleteActions.error(null));
    try {
      const response = await deletePrivatePassAPI(id);
      dispatch(privatePassDeleteActions.success(response.data));
      dispatch(fetchPrivatePassRetrieve(id));
    } catch (err) {
      console.error(err);
      dispatch(privatePassDeleteActions.error(err));
    }
    dispatch(privatePassDeleteActions.isLoading(false));
  };
}

export const privateServiceCompatiblePassActions = {
  error: createAction('PRIVATE_SERVICE_COMPATIBLE_PASS/ACTION/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE_COMPATIBLE_PASS/ACTION/LOADING'),
  create: createAction('PRIVATE_SERVICE_COMPATIBLE_PASS/ACTION/CREATE'),
  delete: createAction('PRIVATE_SERVICE_COMPATIBLE_PASS/ACTION/DELETE'),
};

export function deleteCompatibleServicePass(
  privatePassId: number,
  privateServiceId: number,
  options: ?{ onSuccess: () => void, onError: ?() => void },
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
  options: ?{ onSuccess: () => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceCompatiblePassActions.isLoading(true));
    dispatch(privateServiceCompatiblePassActions.error(null));
    try {
      await createCompatibleServicePassAPI(privatePassId, privateServiceId);
      dispatch(
        privateServiceCompatiblePassActions.create(
          privatePassId,
          privateServiceId,
        ),
      );
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

export const privateConsumerPassListActions = {
  error: createAction('PRIVATE_CONSUMER_PASS/LIST/ERROR'),
  isLoading: createAction('PRIVATE_CONSUMER_PASS/LIST/IS_LOADING'),
  success: createAction('PRIVATE_CONSUMER_PASS/LIST/SUCCESS'),
};

export function fetchPrivateConsumerPassList(
  params: any,
  options: ?{ onSuccess: () => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateConsumerPassListActions.isLoading(true));
    dispatch(privateConsumerPassListActions.error(null));
    try {
      const response = await fetchPrivateConsumerPassListAPI(params);
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

export function fetchCompatiblePrivateConsumerPass(
  privateSlotId: number,
  params: any,
  options: ?{ onSuccess: () => void, onError: ?() => void },
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
  options: ?{ onSuccess: () => void, onError: ?() => void },
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

export function fetchCompatiblePrivatePass(
  privateSlotId: number,
  params: any,
  options: ?{ onSuccess: () => void, onError: ?() => void },
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

export const privateBookingPreviewActions = {
  error: createAction('PRIVATE_BOOKING/PREVIEW/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/PREVIEW/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/PREVIEW/SUCCESS'),
};

export function fetchPrivateBookingPreview(
  privateSlotId: number,
  associatedCoachId: number,
  date: string,
  options: ?{ onSuccess: () => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingPreviewActions.isLoading(true));
    dispatch(privateBookingPreviewActions.error(null));
    try {
      const response = await fetchPrivateBookingPreviewAPI(
        privateSlotId,
        associatedCoachId,
        date,
      );
      dispatch(privateBookingPreviewActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateBookingPreviewActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingPreviewActions.isLoading(false));
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
  options: ?{
    onSuccess: (Array<PrivateBooking>) => void,
    onError: ?() => void,
  },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingListActions.isLoading(true));
    dispatch(privateBookingListActions.error(null));
    try {
      const response = await fetchPrivateBookingsAPI(params);
      dispatch(privateBookingListActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(privateBookingListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingListActions.isLoading(false));
  };
}

export const fetchPrivateBooking = (id: number, options: OptionCallback) =>
  fetchPrivateBookings({ id__in: [id] }, options);

export function registerPrivateBooking(
  params: any,
  options: ?{ onSuccess: () => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingCreateOrUpdateActions.isLoading(true));
    dispatch(privateBookingCreateOrUpdateActions.error(null));
    try {
      const response = await registerPrivateBookingsAPI(params);
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

export const privateBookingCreateOrUpdateActions = {
  error: createAction('PRIVATE_BOOKING/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/CREATE_OR_UPDATE/SUCCESS'),
};

export function disablePrivateBooking(
  id: number,
  data: { force_refund: boolean },
  options: ?{ onSuccess: () => void, onError: ?() => void },
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

export const privateBookingDeleteActions = {
  error: createAction('PRIVATE_BOOKING/DELETE/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/DELETE/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/DELETE/SUCCESS'),
};

export function deletePrivateBooking(
  id: number,
  data: { force_refund: boolean },
  options: ?{ onSuccess: () => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingDeleteActions.isLoading(true));
    dispatch(privateBookingDeleteActions.error(null));
    try {
      await deletePrivateBookingAPI(id);
      dispatch(privateBookingDeleteActions.success(id));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateBookingDeleteActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingDeleteActions.isLoading(false));
  };
}
