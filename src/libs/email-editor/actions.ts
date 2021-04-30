import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

import {
  createEmailTemplate as createEmailTemplateAPI,
  updateEmailTemplate as updateEmailTemplateAPI,
  fetchEmailTemplatesSummaries as fetchEmailTemplatesSummariesAPI,
  fetchEmailTemplate as fetchEmailTemplateAPI,
  fetchEmailTemplateDetail as fetchEmailTemplateDetailAPI,
  deleteEmailTemplate as deleteEmailTemplateAPI,
} from './api';

import { getFreshEmailTemplateSummariesIds } from './selectors';

import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

import { createDictionnaryById, createIdList } from '../../actions/utils';
import { RootState } from '../../reducers';

export const emailTemplatesSummariesAction = {
  error: createAction('EMAIL/SUMMARIES/ERROR'),
  isLoading: createAction('EMAIL/SUMMARIES/IS_LOADING'),
  success: createAction('EMAIL/SUMMARIES/SUCCESS'),
};

export const setEmailEditorHasBeenLoaded = createAction(
  'EMAIL/HAS_BEEN_LOADED',
);

export function emailTemplatesSummaries(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(emailTemplatesSummariesAction.isLoading(true));
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
    dispatch(emailTemplatesSummariesAction.isLoading(false));
  };
}

export const emailTemplateBulkAction = {
  error: createAction('EMAIL_SUMMARY/BULK_RETRIEVE/ERROR'),
  isLoading: createAction('EMAIL_SUMMARY/BULK_RETRIEVE/IS_LOADING'),
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
    dispatch(emailTemplateBulkAction.isLoading(true));
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
    dispatch(emailTemplateBulkAction.isLoading(false));
  };
}

export const emailTemplateCompleteAction = {
  error: createAction('EMAIL/COMPLETE/ERROR'),
  isLoading: createAction('EMAIL/COMPLETE/IS_LOADING'),
  success: createAction('EMAIL/COMPLETE/SUCCESS'),
};

export function emailTemplateComplete(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(emailTemplateCompleteAction.isLoading(true));
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
    dispatch(emailTemplateCompleteAction.isLoading(false));
  };
}

export const emailTemplateDetailAction = {
  error: createAction('EMAIL/DETAIL/ERROR'),
  isLoading: createAction('EMAIL/DETAIL/IS_LOADING'),
  success: createAction('EMAIL/DETAIL/SUCCESS'),
};

export function emailTemplateDetail(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(emailTemplateDetailAction.isLoading(true));
    dispatch(emailTemplateDetailAction.error(null));

    try {
      const response = await fetchEmailTemplateDetailAPI(id);
      dispatch(
        emailTemplateDetailAction.success({
          [response.data.id]: response.data,
        }),
      );
      dispatch(emailTemplateDetailAction.error(null));
    } catch (error) {
      dispatch(emailTemplateDetailAction.error(error));
    }
    dispatch(emailTemplateDetailAction.isLoading(false));
  };
}

export const createEmailDesignAction = {
  error: createAction('EMAIL/CREATE/ERROR'),
  isLoading: createAction('EMAIL/CREATE/IS_LOADING'),
  success: createAction('EMAIL/CREATE/SUCCESS'),
};

export function emailDesignCreate(
  data: any,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(createEmailDesignAction.isLoading(true));
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
    dispatch(createEmailDesignAction.isLoading(false));
  };
}

export const updateEmailTemplateAction = {
  error: createAction('EMAIL/UPDATE/ERROR'),
  isLoading: createAction('EMAIL/UPDATE/IS_LOADING'),
  success: createAction('EMAIL/UPDATE/SUCCESS'),
};

export function emailTemplateUpdate(id: number, data: any): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateEmailTemplateAction.isLoading(true));
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
    } catch (error) {
      dispatch(updateEmailTemplateAction.error(error));
      dispatch(snackbarError('email.update.error'));
    }
    dispatch(updateEmailTemplateAction.isLoading(false));
  };
}

export const deleteEmailTemplateAction = {
  error: createAction('EMAIL/DELETE/ERROR'),
  isLoading: createAction('EMAIL/DELETE/IS_LOADING'),
  success: createAction('EMAIL/DELETE/SUCCESS'),
};

export function emailTemplateDelete(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteEmailTemplateAction.isLoading(true));
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
    dispatch(deleteEmailTemplateAction.isLoading(false));
  };
}

export const resetAction = createAction('EMAIL/RESET/SUCCESS');

export function resetEmails() {
  return async (dispatch: Dispatch) => {
    dispatch(resetAction(true));
  };
}
