import { createAction } from 'redux-actions';
import { OptionCallback, Dispatch } from '../../state/types';
import {
  fetchAllCustomForm as fetchAllCustomFormAPI,
  fetchCustomFormBulk as fetchCustomFormBulkAPI,
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
  submitDraftCustomForm as submitDraftCustomFormAPI,
  fetchAllCustomFormStatistics as fetchAllCustomFormStatisticsAPI,
  fetchAllCustomFormAutDisplayRules as fetchAllCustomFormAutDisplayRulesAPI,
  fetchCustomFormDisplayRuleBulk as fetchCustomFormDisplayRuleBulkAPI,
  updateCustomFormDisplayRule as updateCustomFormDisplayRuleAPI,
  createCustomFormDisplayRule as createCustomFormDisplayRuleAPI,
  deleteCustomFormDisplayRule as deleteCustomFormDisplayRuleAPI,
  requestMemberCustomFormNotification as requestMemberCustomFormNotificationAPI,
  updateCustomFormLayout as updateCustomFormLayoutAPI,
  fetchCompanyCustomFormSignUp as fetchCompanyCustomFormSignUpAPI,
  fetchCompanyCustomMemberForm as fetchCompanyCustomMemberFormAPI,
  submitSignUpCustomForm as submitSignUpCustomFormAPI,
  fetchModelBasedAnswerApi,
} from './api';
import { snackbarError, snackbarSuccess } from '../snackbar/actions';
import type {
  CustomForm,
  CustomFormFieldAnswer,
  CustomFormDisplayRule,
  ResponsiveLayouts,
} from './types';

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
export const fetchCustomFormBulkActions = {
  isLoading: createAction('CUSTOM_FORM/BULK/IS_LOADING'),
  error: createAction('CUSTOM_FORM/BULK/ERROR'),
  success: createAction('CUSTOM_FORM/BULK/SUCCESS'),
};
export function fetchCustomFormBulk(params: { id__in: Array<number> }) {
  return async (dispatch: Dispatch) => {
    if (params.id__in.length === 0) {
      return;
    }
    dispatch(fetchCustomFormBulkActions.isLoading(true));
    dispatch(fetchCustomFormBulkActions.error(null));
    try {
      const response = await fetchCustomFormBulkAPI(params);
      dispatch(fetchCustomFormBulkActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(fetchCustomFormBulkActions.error(err));
    }
    dispatch(fetchCustomFormBulkActions.isLoading(false));
  };
}
export const fetchMissingCustomFormBulkActions = {
  isLoading: createAction('CUSTOM_FORM_MISSING/BULK/IS_LOADING'),
  error: createAction('CUSTOM_FORM_MISSING/BULK/ERROR'),
  success: createAction('CUSTOM_FORM_MISSING/BULK/SUCCESS'),
  reset: createAction('CUSTOM_FORM_MISSING/BULK/RESET'),
};
export function fetchMissingCustomFormBulk(params: { id__in: Array<number> }) {
  return async (dispatch: Dispatch) => {
    if (params?.id__in.length === 0) {
      return;
    }
    dispatch(fetchMissingCustomFormBulkActions.reset());
    dispatch(fetchMissingCustomFormBulkActions.isLoading(true));
    dispatch(fetchMissingCustomFormBulkActions.error(null));
    try {
      const response = await fetchCustomFormBulkAPI(params);
      dispatch(fetchMissingCustomFormBulkActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(fetchMissingCustomFormBulkActions.error(err));
    }
    dispatch(fetchMissingCustomFormBulkActions.isLoading(false));
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
      if (options && options.onError) options.onError();
      if (error.response?.status === 499 && error.response?.data?.error_code) {
        dispatch(
          snackbarError(
            `customForm.upsert.errors.${error.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError(`customForm.${kind}.error`));
      }
      dispatch(upsertCustomFormActions.error(error.response.data));
    }
    dispatch(upsertCustomFormActions.isLoading(false));
  };
}
export const updateCustomFormLayoutActions = {
  isLoading: createAction('CUSTOM_FORM_LAYOUT/UPSERT/IS_LOADING'),
  error: createAction('CUSTOM_FORM_LAYOUT/UPSERT/ERROR'),
  success: createAction('CUSTOM_FORM_LAYOUT/UPSERT/SUCCESS'),
};

export function updateCutsomFormLayout(
  params: { formId: number; layout: ResponsiveLayouts },
  options?: OptionCallback & { noSuccessMessage?: boolean },
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateCustomFormLayoutActions.isLoading(true));
    dispatch(updateCustomFormLayoutActions.error(null));
    try {
      const response = await updateCustomFormLayoutAPI(params);

      dispatch(updateCustomFormLayoutActions.success(response.data));
      if (!options?.noSuccessMessage)
        dispatch(snackbarSuccess(`customForm.update.success`));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`customForm.update.error`));
      dispatch(updateCustomFormLayoutActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(updateCustomFormLayoutActions.isLoading(false));
  };
}

export const disableCustomFormActions = {
  error: createAction('CUSTOM_FORM/DISABLE/ERROR'),
  isLoading: createAction('CUSTOM_FORM/DISABLE/IS_LOADING'),
  success: createAction('CUSTOM_FORM/DISABLE/SUCCESS'),
};

export function disableCustomForm(formId: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(disableCustomFormActions.isLoading(true));

    try {
      const response = await disableCustomFormAPI(formId);
      dispatch(disableCustomFormActions.success(response.data));
      dispatch(snackbarSuccess('customForm.disable.success'));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(disableCustomFormActions.error(formId));
      dispatch(snackbarError('customForm.disable.error'));
      if (options && options.onError) options.onError();
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
      if (options && options.onError) options.onError();
      if (error.response?.status === 499 && error.response?.data?.error_code) {
        dispatch(
          snackbarError(
            `customForm.signupViaCustomForm.errors.${error.response.data.error_code}`,
          ),
        );
        dispatch(submitCustomFormActions.error(error.response.data));
      } else {
        dispatch(snackbarError(`customForm.customFormStepper.error`));
      }

      dispatch(submitCustomFormActions.error(error?.response?.data));
    }
    dispatch(submitCustomFormActions.isLoading(false));
  };
}

export const submitCustomFormDratActions = {
  isLoading: createAction('CUSTOM_FORM_DRAFT/SUBMIT/IS_LOADING'),
  error: createAction('CUSTOM_FORM_DRAFT/SUBMIT/ERROR'),
  success: createAction('CUSTOM_FORM_DRAFT/SUBMIT/SUCCESS'),
};

export function submitCustomFormDraft(
  params: { custom_form_id: number; companyId: number },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(submitCustomFormDratActions.isLoading(true));
    dispatch(submitCustomFormDratActions.error(null));
    try {
      const response = await submitDraftCustomFormAPI(params);

      dispatch(submitCustomFormDratActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      if (options && options.onError) options.onError();
      if (error.response?.status === 499 && error.response?.data?.error_code) {
        dispatch(
          snackbarError(
            `customForm.signupViaCustomForm.errors.${error.response.data.error_code}`,
          ),
        );
        dispatch(submitCustomFormActions.error(error.response.data));
      } else {
        dispatch(snackbarError(`customForm.customFormStepper.error`));
      }

      dispatch(submitCustomFormActions.error(error?.response?.data));
    }
    dispatch(submitCustomFormDratActions.isLoading(false));
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

export const fetchAllCustomFormDisplayRuleActions = {
  isLoading: createAction('CUSTOM_FORM_DISPLAY_RULE/GET/IS_LOADING'),
  error: createAction('CUSTOM_FORM_DISPLAY_RULE/GET/ERROR'),
  success: createAction('CUSTOM_FORM_DISPLAY_RULE/GET/SUCCESS'),
};
export function fetchAllCustomFormDisplayRule(companyId?: number) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAllCustomFormDisplayRuleActions.isLoading(true));
    dispatch(fetchAllCustomFormDisplayRuleActions.error(null));
    try {
      const response = await fetchAllCustomFormAutDisplayRulesAPI(companyId);
      dispatch(fetchAllCustomFormDisplayRuleActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(fetchAllCustomFormDisplayRuleActions.error(err));
    }
    dispatch(fetchAllCustomFormDisplayRuleActions.isLoading(false));
  };
}
export const fetchBlockingCustomFormDisplayRuleBulkActions = {
  isLoading: createAction('DISPLAY_RULE_BLOCKING/BULK/IS_LOADING'),
  error: createAction('DISPLAY_RULE_BLOCKING/BULK/ERROR'),
  success: createAction('DISPLAY_RULE_BLOCKING/BULK/SUCCESS'),
  reset: createAction('DISPLAY_RULE_BLOCKING/BULK/RESET'),
};
export function fetchBlockingCustomFormDisplayRuleBulk(params: {
  id__in: Array<number>;
}) {
  return async (dispatch: Dispatch) => {
    if (params?.id__in.length === 0) {
      return;
    }
    dispatch(fetchBlockingCustomFormDisplayRuleBulkActions.reset());
    dispatch(fetchBlockingCustomFormDisplayRuleBulkActions.isLoading(true));
    dispatch(fetchBlockingCustomFormDisplayRuleBulkActions.error(null));
    try {
      const response = await fetchCustomFormDisplayRuleBulkAPI(params);
      dispatch(
        fetchBlockingCustomFormDisplayRuleBulkActions.success(response.data),
      );
    } catch (err) {
      console.error(err);
      dispatch(fetchBlockingCustomFormDisplayRuleBulkActions.error(err));
    }
    dispatch(fetchBlockingCustomFormDisplayRuleBulkActions.isLoading(false));
  };
}

export const upsertCustomFormDisplayRuleActions = {
  isLoading: createAction('CUSTOM_FORM_DISPLAY_RULE/UPSERT/IS_LOADING'),
  error: createAction('CUSTOM_FORM_DISPLAY_RULE/UPSERT/ERROR'),
  success: createAction('CUSTOM_FORM_DISPLAY_RULE/UPSERT/SUCCESS'),
};

export function upsertCustomFormDisplayRule(
  custom_form_display_rule: CustomFormDisplayRule,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertCustomFormDisplayRuleActions.isLoading(true));
    dispatch(upsertCustomFormDisplayRuleActions.error(null));
    const kind = custom_form_display_rule.id ? 'update' : 'create';
    try {
      const response = custom_form_display_rule.id
        ? await updateCustomFormDisplayRuleAPI(custom_form_display_rule)
        : await createCustomFormDisplayRuleAPI(custom_form_display_rule);

      dispatch(upsertCustomFormDisplayRuleActions.success(response.data));
      dispatch(snackbarSuccess(`customFormDisplayRule.${kind}.success`));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      if (error?.response.status === 499 && error?.response?.data?.error_code) {
        dispatch(
          snackbarError(
            `customFormDisplayRule.customError.${error.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError(`customFormDisplayRule.${kind}.error`));
      }

      dispatch(upsertCustomFormDisplayRuleActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(upsertCustomFormDisplayRuleActions.isLoading(false));
  };
}

export const deleteCustomFormDisplayRuleActions = {
  error: createAction('CUSTOM_FORM_DISPLAY_RULE/DELETE/ERROR'),
  isLoading: createAction('CUSTOM_FORM_DISPLAY_RULE/DELETE/IS_LOADING'),
  success: createAction('CUSTOM_FORM_DISPLAY_RULE/DELETE/SUCCESS'),
};

export function deleteCustomFormDisplayRule(
  customFormDisplayId: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteCustomFormDisplayRuleActions.isLoading(true));

    try {
      await deleteCustomFormDisplayRuleAPI(customFormDisplayId);
      dispatch(deleteCustomFormDisplayRuleActions.success(customFormDisplayId));
      dispatch(snackbarSuccess('customFormDisplayRule.delete.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(deleteCustomFormDisplayRuleActions.error(customFormDisplayId));
      dispatch(snackbarError('customFormDisplayRule.delete.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(deleteCustomFormDisplayRuleActions.isLoading(false));
  };
}

export const requestCustomFormNotificationActions = {
  success: createAction('CUSTOM_FORM_NOTIFICATION/VALIDATION/SUCCESS'),
  isLoading: createAction('CUSTOM_FORM_NOTIFICATION/VALIDATION/IS_LOADING'),
  error: createAction('CUSTOM_FORM_NOTIFICATION/VALIDATION/ERROR'),
};

export function requestMemberCustomFormNotification(
  data: { company_id?: number },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(requestCustomFormNotificationActions.isLoading(true));
    try {
      const response = await requestMemberCustomFormNotificationAPI(data);
      dispatch(requestCustomFormNotificationActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(requestCustomFormNotificationActions.error(err));

      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(requestCustomFormNotificationActions.isLoading(false));
  };
}

export const fetchCompanyCustomSignUpActions = {
  isLoading: createAction('CUSTOM_FORM_SIGNUP/RETRIEVE/IS_LOADING'),
  error: createAction('CUSTOM_FORM_SIGNUP/RETRIEVE/ERROR'),
  success: createAction('CUSTOM_FORM_SIGNUP/RETRIEVE/SUCCESS'),
};
export function fetchCompanyCustomSignUp({
  company,
  options,
}: {
  company?: number;
  options?: OptionCallback;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCompanyCustomSignUpActions.isLoading(true));
    dispatch(fetchCompanyCustomSignUpActions.error(null));
    try {
      const response = await fetchCompanyCustomFormSignUpAPI(company);
      dispatch(fetchCompanyCustomSignUpActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(fetchCompanyCustomSignUpActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchCompanyCustomSignUpActions.isLoading(false));
  };
}

export const fetchCompanyCustomMemberFormActions = {
  isLoading: createAction('CUSTOM_FORM_MEMBER/RETRIEVE/IS_LOADING'),
  error: createAction('CUSTOM_FORM_MEMBER/RETRIEVE/ERROR'),
  success: createAction('CUSTOM_FORM_MEMBER/RETRIEVE/SUCCESS'),
};
export function fetchCompanyCustomMemberForm({
  company,
  options,
}: {
  company?: number;
  options?: OptionCallback;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCompanyCustomMemberFormActions.isLoading(true));
    dispatch(fetchCompanyCustomMemberFormActions.error(null));
    try {
      const response = await fetchCompanyCustomMemberFormAPI(company);
      dispatch(fetchCompanyCustomMemberFormActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(fetchCompanyCustomMemberFormActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchCompanyCustomMemberFormActions.isLoading(false));
  };
}

export const signUpViaCustomFormActions = {
  isLoading: createAction('CUSTOM_FORM/SIGN_UP/IS_LOADING'),
  error: createAction('CUSTOM_FORM/SIGN_UP/ERROR'),
  success: createAction('CUSTOM_FORM/SIGN_UP/SUCCESS'),
};

export function submitSignUpCustomForm(
  sign_up_custom_form_filled: FormData,
  company: number | string,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(signUpViaCustomFormActions.isLoading(true));
    dispatch(signUpViaCustomFormActions.error(null));
    try {
      const response = await submitSignUpCustomFormAPI(
        sign_up_custom_form_filled,
        company,
      );

      dispatch(signUpViaCustomFormActions.success(response.data));
      dispatch(snackbarSuccess(`customForm.signupViaCustomForm.success`));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      if (options && options.onError) options.onError();
      if (error.response?.status === 499 && error.response?.data?.error_code) {
        dispatch(
          snackbarError(
            `customForm.signupViaCustomForm.errors.${error.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError(`customForm.signupViaCustomForm.error`));
      }

      dispatch(signUpViaCustomFormActions.error(error?.response?.data));
    }
    dispatch(signUpViaCustomFormActions.isLoading(false));
  };
}

export const fetchModelBasedAnswerActions = {
  isLoading: createAction('CUSTOM_FORM/CUSTOM_ANSWER/IS_LOADING'),
  error: createAction('CUSTOM_FORM/CUSTOM_ANSWER/ERROR'),
  success: createAction('CUSTOM_FORM/CUSTOM_ANSWER/SUCCESS'),
};

export function fetchModelBasedAnswer(
  params: {
    memberId: number;
    datatype: number;
    kind: number;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchModelBasedAnswerActions.isLoading(true));
    dispatch(fetchModelBasedAnswerActions.error(null));
    try {
      const response = await fetchModelBasedAnswerApi(params);
      dispatch(fetchModelBasedAnswerActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      if (options && options.onError) options.onError();
      dispatch(fetchModelBasedAnswerActions.error(error?.response?.data));
    }
    dispatch(fetchModelBasedAnswerActions.isLoading(false));
  };
}
