import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import uniq from 'lodash/uniq';

import {
  fetchAllReplacementRequestsActions,
  fetchAllReplacementRequestCoachAnswersActions,
  createReplacementRequestBulkActions,
  createDisciplineGroupActions,
  fetchDisciplineGroupListActions,
  deleteDisciplineGroupActions,
  updateDisciplineGroupActions,
  updateReplacementRequestActions,
  fetchHasUnseenConfirmedRequestsActions,
  fetchHasRequestsLinkedToCancelledOffersActions,
  fetchReplacementRequestConfigurationActions,
  updateReplacementRequestConfigurationActions,
  fetchSubstitutionHistoryActions,
} from './actions';

import {
  ReplacementRequest,
  ReplacementRequestCoachAnswer,
  ReplacementRequestState,
  SubstitutionHistoryItem,
} from './types';

const initialState: Immutable.Immutable<ReplacementRequestState> =
  Immutable<ReplacementRequestState>({
    error: null,
    loading: false,
    updateRequest: {
      loading: false,
      error: null,
    },
    byId: {},
    allIds: [],
    count: 0,
    page: 1,
    pendingRequests: {
      byId: {},
      allIds: [],
      count: 0,
      page: 1,
      loading: false,
    },
    teacherFoundRequests: {
      byId: {},
      allIds: [],
      count: 0,
      page: 1,
      loading: false,
      hasUnseen: false,
    },
    substitutionHistory: {
      items: [],
      count: 0,
      page: 1,
      loading: false,
      error: null,
    },
    replacementRequestCoachAnswer: {
      error: null,
      loading: false,
      byId: {},
      allIds: [],
    },
    disciplineGroup: {
      error: null,
      loading: false,
      byId: {},
      allIds: [],
      count: 0,
      page: 1,
    },
    configuration: {
      // @ts-expect-error
      configuration: {},
      loading: false,
      error: null,
    },
    hasRequestsLinkedToCancelledOffers: {
      exists: false,
      loading: false,
      error: null,
    },
  });

export default handleActions<Immutable.Immutable<ReplacementRequestState>>(
  {
    [fetchAllReplacementRequestsActions.loading.toString()]: (
      state,
      { payload },
    ) => state.set('loading', payload),
    [fetchAllReplacementRequestsActions.error.toString()]: (
      state,
      { payload },
    ) => state.set('error', payload),
    [fetchAllReplacementRequestsActions.success.toString()]: (
      state,
      { payload },
    ) =>
      state
        .merge(
          {
            // @ts-expect-error
            byId: payload.results.reduce(
              (acc: any, l: ReplacementRequest) => ({ ...acc, [l.id]: l }),
              {},
            ),
          },
          { deep: true },
        )
        .setIn(
          ['allIds'],
          // @ts-expect-error
          payload.results.map((l: ReplacementRequest) => l.id),
        )
        .setIn(['count'], payload.count)
        .setIn(['page'], payload.page),
    [fetchAllReplacementRequestsActions.successPending.toString()]: (
      state,
      { payload },
    ) =>
      state
        .merge(
          {
            pendingRequests: {
              // @ts-expect-error
              byId: payload.results.reduce(
                (acc: any, l: ReplacementRequest) => ({ ...acc, [l.id]: l }),
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['pendingRequests', 'allIds'],
          // @ts-expect-error
          payload.results.map((l: ReplacementRequest) => l.id),
        )
        .setIn(['pendingRequests', 'count'], payload.count)
        .setIn(['pendingRequests', 'page'], payload.page),
    [fetchAllReplacementRequestsActions.successTeacherFound.toString()]: (
      state,
      { payload },
    ) =>
      state
        .merge(
          {
            teacherFoundRequests: {
              // @ts-expect-error
              byId: payload.results.reduce(
                (acc: any, l: ReplacementRequest) => ({ ...acc, [l.id]: l }),
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['teacherFoundRequests', 'allIds'],
          // @ts-expect-error
          payload.results.map((l: ReplacementRequest) => l.id),
        )
        .setIn(['teacherFoundRequests', 'count'], payload.count)
        .setIn(['teacherFoundRequests', 'page'], payload.page),
    [createReplacementRequestBulkActions.loading.toString()]: (
      state,
      { payload },
    ) => state.set('loading', payload),
    [createReplacementRequestBulkActions.error.toString()]: (
      state,
      { payload },
    ) => state.set('error', payload),
    [createReplacementRequestBulkActions.success.toString()]: (
      state,
      { payload },
    ) =>
      state
        .merge(
          {
            // @ts-expect-error
            byId: payload.reduce(
              (acc: any, l: ReplacementRequest) => ({ ...acc, [l.id]: l }),
              {},
            ),
          },
          { deep: true },
        )
        .setIn(
          ['allIds'],
          // @ts-expect-error
          payload.map((l: ReplacementRequest) => l.id),
        ),
    [fetchHasUnseenConfirmedRequestsActions.success.toString()]: (
      state,
      { payload },
    ) => state.setIn(['teacherFoundRequests', 'hasUnseen'], payload),
    [fetchHasRequestsLinkedToCancelledOffersActions.loading.toString()]: (
      state,
      { payload },
    ) =>
      state.setIn(['hasRequestsLinkedToCancelledOffers', 'loading'], payload),
    [fetchHasRequestsLinkedToCancelledOffersActions.error.toString()]: (
      state,
      { payload },
    ) => state.setIn(['hasRequestsLinkedToCancelledOffers', 'error'], payload),
    [fetchHasRequestsLinkedToCancelledOffersActions.success.toString()]: (
      state,
      { payload },
    ) => state.setIn(['hasRequestsLinkedToCancelledOffers', 'exists'], payload),
    [fetchAllReplacementRequestCoachAnswersActions.loading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['replacementRequestCoachAnswer', 'loading'], payload),
    [fetchAllReplacementRequestCoachAnswersActions.error.toString()]: (
      state,
      { payload },
    ) => state.setIn(['replacementRequestCoachAnswer', 'error'], payload),
    [fetchAllReplacementRequestCoachAnswersActions.success.toString()]: (
      state,
      { payload },
    ) =>
      state
        .merge(
          {
            replacementRequestCoachAnswer: {
              // @ts-expect-error
              byId: payload.reduce(
                (acc: any, l: ReplacementRequestCoachAnswer) => ({
                  ...acc,
                  [l.id]: l,
                }),
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['replacementRequestCoachAnswer', 'allIds'],
          uniq([
            ...state.replacementRequestCoachAnswer.allIds,
            // @ts-expect-error
            ...payload.map((coachAnswer) => coachAnswer.id),
          ]),
        ),
    [updateReplacementRequestActions.loading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['updateRequest', 'loading'], payload),
    [updateReplacementRequestActions.error.toString()]: (state, { payload }) =>
      state.setIn(['updateRequest', 'error'], payload),
    [updateReplacementRequestActions.success.toString()]: (
      state,
      { payload },
    ) =>
      // @ts-expect-error
      state.setIn(['byId', payload.id], payload),
    // Coach discipline group
    [deleteDisciplineGroupActions.loading.toString()]: (state, { payload }) =>
      state.setIn(['disciplineGroup', 'loading'], payload),
    [deleteDisciplineGroupActions.error.toString()]: (state, { payload }) =>
      state.setIn(['disciplineGroup', 'error'], payload),
    [createDisciplineGroupActions.loading.toString()]: (state, { payload }) =>
      state.setIn(['disciplineGroup', 'loading'], payload),
    [createDisciplineGroupActions.error.toString()]: (state, { payload }) =>
      state.setIn(['disciplineGroup', 'error'], payload),
    [createDisciplineGroupActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) =>
      state
        .setIn(
          ['disciplineGroup', 'allIds'],
          [...state.disciplineGroup.allIds, payload.id],
        )
        .setIn(['disciplineGroup', 'byId', payload.id], payload),
    [fetchDisciplineGroupListActions.loading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['disciplineGroup', 'loading'], payload),
    [fetchDisciplineGroupListActions.error.toString()]: (state, { payload }) =>
      state.setIn(['disciplineGroup', 'error'], payload),
    [fetchDisciplineGroupListActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) =>
      state
        .setIn(
          ['disciplineGroup', 'allIds'],
          // @ts-expect-error
          payload.map((group) => group.id),
        )
        .merge(
          {
            disciplineGroup: {
              // @ts-expect-error
              byId: payload.reduce((acc, group) => {
                acc[group.id] = group;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        ),
    [updateDisciplineGroupActions.loading.toString()]: (state, { payload }) =>
      state.setIn(['disciplineGroup', 'loading'], payload),
    [updateDisciplineGroupActions.error.toString()]: (state, { payload }) =>
      state.setIn(['disciplineGroup', 'error'], payload),
    [updateDisciplineGroupActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['disciplineGroup', 'byId', payload.id], payload),
    [fetchReplacementRequestConfigurationActions.loading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['configuration', 'loading'], payload),
    [fetchReplacementRequestConfigurationActions.error.toString()]: (
      state,
      { payload },
    ) => state.setIn(['configuration', 'error'], payload),
    [fetchReplacementRequestConfigurationActions.success.toString()]: (
      state,
      { payload },
    ) => state.setIn(['configuration', 'configuration'], payload),
    [updateReplacementRequestConfigurationActions.loading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['configuration', 'loading'], payload),
    [updateReplacementRequestConfigurationActions.error.toString()]: (
      state,
      { payload },
    ) => state.setIn(['configuration', 'error'], payload),
    [updateReplacementRequestConfigurationActions.success.toString()]: (
      state,
      { payload },
    ) => state.setIn(['configuration', 'configuration'], payload),
    [fetchSubstitutionHistoryActions.loading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['substitutionHistory', 'loading'], payload),
    [fetchSubstitutionHistoryActions.error.toString()]: (state, { payload }) =>
      state.setIn(['substitutionHistory', 'error'], payload),
    [fetchSubstitutionHistoryActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          results: SubstitutionHistoryItem[];
          count: number;
          page: number;
        };
      },
    ) =>
      state
        .setIn(['substitutionHistory', 'items'], payload.results)
        .setIn(['substitutionHistory', 'count'], payload.count)
        .setIn(['substitutionHistory', 'page'], payload.page),
  },
  initialState,
);
