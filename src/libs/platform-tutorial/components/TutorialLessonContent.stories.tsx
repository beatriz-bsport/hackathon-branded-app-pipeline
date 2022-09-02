import React from 'react';
import { TutorialSectionFactory } from '../factories';

import TutorialLessonContent, {
  Props,
} from './TutorialLessonContent.component';

const CustomTemplate = (args: Props) => <TutorialLessonContent {...args} />;

const section = TutorialSectionFactory(1, 1, 3);
const lesson_start = section.lessons[0];
const lesson_middle = section.lessons[1];
const lesson_end = section.lessons[2];
const options = {
  goToLesson: (id: number) => {
    alert(`Go to lesson of id : ${id}`);
  },
  goToFinish: () => {
    alert('End section!');
  },
};
const goToPreviousLesson = (id: number) => {
  if (id !== null) {
    alert(`Go to lesson of id : ${id}`);
  }
};
const goToNextLesson = (id: number) => {
  alert(`Go to lesson of id : ${id}`);
};
const goToFinish = () => {
  alert('End section!');
};

export const TutorialLessonHeaderMiddleOfSection = CustomTemplate.bind({});

TutorialLessonHeaderMiddleOfSection.args = {
  ...options,
  section: section,
  selectedLesson: lesson_middle,
  previousLessonId: lesson_start.id,
  nextLessonId: lesson_end.id,
};

export const TutorialLessonHeaderStartOfSection = CustomTemplate.bind({});

TutorialLessonHeaderStartOfSection.args = {
  ...options,
  section: section,
  selectedLesson: lesson_start,
  previousLessonId: null,
  nextLessonId: lesson_middle.id,
};
export const TutorialLessonHeaderEndOfSection = CustomTemplate.bind({});

TutorialLessonHeaderEndOfSection.args = {
  ...options,
  section: section,
  selectedLesson: lesson_end,
  previousLessonId: lesson_middle.id,
  nextLessonId: null,
};

export default {
  title: 'Library/Tutorial/TutorialLessonContent',
  component: TutorialLessonContent,
  parameters: {
    docs: {
      page: null,
    },
  },
};
