import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import type { CustomFormState } from './types';
import {
  fetchAllCustomFormActions,
  fetchCustomFormBulkActions,
  fetchMissingCustomFormBulkActions,
  fetchCustomFormActions,
  upsertCustomFormActions,
  disableCustomFormActions,
  restoreCustomFormactions,
  disableCustomFormFieldActions,
  restoreCustomFormFieldActions,
  duplicateCustomFormActions,
  fetchMemberCustomFormFilledActions,
  submitCustomFormActions,
  submitCustomFormDratActions,
  fetchAllCustomFormStatisticsActions,
  fetchAllCustomFormDisplayRuleActions,
  upsertCustomFormDisplayRuleActions,
  deleteCustomFormDisplayRuleActions,
  fetchBlockingCustomFormDisplayRuleBulkActions,
  updateCustomFormLayoutActions,
  fetchCompanyCustomSignUpActions,
  fetchCompanyCustomMemberFormActions,
  signUpViaCustomFormActions,
} from './actions';

const initialState: Immutable.Immutable<CustomFormState> = Immutable<CustomFormState>(
  {
    allIds: [],
    byId: {},
    loading: false,
    error: null,
    upsert: {
      loading: false,
      error: null,
    },
    layout: {
      loading: false,
      error: null,
    },
    filled: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
    statistics: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
    display_rule: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
    signUp: {
      loading: false,
      error: null,
      form: null,
    },
    memberForm: {
      loading: false,
      error: null,
      form: null,
    },
  },
);

export default handleActions(
  {
    [fetchAllCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchAllCustomFormActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchAllCustomFormActions.success.toString()]: (state, { payload }) => {
      return state
        .set(
          'allIds',
          payload.results.map((cus) => cus.id),
        )
        .merge(
          {
            byId: payload.results.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [fetchCustomFormBulkActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchCustomFormBulkActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchCustomFormBulkActions.success.toString()]: (state, { payload }) => {
      return state
        .set(
          'allIds',
          payload.results.map((cus) => cus.id),
        )
        .merge(
          {
            byId: payload.results.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [fetchMissingCustomFormBulkActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('loading', payload);
    },
    [fetchMissingCustomFormBulkActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('error', payload);
    },
    [fetchMissingCustomFormBulkActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          byId: payload.results.reduce((acc: any, ps: any) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [fetchCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchCustomFormActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchCustomFormActions.success.toString()]: (state, { payload }) => {
      if (!state.allIds.find((id) => id === payload.id)) {
        return state
          .setIn(['byId', payload.id], payload)
          .setIn(['allIds'], [...state.allIds, payload.id]);
      }
      return state.setIn(['byId', payload.id], payload);
    },
    [disableCustomFormActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [disableCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [restoreCustomFormactions.success.toString()]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [restoreCustomFormactions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [disableCustomFormFieldActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['byId', payload.formId, 'custom_form_field'],
        state.byId[payload.formId].custom_form_field.map((field) =>
          field.id !== payload.data.id ? field : payload.data,
        ),
      );
    },
    [restoreCustomFormFieldActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['byId', payload.formId], payload);
    },
    [upsertCustomFormActions.success.toString()]: (state, { payload }) => {
      if (!state.allIds.find((id) => id === payload.id)) {
        return state
          .setIn(['byId', payload.id], payload)
          .setIn(['allIds'], [...state.allIds, payload.id]);
      }
      return state.setIn(['byId', payload.id], payload);
    },
    [upsertCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsertCustomFormActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [updateCustomFormLayoutActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [updateCustomFormLayoutActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['layout', 'loading'], payload);
    },
    [updateCustomFormLayoutActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['layout', 'error'], payload);
    },
    [duplicateCustomFormActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(['byId', payload.id], payload)
        .setIn(['allIds'], [...state.allIds, payload.id]);
    },
    [duplicateCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [duplicateCustomFormActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [fetchMemberCustomFormFilledActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['filled', 'loading'], payload);
    },
    [fetchMemberCustomFormFilledActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['filled', 'error'], payload);
    },
    [fetchMemberCustomFormFilledActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['filled', 'allIds'],
          payload.results.map((cus) => cus.id),
        )
        .merge(
          {
            filled: {
              byId: payload.results.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [submitCustomFormActions.success.toString()]: (state, { payload }) => {
      if (!state.allIds.find((id) => id === payload.id)) {
        return state
          .setIn(['filled', 'byId', payload.id], payload)
          .setIn(['filled', 'allIds'], [...state.filled.allIds, payload.id]);
      }
      return state.setIn(['filled', 'byId', payload.id], payload);
    },
    [submitCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [submitCustomFormActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [submitCustomFormDratActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [submitCustomFormDratActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [fetchAllCustomFormStatisticsActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['statistics', 'loading'], payload);
    },
    [fetchAllCustomFormStatisticsActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['statistics', 'error'], payload);
    },
    [fetchAllCustomFormStatisticsActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['statistics', 'allIds'],
          payload.results.map((cus_stats) => cus_stats.id),
        )
        .merge(
          {
            statistics: {
              byId: payload.results.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [fetchAllCustomFormDisplayRuleActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['display_rule', 'loading'], payload);
    },
    [fetchAllCustomFormDisplayRuleActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['display_rule', 'error'], payload);
    },
    [fetchAllCustomFormDisplayRuleActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['display_rule', 'allIds'],
          payload.results.map((display_rule) => display_rule.id),
        )
        .merge(
          {
            display_rule: {
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [fetchBlockingCustomFormDisplayRuleBulkActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['display_rule', 'loading'], payload);
    },
    [fetchBlockingCustomFormDisplayRuleBulkActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['display_rule', 'error'], payload);
    },
    [fetchBlockingCustomFormDisplayRuleBulkActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          display_rule: {
            byId: payload.results.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [upsertCustomFormDisplayRuleActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['display_rule', 'loading'], payload);
    },
    [upsertCustomFormDisplayRuleActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [upsertCustomFormDisplayRuleActions.success.toString()]: (
      state,
      { payload },
    ) => {
      if (!state.display_rule.allIds.find((id) => id === payload.id)) {
        return state
          .setIn(['display_rule', 'byId', payload.id], payload)
          .setIn(
            ['display_rule', 'allIds'],
            [...state.display_rule.allIds, payload.id],
          );
      }
      return state.setIn(['display_rule', 'byId', payload.id], payload);
    },
    [deleteCustomFormDisplayRuleActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['display_rule', 'allIds'],
        state.display_rule.allIds.filter((id) => id !== payload),
      );
    },
    [fetchCompanyCustomSignUpActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['signUp', 'loading'], payload);
    },
    [fetchCompanyCustomSignUpActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['signUp', 'loading'], payload);
    },
    [fetchCompanyCustomSignUpActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['signUp', 'form'], payload);
    },
    [fetchCompanyCustomMemberFormActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['memberForm', 'loading'], payload);
    },
    [fetchCompanyCustomMemberFormActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['memberForm', 'loading'], payload);
    },
    [fetchCompanyCustomMemberFormActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['memberForm', 'form'], payload);
    },
    [signUpViaCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [signUpViaCustomFormActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
  },
  initialState,
);
