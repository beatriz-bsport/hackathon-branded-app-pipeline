import { createAction } from 'redux-actions';
import {
  OptionCallback,
  Dispatch,
  OptionPaginatedCallback,
} from '../../state/types';

import {
  // CADENCE
  retrieveCadence as retrieveCadenceAPI,
  fetchCadenceList as fetchCadenceListAPI,
  createCadence as createCadenceAPI,
  updateCadence as updateCadenceAPI,
  archiveCadence as archiveCadenceAPI,
  restoreCadence as restoreCadenceAPI,
  activateCadence as activateCadenceAPI,
  shutOffCadence as shutOffCadenceAPI,
  upsertCadenceConfiguration as upsertCadenceConfigurationAPI,
  // STEP
  retrieveCadenceStep as retrieveCadenceStepAPI,
  fetchCadenceStepList as fetchCadenceStepListAPI,
  updateCadenceStepCanvasPosition as updateCadenceStepCanvasPositionAPI,
  updateCadenceStepConnectedTriggerCanvasPosition as updateCadenceStepConnectedTriggerCanvasPositionAPI,
  subscribeStepToStep as subscribeStepToStepAPI,
  updateConnectedTrigger as updateConnectedTriggerAPI,
  updateCadenceStep as updateCadenceStepAPI,
  deleteCadenceStep as deleteCadenceStepAPI,
} from './api';

import type {
  Cadence,
  CadenceStep,
  CadenceQueryParams,
  CadenceStepQueryParams,
} from './types';

export const createCadenceActions = {
  isLoading: createAction('CADENCE/CREATE/IS_LOADING'),
  error: createAction('CADENCE/CREATE/ERROR'),
  success: createAction('CADENCE/CREATE/SUCCESS'),
};

export function createCadence(
  data: { name: string },
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createCadenceActions.isLoading(true));
    dispatch(createCadenceActions.error(null));

    try {
      const response = await createCadenceAPI(data);
      dispatch(createCadenceActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(createCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(createCadenceActions.isLoading(false));
  };
}

export const updateCadenceActions = {
  isLoading: createAction('CADENCE/UPDATE/IS_LOADING'),
  error: createAction('CADENCE/UPDATE/ERROR'),
  success: createAction('CADENCE/UPDATE/SUCCESS'),
};

export function updateCadence(
  id: number,
  data: { name: string },
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateCadenceActions.isLoading(true));
    dispatch(updateCadenceActions.error(null));

    try {
      const response = await updateCadenceAPI(id, data);
      dispatch(updateCadenceActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(updateCadenceActions.isLoading(false));
  };
}

export const archiveCadenceActions = {
  isLoading: createAction('CADENCE/ARCHIVE/IS_LOADING'),
  error: createAction('CADENCE/ARCHIVE/ERROR'),
  success: createAction('CADENCE/ARCHIVE/SUCCESS'),
};

export function archiveCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(archiveCadenceActions.isLoading(true));
    dispatch(archiveCadenceActions.error(null));

    try {
      const response = await archiveCadenceAPI(id);
      dispatch(archiveCadenceActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(archiveCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(archiveCadenceActions.isLoading(false));
  };
}

export const restoreCadenceActions = {
  isLoading: createAction('CADENCE/RESTORE/IS_LOADING'),
  error: createAction('CADENCE/RESTORE/ERROR'),
  success: createAction('CADENCE/RESTORE/SUCCESS'),
};

export function restoreCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(restoreCadenceActions.isLoading(true));
    dispatch(restoreCadenceActions.error(null));

    try {
      const response = await restoreCadenceAPI(id);
      dispatch(restoreCadenceActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(restoreCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(restoreCadenceActions.isLoading(false));
  };
}

export const activateCadenceActions = {
  isLoading: createAction('CADENCE/ACTIVATE/IS_LOADING'),
  error: createAction('CADENCE/ACTIVATE/ERROR'),
  success: createAction('CADENCE/ACTIVATE/SUCCESS'),
};

export function activateCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(activateCadenceActions.isLoading(true));
    dispatch(activateCadenceActions.error(null));

    try {
      const response = await activateCadenceAPI(id);
      dispatch(activateCadenceActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(activateCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(activateCadenceActions.isLoading(false));
  };
}

export const shutOffCadenceActions = {
  isLoading: createAction('CADENCE/SHUT_OFF/IS_LOADING'),
  error: createAction('CADENCE/SHUT_OFF/ERROR'),
  success: createAction('CADENCE/SHUT_OFF/SUCCESS'),
};

export function shutOffCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(shutOffCadenceActions.isLoading(true));
    dispatch(shutOffCadenceActions.error(null));

    try {
      const response = await shutOffCadenceAPI(id);
      dispatch(shutOffCadenceActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(shutOffCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(shutOffCadenceActions.isLoading(false));
  };
}

export const upsertCadenceConfigurationActions = {
  isLoading: createAction('CADENCE/SETUP_CONFIG/IS_LOADING'),
  error: createAction('CADENCE/SETUP_CONFIG/ERROR'),
  success: createAction('CADENCE/SETUP_CONFIG/SUCCESS'),
};

export function upsertCadenceConfiguration(
  id: number,
  data: any,
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertCadenceConfigurationActions.isLoading(true));
    dispatch(upsertCadenceConfigurationActions.error(null));

    try {
      const response = await upsertCadenceConfigurationAPI(id, data);
      dispatch(upsertCadenceConfigurationActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(upsertCadenceConfigurationActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(upsertCadenceConfigurationActions.isLoading(false));
  };
}
export const retrieveCadenceActions = {
  isLoading: createAction('CADENCE/RETRIEVE/IS_LOADING'),
  error: createAction('CADENCE/RETRIEVE/ERROR'),
  success: createAction('CADENCE/RETRIEVE/SUCCESS'),
};

export function retrieveCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveCadenceActions.isLoading(true));
    dispatch(retrieveCadenceActions.error(null));

    try {
      const response = await retrieveCadenceAPI(id);
      dispatch(retrieveCadenceActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(retrieveCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(retrieveCadenceActions.isLoading(false));
  };
}

export const fetchCadenceListActions = {
  isLoading: createAction('CADENCE/LIST/IS_LOADING'),
  error: createAction('CADENCE/LIST/ERROR'),
  success: createAction('CADENCE/LIST/SUCCESS'),
};

export function fetchCadenceList(
  params?: CadenceQueryParams,
  options?: OptionPaginatedCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCadenceListActions.isLoading(true));
    dispatch(fetchCadenceListActions.error(null));

    try {
      const response = await fetchCadenceListAPI(params);
      dispatch(fetchCadenceListActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchCadenceListActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(fetchCadenceListActions.isLoading(false));
  };
}

export const retrieveCadenceStepActions = {
  isLoading: createAction('CADENCE_STEP/RETRIEVE/IS_LOADING'),
  error: createAction('CADENCE_STEP/RETRIEVE/ERROR'),
  success: createAction('CADENCE_STEP/RETRIEVE/SUCCESS'),
};

export function retrieveCadenceStep(
  id: number,
  options?: OptionCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveCadenceStepActions.isLoading(true));
    dispatch(retrieveCadenceStepActions.error(null));

    try {
      const response = await retrieveCadenceStepAPI(id);
      dispatch(retrieveCadenceStepActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(retrieveCadenceStepActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(retrieveCadenceStepActions.isLoading(false));
  };
}

export const fetchCadenceStepListActions = {
  isLoading: createAction('CADENCE_STEP/LIST/IS_LOADING'),
  error: createAction('CADENCE_STEP/LIST/ERROR'),
  success: createAction('CADENCE_STEP/LIST/SUCCESS'),
};

export function fetchCadenceStepList(
  params?: CadenceStepQueryParams,
  options?: OptionPaginatedCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCadenceStepListActions.isLoading(true));
    dispatch(fetchCadenceStepListActions.error(null));

    try {
      const response = await fetchCadenceStepListAPI(params);
      dispatch(fetchCadenceStepListActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchCadenceStepListActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(fetchCadenceStepListActions.isLoading(false));
  };
}

export const updateCadenceStepCanvasPositionActions = {
  isLoading: createAction('CADENCE_STEP/UPDATE_CANVAS/IS_LOADING'),
  error: createAction('CADENCE_STEP/UPDATE_CANVAS/ERROR'),
  success: createAction('CADENCE_STEP/UPDATE_CANVAS/SUCCESS'),
};

export function updateCadenceStepCanvasPosition(
  id: number,
  position: { x: number; y: number },
  options?: OptionCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateCadenceStepCanvasPositionActions.isLoading(true));
    dispatch(updateCadenceStepCanvasPositionActions.error(null));

    try {
      const response = await updateCadenceStepCanvasPositionAPI(id, position);
      dispatch(updateCadenceStepCanvasPositionActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateCadenceStepCanvasPositionActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(updateCadenceStepCanvasPositionActions.isLoading(false));
  };
}

export const updateCadenceStepConnectedTriggerCanvasPositionActions = {
  isLoading: createAction('CADENCE_STEP/UPDATE_CT_CANVAS/IS_LOADING'),
  error: createAction('CADENCE_STEP/UPDATE_CT_CANVAS/ERROR'),
  success: createAction('CADENCE_STEP/UPDATE_CT_CANVAS/SUCCESS'),
};

export function updateCadenceStepConnectedTriggerCanvasPosition(
  id: number,
  position: { ct_uuid: string; x: number; y: number },
  options?: OptionCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      updateCadenceStepConnectedTriggerCanvasPositionActions.isLoading(true),
    );
    dispatch(
      updateCadenceStepConnectedTriggerCanvasPositionActions.error(null),
    );

    try {
      const response = await updateCadenceStepConnectedTriggerCanvasPositionAPI(
        id,
        position,
      );
      dispatch(
        updateCadenceStepConnectedTriggerCanvasPositionActions.success(
          response.data,
        ),
      );
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(
        updateCadenceStepConnectedTriggerCanvasPositionActions.error(err),
      );
      options && options.onError && options.onError();
    }

    dispatch(
      updateCadenceStepConnectedTriggerCanvasPositionActions.isLoading(false),
    );
  };
}
export const subscribeStepToStepActions = {
  isLoading: createAction('CADENCE_STEP/SUB_TO_STEP/IS_LOADING'),
  error: createAction('CADENCE_STEP/SUB_TO_STEP/ERROR'),
  success: createAction('CADENCE_STEP/SUB_TO_STEP/SUCCESS'),
};

export const updateCadenceStepActions = {
  isLoading: createAction('CADENCE_STEP/UPDATE/IS_LOADING'),
  error: createAction('CADENCE_STEP/UPDATE/ERROR'),
  success: createAction('CADENCE_STEP/UPDATE/SUCCESS'),
};

export function updateCadenceStep(
  id: number,
  data: { name: string },
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateCadenceStepActions.isLoading(true));
    dispatch(updateCadenceStepActions.error(null));

    try {
      const response = await updateCadenceStepAPI(id, data);
      dispatch(updateCadenceStepActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateCadenceStepActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(updateCadenceStepActions.isLoading(false));
  };
}
export const deleteCadenceStepActions = {
  isLoading: createAction('CADENCE_STEP/DELETE/IS_LOADING'),
  error: createAction('CADENCE_STEP/DELETE/ERROR'),
  success: createAction('CADENCE_STEP/DELETE/SUCCESS'),
};

export function deleteCadenceStep(
  id: number,
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteCadenceStepActions.isLoading(true));
    dispatch(deleteCadenceStepActions.error(null));

    try {
      const response = await deleteCadenceStepAPI(id);
      dispatch(deleteCadenceStepActions.success({ id }));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(deleteCadenceStepActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(deleteCadenceStepActions.isLoading(false));
  };
}

export function subscribeStepToStep(
  id: number,
  data: any,
  options?: OptionCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(subscribeStepToStepActions.isLoading(true));
    dispatch(subscribeStepToStepActions.error(null));

    try {
      const response = await subscribeStepToStepAPI(id, data);
      dispatch(subscribeStepToStepActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(subscribeStepToStepActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(subscribeStepToStepActions.isLoading(false));
  };
}

export function updateConnectedTrigger(
  id: number,
  data: any,
  options?: OptionCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(subscribeStepToStepActions.isLoading(true));
    dispatch(subscribeStepToStepActions.error(null));

    try {
      const response = await updateConnectedTriggerAPI(id, data);
      dispatch(subscribeStepToStepActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(subscribeStepToStepActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(subscribeStepToStepActions.isLoading(false));
  };
}
