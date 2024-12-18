import React from 'react';
import { TutorialSectionsFactory } from '../factories';

import TutorialSectionList, { Props } from './TutorialSectionList.component';

const CustomTemplate = (args: Props) => <TutorialSectionList {...args} />;

export const TutorialSectionListCompleted = CustomTemplate.bind({});

TutorialSectionListCompleted.args = {
  sections: TutorialSectionsFactory(4, undefined, true, false, false),
  //
  shareSection: (id: number) => {
    alert(`Share section of id : ${id}`);
  },
  shareLesson: (id: number) => {
    alert(`Share lesson of id : ${id}`);
  },
  goToLesson: (id: number) => {
    alert(`Go to lesson of id : ${id}`);
  },
};
export const TutorialSectionListAddOnAndNew = CustomTemplate.bind({});

TutorialSectionListAddOnAndNew.args = {
  sections: TutorialSectionsFactory(4, undefined, false, true, true),
  //
  shareSection: (id: number) => {
    alert(`Share section of id : ${id}`);
  },
  shareLesson: (id: number) => {
    alert(`Share lesson of id : ${id}`);
  },
  goToLesson: (id: number) => {
    alert(`Go to lesson of id : ${id}`);
  },
};
export const TutorialSectionListRandom = CustomTemplate.bind({});

TutorialSectionListRandom.args = {
  sections: TutorialSectionsFactory(4),
  //
  shareSection: (id: number) => {
    alert(`Share section of id : ${id}`);
  },
  shareLesson: (id: number) => {
    alert(`Share lesson of id : ${id}`);
  },
  goToLesson: (id: number) => {
    alert(`Go to lesson of id : ${id}`);
  },
};

export default {
  title: 'Library/Tutorial/TutorialSectionList',
  component: TutorialSectionList,
  parameters: {
    docs: {
      page: null,
    },
  },
};
