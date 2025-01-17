import React from 'react';
import { TutorialLessonFactory, TutorialSectionFactory } from '../factories';

import TutorialLessonHeader, { Props } from './TutorialLessonHeader.component';

const section_completed = TutorialSectionFactory(1, 1, 5, true);
const section_no_completed = TutorialSectionFactory(1, 1, 4, false);
const lesson1 = TutorialLessonFactory(1, 1, 1, true);
const lesson2 = TutorialLessonFactory(2, 2, 1, false);
const lesson3 = TutorialLessonFactory(3, 3, 1, true);
const lesson4 = TutorialLessonFactory(4, 4, 1, false);

const CustomTemplate = (args: Props) => {
  const [selectedLesson, setSelectedLesson] = React.useState(
    section_completed.lessons[1],
  );
  const goToLesson = (
    sectionId: number | string,
    lessonId: number | string,
  ) => {
    // @ts-expect-error
    setSelectedLesson(section_completed.lessons[lessonId]);
  };
  return (
    <TutorialLessonHeader
      {...args}
      selectedLesson={selectedLesson}
      goToLesson={goToLesson}
    />
  );
};

export const TutorialLessonHeaderAllCompleted = CustomTemplate.bind({});

TutorialLessonHeaderAllCompleted.args = {
  section: section_completed,
  selectedLesson: section_completed.lessons[1],
  goToLesson: () => {},
};

export const TutorialLessonHeaderNoCompleted = CustomTemplate.bind({});

TutorialLessonHeaderNoCompleted.args = {
  section: section_no_completed,
  selectedLesson: section_completed.lessons[1],
  goToLesson: () => {},
};

export const TutorialLessonHeaderSomeCompleted = CustomTemplate.bind({});

TutorialLessonHeaderSomeCompleted.args = {
  section: {
    translated_name: 'Section test',
    lessons: [lesson1, lesson2, lesson3, lesson4],
    upsell_identifiers: [],
  },
  selectedLesson: lesson2,
  goToLesson: () => {},
};

export const TutorialLessonHeaderNoSection = CustomTemplate.bind({});

TutorialLessonHeaderNoSection.args = {
  section: false,
  selectedLesson: lesson2,
  goToLesson: () => {},
};

export default {
  title: 'Library/Tutorial/TutorialLessonHeader',
  component: TutorialLessonHeader,
  parameters: {
    docs: {
      page: null,
    },
  },
};
