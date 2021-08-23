import {
  API_V1_URI,
  getAuth,
  putAuth,
  postAuth,
  postBaseAuth,
  buildUrlParams,
} from '../../http';
import type { CustomForm, CustomFormFieldAnswer } from './types';

export async function fetchAllCustomForm(companyId?: number) {
  if (companyId) {
    return getAuth(
      `${API_V1_URI}/custom_form/custom_form/${
        companyId &&
        buildUrlParams({
          companyId,
        })
      }`,
    );
  }
  return getAuth(`${API_V1_URI}/custom_form/custom_form/`);
}

export async function fetchCustomForm({
  customFormId,
  memberId,
  companyId,
}: {
  customFormId: number;
  memberId: number;
  companyId: number;
}) {
  if (companyId) {
    return getAuth(
      `${API_V1_URI}/custom_form/custom_form/${customFormId}/${buildUrlParams({
        companyId,
        memberId,
      })}`,
    );
  }
  return getAuth(`${API_V1_URI}/custom_form/custom_form/${customFormId}/`);
}

export async function createCustomForm(form: CustomForm) {
  return postBaseAuth(`${API_V1_URI}/custom_form/custom_form/`, form);
}
export async function updateCustomForm(form: CustomForm) {
  return putAuth(`${API_V1_URI}/custom_form/custom_form/${form.id}/`, form);
}

export async function disableCustomForm(formId: number) {
  return postAuth(`${API_V1_URI}/custom_form/custom_form/${formId}/disable/`);
}

export async function restoreCustomForm(formId: number) {
  return postAuth(`${API_V1_URI}/custom_form/custom_form/${formId}/restore/`);
}

export async function disableCustomFormField(fielId: number) {
  return postAuth(
    `${API_V1_URI}/custom_form/custom_form_field/${fielId}/disable/`,
  );
}

export async function restoreCustomFormField(fielId: number) {
  return postAuth(
    `${API_V1_URI}/custom_form/custom_form_field/${fielId}/restore/`,
  );
}

export async function duplicateCustomForm(formId: number) {
  return postAuth(`${API_V1_URI}/custom_form/custom_form/${formId}/duplicate/`);
}

export async function fetchMemberCustomFormFilled(memberId?: number) {
  if (memberId) {
    return getAuth(
      `${API_V1_URI}/custom_form/custom_form_filled/${
        memberId &&
        buildUrlParams({
          memberId,
          page_size: 100,
        })
      }`,
    );
  }
  return getAuth(`${API_V1_URI}/custom_form/custom_form_filled/`);
}

export async function submitCustomForm(
  form_filled: CustomFormFieldAnswer,
  companyId: number,
) {
  return postBaseAuth(
    `${API_V1_URI}/custom_form/custom_form_filled/${buildUrlParams({
      companyId,
    })}`,
    form_filled,
  );
}

export async function fetchAllCustomFormStatistics() {
  return getAuth(`${API_V1_URI}/custom_form/custom_form_statistics/`);
}
