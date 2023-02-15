import { memoize } from 'lodash';
import { createSelector } from 'reselect';

import { RootState } from '../../reducers';
import { TutorialCompletion, TutorialLesson, TutorialSection } from './types';
import { checkRequiredPermissions } from '../role/utils';
import { getPermissions } from '../role/selectors';
import { platformTutorialActivated } from './utils';
// SECTION
const _getTutorialSectionAllIds = (state: RootState) =>
  state.tutorial.section.allIds;
const _getTutorialSectionbyId = (state: RootState) =>
  state.tutorial.section.byId;

// LESSON
const _getTutorialLessonAllIds = (state: RootState) =>
  state.tutorial.lesson.allIds;
const _getTutorialLessonbyId = (state: RootState) => state.tutorial.lesson.byId;

export const getTutorialLessonLoadingState = (state: RootState) =>
  state.tutorial.lesson.loading;

// TUTORIAL COMPLETION
const _getTutorialUserStatusState = (state: RootState) =>
  state.tutorial.tutorial_user_status;

const _getTutorialUserStatusLoadingState = (state: RootState) =>
  state.tutorial.tutorial_user_status.loading;
export const getUserTutorialCompletion = (state: RootState) =>
  _getTutorialUserStatusState(state).tutorial_completion;

export const userAcknowlegdePlatformTutorial = createSelector(
  [
    getUserTutorialCompletion,
    getPermissions,
    _getTutorialUserStatusLoadingState,
  ],
  (tutorialCompletion, permissions, loading) => {
    if (
      !permissions ||
      tutorialCompletion?.has_seen_tutorial_section_timestamp === null ||
      tutorialCompletion?.has_seen_tutorial_section_timestamp === 0 ||
      loading ||
      !platformTutorialActivated()
    ) {
      return true;
    }
    const checkTutorialPermission = checkRequiredPermissions(
      'navigationMenu.tutorial',
      permissions,
    );

    return (
      !checkTutorialPermission ||
      tutorialCompletion?.has_seen_tutorial_section_timestamp !== 0
    );
  },
);
export const getUserTutorialStatistics = (state: RootState) =>
  _getTutorialUserStatusState(state).statistics;

const translateSection = (
  section: TutorialSection,
  language: 'en' | 'fr' | 'es' | 'nl' | 'de' | 'it',
) => {
  return {
    ...section,
    translated_name: section?.names[language] || section?.names?.en,
  };
};
export const translateLesson = (
  lesson: TutorialLesson,
  language: 'en' | 'fr' | 'es' | 'nl' | 'de' | 'it',
) => {
  return {
    ...lesson,
    translated_name: lesson?.names[language] || lesson?.names?.en,
    translated_videolink:
      lesson?.videolinks[language] || lesson?.videolinks?.en,
    translated_body: lesson?.bodies[language] || lesson?.bodies?.en,
  };
};

export const translateSectionsWithLessons = memoize(
  (selector: (state: RootState, language: string) => any) =>
    createSelector(
      [selector, (state, lng) => lng],
      (
        sectionsWithLessons: TutorialSection[] | TutorialSection,
        userLanguage: 'en' | 'fr' | 'es' | 'nl' | 'de' | 'it',
      ) => {
        if (!sectionsWithLessons) {
          return sectionsWithLessons;
        }
        if (Array.isArray(sectionsWithLessons)) {
          return sectionsWithLessons.map(
            (sectionAndLessons: TutorialSection) => ({
              ...translateSection(sectionAndLessons, userLanguage),
              lessons: sectionAndLessons?.lessons?.map((_lesson) => ({
                ...translateLesson(_lesson, userLanguage),
              })),
            }),
          );
        }
        return {
          ...translateSection(sectionsWithLessons, userLanguage),
          lessons: sectionsWithLessons?.lessons?.map((_lesson) => ({
            ...translateLesson(_lesson, userLanguage),
          })),
        };
      },
    ),
);

export const getAllTutorialSectionList = createSelector(
  [_getTutorialSectionAllIds, _getTutorialSectionbyId],
  (ids, data) => ids.map((id) => data[id]),
);

export const getTutorialSection =
  (id: number | string) => (state: RootState) => {
    return _getTutorialSectionbyId(state)[id];
  };
export const getTutorialLesson =
  (id: number | string) => (state: RootState) => {
    return _getTutorialLessonbyId(state)[id];
  };

export const getAllTutorialLessonList = createSelector(
  [_getTutorialLessonAllIds, _getTutorialLessonbyId],
  (ids, data) => ids.map((id) => data[id]),
);

export const withLessons = memoize((selector) =>
  createSelector(
    [selector, getAllTutorialLessonList],
    (
      section: Array<TutorialSection> | TutorialSection,
      tutorialLessonList: Array<TutorialLesson>,
    ) => {
      if (!section) return section;
      if (!Array.isArray(section)) {
        return {
          ...section,
          lessons: (tutorialLessonList || []).filter((l) =>
            [section.id, section.uuid].includes(l.section),
          ),
        };
      }
      return section.map((s) => ({
        ...s,
        lessons: (tutorialLessonList || []).filter((l) =>
          [s.id, s.uuid].includes(l.section),
        ),
      }));
    },
  ),
);

export const withLessonTutorialCompletion = memoize(
  (selector: (state: RootState, id?: number) => any) =>
    createSelector(
      [selector, getUserTutorialCompletion],
      (
        lesson: TutorialLesson[] | TutorialLesson,
        tutorial_completion: TutorialCompletion,
      ) => {
        if (!lesson) return null;
        if (!Array.isArray(lesson)) {
          return {
            ...lesson,
            completed: (tutorial_completion?.completed_by_section_id || {})[
              lesson?.section
            ]?.includes(lesson?.id),
            viewed: (tutorial_completion?.viewed_by_section_id || {})[
              lesson?.section
            ]?.includes(lesson?.id),
          };
        }
        return lesson?.map((l: TutorialLesson) => ({
          ...l,
          completed: (tutorial_completion?.completed_by_section_id || {})[
            l?.section
          ]?.includes(l?.id),
          viewed: (tutorial_completion?.viewed_by_section_id || {})[
            l?.section
          ]?.includes(l?.id),
        }));
      },
    ),
);
export const withSectionTutorialCompletion = memoize(
  (selector: (state: RootState, id?: number) => any) =>
    createSelector(
      [selector, getUserTutorialCompletion],
      (
        section: TutorialSection[] | TutorialSection,
        tutorial_completion: TutorialCompletion,
      ) => {
        if (!section) return null;
        if (!Array.isArray(section)) {
          return {
            ...section,
            completed:
              (tutorial_completion?.completed_by_section_id || {})[section?.id]
                ?.length === section?.lessons?.length,
            viewed:
              (tutorial_completion?.viewed_by_section_id || {})[section?.id]
                ?.length === section?.lessons?.length,
            lessons: (section?.lessons || [])?.map((lesson: TutorialLesson) => {
              return {
                ...lesson,
                completed: (tutorial_completion?.completed_by_section_id || {})[
                  section?.id
                ]?.includes(lesson?.id),
                viewed: (tutorial_completion?.viewed_by_section_id || {})[
                  section?.id
                ]?.includes(lesson?.id),
              };
            }),
          };
        }
        return section?.map((s: TutorialSection) => ({
          ...s,
          completed:
            (tutorial_completion?.completed_by_section_id || {})[s?.id]
              ?.length === s?.lessons?.length,
          viewed:
            (tutorial_completion?.viewed_by_section_id || {})[s?.id]?.length ===
            s?.lessons?.length,
          lessons: (s?.lessons || [])?.map((lesson: TutorialLesson) => {
            return {
              ...lesson,
              completed: (tutorial_completion?.completed_by_section_id || {})[
                s?.id
              ]?.includes(lesson?.id),
              viewed: (tutorial_completion?.viewed_by_section_id || {})[
                s?.id
              ]?.includes(lesson?.id),
            };
          }),
        }));
      },
    ),
);
