import React from 'react';
import { TutorialLessonsFactory } from '../factories';

import TutorialLessonList, { Props } from './TutorialLessonList.component';

const CustomTemplate = (args: Props) => <TutorialLessonList {...args} />;

export const TutorialLessonCompleted = CustomTemplate.bind({});

TutorialLessonCompleted.args = {
  lessons: TutorialLessonsFactory(5, 1, undefined, true, false),
  goToLesson: (id: number) => {
    alert(`Go to lesson of id : ${id}`);
  },
  shareLesson: (id: number) => {
    alert(`Share lesson of id : ${id}`);
  },
};

export const TutorialLessonNewAndAddOn = CustomTemplate.bind({});

TutorialLessonNewAndAddOn.args = {
  lessons: TutorialLessonsFactory(5, 1, undefined, false, true),
  goToLesson: (id: number) => {
    alert(`Go to lesson of id : ${id}`);
  },
  shareLesson: (id: number) => {
    alert(`Share lesson of id : ${id}`);
  },
};
export const TutorialLessonRandom = CustomTemplate.bind({});

TutorialLessonRandom.args = {
  lessons: TutorialLessonsFactory(10, 1),
  goToLesson: (id: number) => {
    alert(`Go to lesson of id : ${id}`);
  },
  shareLesson: (id: number) => {
    alert(`Share lesson of id : ${id}`);
  },
};

export default {
  title: 'Library/Tutorial/TutorialLessonList',
  component: TutorialLessonList,
  parameters: {
    docs: {
      page: null,
    },
  },
};
