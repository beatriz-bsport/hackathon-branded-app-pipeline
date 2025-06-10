import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import { FranchiseProductTemplateQueryParams } from '#src/libs/franchise/types';
import { snackbarSuccess, snackbarError } from '#src/libs/snackbar/actions';

import {
  createEmailTemplate as createEmailTemplateAPI,
  updateEmailTemplate as updateEmailTemplateAPI,
  fetchEmailTemplatesSummaries as fetchEmailTemplatesSummariesAPI,
  fetchEmailTemplatesSummariesPaginated as fetchEmailTemplatesSummariesPaginatedAPI,
  fetchEmailTemplate as fetchEmailTemplateAPI,
  fetchEmailTemplateDetail as fetchEmailTemplateDetailAPI,
  fetchBulkEmailTemplateDetail as fetchBulkEmailTemplateDetailAPI,
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
  fetchTemplateMetaData as fetchTemplateMetaDataAPI,
} from './api';

import { getFreshEmailTemplateSummariesIds } from '#src/libs/email-editor/selectors';

// @ts-expect-error
import { createDictionnaryById, createIdList } from '#src/actions/utils';

import type {
  EmailTemplate,
  EmailTemplateCategory,
  EmailTemplateCategoryWithTemplates,
  FranchisorSavedFilter,
  EmailTemplateSummary,
  EmailDesignQueryParamsPaginated,
  EmailEditAPIParams,
} from '#src/libs/email-editor/types';

import {
  ELLIPSIS,
  EMAIL_TITLE_BACKEND_CHARACTER_LIMIT,
  FRANCHISE_EMAIL_DESIGN_TEMPLATE_PAGINATION_SIZE,
} from '#src/libs/email-editor/constants';

import type { RootState } from '#src/reducers';

import type {
  Dispatch,
  ThunkAction,
  OptionCallback,
  PaginatedResponse,
} from '#src/state/types';

export const emailTemplatesSummariesAction = {
  error: createAction('EMAIL/SUMMARIES/ERROR'),
  loading: createAction('EMAIL/SUMMARIES/IS_LOADING'),
  success: createAction('EMAIL/SUMMARIES/SUCCESS'),
};

export const setEmailEditorHasBeenLoaded = createAction(
  'EMAIL/HAS_BEEN_LOADED',
);

export function emailTemplatesSummaries(
  params?: FranchiseProductTemplateQueryParams,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(emailTemplatesSummariesAction.loading(true));
    dispatch(emailTemplatesSummariesAction.error(null));

    try {
      const response = await fetchEmailTemplatesSummariesAPI(params);
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

export const fetchFranchiseEmailTemplatesSummariesPaginatedActions = {
  ownedByFranchisorError: createAction<Error | null>(
    'EMAIL_SUMMARIES/OWNED_BY_FRANCHISOR/PAGINATED_LIST/ERROR',
  ),
  ownedByFranchisorIsLoading: createAction<boolean>(
    'EMAIL_SUMMARIES/OWNED_BY_FRANCHISOR/PAGINATED_LIST/IS_LOADING',
  ),
  ownedByFranchisorSuccess: createAction<
    PaginatedResponse<EmailTemplateSummary>
  >('EMAIL_SUMMARIES/OWNED_BY_FRANCHISOR/PAGINATED_LIST/SUCCESS'),

  ownedByFranchiseeError: createAction<Error | null>(
    'EMAIL_SUMMARIES/OWNED_BY_FRANCHISEE/PAGINATED_LIST/ERROR',
  ),
  ownedByFranchiseeIsLoading: createAction<boolean>(
    'EMAIL_SUMMARIES/OWNED_BY_FRANCHISEE/PAGINATED_LIST/IS_LOADING',
  ),
  ownedByFranchiseeSuccess: createAction<
    PaginatedResponse<EmailTemplateSummary>
  >('EMAIL_SUMMARIES/OWNED_BY_FRANCHISEE/PAGINATED_LIST/SUCCESS'),

  bsportDefaultError: createAction<Error | null>(
    'EMAIL_SUMMARIES/BSPORT_DEFAULT_FRANCHISE/PAGINATED_LIST/ERROR',
  ),
  bsportDefaultIsLoading: createAction<boolean>(
    'EMAIL_SUMMARIES/BSPORT_DEFAULT_FRANCHISE/PAGINATED_LIST/IS_LOADING',
  ),
  bsportDefaultSuccess: createAction<PaginatedResponse<EmailTemplateSummary>>(
    'EMAIL_SUMMARIES/BSPORT_DEFAULT_FRANCHISE/PAGINATED_LIST/SUCCESS',
  ),
};

export function fetchEmailTemplatesSummariesOwnedByFranchisorPaginated(
  params?: EmailDesignQueryParamsPaginated,
  options?: OptionCallback<PaginatedResponse<EmailTemplateSummary>>,
): ThunkAction {
  return async (dispatch, getState) => {
    dispatch(
      fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchisorError(
        null,
      ),
    );
    dispatch(
      fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchisorIsLoading(
        true,
      ),
    );
    const currentState = getState().emailTemplate.franchise.ownedByFranchisor;

    const nextPage = params?.page ?? currentState.next_page ?? 1;

    try {
      const response = await fetchEmailTemplatesSummariesPaginatedAPI({
        ...params,
        is_franchise: true,
        is_default_bsport_template: false,
        page: nextPage,
        page_size: FRANCHISE_EMAIL_DESIGN_TEMPLATE_PAGINATION_SIZE,
      });
      dispatch(
        fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchisorSuccess(
          response.data,
        ),
      );

      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(
        fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchisorError(
          err,
        ),
      );
      options?.onError?.(err);
    }
    dispatch(
      fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchisorIsLoading(
        false,
      ),
    );
  };
}

export function fetchEmailTemplatesSummariesOwnedByFranchiseePaginated(
  params?: EmailDesignQueryParamsPaginated,
  options?: OptionCallback<PaginatedResponse<EmailTemplateSummary>>,
): ThunkAction {
  return async (dispatch, getState) => {
    dispatch(
      fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchiseeError(
        null,
      ),
    );
    dispatch(
      fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchiseeIsLoading(
        true,
      ),
    );
    const currentState = getState().emailTemplate.franchise.ownedByFranchisor;

    const nextPage = params?.page ?? currentState.next_page ?? 1;

    try {
      const response = await fetchEmailTemplatesSummariesPaginatedAPI({
        ...params,
        is_franchise: false,
        is_default_bsport_template: false,
        page: nextPage,
        page_size: FRANCHISE_EMAIL_DESIGN_TEMPLATE_PAGINATION_SIZE,
      });
      dispatch(
        fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchiseeSuccess(
          response.data,
        ),
      );

      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(
        fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchiseeError(
          err,
        ),
      );
      options?.onError?.(err);
    }
    dispatch(
      fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchiseeIsLoading(
        false,
      ),
    );
  };
}

export function fetchEmailTemplatesSummariesBsportDefaultPaginated(
  params?: EmailDesignQueryParamsPaginated,
  options?: OptionCallback<PaginatedResponse<EmailTemplateSummary>>,
): ThunkAction {
  return async (dispatch, getState) => {
    dispatch(
      fetchFranchiseEmailTemplatesSummariesPaginatedActions.bsportDefaultError(
        null,
      ),
    );
    dispatch(
      fetchFranchiseEmailTemplatesSummariesPaginatedActions.bsportDefaultIsLoading(
        true,
      ),
    );
    const currentState = getState().emailTemplate.franchise.ownedByFranchisor;

    const nextPage = params?.page ?? currentState.next_page ?? 1;

    try {
      const response = await fetchEmailTemplatesSummariesPaginatedAPI({
        ...params,
        is_default_bsport_template: true,
        page: nextPage,
        page_size: FRANCHISE_EMAIL_DESIGN_TEMPLATE_PAGINATION_SIZE,
      });
      dispatch(
        fetchFranchiseEmailTemplatesSummariesPaginatedActions.bsportDefaultSuccess(
          response.data,
        ),
      );

      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(
        fetchFranchiseEmailTemplatesSummariesPaginatedActions.bsportDefaultError(
          err,
        ),
      );
      options?.onError?.(err);
    }
    dispatch(
      fetchFranchiseEmailTemplatesSummariesPaginatedActions.bsportDefaultIsLoading(
        false,
      ),
    );
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
            // @ts-expect-error
            [response.data.id]: {
              // @ts-expect-error
              title: response.data.title,
              // @ts-expect-error
              subject: response.data.subject,
              // @ts-expect-error
              date_created: response.data.date_created,
              // @ts-expect-error
              id: response.data.id,
              // @ts-expect-error
              category: response.data.category,
              // @ts-expect-error
              ordering_in_category: response.data.ordering_in_category,
              // @ts-expect-error
              available_for_companies: response.data.available_for_companies,
            },
          },
          detail: {
            // @ts-expect-error
            [response.data.id]: {
              // @ts-expect-error
              id: response.data.id,
              // @ts-expect-error
              html: response.data.html,
              // @ts-expect-error
              design: response.data.design
                ? // @ts-expect-error
                  JSON.parse(response.data.design)
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

export const bulkEmailTemplateDetailAction = {
  error: createAction('EMAIL/DETAIL_BULK/ERROR'),
  isLoading: createAction('EMAIL/DETAIL_BULK/IS_LOADING'),
  success: createAction('EMAIL/DETAIL_BULK/SUCCESS'),
};

export function bulkEmailTemplateDetail(
  id__in: number[],
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(bulkEmailTemplateDetailAction.isLoading(true));
    dispatch(bulkEmailTemplateDetailAction.error(null));

    try {
      const response = await fetchBulkEmailTemplateDetailAPI({ id__in });
      // @ts-expect-error
      dispatch(bulkEmailTemplateDetailAction.success(response.data.results));
      dispatch(bulkEmailTemplateDetailAction.error(null));
      typeof options?.onSuccess === 'function' && options.onSuccess();
    } catch (error) {
      dispatch(bulkEmailTemplateDetailAction.error(error));
      typeof options?.onError === 'function' && options.onError();
    }
    dispatch(bulkEmailTemplateDetailAction.isLoading(false));
  };
}
export const emailTemplateDetailAction = {
  error: createAction('EMAIL/DETAIL/ERROR'),
  loading: createAction('EMAIL/DETAIL/IS_LOADING'),
  success: createAction('EMAIL/DETAIL/SUCCESS'),
  reset: createAction<void>('EMAIL/DETAIL/RESET'),
};

export const resetEmailDetail = () => {
  return (dispatch: Dispatch) => {
    dispatch(emailTemplateDetailAction.reset());
  };
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
          // @ts-expect-error
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
  success: createAction<EmailTemplate>('EMAIL/CREATE/SUCCESS'),
  loading: createAction<boolean>('EMAIL/CREATE/IS_LOADING'),
  error: createAction<Error | null>('EMAIL/CREATE/ERROR'),
};

export function emailDesignCreate(
  data: EmailEditAPIParams,
  options?: OptionCallback<number>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(createEmailDesignAction.loading(true));
    dispatch(createEmailDesignAction.error(null));

    try {
      const response = await createEmailTemplateAPI(data);
      dispatch(createEmailDesignAction.success(response.data));
      dispatch(createEmailDesignAction.error(null));
      dispatch(snackbarSuccess('email.create.success'));
      if (options && options.onSuccess) options.onSuccess(response.data.id);
    } catch (error: any) {
      dispatch(createEmailDesignAction.error(error));
      dispatch(snackbarError('email.create.error'));
      options?.onError?.(error);
    }
    dispatch(createEmailDesignAction.loading(false));
  };
}

export const updateEmailTemplateAction = {
  success: createAction<EmailTemplate>('EMAIL/UPDATE/SUCCESS'),
  loading: createAction<boolean>('EMAIL/UPDATE/IS_LOADING'),
  error: createAction<Error | null>('EMAIL/UPDATE/ERROR'),
};

export function emailTemplateUpdate(
  id: number,
  data: EmailEditAPIParams,
  options?: OptionCallback<number>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateEmailTemplateAction.loading(true));
    dispatch(updateEmailTemplateAction.error(null));

    try {
      const response = await updateEmailTemplateAPI(id, data);
      dispatch(updateEmailTemplateAction.success(response.data));
      dispatch(updateEmailTemplateAction.error(null));
      dispatch(snackbarSuccess('email.update.success'));

      options?.onSuccess?.(response.data.id);
    } catch (error: any) {
      dispatch(updateEmailTemplateAction.error(error));
      dispatch(snackbarError('email.update.error'));
      options?.onError?.(error);
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
          // @ts-expect-error
          summary: {
            // @ts-expect-error
            [response.data.id]: {
              // @ts-expect-error
              name: response.data.name,
              // @ts-expect-error
              date_created: response.data.date_created,
              // @ts-expect-error
              id: response.data.id,
              // @ts-expect-error
              category: response.data.category,
              // @ts-expect-error
              ordering_in_category: response.data.ordering_in_category,
              // @ts-expect-error
              available: response.data.available,
            },
          },
          detail: {
            // @ts-expect-error
            [response.data.id]: {
              // @ts-expect-error
              id: response.data.id,
              // @ts-expect-error
              html: response.data.html,
              // @ts-expect-error
              design: response.data.design
                ? // @ts-expect-error
                  JSON.parse(response.data.design)
                : {},
            },
          },
        }),
      );
      dispatch(updateEmailTemplateAction.error(null));
      dispatch(snackbarSuccess('email.update.success'));

      if (typeof options?.onSuccess === 'function')
        // @ts-expect-error
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

      // @ts-expect-error
      const originalTitle = response.data.title;
      const copyFlag = ` (${props.copyTranslation || 'copy'})`;

      let newTitle = `${originalTitle}${copyFlag}`;

      if (newTitle.length > EMAIL_TITLE_BACKEND_CHARACTER_LIMIT) {
        // if the new title is too long, we truncate from the original title
        // the number of characters needed so that the new title fits the limit
        const numberOfCharactersToTruncate =
          newTitle.length +
          ELLIPSIS.length -
          EMAIL_TITLE_BACKEND_CHARACTER_LIMIT;
        newTitle = `${originalTitle.substring(
          0,
          originalTitle.length - numberOfCharactersToTruncate,
        )}${ELLIPSIS}${copyFlag}`;
      }

      const data = {
        // @ts-expect-error
        design: response.data.design,
        // @ts-expect-error
        html: response.data.html,
        title: newTitle,
        // @ts-expect-error
        subject: response.data.subject,
        // @ts-expect-error
        category: response.data.category,
        // @ts-expect-error
        available_for_companies: response.data.available_for_companies,
      };
      const newTemplate = await createEmailTemplateAPI(data);

      dispatch(resetEmails());
      dispatch(emailTemplatesSummaries());
      dispatch(snackbarSuccess('email.duplicate.success'));
      if (typeof props.options?.onSuccess === 'function') {
        props.options?.onSuccess(newTemplate.data.id);
      }
    } catch (error) {
      dispatch(emailTemplateDuplicateAction.error(error));
      dispatch(snackbarError('email.duplicate.error'));
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
      // @ts-expect-error
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

export function emailTemplateDelete(
  id: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteEmailTemplateAction.loading(true));
    dispatch(deleteEmailTemplateAction.error(null));

    try {
      await deleteEmailTemplateAPI(id);
      options?.onSuccess?.();
      dispatch(snackbarSuccess('email.delete.success'));
      dispatch(resetEmails());
      dispatch(emailTemplatesSummaries());
    } catch (error) {
      options?.onError?.();
      dispatch(deleteEmailTemplateAction.error(error));
      dispatch(snackbarError('email.delete.error'));
    }
    dispatch(deleteEmailTemplateAction.loading(false));
  };
}

export const resetAction = createAction('EMAIL/RESET/DONE');

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
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(emailTemplateUpdateOrderActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(emailTemplateUpdateOrderActions.loading(false));
  };
}

export const templateMetaDataActions = {
  error: createAction('EMAIL/TEMPLATE_META_DATA/ERROR'),
  loading: createAction('EMAIL/TEMPLATE_META_DATA/LOADING'),
  success: createAction('EMAIL/TEMPLATE_META_DATA/SUCCESS'),
};

export function fetchCurrentTemplateMetadata(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(templateMetaDataActions.loading(true));
    dispatch(templateMetaDataActions.error(null));
    try {
      const response = await fetchTemplateMetaDataAPI(id);
      dispatch(templateMetaDataActions.success(response.data));
    } catch (error) {
      console.error(error);
      dispatch(templateMetaDataActions.error(error));
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
      // @ts-expect-error
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
      // @ts-expect-error
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
    } catch (_error) {
      dispatch(deleteEmailTemplateCategoryActions.error(category));
      dispatch(snackbarError('paymentPack.category.delete.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(deleteEmailTemplateCategoryActions.loading(false));
  };
}
