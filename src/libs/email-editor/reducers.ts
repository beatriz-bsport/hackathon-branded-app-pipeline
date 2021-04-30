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
} from './actions';

import type { EmailTemplateState } from './types';

const initialState: Immutable.Immutable<EmailTemplateState> = Immutable<EmailTemplateState>(
  {
    isLoading: false,
    error: null,
    byId: {},
    hasBeenLoadedOnce: false,
    allIds: [],
    detail: {
      isLoading: false,
      error: null,
      byId: {},
    },
    // Create or Update
    upsert: {
      isLoading: false,
      error: null,
    },
  },
);

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
    [emailTemplatesSummariesAction.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('isLoading', payload);
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
    [emailTemplateBulkAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('isLoading', payload);
    },

    // Load the html end design of one specific template
    [emailTemplateDetailAction.success.toString()]: (state, { payload }) => {
      return state.merge({ detail: { byId: payload } }, { deep: true });
    },

    [emailTemplateDetailAction.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['detail', 'isLoading'], payload);
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
    [emailTemplateCompleteAction.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['detail', 'isLoading'], payload);
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
    [createEmailDesignAction.isLoading.toString()]: (state, { payload }) => {
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

    [updateEmailTemplateAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('isLoading', payload);
    },
    [updateEmailTemplateAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [deleteEmailTemplateAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('isLoading', payload);
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
  },
  initialState,
);
