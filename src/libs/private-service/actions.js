// @flow

import { createAction } from 'redux-actions';

import {
  // availability-slot
  fetchAvailabilitySlots as fetchAvailabilitySlotsAPI,
  fetchPrivateBookings as fetchPrivateBookingsAPI,
  disableCoachAvailabilitySlot as disableCoachAvailabilitySlotAPI,
  enableCoachAvailabilitySlot as enableCoachAvailabilitySlotAPI,
  searchAvailableSlots as searchAvailableSlotsAPI,
  // private-service
  fetchAllPrivateServices as fetchAllPrivateServicesAPI,
  fetchPrivateService as fetchPrivateServiceAPI,
  createOrUpdatePrivateService as createOrUpdatePrivateServiceAPI,
  deletePrivateService as deletePrivateServiceAPI,
  // private-coach
  createPrivateCoach as createPrivateCoachAPI,
  deletePrivateCoach as deletePrivateCoachAPI,
  createPrivateEstablishment as createPrivateEstablishmentAPI,
  deletePrivateEstablishment as deletePrivateEstablishmentAPI,
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
  // private-booking
  fetchPrivateBookingPreview as fetchPrivateBookingPreviewAPI,
  registerPrivateBookings as registerPrivateBookingsAPI,
  disablePrivateBooking as disablePrivateBookingAPI,
} from './api';

import type { Dispatch, ThunkAction } from '../../state/types';

export const availabilitySlotListActions = {
  error: createAction('AVAILABILITY_SLOT/LIST/ERROR'),
  isLoading: createAction('AVAILABILITY_SLOT/LIST/IS_LOADING'),
  success: createAction('AVAILABILITY_SLOT/LIST/SUCCESS'),
};

export function fetchAvailabilitySlots(params: any): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availabilitySlotListActions.isLoading(true));
    dispatch(availabilitySlotListActions.error(null));
    try {
      const response = await fetchAvailabilitySlotsAPI(params);
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

export function enableCoachAvailabilitySlot(
  coach: number,
  {
    date_start,
    date_end,
    recurrence_until,
    all_date_start,
  }: { date_start: string, date_end: string, recurrence_until?: string },
  options: ?{ onSuccess: () => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availabilitySlotUpdateActions.isLoading(true));
    dispatch(availabilitySlotUpdateActions.error(null));
    try {
      await enableCoachAvailabilitySlotAPI(coach, {
        date_start,
        date_end,
        recurrence_until,
        all_date_start,
      });
      dispatch(availabilitySlotUpdateActions.success());
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(availabilitySlotListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(availabilitySlotUpdateActions.isLoading(false));
  };
}

export function disableCoachAvailabilitySlot(
  coach: number,
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
      await disableCoachAvailabilitySlotAPI(coach, {
        date_start,
        date_end,
        recurrence_until,
        all_date_start,
      });
      dispatch(availabilitySlotUpdateActions.success());
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(availabilitySlotListActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(availabilitySlotUpdateActions.isLoading(false));
  };
}

export const privateServiceListActions = {
  error: createAction('PRIVATE_SERVICE/LIST/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/LIST/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/LIST/SUCCESS'),
};

export function fetchAllPrivateServices(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceListActions.isLoading(true));
    dispatch(privateServiceListActions.error(null));
    try {
      const response = await fetchAllPrivateServicesAPI();
      dispatch(privateServiceListActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privateServiceListActions.error(null));
    }
    dispatch(privateServiceListActions.isLoading(false));
  };
}

export const privateServiceRetrieveActions = {
  error: createAction('PRIVATE_SERVICE/RETRIEVE/ERROR'),
  isLoading: createAction('PRIVATE_SERVICE/RETRIEVE/IS_LOADING'),
  success: createAction('PRIVATE_SERVICE/RETRIEVE/SUCCESS'),
};

export function fetchPrivateService(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateServiceRetrieveActions.isLoading(true));
    dispatch(privateServiceRetrieveActions.error(null));
    try {
      const response = await fetchPrivateServiceAPI(id);
      dispatch(privateServiceRetrieveActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privateServiceRetrieveActions.error(null));
    }
    dispatch(privateServiceRetrieveActions.isLoading(false));
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
  associatedCoachId: number,
  date: string,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availabilitySlotSearchActions.isLoading(true));
    dispatch(availabilitySlotSearchActions.error(null));
    try {
      const response = await searchAvailableSlotsAPI(
        privateServiceId,
        privateSlotId,
        associatedCoachId,
        date,
      );
      dispatch(availabilitySlotSearchActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(availabilitySlotSearchActions.error(null));
    }
    dispatch(availabilitySlotSearchActions.isLoading(false));
  };
}

export const privatePassListActions = {
  error: createAction('PRIVATE_PASS/LIST/ERROR'),
  isLoading: createAction('PRIVATE_PASS/LIST/IS_LOADING'),
  success: createAction('PRIVATE_PASS/LIST/SUCCESS'),
};

export function fetchPrivatePassList(companyId?: number) {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassListActions.isLoading(true));
    dispatch(privatePassListActions.error(null));
    try {
      const response = await fetchPrivatePassListAPI(companyId);
      dispatch(privatePassListActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(privatePassListActions.error(err));
    }
    dispatch(privatePassListActions.isLoading(false));
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

export function fetchCompatiblePrivateConsumerPass(
  privateServiceId: number,
  privateSlotId: number,
  params: any,
  options: ?{ onSuccess: () => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateConsumerPassListActions.isLoading(true));
    dispatch(privateConsumerPassListActions.error(null));
    try {
      const response = await fetchCompatiblePrivateConsumerPassAPI(
        privateServiceId,
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

export function fetchCompatiblePrivatePass(
  privateSlotId: number,
  options: ?{ onSuccess: () => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privatePassListActions.isLoading(true));
    dispatch(privatePassListActions.error(null));
    try {
      const response = await fetchCompatiblePrivatePassAPI(privateSlotId);
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
};

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

export const privateBookingRegisterActions = {
  error: createAction('PRIVATE_BOOKING/REGISTER/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/REGISTER/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/REGISTER/SUCCESS'),
};

export function registerPrivateBooking(
  params: any,
  options: ?{ onSuccess: () => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingRegisterActions.isLoading(true));
    dispatch(privateBookingRegisterActions.error(null));
    try {
      const response = await registerPrivateBookingsAPI(params);
      dispatch(privateBookingRegisterActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateBookingRegisterActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingRegisterActions.isLoading(false));
  };
}

export const privateBookingDisableActions = {
  error: createAction('PRIVATE_BOOKING/DISABLE/ERROR'),
  isLoading: createAction('PRIVATE_BOOKING/DISABLE/IS_LOADING'),
  success: createAction('PRIVATE_BOOKING/DISABLE/SUCCESS'),
};

export function disablePrivateBooking(
  id: number,
  data: { force_refund: boolean },
  options: ?{ onSuccess: () => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(privateBookingDisableActions.isLoading(true));
    dispatch(privateBookingDisableActions.error(null));
    try {
      const response = await disablePrivateBookingAPI(id, data);
      dispatch(privateBookingDisableActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(privateBookingDisableActions.error(null));
      if (options && options.onError) options.onError();
    }
    dispatch(privateBookingDisableActions.isLoading(false));
  };
}
