// @ts-nocheck
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  tagGroupListActions,
  tagGroupCreateOrUpdateActions,
  tagListActions,
  tagCreateOrUpdateActions,
  tagUsageActions,
  fetchMemberTagListActions,
  tagGroupTemplateListActions,
  tagGroupTemplateCreateOrUpdateActions,
  tagTemplateListActions,
  tagTemplateCreateOrUpdateActions,
  tagTemplateUsageActions,
} from './actions';

import type { TagState } from './types';

const initialState: Immutable.Immutable<TagState> = Immutable<TagState>({
  tag: {
    items: [],
    byId: {},
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  group: {
    items: [],
    byId: {},
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  tagUsage: {
    loading: false,
    error: null,
    byId: {},
  },
  tagTemplate: {
    items: [],
    byId: {},
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  groupTemplate: {
    items: [],
    byId: {},
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  tagTemplateUsage: {
    loading: false,
    error: null,
    byId: {},
  },
  marketPlaceMemberTag: {
    loading: false,
    error: null,
    tagIdsList: [],
  },
});

export default handleActions(
  {
    // TAGS
    // --------
    [tagListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['tag', 'loading'], payload);
    },
    [tagListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['tag', 'error'], payload);
    },
    [tagListActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['tag', 'items'], payload).merge(
        {
          tag: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [tagUsageActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          tagUsage: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [tagUsageActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['tagUsageActions', 'loading'], payload);
    },
    [tagUsageActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['tagUsageActions', 'error'], payload);
    },
    [tagCreateOrUpdateActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['tag', 'createOrUpdate', 'loading'], payload);
    },
    [tagCreateOrUpdateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['tag', 'createOrUpdate', 'error'], payload);
    },
    [tagCreateOrUpdateActions.success.toString()]: (state, { payload }) => {
      let idx = state.tag.items.findIndex((t) => t.id === payload.id);
      if (idx === -1) {
        idx = state.tag.items.length;
      }
      return state.setIn(['tag', 'items', idx], payload);
    },
    // GROUP
    // --------
    [tagGroupListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['group', 'loading'], payload);
    },
    [tagGroupListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['group', 'error'], payload);
    },
    [tagGroupListActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['group', 'items'], payload).merge(
        {
          group: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [tagGroupCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['group', 'createOrUpdate', 'loading'], payload);
    },
    [tagGroupCreateOrUpdateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['group', 'createOrUpdate', 'error'], payload);
    },
    [tagGroupCreateOrUpdateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      let idx = state.group.items.findIndex((g) => g.id === payload.id);
      if (idx === -1) {
        idx = state.group.items.length;
      }
      return state.setIn(['group', 'items', idx], payload);
    },
    [fetchMemberTagListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['marketPlaceMemberTag', 'loading'], payload);
    },
    [fetchMemberTagListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['marketPlaceMemberTag', 'error'], payload);
    },
    [fetchMemberTagListActions.success.toString()]: (state, { payload }) => {
      return state.setIn(
        ['marketPlaceMemberTag', 'tagIdsList'],
        payload.map((tag) => tag.id),
      );
    },
    // TAG TEMPLATE
    // --------
    [tagTemplateListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['tagTemplate', 'loading'], payload);
    },
    [tagTemplateListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['tagTemplate', 'error'], payload);
    },
    [tagTemplateListActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['tagTemplate', 'items'], payload).merge(
        {
          tagTemplate: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [tagTemplateUsageActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          tagTemplateUsage: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [tagTemplateUsageActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['tagTemplateUsage', 'loading'], payload);
    },
    [tagTemplateUsageActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['tagTemplateUsage', 'error'], payload);
    },
    [tagTemplateCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['tagTemplate', 'createOrUpdate', 'loading'], payload);
    },
    [tagTemplateCreateOrUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['tagTemplate', 'createOrUpdate', 'error'], payload);
    },
    [tagTemplateCreateOrUpdateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      let idx = state.tagTemplate.items.findIndex((t) => t.id === payload.id);
      if (idx === -1) {
        idx = state.tagTemplate.items.length;
      }
      return state.setIn(['tagTemplate', 'items', idx], payload);
    },
    // GROUP TEMPLATE
    // --------
    [tagGroupTemplateListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['groupTemplate', 'loading'], payload);
    },
    [tagGroupTemplateListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['groupTemplate', 'error'], payload);
    },
    [tagGroupTemplateListActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['groupTemplate', 'items'], payload).merge(
        {
          groupTemplate: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [tagGroupTemplateCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['groupTemplate', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [tagGroupTemplateCreateOrUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['groupTemplate', 'createOrUpdate', 'error'], payload);
    },
    [tagGroupTemplateCreateOrUpdateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      let idx = state.groupTemplate.items.findIndex((g) => g.id === payload.id);
      if (idx === -1) {
        idx = state.groupTemplate.items.length;
      }
      return state.setIn(['groupTemplate', 'items', idx], payload);
    },
  },
  initialState,
);
