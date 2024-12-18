import { API_V1_URI, buildUrlParams, getAuth, postAuth } from '../../http';
import type {
  TutorialSectionQueryParams,
  TutorialLessonQueryParams,
  TutorialLessonUserStatusQueryParams,
} from './types';

// SECTION
export const fetchListTutorialSections = async (
  params: TutorialSectionQueryParams,
) => {
  return getAuth(
    `${API_V1_URI}/platform_tutorial/section/${buildUrlParams(params)}`,
  );
};

export const retrieveTutorialSection = async (
  params: TutorialSectionQueryParams,
) => {
  return getAuth(
    `${API_V1_URI}/platform_tutorial/section/me/${buildUrlParams(params)}`,
  );
};

// LESSON
export const fetchListTutorialLessons = async (
  params: TutorialLessonQueryParams,
) => {
  return getAuth(
    `${API_V1_URI}/platform_tutorial/lesson/${buildUrlParams(params)}`,
  );
};

export const retrieveTutorialLesson = async (
  params: TutorialLessonQueryParams,
) => {
  return getAuth(
    `${API_V1_URI}/platform_tutorial/lesson/me/${buildUrlParams(params)}`,
  );
};

// COMPLETION
export const fetchUserTutorialCompletion = async (
  params: TutorialLessonUserStatusQueryParams,
) => {
  return getAuth(
    `${API_V1_URI}/platform_tutorial/lesson_user_status/me/${buildUrlParams(
      params,
    )}`,
  );
};

export const updateTutorialLessonViewedStatus = async (
  params: TutorialLessonUserStatusQueryParams,
) => {
  return postAuth(
    `${API_V1_URI}/platform_tutorial/lesson_user_status/me/update_tutorial_lesson_completion/`,
    { ...params, viewed: true },
  );
};

export const updateTutorialLessonCompletedStatus = async (
  params: TutorialLessonUserStatusQueryParams,
) => {
  return postAuth(
    `${API_V1_URI}/platform_tutorial/lesson_user_status/me/update_tutorial_lesson_completion/`,
    { ...params, completed: true },
  );
};

export const updateUserAcknowlegdeTutorial = async () => {
  return postAuth(
    `${API_V1_URI}/platform_tutorial/lesson_user_status/me/update_user_acknowledge_tutorial/`,
  );
};
