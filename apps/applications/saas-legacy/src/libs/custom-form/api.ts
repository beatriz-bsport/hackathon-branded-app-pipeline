import {
  getAuth,
  putAuth,
  postAuth,
  postBaseAuth,
  buildUrlParams,
  deleteAuth,
} from '../../http';
import type {
  CustomForm,
  CustomFormDisplayRule,
  ResponsiveLayouts,
  SignUpCustomFormPayload,
  CustomFormFilledAPI,
  CustomFormFieldAnswer,
} from './types';

import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_CDP_V1;

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

export async function fetchCompanyCustomFormSignUp(company?: number) {
  if (company) {
    return getAuth(
      `${API_V1_URI}/custom_form/custom_form/get_company_custom_signup_form/${buildUrlParams(
        {
          company,
        },
      )}`,
    );
  }
  return getAuth(
    `${API_V1_URI}/custom_form/custom_form/get_company_custom_signup_form/`,
  );
}

export async function fetchCompanyCustomMemberForm(company: number) {
  return getAuth<CustomForm>(
    `${API_V1_URI}/custom_form/custom_form/get_company_custom_member_form/${buildUrlParams(
      {
        company,
      },
    )}`,
  );
}

export async function fetchCustomFormBulk(params: { id__in: Array<number> }) {
  return getAuth(
    `${API_V1_URI}/custom_form/custom_form/${buildUrlParams(params)}`,
  );
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

/**
 * Submit a custom form
 * @param form_filled A FormData instance with keys custom_form_id and custom_form_field_filled
 * @param companyId The required company id
 */
export async function submitCustomForm(
  form_filled: FormData,
  companyId: number,
) {
  return postBaseAuth<CustomFormFilledAPI>(
    `${API_V1_URI}/custom_form/custom_form_filled/${buildUrlParams({
      companyId,
    })}`,
    form_filled,
  );
}

export async function submitSignUpCustomForm(
  signup_form_filled: CustomFormFieldAnswer,
  companyId: number | string | null,
  referral_uuid?: string | null,
) {
  if (companyId) {
    return postBaseAuth<SignUpCustomFormPayload>(
      `${API_V1_URI}/custom_form/custom_form_filled/signup/${buildUrlParams({
        companyId,
        ...(referral_uuid ? { referral_uuid } : {}),
      })}`,
      signup_form_filled,
    );
  }
  return postBaseAuth<SignUpCustomFormPayload>(
    `${API_V1_URI}/custom_form/custom_form_filled/signup/`,
    signup_form_filled,
  );
}

export async function submitDraftCustomForm({
  custom_form_id,
  companyId,
}: {
  custom_form_id: number;
  companyId: number;
}) {
  return postBaseAuth(
    `${API_V1_URI}/custom_form/custom_form_filled/register_draft/${buildUrlParams(
      {
        company: companyId,
      },
    )}`,
    { custom_form_id },
  );
}

export async function fetchCustomFormStatistics({
  formId,
}: {
  formId: number;
}) {
  return getAuth(`${API_V1_URI}/custom_form/custom_form_statistics/${formId}/`);
}

export async function fetchAllCustomFormAutDisplayRules(companyId: number) {
  if (companyId) {
    return getAuth(
      `${API_V1_URI}/custom_form/display_rule/${buildUrlParams({
        companyId,
      })}`,
    );
  }
  return getAuth(`${API_V1_URI}/custom_form/display_rule/`);
}
export async function fetchCustomFormDisplayRuleBulk(params: {
  id__in: Array<number>;
}) {
  return getAuth(
    `${API_V1_URI}/custom_form/display_rule/${buildUrlParams(params)}`,
  );
}

export async function createCustomFormDisplayRule(
  display_rule: CustomFormDisplayRule,
) {
  return postBaseAuth(`${API_V1_URI}/custom_form/display_rule/`, display_rule);
}
export async function updateCustomFormDisplayRule(
  display_rule: CustomFormDisplayRule,
) {
  return putAuth(
    `${API_V1_URI}/custom_form/display_rule/${display_rule.id}/`,
    display_rule,
  );
}

export async function deleteCustomFormDisplayRule(display_rule_id: number) {
  return deleteAuth(
    `${API_V1_URI}/custom_form/display_rule/${display_rule_id}/`,
  );
}

export async function requestMemberCustomFormNotification(data: {
  company_id?: number;
}) {
  return postAuth(
    `${API_V1_URI}/custom_form/display_rule/retrieve_missing_custom_forms_information/`,
    data,
  );
}

export async function updateCustomFormLayout({
  formId,
  layout,
}: {
  formId: number;
  layout: ResponsiveLayouts;
}) {
  return postAuth(
    `${API_V1_URI}/custom_form/custom_form/${formId}/update_layout/`,
    { layout: { ...layout } },
  );
}

export async function fetchModelBasedAnswerApi(params: {
  memberId: number;
  datatype: number;
  kind: number;
}) {
  return getAuth(
    `${API_V1_URI}/custom_form/model_based_answer/get_last_model_based_answer/${buildUrlParams(
      params,
    )}`,
  );
}
