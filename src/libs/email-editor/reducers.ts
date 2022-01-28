// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';

import {
  createEmailDesignAction,
  emailTemplatesSummariesAction,
  emailTemplateDetailAction,
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
} from './actions';

import type { EmailTemplateState } from './types';

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
  });

export default handleActions(
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

    [createEmailDesignAction.success.toString()]: (state, { payload }) => {
      // console.log(newList);
      // console.log(newList);
      return state
        .merge(
          {
            byId: payload.summary,
            detail: { byId: payload.detail },
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
    [createEmailDesignAction.loading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [createEmailDesignAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [updateEmailTemplateAction.success.toString()]: (state, { payload }) => {
      return state.merge(
        { byId: payload.summary, detail: { byId: payload.detail } },
        { deep: true },
      );
    },

    [updateEmailTemplateAction.loading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [updateEmailTemplateAction.error.toString()]: (state, { payload }) => {
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
          payload.results.map((pp) => pp.id),
        )
        .merge(
          {
            emailTemplateCategory: {
              byId: payload.results.reduce(
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
  },
  initialState,
);
