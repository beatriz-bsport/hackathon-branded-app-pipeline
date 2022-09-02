import React from 'react';
import { TutorialLessonFactory, TutorialSectionFactory } from '../factories';

import TutorialLessonHeader, { Props } from './TutorialLessonHeader.component';

const CustomTemplate = (args: Props) => <TutorialLessonHeader {...args} />;

const section_completed = TutorialSectionFactory(1, 1, 20, true);
const lesson_completed = section_completed.lessons[1];

export const TutorialLessonHeaderAllCompleted = CustomTemplate.bind({});

TutorialLessonHeaderAllCompleted.args = {
  section: section_completed,
  selectedLesson: lesson_completed,
  goToLesson: (id: number) => {
    alert(`Go to lesson of id : ${id}`);
  },
};

const section_no_completed = TutorialSectionFactory(1, 1, 4, false);
const lesson_no_completed = section_completed.lessons[1];

export const TutorialLessonHeaderNoCompleted = CustomTemplate.bind({});

TutorialLessonHeaderNoCompleted.args = {
  section: section_no_completed,
  selectedLesson: lesson_no_completed,
  goToLesson: (id: number) => {
    alert(`Go to lesson of id : ${id}`);
  },
};

const lesson1 = TutorialLessonFactory(1, 1, 1, true);
const lesson2 = TutorialLessonFactory(2, 2, 1, false);
const lesson3 = TutorialLessonFactory(3, 3, 1, true);
const lesson4 = TutorialLessonFactory(4, 4, 1, false);

export const TutorialLessonHeaderSomeCompleted = CustomTemplate.bind({});

TutorialLessonHeaderSomeCompleted.args = {
  section: {
    name: 'Section test',
    lessons: [lesson1, lesson2, lesson3, lesson4],
  },
  selectedLesson: lesson2,
  goToLesson: (id: number) => {
    alert(`Go to lesson of id : ${id}`);
  },
};

export const TutorialLessonHeaderNoSection = CustomTemplate.bind({});

TutorialLessonHeaderNoSection.args = {
  section: false,
  selectedLesson: lesson2,
  goToLesson: (id: number) => {
    alert(`Go to lesson of id : ${id}`);
  },
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
