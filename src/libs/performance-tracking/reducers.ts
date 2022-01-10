import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import { handleActions } from 'redux-actions';
import { PerformanceTrackingState } from './types';
import {
  MemberProgramListActions,
  MetricListActions,
  ProgramCreateOrUpdateActions,
  ProgramListActions,
  disableMemberProgramActions,
  MemberProgramCreateOrUpdateOrRetrieveActions,
  ProgramEnableOrDisableActions,
} from './actions';

const initialState: Immutable.Immutable<PerformanceTrackingState> =
  Immutable<PerformanceTrackingState>({
    program: {
      allIds: [],

      byId: {},
      loading: false,
      error: null,
      createOrUpdate: {
        loading: false,
        error: null,
      },
      disabled: {
        loading: false,
        error: null,
      },
      delete: {
        loading: false,
        error: null,
      },
    },
    memberProgram: {
      allIds: [],
      byMemberId: {},
      byId: {},
      loading: false,
      error: null,
      createOrUpdate: {
        loading: false,
        error: null,
      },
    },
    metricList: {
      loading: false,
      error: null,
      byId: {},
      byProgramId: {},
    },
  });

export default handleActions(
  {
    [ProgramListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['program', 'error'], payload);
    },
    [ProgramListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['program', 'loading'], payload);
    },
    [ProgramListActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['program', 'allIds'],
          uniq([
            ...state.program.allIds,
            ...payload.map((program) => program.id),
          ]),
        )
        .merge(
          {
            program: {
              byId: payload.reduce((acc, program) => {
                acc[program.id] = program;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [MemberProgramListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['memberProgram', 'error'], payload);
    },
    [MemberProgramListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['memberProgram', 'loading'], payload);
    },
    [MemberProgramListActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['memberProgram', 'allIds'],

          payload.map((memberProgram) => memberProgram.id),
        )
        .merge(
          {
            memberProgram: {
              byId: payload.reduce((acc, memberProgram) => {
                acc[memberProgram.id] = memberProgram;
                return acc;
              }, {}),
              byMemberId: payload.reduce((acc, memberProgram) => {
                acc[memberProgram.member] = Array.isArray(
                  acc[memberProgram.member],
                )
                  ? [...acc[memberProgram.member], memberProgram.id]
                  : [memberProgram.id];
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [ProgramEnableOrDisableActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['program', 'delete', 'error'], payload);
    },
    [ProgramEnableOrDisableActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['program', 'delete', 'loading'], payload);
    },
    [ProgramEnableOrDisableActions.success.toString()]: (
      state,
      { payload },
    ) => {
      if (!state.program.allIds.find((id) => id === payload.id)) {
        return state
          .setIn(['program', 'byId', payload.id], payload)
          .setIn(['program', 'allIds'], [...state.program.allIds, payload.id]);
      }

      return state.setIn(['program', 'byId', payload.id], payload);
    },
    [MetricListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['metricList', 'error'], payload);
    },
    [MetricListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['metricList', 'loading'], payload);
    },
    [MetricListActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          metricList: {
            byId: payload.reduce((acc, metric) => {
              acc[metric.id] = metric;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [ProgramCreateOrUpdateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['program', 'createOrUpdate', 'error'], payload);
    },
    [ProgramCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['program', 'createOrUpdate', 'loading'], payload);
    },
    [ProgramCreateOrUpdateActions.success.toString()]: (state, { payload }) => {
      if (!state.program.allIds.find((id) => id === payload.id)) {
        return state
          .setIn(['program', 'byId', payload.id], {
            ...payload,
            metric_list: payload.metric_list.map((metric) => metric.id),
          })
          .setIn(['program', 'allIds'], [...state.program.allIds, payload.id])
          .merge(
            {
              metricList: {
                byId: payload.metric_list.reduce((acc, metric) => {
                  acc[metric.id] = metric;
                  return acc;
                }, {}),
              },
            },
            { deep: true },
          );
      }
      return state
        .setIn(['program', 'byId', payload.id], {
          ...payload,
          metric_list: payload.metric_list.map((metric) => metric.id),
        })
        .merge(
          {
            metricList: {
              byId: payload.metric_list.reduce((acc, metric) => {
                acc[metric.id] = metric;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [MemberProgramCreateOrUpdateOrRetrieveActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['memberProgram', 'createOrUpdate', 'error'], payload);
    },
    [MemberProgramCreateOrUpdateOrRetrieveActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['memberProgram', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [MemberProgramCreateOrUpdateOrRetrieveActions.success.toString()]: (
      state,
      { payload },
    ) => {
      if (!state.memberProgram.allIds.find((id) => id === payload.id)) {
        if (state.memberProgram.byMemberId[payload.member]) {
          return state
            .setIn(['memberProgram', 'byId', payload.id], payload)
            .setIn(
              ['memberProgram', 'allIds'],
              [...state.memberProgram.allIds, payload.id],
            )
            .setIn(
              ['memberProgram', 'byMemberId', payload.member],
              [...state.memberProgram.byMemberId[payload.member], payload.id],
            );
        }

        return state
          .setIn(['memberProgram', 'byId', payload.id], payload)
          .setIn(
            ['memberProgram', 'allIds'],
            [...state.memberProgram.allIds, payload.id],
          )
          .setIn(['memberProgram', 'byMemberId', payload.member], [payload.id]);
      }
      return state.setIn(['memberProgram', 'byId', payload.id], payload);
    },
    [disableMemberProgramActions.success.toString()]: (state, { payload }) => {
      return state.setIn(
        ['memberProgram', 'byId', payload.memberProgramId, 'is_disabled'],
        true,
      );
    },
  },
  initialState,
);
