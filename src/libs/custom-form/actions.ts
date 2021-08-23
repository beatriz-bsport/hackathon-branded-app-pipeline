import { createAction } from 'redux-actions';
import type { Dispatch } from '../../state/types';
import { OptionCallback } from '../../state/types';
import {
  fetchAllCustomForm as fetchAllCustomFormAPI,
  fetchCustomForm as fetchCustomFormAPI,
  createCustomForm as createCustomFormAPI,
  updateCustomForm as updateCustomFormAPI,
  disableCustomForm as disableCustomFormAPI,
  restoreCustomForm as restoreCustomFormAPI,
  disableCustomFormField as disableCustomFormFieldPAI,
  restoreCustomFormField as restoreCustomFormFieldAPI,
  duplicateCustomForm as duplicateCustomFormAPI,
  fetchMemberCustomFormFilled as fetchMemberCustomFormFilledAPI,
  submitCustomForm as submitCustomFormAPI,
  fetchAllCustomFormStatistics as fetchAllCustomFormStatisticsAPI,
} from './api';
import { snackbarError, snackbarSuccess } from '../../actions/snackbar.actions';
import type { CustomForm, CustomFormFieldAnswer } from './types';

export const fetchAllCustomFormActions = {
  isLoading: createAction('CUSTOM_FORM/GET/IS_LOADING'),
  error: createAction('CUSTOM_FORM/GET/ERROR'),
  success: createAction('CUSTOM_FORM/GET/SUCCESS'),
};
export function fetchAllCustomForm(companyId?: number) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAllCustomFormActions.isLoading(true));
    dispatch(fetchAllCustomFormActions.error(null));
    try {
      const response = await fetchAllCustomFormAPI(companyId);
      dispatch(fetchAllCustomFormActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(fetchAllCustomFormActions.error(err));
    }
    dispatch(fetchAllCustomFormActions.isLoading(false));
  };
}

export const fetchCustomFormActions = {
  isLoading: createAction('CUSTOM_FORM/RETRIEVE/IS_LOADING'),
  error: createAction('CUSTOM_FORM/RETRIEVE/ERROR'),
  success: createAction('CUSTOM_FORM/RETRIEVE/SUCCESS'),
};
export function fetchCustomForm({
  customFormId,
  memberId,
  companyId,
  options,
}: {
  customFormId: number;
  memberId?: number;
  companyId?: number;
  options?: OptionCallback;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCustomFormActions.isLoading(true));
    dispatch(fetchCustomFormActions.error(null));
    try {
      const response = await fetchCustomFormAPI({
        customFormId,
        memberId,
        companyId,
      });
      dispatch(fetchCustomFormActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(fetchCustomFormActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchCustomFormActions.isLoading(false));
  };
}
export const upsertCustomFormActions = {
  isLoading: createAction('CUSTOM_FORM/UPSERT/IS_LOADING'),
  error: createAction('CUSTOM_FORM/UPSERT/ERROR'),
  success: createAction('CUSTOM_FORM/UPSERT/SUCCESS'),
};

export function upsertCustomForm(form: CustomForm, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertCustomFormActions.isLoading(true));
    dispatch(upsertCustomFormActions.error(null));
    const kind = form.id ? 'update' : 'create';
    try {
      const response = form.id
        ? await updateCustomFormAPI(form)
        : await createCustomFormAPI(form);

      dispatch(upsertCustomFormActions.success(response.data));
      dispatch(snackbarSuccess(`customForm.${kind}.success`));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`customForm.${kind}.error`));
      dispatch(upsertCustomFormActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(upsertCustomFormActions.isLoading(false));
  };
}

export const disableCustomFormActions = {
  error: createAction('CUSTOM_FORM/DISABLE/ERROR'),
  isLoading: createAction('CUSTOM_FORM/DISABLE/IS_LOADING'),
  success: createAction('CUSTOM_FORM/DISABLE/SUCCESS'),
};

export function disableCustomForm(formId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(disableCustomFormActions.isLoading(true));

    try {
      const response = await disableCustomFormAPI(formId);
      dispatch(disableCustomFormActions.success(response.data));
      dispatch(snackbarSuccess('customForm.disable.success'));
    } catch (error) {
      dispatch(disableCustomFormActions.error(formId));
      dispatch(snackbarError('customForm.disable.error'));
    }
    dispatch(disableCustomFormActions.isLoading(false));
  };
}

export const restoreCustomFormactions = {
  error: createAction('CUSTOM_FORM/RESTORE/ERROR'),
  isLoading: createAction('CUSTOM_FORM/RESTORE/IS_LOADING'),
  success: createAction('CUSTOM_FORM/RESTORE/SUCCESS'),
};

export function restoreCustomForm(formId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(restoreCustomFormactions.isLoading(true));

    try {
      const response = await restoreCustomFormAPI(formId);
      dispatch(restoreCustomFormactions.success(response.data));
      dispatch(snackbarSuccess('customForm.restore.success'));
    } catch (error) {
      dispatch(restoreCustomFormactions.error(formId));
      dispatch(snackbarError('customForm.restore.error'));
    }
    dispatch(restoreCustomFormactions.isLoading(false));
  };
}

export const disableCustomFormFieldActions = {
  error: createAction('CUSTOM_FORM_FIELD/DISABLE/ERROR'),
  isLoading: createAction('CUSTOM_FORM_FIELD/DISABLE/IS_LOADING'),
  success: createAction('CUSTOM_FORM_FIELD/DISABLE/SUCCESS'),
};

export function disableCustomFormField(formId: number, fieldId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(disableCustomFormFieldActions.isLoading(true));

    try {
      const response = await disableCustomFormFieldPAI(fieldId);
      dispatch(
        disableCustomFormFieldActions.success({ formId, data: response.data }),
      );
      dispatch(snackbarSuccess('customForm.customFormField.disable.success'));
    } catch (error) {
      dispatch(disableCustomFormFieldActions.error(fieldId));
      dispatch(snackbarError('customForm.customFormFiald.disable.error'));
    }
    dispatch(disableCustomFormFieldActions.isLoading(false));
  };
}

export const restoreCustomFormFieldActions = {
  error: createAction('CUSTOM_FORM_FIELD/RESTORE/ERROR'),
  isLoading: createAction('CUSTOM_FORM_FIELD/RESTORE/IS_LOADING'),
  success: createAction('CUSTOM_FORM_FIELD/RESTORE/SUCCESS'),
};

export function restoreCustomFormField(formId: number, fieldId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(restoreCustomFormFieldActions.isLoading(true));

    try {
      const response = await restoreCustomFormFieldAPI(fieldId);
      dispatch(
        restoreCustomFormFieldActions.success({ formId, data: response.data }),
      );
      dispatch(snackbarSuccess('customForm.customFormField.restore.success'));
    } catch (error) {
      dispatch(restoreCustomFormFieldActions.error(fieldId));
      dispatch(snackbarError('customForm.customFormField.restore.error'));
    }
    dispatch(restoreCustomFormFieldActions.isLoading(false));
  };
}

export const duplicateCustomFormActions = {
  isLoading: createAction('CUSTOM_FORM/DUPLICATE/IS_LOADING'),
  error: createAction('CUSTOM_FORM/DUPLICATE/ERROR'),
  success: createAction('CUSTOM_FORM/DUPLICATE/SUCCESS'),
};

export function duplicateCustomForm(formId: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(duplicateCustomFormActions.isLoading(true));
    dispatch(duplicateCustomFormActions.error(null));
    try {
      const response = await duplicateCustomFormAPI(formId);
      dispatch(duplicateCustomFormActions.success(response.data));
      dispatch(snackbarSuccess(`customForm.duplicate.success`));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`customForm.duplicate.error`));
      dispatch(duplicateCustomFormActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(duplicateCustomFormActions.isLoading(false));
  };
}

export const fetchMemberCustomFormFilledActions = {
  isLoading: createAction('CUSTOM_FORM_FILLED/GET/IS_LOADING'),
  error: createAction('CUSTOM_FORM_FILLED/GET/ERROR'),
  success: createAction('CUSTOM_FORM_FILLED/GET/SUCCESS'),
};
export function fetchMemberCustomFormFilled(memberId?: number) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMemberCustomFormFilledActions.isLoading(true));
    dispatch(fetchMemberCustomFormFilledActions.error(null));
    try {
      const response = await fetchMemberCustomFormFilledAPI(memberId);
      dispatch(fetchMemberCustomFormFilledActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(fetchMemberCustomFormFilledActions.error(err));
    }
    dispatch(fetchMemberCustomFormFilledActions.isLoading(false));
  };
}

export const submitCustomFormActions = {
  isLoading: createAction('CUSTOM_FORM/SUBMIT/IS_LOADING'),
  error: createAction('CUSTOM_FORM/SUBMIT/ERROR'),
  success: createAction('CUSTOM_FORM/SUBMIT/SUCCESS'),
};

export function submitCustomForm(
  form_filled: CustomFormFieldAnswer,
  companyId: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(submitCustomFormActions.isLoading(true));
    dispatch(submitCustomFormActions.error(null));
    try {
      const response = await submitCustomFormAPI(form_filled, companyId);

      dispatch(submitCustomFormActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(submitCustomFormActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(submitCustomFormActions.isLoading(false));
  };
}

export const fetchAllCustomFormStatisticsActions = {
  isLoading: createAction('CUSTOM_FORM/STAT/IS_LOADING'),
  error: createAction('CUSTOM_FORM/STAT/ERROR'),
  success: createAction('CUSTOM_FORM/STAT/SUCCESS'),
};
export function fetchAllCustomFormStatistics() {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAllCustomFormStatisticsActions.isLoading(true));
    dispatch(fetchAllCustomFormStatisticsActions.error(null));
    try {
      const response = await fetchAllCustomFormStatisticsAPI();
      dispatch(fetchAllCustomFormStatisticsActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(fetchAllCustomFormStatisticsActions.error(err));
    }
    dispatch(fetchAllCustomFormStatisticsActions.isLoading(false));
  };
}
