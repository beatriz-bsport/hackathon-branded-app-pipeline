import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import { snackbarSuccess, snackbarError } from '../snackbar/actions';

import {
  createEmailTemplate as createEmailTemplateAPI,
  updateEmailTemplate as updateEmailTemplateAPI,
  fetchEmailTemplatesSummaries as fetchEmailTemplatesSummariesAPI,
  fetchEmailTemplate as fetchEmailTemplateAPI,
  fetchEmailTemplateDetail as fetchEmailTemplateDetailAPI,
  deleteEmailTemplate as deleteEmailTemplateAPI,
  restoreEmailTemplate as restoreEmailTemplateAPI,
  fetchFranchisePageFilter as fetchFranchisePageFilterAPI,
  updateFranchisePageFilter as updateFranchisePageFilterAPI,
  updateEmailTemplateCategory as updateEmailTemplateCategoryAPI,
  fetchAllEmailTemplateCategory as fetchAllEmailTemplateCategoryAPI,
  deleteEmailTemplateCategory as deleteEmailTemplateCategoryAPI,
  createEmailTemplateCategory as createEmailTemplateCategoryAPI,
  editCategoryOrder as editCategoryOrderAPI,
  editOrderEmailTemplate as editOrderEmailTemplateAPI,
} from './api';

import { getFreshEmailTemplateSummariesIds } from './selectors';

import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

import { createDictionnaryById, createIdList } from '../../actions/utils';
import { RootState } from '../../reducers';
import {
  EmailTemplate,
  EmailTemplateCategory,
  EmailTemplateCategoryWithTemplates,
  FranchisorSavedFilter,
} from './types';

export const emailTemplatesSummariesAction = {
  error: createAction('EMAIL/SUMMARIES/ERROR'),
  loading: createAction('EMAIL/SUMMARIES/IS_LOADING'),
  success: createAction('EMAIL/SUMMARIES/SUCCESS'),
};

export const setEmailEditorHasBeenLoaded = createAction(
  'EMAIL/HAS_BEEN_LOADED',
);

export function emailTemplatesSummaries(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(emailTemplatesSummariesAction.loading(true));
    dispatch(emailTemplatesSummariesAction.error(null));

    try {
      const response = await fetchEmailTemplatesSummariesAPI();
      dispatch(
        emailTemplatesSummariesAction.success({
          emailTemplatesDict: createDictionnaryById(response.data),
          emailTemplatesIdList: createIdList(response.data),
        }),
      );
      dispatch(emailTemplatesSummariesAction.error(null));
    } catch (error) {
      dispatch(emailTemplatesSummariesAction.error(error));
    }
    dispatch(emailTemplatesSummariesAction.loading(false));
  };
}

export const emailTemplateBulkAction = {
  error: createAction('EMAIL_SUMMARY/BULK_RETRIEVE/ERROR'),
  loading: createAction('EMAIL_SUMMARY/BULK_RETRIEVE/IS_LOADING'),
  success: createAction('EMAIL_SUMMARY/BULK_RETRIEVE/SUCCESS'),
};

export function fetchEmailTemplateSummariesBulk(
  ids: Array<number>,
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const freshEmailTemplateList = getFreshEmailTemplateSummariesIds(
      getState(),
    );
    const ids_uniq = uniq(ids.filter((id) => !!id)).filter(
      (id) => !freshEmailTemplateList.includes(id),
    );
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(emailTemplateBulkAction.loading(true));
    dispatch(emailTemplateBulkAction.error(null));

    try {
      const response = await fetchEmailTemplatesSummariesAPI({
        id__in: ids_uniq,
      });
      dispatch(
        emailTemplateBulkAction.success({
          emailTemplatesDict: createDictionnaryById(response.data),
          emailTemplatesIdList: createIdList(response.data),
        }),
      );
      dispatch(emailTemplateBulkAction.error(null));
    } catch (error) {
      dispatch(emailTemplateBulkAction.error(error));
    }
    dispatch(emailTemplateBulkAction.loading(false));
  };
}

export function fetchEmailTemplateBulk(ids: Array<number>): ThunkAction {
  return async (dispatch: Dispatch) => {
    if (ids?.length === 0) {
      return;
    }
    dispatch(emailTemplateBulkAction.loading(true));
    dispatch(emailTemplateBulkAction.error(null));

    try {
      const response = await fetchEmailTemplatesSummariesAPI({
        id__in: ids,
      });
      dispatch(
        emailTemplateBulkAction.success({
          emailTemplatesDict: createDictionnaryById(response.data),
          emailTemplatesIdList: createIdList(response.data),
        }),
      );
      dispatch(emailTemplateBulkAction.error(null));
    } catch (error) {
      dispatch(emailTemplateBulkAction.error(error));
    }
    dispatch(emailTemplateBulkAction.loading(false));
  };
}

export const emailTemplateCompleteAction = {
  error: createAction('EMAIL/COMPLETE/ERROR'),
  loading: createAction('EMAIL/COMPLETE/IS_LOADING'),
  success: createAction('EMAIL/COMPLETE/SUCCESS'),
};

export function emailTemplateComplete(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(emailTemplateCompleteAction.loading(true));
    dispatch(emailTemplateCompleteAction.error(null));

    try {
      const response = await fetchEmailTemplateAPI(id);
      dispatch(
        emailTemplateCompleteAction.success({
          summary: {
            [response.data.id]: {
              title: response.data.title,
              subject: response.data.subject,
              date_created: response.data.date_created,
              id: response.data.id,
              category: response.data.category,
              ordering_in_category: response.data.ordering_in_category,
            },
          },
          detail: {
            [response.data.id]: {
              id: response.data.id,
              html: response.data.html,
              design: response.data.design
                ? JSON.parse(response.data.design)
                : {},
            },
          },
        }),
      );
      dispatch(emailTemplateCompleteAction.error(null));
    } catch (error) {
      dispatch(emailTemplateCompleteAction.error(error));
    }
    dispatch(emailTemplateCompleteAction.loading(false));
  };
}

export const emailTemplateDetailAction = {
  error: createAction('EMAIL/DETAIL/ERROR'),
  loading: createAction('EMAIL/DETAIL/IS_LOADING'),
  success: createAction('EMAIL/DETAIL/SUCCESS'),
};

export function emailTemplateDetail(
  id: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(emailTemplateDetailAction.loading(true));
    dispatch(emailTemplateDetailAction.error(null));

    try {
      const response = await fetchEmailTemplateDetailAPI(id);
      dispatch(
        emailTemplateDetailAction.success({
          [response.data.id]: response.data,
        }),
      );
      dispatch(emailTemplateDetailAction.error(null));
      typeof options?.onSuccess === 'function' && options.onSuccess();
    } catch (error) {
      dispatch(emailTemplateDetailAction.error(error));
      typeof options?.onError === 'function' && options.onError();
    }
    dispatch(emailTemplateDetailAction.loading(false));
  };
}

export const createEmailDesignAction = {
  error: createAction('EMAIL/CREATE/ERROR'),
  loading: createAction('EMAIL/CREATE/IS_LOADING'),
  success: createAction('EMAIL/CREATE/SUCCESS'),
};

export function emailDesignCreate(
  data: EmailTemplate & { available_for_companies?: number[] },
  options?: OptionCallback<number>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(createEmailDesignAction.loading(true));
    dispatch(createEmailDesignAction.error(null));

    try {
      const response = await createEmailTemplateAPI(data);
      dispatch(
        createEmailDesignAction.success({
          id: response.data.id,
          summary: {
            [response.data.id]: {
              title: response.data.title,
              subject: response.data.subject,
              date_created: response.data.date_created,
              id: response.data.id,
              category: response.data.category,
              ordering_in_category: response.data.ordering_in_category,
            },
          },
          detail: {
            [response.data.id]: {
              id: response.data.id,
              html: response.data.html,
              design: response.data.design
                ? JSON.parse(response.data.design)
                : {},
            },
          },
        }),
      );
      dispatch(createEmailDesignAction.error(null));
      dispatch(snackbarSuccess('email.create.success'));
      if (options && options.onSuccess) options.onSuccess(response.data.id);
    } catch (error) {
      dispatch(createEmailDesignAction.error(error));
      dispatch(snackbarError('email.create.error'));
    }
    dispatch(createEmailDesignAction.loading(false));
  };
}

export const updateEmailTemplateAction = {
  error: createAction('EMAIL/UPDATE/ERROR'),
  loading: createAction('EMAIL/UPDATE/IS_LOADING'),
  success: createAction('EMAIL/UPDATE/SUCCESS'),
};

export function emailTemplateUpdate(
  id: number,
  data: EmailTemplate & { available_for_companies?: number[] },
  options?: OptionCallback<number>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateEmailTemplateAction.loading(true));
    dispatch(updateEmailTemplateAction.error(null));

    try {
      const response = await updateEmailTemplateAPI(id, data);
      dispatch(
        updateEmailTemplateAction.success({
          summary: {
            [response.data.id]: {
              name: response.data.name,
              date_created: response.data.date_created,
              id: response.data.id,
              category: response.data.category,
              ordering_in_category: response.data.ordering_in_category,
            },
          },
          detail: {
            [response.data.id]: {
              id: response.data.id,
              html: response.data.html,
              design: response.data.design
                ? JSON.parse(response.data.design)
                : {},
            },
          },
        }),
      );
      dispatch(updateEmailTemplateAction.error(null));
      dispatch(snackbarSuccess('email.update.success'));

      if (typeof options?.onSuccess === 'function')
        options?.onSuccess(response.data.id);
    } catch (error) {
      dispatch(updateEmailTemplateAction.error(error));
      dispatch(snackbarError('email.update.error'));
    }
    dispatch(updateEmailTemplateAction.loading(false));
  };
}

export function restoreEmailTemplate(
  id: number,
  options?: OptionCallback<number>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateEmailTemplateAction.loading(true));
    dispatch(updateEmailTemplateAction.error(null));

    try {
      const response = await restoreEmailTemplateAPI(id);
      dispatch(
        updateEmailTemplateAction.success({
          summary: {
            [response.data.id]: {
              name: response.data.name,
              date_created: response.data.date_created,
              id: response.data.id,
              category: response.data.category,
              ordering_in_category: response.data.ordering_in_category,
              available: response.data.available,
            },
          },
          detail: {
            [response.data.id]: {
              id: response.data.id,
              html: response.data.html,
              design: response.data.design
                ? JSON.parse(response.data.design)
                : {},
            },
          },
        }),
      );
      dispatch(updateEmailTemplateAction.error(null));
      dispatch(snackbarSuccess('email.update.success'));

      if (typeof options?.onSuccess === 'function')
        options?.onSuccess(response.data.id);
    } catch (error) {
      dispatch(updateEmailTemplateAction.error(error));
      dispatch(snackbarError('email.update.error'));
    }
    dispatch(updateEmailTemplateAction.loading(false));
  };
}

export const emailTemplateDuplicateAction = {
  error: createAction('EMAIL/DUPLICATE/ERROR'),
  loading: createAction('EMAIL/DUPLICATE/IS_LOADING'),
  success: createAction('EMAIL/DUPLICATE/SUCCESS'),
};

export function emailTemplateDuplicate(props: {
  id: number;
  copyTranslation?: string;
  options?: OptionCallback<number>;
}): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(emailTemplateDuplicateAction.loading(true));

    try {
      const response = await fetchEmailTemplateAPI(props.id);

      const data = {
        design: response.data.design,
        html: response.data.html,
        title: `${response.data.title} (${props.copyTranslation || 'copy'})`,
        subject: response.data.subject,
        category: response.data.category,
        available_for_companies: response.data.available_for_companies,
      };
      const newTemplate = await createEmailTemplateAPI(data);

      dispatch(resetEmails());
      dispatch(emailTemplatesSummaries());
      if (typeof props.options?.onSuccess === 'function') {
        props.options?.onSuccess(newTemplate.data.id);
      }
    } catch (error) {
      dispatch(emailTemplateDuplicateAction.error(error));
      dispatch(snackbarError('email.delete.error'));
      if (typeof props.options?.onError === 'function') {
        props.options?.onError();
      }
    }
  };
}

export const fetchFranchisePageFilterAction = {
  error: createAction('EMAIL/FRANCHISOR_FILTER/ERROR'),
  loading: createAction('EMAIL/FRANCHISOR_FILTER/IS_LOADING'),
  success: createAction('EMAIL/FRANCHISOR_FILTER/SUCCESS'),
};

export function fetchFranchisePageFilter(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchisePageFilterAction.loading(true));

    try {
      const response = await fetchFranchisePageFilterAPI();

      dispatch(fetchFranchisePageFilterAction.success(response.data.filters));
    } catch (error) {
      dispatch(fetchFranchisePageFilterAction.error(error));
    }
  };
}

export const updateFranchisePageFilterAction = {
  error: createAction('EMAIL/UPDATE_FRANCHISOR_FILTER/ERROR'),
  loading: createAction('EMAIL/UPDATE_FRANCHISOR_FILTER/IS_LOADING'),
  success: createAction('EMAIL/UPDATE_FRANCHISOR_FILTER/SUCCESS'),
};

export function updateFranchisePageFilter(
  data: FranchisorSavedFilter[],
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateFranchisePageFilterAction.loading(true));

    try {
      const response = await updateFranchisePageFilterAPI({ filters: data });
      dispatch(updateFranchisePageFilterAction.success(response.data.filters));
    } catch (error) {
      dispatch(updateFranchisePageFilterAction.error(error));
    }
  };
}

export const deleteEmailTemplateAction = {
  error: createAction('EMAIL/DELETE/ERROR'),
  loading: createAction('EMAIL/DELETE/IS_LOADING'),
  success: createAction('EMAIL/DELETE/SUCCESS'),
};

export function emailTemplateDelete(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteEmailTemplateAction.loading(true));
    dispatch(deleteEmailTemplateAction.error(null));

    try {
      await deleteEmailTemplateAPI(id);

      dispatch(snackbarSuccess('email.delete.success'));
      dispatch(resetEmails());
      dispatch(emailTemplatesSummaries());
    } catch (error) {
      dispatch(deleteEmailTemplateAction.error(error));
      dispatch(snackbarError('email.delete.error'));
    }
    dispatch(deleteEmailTemplateAction.loading(false));
  };
}

export const resetAction = createAction('EMAIL/RESET/SUCCESS');

export function resetEmails() {
  return async (dispatch: Dispatch) => {
    dispatch(resetAction(true));
  };
}

export const emailTemplateUpdateOrderActions = {
  error: createAction('EMAIL/UPDATE_ORDER/ERROR'),
  loading: createAction('EMAIL/UPDATE_ORDER/IS_LOADING'),
  success: createAction('EMAIL/UPDATE_ORDER/SUCCESS'),
};

export function editOrderEmailTemplate(
  data: Array<{ id: number; ordering_in_category: number }>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(emailTemplateUpdateOrderActions.loading(true));
    dispatch(emailTemplateUpdateOrderActions.error(null));
    try {
      const response = await editOrderEmailTemplateAPI(data);
      dispatch(emailTemplateUpdateOrderActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(emailTemplateUpdateOrderActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(emailTemplateUpdateOrderActions.loading(false));
  };
}

export const listAllEmailTemplateCategoryActions = {
  loading: createAction('EMAIL_CATEGORY/LIST/IS_LOADING'),
  error: createAction('EMAIL_CATEGORY/LIST/ERROR'),
  success: createAction('EMAIL_CATEGORY/LIST/SUCCESS'),
};

export function fetchAllEmailTemplateCategory(companyId?: number) {
  return async (dispatch: Dispatch) => {
    dispatch(listAllEmailTemplateCategoryActions.loading(true));
    dispatch(listAllEmailTemplateCategoryActions.error(null));
    try {
      const response = await fetchAllEmailTemplateCategoryAPI({ companyId });
      const EmailTemplatees = response.data;
      dispatch(listAllEmailTemplateCategoryActions.success(EmailTemplatees));
    } catch (err) {
      console.error(err);
      dispatch(listAllEmailTemplateCategoryActions.error(err));
    }
    dispatch(listAllEmailTemplateCategoryActions.loading(false));
  };
}

export const updateEmailTemplateCategoryOrderActions = {
  loading: createAction('EMAIL_CATEGORY/UPDATE_ORDER/IS_LOADING'),
  error: createAction('EMAIL_CATEGORY/UPDATE_ORDER/ERROR'),
  success: createAction('EMAIL_CATEGORY/UPDATE_ORDER/SUCCESS'),
};

export function updateEmailTemplateCategoryOrder(
  data: Array<{ id: number; category_ordering: number }>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateEmailTemplateCategoryOrderActions.loading(true));
    dispatch(updateEmailTemplateCategoryOrderActions.error(null));
    try {
      const response = await editCategoryOrderAPI(data);
      dispatch(updateEmailTemplateCategoryOrderActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`paymentPack.category.update.error`));
      dispatch(
        updateEmailTemplateCategoryOrderActions.error(error.response.data),
      );
      if (options && options.onError) options.onError();
    }
    dispatch(updateEmailTemplateCategoryOrderActions.loading(false));
  };
}

export const upsertEmailTemplateCategoryActions = {
  loading: createAction('EMAIL_CATEGORY/UPSERT/IS_LOADING'),
  error: createAction('EMAIL_CATEGORY/UPSERT/ERROR'),
  success: createAction('EMAIL_CATEGORY/UPSERT/SUCCESS'),
};

export function upsertEmailTemplateCategory(
  category: EmailTemplateCategory,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertEmailTemplateCategoryActions.loading(true));
    dispatch(upsertEmailTemplateCategoryActions.error(null));
    const kind = category.id ? 'update' : 'create';
    try {
      const response = category.id
        ? await updateEmailTemplateCategoryAPI(category)
        : await createEmailTemplateCategoryAPI(category);
      dispatch(upsertEmailTemplateCategoryActions.success(response.data));
      dispatch(snackbarSuccess(`paymentPack.category.${kind}.success`));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`paymentPack.category.${kind}.error`));
      dispatch(upsertEmailTemplateCategoryActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(upsertEmailTemplateCategoryActions.loading(false));
  };
}

export const deleteEmailTemplateCategoryActions = {
  error: createAction('EMAIL_CATEGORY/DELETE/ERROR'),
  loading: createAction('EMAIL_CATEGORY/DELETE/IS_LOADING'),
  success: createAction('EMAIL_CATEGORY/DELETE/SUCCESS'),
};

export function deleteEmailTemplateCategory(
  category: EmailTemplateCategoryWithTemplates,
  options?: OptionCallback<EmailTemplateCategoryWithTemplates>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteEmailTemplateCategoryActions.loading(true));
    try {
      await deleteEmailTemplateCategoryAPI(category);
      dispatch(deleteEmailTemplateCategoryActions.success(category));
      dispatch(snackbarSuccess('paymentPack.category.delete.success'));
      if (options && options.onSuccess) options.onSuccess(category);
    } catch (error) {
      dispatch(deleteEmailTemplateCategoryActions.error(category));
      dispatch(snackbarError('paymentPack.category.delete.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(deleteEmailTemplateCategoryActions.loading(false));
  };
}
