import { createAction } from 'redux-actions';

import type { Dispatch, OptionCallback } from '../../state/types';
import type {
  TutorialLessonQueryParams,
  TutorialSectionQueryParams,
  TutorialCompletion,
  TutorialSection,
  TutorialLesson,
  TutorialLessonUserStatusQueryParams,
} from './types';
import {
  fetchListTutorialSections as fetchListTutorialSectionsAPI,
  retrieveTutorialSection as retrieveTutorialSectionAPI,
  fetchListTutorialLessons as fetchListTutorialLessonsAPI,
  retrieveTutorialLesson as retrieveTutorialLessonAPI,
  fetchUserTutorialCompletion as fetchUserTutorialCompletionAPI,
  updateTutorialLessonViewedStatus as updateTutorialLessonViewedStatusAPI,
  updateTutorialLessonCompletedStatus as updateTutorialLessonCompletedStatusAPI,
  updateUserAcknowlegdeTutorial as updateUserAcknowlegdeTutorialAPI,
} from './api';

export const listTutorialSectionActions = {
  error: createAction('TUTORIAL_SECTION/LIST/ERROR'),
  isLoading: createAction('TUTORIAL_SECTION/LIST/IS_LOADING'),
  success: createAction('TUTORIAL_SECTION/LIST/SUCCESS'),
};

export function fetchListTutorialSections(
  params?: TutorialSectionQueryParams,
  options?: OptionCallback<TutorialSection>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listTutorialSectionActions.error(null));
    dispatch(listTutorialSectionActions.isLoading(true));
    try {
      const response = await fetchListTutorialSectionsAPI(params);
      dispatch(listTutorialSectionActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listTutorialSectionActions.error(err));
      options?.onError && options.onError(err);
    }
    dispatch(listTutorialSectionActions.isLoading(false));
  };
}
export const retrieveTutorialSectionActions = {
  error: createAction('TUTORIAL_SECTION/RETRIEVE/ERROR'),
  isLoading: createAction('TUTORIAL_SECTION/RETRIEVE/IS_LOADING'),
  success: createAction('TUTORIAL_SECTION/RETRIEVE/SUCCESS'),
};

export function retrieveTutorialSection(
  params?: TutorialSectionQueryParams,
  options?: OptionCallback<TutorialSection>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveTutorialSectionActions.error(null));
    dispatch(retrieveTutorialSectionActions.isLoading(true));
    try {
      const response = await retrieveTutorialSectionAPI(params);
      dispatch(retrieveTutorialSectionActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(retrieveTutorialSectionActions.error(err));
      options?.onError && options.onError(err);
    }
    dispatch(retrieveTutorialSectionActions.isLoading(false));
  };
}

export const listTutorialLessonActions = {
  error: createAction('TUTORIAL_LESSON/LIST/ERROR'),
  isLoading: createAction('TUTORIAL_LESSON/LIST/IS_LOADING'),
  success: createAction('TUTORIAL_LESSON/LIST/SUCCESS'),
};

export function fetchListTutorialLessons(
  params?: TutorialLessonQueryParams,
  options?: OptionCallback<TutorialLesson>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listTutorialLessonActions.error(null));
    dispatch(listTutorialLessonActions.isLoading(true));
    try {
      const response = await fetchListTutorialLessonsAPI(params);
      dispatch(listTutorialLessonActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listTutorialLessonActions.error(err));
      options?.onError && options.onError(err);
    }
    dispatch(listTutorialLessonActions.isLoading(false));
  };
}

export const retrieveTutorialLessonActions = {
  error: createAction('TUTORIAL_LESSON/RETRIEVE/ERROR'),
  isLoading: createAction('TUTORIAL_LESSON/RETRIEVE/IS_LOADING'),
  success: createAction('TUTORIAL_LESSON/RETRIEVE/SUCCESS'),
};

export function retrieveTutorialLesson(
  params?: TutorialLessonQueryParams,
  options?: OptionCallback<TutorialLesson>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveTutorialLessonActions.error(null));
    dispatch(retrieveTutorialLessonActions.isLoading(true));
    try {
      const response = await retrieveTutorialLessonAPI(params);
      dispatch(retrieveTutorialLessonActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(retrieveTutorialLessonActions.error(err));
      options?.onError && options.onError(err);
    }
    dispatch(retrieveTutorialLessonActions.isLoading(false));
  };
}

export const detailTutorialCompletionActions = {
  error: createAction('TUTORIAL_COMPLETION/DETAIL/ERROR'),
  isLoading: createAction('TUTORIAL_COMPLETION/DETAIL/IS_LOADING'),
  success: createAction('TUTORIAL_COMPLETION/DETAIL/SUCCESS'),
};

export function fetchUserTutorialCompletion(
  params?: TutorialLessonUserStatusQueryParams,
  options?: OptionCallback<TutorialCompletion>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(detailTutorialCompletionActions.error(null));
    dispatch(detailTutorialCompletionActions.isLoading(true));
    try {
      const response = await fetchUserTutorialCompletionAPI(params);
      dispatch(detailTutorialCompletionActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(detailTutorialCompletionActions.error(err));
      options?.onError && options.onError(err);
    }
    dispatch(detailTutorialCompletionActions.isLoading(false));
  };
}

export const updateTutorialLessonUserCompletionStatusAction = {
  error: createAction('CREATE_OR_UPDATE_TUTORIAL_COMPLETION/DETAIL/ERROR'),
  isLoading: createAction(
    'CREATE_OR_UPDATE_TUTORIAL_COMPLETION/DETAIL/IS_LOADING',
  ),
  success: createAction('CREATE_OR_UPDATE_TUTORIAL_COMPLETION/DETAIL/SUCCESS'),
};

export function updateTutorialLessonViewedStatus(
  params?: TutorialLessonUserStatusQueryParams,
  options?: OptionCallback<TutorialCompletion>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateTutorialLessonUserCompletionStatusAction.error(null));
    dispatch(updateTutorialLessonUserCompletionStatusAction.isLoading(true));
    try {
      const response = await updateTutorialLessonViewedStatusAPI(params);

      dispatch(
        updateTutorialLessonUserCompletionStatusAction.success(response.data),
      );
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateTutorialLessonUserCompletionStatusAction.error(err));
      options?.onError && options.onError(err);
    }
    dispatch(updateTutorialLessonUserCompletionStatusAction.isLoading(false));
  };
}

export function updateTutorialLessonCompletedStatus(
  params?: TutorialLessonUserStatusQueryParams,
  options?: OptionCallback<TutorialCompletion>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateTutorialLessonUserCompletionStatusAction.error(null));
    dispatch(updateTutorialLessonUserCompletionStatusAction.isLoading(true));
    try {
      const response = await updateTutorialLessonCompletedStatusAPI(params);

      dispatch(
        updateTutorialLessonUserCompletionStatusAction.success(response.data),
      );
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateTutorialLessonUserCompletionStatusAction.error(err));
      options?.onError && options.onError(err);
    }
    dispatch(updateTutorialLessonUserCompletionStatusAction.isLoading(false));
  };
}

export function updateUserAcknowlegdeTutorial(
  options?: OptionCallback<TutorialCompletion>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateTutorialLessonUserCompletionStatusAction.error(null));
    dispatch(updateTutorialLessonUserCompletionStatusAction.isLoading(true));
    try {
      const response = await updateUserAcknowlegdeTutorialAPI();

      dispatch(
        updateTutorialLessonUserCompletionStatusAction.success(response.data),
      );
      options?.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateTutorialLessonUserCompletionStatusAction.error(err));
      options?.onError && options.onError(err);
    }
    dispatch(updateTutorialLessonUserCompletionStatusAction.isLoading(false));
  };
}
