import { createAction } from 'redux-actions';

import type { CustomForm, CustomFormFilledAPI } from '@bsport/saas-legacy/src/libs/custom-form/types';

export const fetchCompanyCustomMemberFormActions = {
  success: createAction<CustomForm>('CUSTOM_FORM_MEMBER/RETRIEVE/SUCCESS'),
  isLoading: createAction<boolean>('CUSTOM_FORM_MEMBER/RETRIEVE/IS_LOADING'),
  error: createAction<Error | null>('CUSTOM_FORM_MEMBER/RETRIEVE/ERROR'),
};

export const submitCustomFormActions = {
  success: createAction<CustomFormFilledAPI>('CUSTOM_FORM/SUBMIT/SUCCESS'),
  isLoading: createAction<boolean>('CUSTOM_FORM/SUBMIT/IS_LOADING'),
  error: createAction<Error | null>('CUSTOM_FORM/SUBMIT/ERROR'),
};
