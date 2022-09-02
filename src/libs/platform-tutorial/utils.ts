import { TutorialCompletion, TutorialLesson } from './types';

export const isLessonCompleted = (
  lesson: TutorialLesson,
  tutorial_completion: TutorialCompletion,
) =>
  (
    (tutorial_completion?.completed_by_section_id || {})[lesson.section] || []
  ).includes(lesson.id);

export const isLessonViewed = (
  lesson: TutorialLesson,
  tutorial_completion: TutorialCompletion,
) =>
  (
    (tutorial_completion?.viewed_by_section_id || {})[lesson.section] || []
  ).includes(lesson.id);
