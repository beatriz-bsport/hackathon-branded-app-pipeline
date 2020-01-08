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
} from './actions';

import type { email_template_state } from './types';

const initialState: email_template_state = Immutable({
  isLoading: false,
  error: null,
  byId: {},
  allIds: [],
  detail: { isLoading: false, error: null, byId: {} },
  // Create or Update
  upsert: {
    isLoading: false,
    error: null,
  },
});

export default handleActions(
  {
    // get name, id, and date of all templates for listing them
    [emailTemplatesSummariesAction.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.emailTemplatesDict,
          },
          { deep: true },
        )
        .set('allIds', payload.emailTemplatesIdList);
    },
    [emailTemplatesSummariesAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [emailTemplatesSummariesAction.isLoading]: (state, { payload }) => {
      return state.set('isLoading', payload);
    },

    [emailTemplateBulkAction.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.emailTemplatesDict,
          },
          { deep: true },
        )
        .set('allIds', payload.emailTemplatesIdList);
    },
    [emailTemplateBulkAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [emailTemplateBulkAction.isLoading]: (state, { payload }) => {
      return state.set('isLoading', payload);
    },

    // Load the html end design of one specific template
    [emailTemplateDetailAction.success]: (state, { payload }) => {
      return state.merge({ detail: { byId: payload } }, { deep: true });
    },

    [emailTemplateDetailAction.isLoading]: (state, { payload }) => {
      return state.setIn(['detail', 'isLoading'], payload);
    },
    [emailTemplateDetailAction.error]: (state, { payload }) => {
      return state.setIn(['detail', 'error'], payload);
    },

    // Get all infos about one template, used when go to edit page
    [emailTemplateCompleteAction.success]: (state, { payload }) => {
      return state.merge(
        { byId: payload.summary, detail: { byId: payload.detail } },
        { deep: true },
      );
    },
    [emailTemplateCompleteAction.isLoading]: (state, { payload }) => {
      return state.setIn(['detail', 'isLoading'], payload);
    },
    [emailTemplateCompleteAction.error]: (state, { payload }) => {
      return state.setIn(['detail', 'error'], payload);
    },

    [createEmailDesignAction.success]: (state, { payload }) => {
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
    [createEmailDesignAction.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [createEmailDesignAction.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [updateEmailTemplateAction.success]: (state, { payload }) => {
      return state.merge(
        { byId: payload.summary, detail: { byId: payload.detail } },
        { deep: true },
      );
    },

    [updateEmailTemplateAction.isLoading]: (state, { payload }) => {
      return state.set('isLoading', payload);
    },
    [updateEmailTemplateAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [deleteEmailTemplateAction.isLoading]: (state, { payload }) => {
      return state.set('isLoading', payload);
    },
    [deleteEmailTemplateAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },

    [resetAction.success]: (state) => {
      return state
        .setIn(['byId'], {})
        .setIn(['allIds'], [])
        .setIn(['detail', 'byId'], {});
    },
  },
  initialState,
);
