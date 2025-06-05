import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';

import {
  createEmailDesignAction,
  emailTemplatesSummariesAction,
  emailTemplateDetailAction,
  bulkEmailTemplateDetailAction,
  updateEmailTemplateAction,
  emailTemplateCompleteAction,
  emailTemplateBulkAction,
  deleteEmailTemplateAction,
  resetAction,
  setEmailEditorHasBeenLoaded,
  emailTemplateDuplicateAction,
  fetchFranchisePageFilterAction,
  updateFranchisePageFilterAction,
  emailTemplateUpdateOrderActions,
  deleteEmailTemplateCategoryActions,
  updateEmailTemplateCategoryOrderActions,
  upsertEmailTemplateCategoryActions,
  listAllEmailTemplateCategoryActions,
  templateMetaDataActions,
  fetchFranchiseEmailTemplatesSummariesPaginatedActions,
} from '#src/libs/email-editor/actions';

import { FRANCHISE_EMAIL_DESIGN_TEMPLATE_PAGINATION_SIZE } from '#src/libs/email-editor/constants';
import type {
  EmailTemplate,
  EmailTemplateState,
  EmailTemplateSummary,
} from '#src/libs/email-editor/types';
import type { PaginatedResponse } from '#src/state/types';
const initialState: Immutable.Immutable<EmailTemplateState> =
  Immutable<EmailTemplateState>({
    loading: false,
    error: null,
    byId: {},
    hasBeenLoadedOnce: false,
    allIds: [],
    detail: {
      loading: false,
      error: null,
      byId: {},
    },
    // Create or Update
    upsert: {
      loading: false,
      error: null,
    },
    savedFilter: {
      loading: false,
      error: null,
      filters: [],
    },
    emailTemplateCategory: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
      upsert: {
        loading: false,
        error: null,
      },
    },
    currentTemplateMetaData: {
      required_tags_list: [],
      related_notification_rule_events: [],
      loading: false,
      error: null,
    },
    franchise: {
      ownedByFranchisor: {
        page: 1,
        next_page: null,
        previous_page: null,
        count: 0,
        page_size: FRANCHISE_EMAIL_DESIGN_TEMPLATE_PAGINATION_SIZE,
        allIds: [],
        byId: {},
        loading: false,
        error: null,
      },
      ownedByFranchisee: {
        page: 1,
        next_page: null,
        previous_page: null,
        count: 0,
        page_size: FRANCHISE_EMAIL_DESIGN_TEMPLATE_PAGINATION_SIZE,
        allIds: [],
        byId: {},
        loading: false,
        error: null,
      },
      bsportDefault: {
        page: 1,
        next_page: null,
        previous_page: null,
        count: 0,
        page_size: FRANCHISE_EMAIL_DESIGN_TEMPLATE_PAGINATION_SIZE,
        allIds: [],
        byId: {},
        loading: false,
        error: null,
      },
    },
  });

export default handleActions<Immutable.Immutable<EmailTemplateState>, any>(
  {
    // get name, id, and date of all templates for listing them
    [emailTemplatesSummariesAction.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .merge(
          {
            byId: payload.emailTemplatesDict,
          },
          { deep: true },
        )
        .set('allIds', payload.emailTemplatesIdList);
    },
    [emailTemplatesSummariesAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [setEmailEditorHasBeenLoaded.toString()]: (state) => {
      return state.set('hasBeenLoadedOnce', true);
    },
    [emailTemplatesSummariesAction.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('loading', payload);
    },

    [emailTemplateBulkAction.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.emailTemplatesDict,
          },
          { deep: true },
        )
        .set('allIds', payload.emailTemplatesIdList);
    },
    [emailTemplateBulkAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [emailTemplateBulkAction.loading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },

    // Load the html end design of one specific template
    [emailTemplateDetailAction.success.toString()]: (state, { payload }) => {
      return state.merge({ detail: { byId: payload } }, { deep: true });
    },

    [emailTemplateDetailAction.loading.toString()]: (state, { payload }) => {
      return state.setIn(['detail', 'loading'], payload);
    },
    [emailTemplateDetailAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['detail', 'error'], payload);
    },
    [emailTemplateDetailAction.reset.toString()]: (state) => {
      return state.setIn(['detail', 'byId'], {});
    },
    [bulkEmailTemplateDetailAction.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          detail: {
            // @ts-expect-error
            byId: payload.reduce((acc, email) => {
              acc[email.id] = email;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },

    [bulkEmailTemplateDetailAction.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['detail', 'isLoading'], payload);
    },
    [bulkEmailTemplateDetailAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['detail', 'error'], payload);
    },

    // Get all infos about one template, used when go to edit page
    [emailTemplateCompleteAction.success.toString()]: (state, { payload }) => {
      return state.merge(
        { byId: payload.summary, detail: { byId: payload.detail } },
        { deep: true },
      );
    },
    [emailTemplateCompleteAction.loading.toString()]: (state, { payload }) => {
      return state.setIn(['detail', 'loading'], payload);
    },
    [emailTemplateCompleteAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['detail', 'error'], payload);
    },

    [createEmailDesignAction.success.toString()]: (
      state,
      { payload }: { payload: EmailTemplate },
    ) => {
      const emailDesignDataTransformed = {
        id: payload.id,
        summary: {
          [payload.id]: {
            title: payload.title,
            subject: payload.subject,
            date_created: payload.date_modified,
            id: payload.id,
            category: payload.category,
            ordering_in_category: payload.ordering_in_category,
          },
        },
        detail: {
          [payload.id]: {
            id: payload.id,
            html: payload.html,
            design: payload.design ? JSON.parse(payload.design) : {},
          },
        },
      };
      return state
        .merge(
          {
            byId: emailDesignDataTransformed.summary,

            detail: { byId: emailDesignDataTransformed.detail },
          },
          { deep: true },
        )
        .update(
          'allIds',
          (myList, newId) => {
            return myList.concat([newId]);
          },

          payload.id,
        );
    },
    [createEmailDesignAction.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [createEmailDesignAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [updateEmailTemplateAction.success.toString()]: (
      state,
      { payload }: { payload: EmailTemplate },
    ) => {
      const emailDesignDataTransformed = {
        id: payload.id,
        summary: {
          [payload.id]: {
            title: payload.title,
            subject: payload.subject,
            date_created: payload.date_modified,
            id: payload.id,
            category: payload.category,
            ordering_in_category: payload.ordering_in_category,
          },
        },
        detail: {
          [payload.id]: {
            id: payload.id,
            html: payload.html,
            design: payload.design ? JSON.parse(payload.design) : {},
          },
        },
      };
      return state.merge(
        {
          byId: emailDesignDataTransformed.summary,
          detail: { byId: emailDesignDataTransformed.detail },
        },
        { deep: true },
      );
    },

    [updateEmailTemplateAction.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [updateEmailTemplateAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [deleteEmailTemplateAction.loading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [deleteEmailTemplateAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [resetAction.toString()]: (state) => {
      return state
        .setIn(['byId'], {})
        .setIn(['allIds'], [])
        .setIn(['detail', 'byId'], {});
    },
    [emailTemplateDuplicateAction.loading.toString()]: (state, { payload }) => {
      return state.set('loading', payload).set('error', null);
    },
    [emailTemplateDuplicateAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload).set('loading', null);
    },
    [emailTemplateDuplicateAction.success.toString()]: (state) => {
      return state.set('loading', false).set('error', null);
    },
    [fetchFranchisePageFilterAction.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['savedFilter', 'loading'], payload)
        .setIn(['savedFilter', 'error'], null);
    },
    [fetchFranchisePageFilterAction.error.toString()]: (state, { payload }) => {
      return state
        .setIn(['savedFilter', 'error'], payload)
        .setIn(['savedFilter', 'loading'], null);
    },
    [fetchFranchisePageFilterAction.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['savedFilter', 'loading'], false)
        .setIn(['savedFilter', 'error'], null)

        .setIn(['savedFilter', 'filters'], payload[0].filters);
    },
    [updateFranchisePageFilterAction.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['savedFilter', 'loading'], payload)
        .setIn(['savedFilter', 'error'], null);
    },
    [updateFranchisePageFilterAction.error.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['savedFilter', 'error'], payload)
        .setIn(['savedFilter', 'loading'], null);
    },
    [updateFranchisePageFilterAction.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['savedFilter', 'loading'], false)
        .setIn(['savedFilter', 'error'], null)

        .setIn(['savedFilter', 'filters'], payload[0].filters);
    },
    [emailTemplateUpdateOrderActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [emailTemplateUpdateOrderActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [emailTemplateUpdateOrderActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          byId: payload.reduce(
            // @ts-expect-error
            (acc, curr) => ({ ...acc, [curr.id]: curr }),
            state.byId,
          ),
        },
        { deep: true },
      );
    },
    [listAllEmailTemplateCategoryActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['emailTemplateCategory', 'loading'], payload);
    },
    [listAllEmailTemplateCategoryActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['emailTemplateCategory', 'error'], payload);
    },
    [listAllEmailTemplateCategoryActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['emailTemplateCategory', 'allIds'],
          // @ts-expect-error
          payload.results.map((pp) => pp.id),
        )
        .merge(
          {
            emailTemplateCategory: {
              byId: payload.results.reduce(
                // @ts-expect-error
                (acc, v) => ({ ...acc, [v.id]: v }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [upsertEmailTemplateCategoryActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['emailTemplateCategory', 'upsert', 'loading'],
        payload,
      );
    },
    [upsertEmailTemplateCategoryActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['emailTemplateCategory', 'upsert', 'error'], payload);
    },
    [upsertEmailTemplateCategoryActions.success.toString()]: (
      state,
      { payload },
    ) => {
      if (!state.emailTemplateCategory.allIds.includes(payload.id)) {
        return state

          .setIn(['emailTemplateCategory', 'byId', payload.id], payload)
          .setIn(
            ['emailTemplateCategory', 'allIds'],

            [...state.emailTemplateCategory.allIds, payload.id],
          );
      }
      return state.setIn(
        ['emailTemplateCategory', 'byId', payload.id],
        payload,
      );
    },
    [deleteEmailTemplateCategoryActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['emailTemplateCategory', 'upsert', 'loading'],
        payload,
      );
    },
    [deleteEmailTemplateCategoryActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['emailTemplateCategory', 'upsert', 'error'], payload);
    },
    [deleteEmailTemplateCategoryActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['emailTemplateCategory', 'allIds'],

        state.emailTemplateCategory.allIds.filter((id) => id !== payload.id),
      );
    },
    [updateEmailTemplateCategoryOrderActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          emailTemplateCategory: {
            byId: payload.reduce(
              // @ts-expect-error
              (acc, cat) => ({ ...acc, [cat.id]: cat }),
              state.emailTemplateCategory.byId,
            ),
          },
        },
        { deep: true },
      );
    },
    [updateEmailTemplateCategoryOrderActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['emailTemplateCategory', 'upsert', 'loading'],
        payload,
      );
    },
    [updateEmailTemplateCategoryOrderActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['emailTemplateCategory', 'upsert', 'error'], payload);
    },
    [templateMetaDataActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['currentTemplateMetaData'], payload);
    },
    [templateMetaDataActions.loading.toString()]: (state, { payload }) => {
      return state.setIn(['currentTemplateMetaData', 'loading'], payload);
    },
    [templateMetaDataActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['currentTemplateMetaData', 'error'], payload);
    },
    // ===== PAGINATED EMAIL TEMAPLTES ACTIONS OWNED BY FRANCHISOR
    [fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchisorIsLoading.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(
          ['franchise', 'ownedByFranchisor', 'loading'],
          payload,
        );
      },
    [fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchisorError.toString()]:
      (state, { payload }: { payload: Error | null }) => {
        return state.setIn(
          ['franchise', 'ownedByFranchisor', 'error'],
          payload,
        );
      },
    [fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchisorSuccess.toString()]:
      (
        state,
        { payload }: { payload: PaginatedResponse<EmailTemplateSummary> },
      ) => {
        const { next_page, results, count, page } = payload;
        return state
          .setIn(['franchise', 'ownedByFranchisor', 'page'], page)
          .setIn(['franchise', 'ownedByFranchisor', 'next_page'], next_page)
          .setIn(['franchise', 'ownedByFranchisor', 'count'], count)
          .setIn(
            ['franchise', 'ownedByFranchisor', 'allIds'],
            (results ?? []).map((template) => template.id),
          )
          .merge(
            {
              franchise: {
                ownedByFranchisor: {
                  byId: (results ?? []).reduce(
                    (acc, v) => ({ ...acc, [v.id]: v }),
                    {},
                  ),
                },
              },
            },
            { deep: true },
          );
      },
    // ===== PAGINATED EMAIL TEMAPLTES ACTIONS OWNED BY FRANCHISEE
    [fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchiseeIsLoading.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(
          ['franchise', 'ownedByFranchisee', 'loading'],
          payload,
        );
      },
    [fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchiseeError.toString()]:
      (state, { payload }: { payload: Error | null }) => {
        return state.setIn(
          ['franchise', 'ownedByFranchisee', 'error'],
          payload,
        );
      },
    [fetchFranchiseEmailTemplatesSummariesPaginatedActions.ownedByFranchiseeSuccess.toString()]:
      (
        state,
        { payload }: { payload: PaginatedResponse<EmailTemplateSummary> },
      ) => {
        const { next_page, results, count, page } = payload;
        return state
          .setIn(['franchise', 'ownedByFranchisee', 'page'], page)
          .setIn(['franchise', 'ownedByFranchisee', 'next_page'], next_page)
          .setIn(['franchise', 'ownedByFranchisee', 'count'], count)
          .setIn(
            ['franchise', 'ownedByFranchisee', 'allIds'],
            (results ?? []).map((template) => template.id),
          )
          .merge(
            {
              franchise: {
                ownedByFranchisee: {
                  byId: (results ?? []).reduce(
                    (acc, v) => ({ ...acc, [v.id]: v }),
                    {},
                  ),
                },
              },
            },
            { deep: true },
          );
      },

    // ===== PAGINATED EMAIL TEMAPLTES ACTIONS BSPORT DEFAULT
    [fetchFranchiseEmailTemplatesSummariesPaginatedActions.bsportDefaultIsLoading.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(['franchise', 'bsportDefault', 'loading'], payload);
      },
    [fetchFranchiseEmailTemplatesSummariesPaginatedActions.bsportDefaultError.toString()]:
      (state, { payload }: { payload: Error | null }) => {
        return state.setIn(['franchise', 'bsportDefault', 'error'], payload);
      },
    [fetchFranchiseEmailTemplatesSummariesPaginatedActions.bsportDefaultSuccess.toString()]:
      (
        state,
        { payload }: { payload: PaginatedResponse<EmailTemplateSummary> },
      ) => {
        const { next_page, results, count, page } = payload;
        return state
          .setIn(['franchise', 'bsportDefault', 'page'], page)
          .setIn(['franchise', 'bsportDefault', 'next_page'], next_page)
          .setIn(['franchise', 'bsportDefault', 'count'], count)
          .setIn(
            ['franchise', 'bsportDefault', 'allIds'],
            (results ?? []).map((template) => template.id),
          )
          .merge(
            {
              franchise: {
                bsportDefault: {
                  byId: (results ?? []).reduce(
                    (acc, v) => ({ ...acc, [v.id]: v }),
                    {},
                  ),
                },
              },
            },
            { deep: true },
          );
      },
  },
  initialState,
);
