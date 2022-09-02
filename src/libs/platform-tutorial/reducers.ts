import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  // SECTION
  listTutorialSectionActions,
  retrieveTutorialSectionActions,
  // LESSON
  listTutorialLessonActions,
  retrieveTutorialLessonActions,
  // COMPLETION
  detailTutorialCompletionActions,
  updateTutorialLessonUserCompletionStatusAction,
} from './actions';

import type { TutorialLesson, TutorialSection, TutorialState } from './types';

const initialState: Immutable.Immutable<TutorialState> =
  Immutable<TutorialState>({
    section: {
      loading: false,
      error: null,
      byId: {},
      allIds: [],
    },
    lesson: {
      loading: false,
      error: null,
      byId: {},
      allIds: [],
    },
    tutorial_user_status: {
      loading: false,
      error: null,
      statistics: {},
      all_tutorial_lessons: {},
      tutorial_completion: {
        has_seen_tutorial_section_timestamp: null,
        completed_by_section_id: {},
        viewed_by_section_id: {},
      },
    },
  });

export default handleActions<Immutable.Immutable<TutorialState>, any>(
  {
    [listTutorialSectionActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['section', 'allIds'],
          payload.map((pc: TutorialSection) => pc.id),
        )
        .merge(
          {
            section: {
              byId: payload.reduce(
                (
                  acc: { [id: number | string]: TutorialSection },
                  ps: TutorialSection,
                ) => {
                  acc[ps.id] = ps;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },

    [listTutorialSectionActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['section', 'loading'], payload);
    },
    [listTutorialSectionActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['section', 'error'], payload);
    },
    [retrieveTutorialSectionActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['section', 'loading'], payload);
    },
    [retrieveTutorialSectionActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['section', 'error'], payload);
    },
    [retrieveTutorialSectionActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['section', 'allIds'], [payload.id])
        .setIn(['section', 'byId', payload.id], payload);
    },

    [listTutorialLessonActions.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            lesson: {
              byId: payload.reduce(
                (
                  acc: { [id: number | string]: TutorialLesson },
                  ps: TutorialLesson,
                ) => {
                  acc[ps.id] = ps;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['lesson', 'allIds'],
          payload.map((pc: TutorialLesson) => pc.id),
        );
    },

    [listTutorialLessonActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['lesson', 'loading'], payload);
    },

    [listTutorialLessonActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['lesson', 'error'], payload);
    },
    [retrieveTutorialLessonActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['lesson', 'loading'], payload);
    },

    [retrieveTutorialLessonActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['lesson', 'error'], payload);
    },
    [retrieveTutorialLessonActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['lesson', 'allIds'], [payload.id])
        .setIn(['lesson', 'byId', payload.id], payload);
    },

    [detailTutorialCompletionActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['tutorial_user_status', 'tutorial_completion'],
          payload.tutorial_completion,
        )
        .setIn(
          ['tutorial_user_status', 'all_tutorial_lessons'],
          payload.all_tutorial_lessons,
        )
        .setIn(['tutorial_user_status', 'statistics'], payload.statistics);
    },

    [detailTutorialCompletionActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['tutorial_user_status', 'loading'], payload);
    },

    [detailTutorialCompletionActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['tutorial_user_status', 'error'], payload);
    },
    [updateTutorialLessonUserCompletionStatusAction.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['tutorial_user_status', 'tutorial_completion'],
          payload.tutorial_completion,
        )
        .setIn(
          ['tutorial_user_status', 'all_tutorial_lessons'],
          payload.all_tutorial_lessons,
        )
        .setIn(['tutorial_user_status', 'statistics'], payload.statistics);
    },

    [updateTutorialLessonUserCompletionStatusAction.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['tutorial_user_status', 'loading'], payload);
    },

    [updateTutorialLessonUserCompletionStatusAction.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['tutorial_user_status', 'error'], payload);
    },
  },
  initialState,
);
