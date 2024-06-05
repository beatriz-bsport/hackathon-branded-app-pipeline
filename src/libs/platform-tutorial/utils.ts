import SeamlessImmutable from 'seamless-immutable';
import { FeatureList } from '#libs/company/types';
import { hasUpsell } from '#libs/platform-billing/utils';
import { TutorialCompletion, TutorialLesson } from './types';

export const isLessonCompleted = (
  lesson: TutorialLesson,
  tutorial_completion:
    | TutorialCompletion
    | SeamlessImmutable.ImmutableObject<TutorialCompletion>,
) =>
  (
    (tutorial_completion?.completed_by_section_id || {})[lesson.section] || []
  ).includes(lesson.id);

export const isLessonViewed = (
  lesson: TutorialLesson,
  tutorial_completion:
    | TutorialCompletion
    | SeamlessImmutable.ImmutableObject<TutorialCompletion>,
) =>
  (
    (tutorial_completion?.viewed_by_section_id || {})[lesson.section] || []
  ).includes(lesson.id);

export const platformTutorialActivated = () => {
  return true;
};

export const isUpsellNotSubscribed = (
  lesson: TutorialLesson,
  featureList: FeatureList,
) => {
  const isUpsell = lesson?.upsell_identifiers?.length > 0;
  if (isUpsell) {
    return !hasUpsell(featureList, lesson?.upsell_identifiers[0]);
  }
  return false;
};
