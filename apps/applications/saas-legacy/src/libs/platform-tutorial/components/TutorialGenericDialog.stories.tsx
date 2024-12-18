import React from 'react';
import {
  TUTORIAL_GENERIC_DIALOG_WELCOME,
  TUTORIAL_GENERIC_DIALOG_SECTION_FINISH,
  TUTORIAL_GENERIC_DIALOG_ALL_FINISH,
  TUTORIAL_GENERIC_DIALOG_SHARE_SECTION,
  TUTORIAL_GENERIC_DIALOG_SHARE_LESSON,
} from '#src/libs/platform-tutorial/constant';
import TutorialGenericDialog, {
  Props,
} from './TutorialGenericDialog.component';

const section = { translated_name: 'Super section', id: 1 };
const lesson = { translated_name: 'Super lesson', id: 1 };

const CustomTemplate = (args: Props) => <TutorialGenericDialog {...args} />;

export const TutorialWelcomeDialog = CustomTemplate.bind({});

TutorialWelcomeDialog.args = {
  open: true,
  identifier: TUTORIAL_GENERIC_DIALOG_WELCOME,
  onClose: console.log('Close Form and go to tutorial'),
  onCancel: console.log('Close Form without going to tutorial'),
};

export const TutorialSectionFinishDialog = CustomTemplate.bind({});

TutorialSectionFinishDialog.args = {
  open: true,
  identifier: TUTORIAL_GENERIC_DIALOG_SECTION_FINISH,
  onClose: () => console.log('Close Form'),
  object: section,
};

export const TutorialAllFinishDialog = CustomTemplate.bind({});

TutorialAllFinishDialog.args = {
  open: true,
  identifier: TUTORIAL_GENERIC_DIALOG_ALL_FINISH,
  onClose: console.log('Close Form'),
};

export const TutorialShareSectionDialog = CustomTemplate.bind({});

TutorialShareSectionDialog.args = {
  open: true,
  identifier: TUTORIAL_GENERIC_DIALOG_SHARE_SECTION,
  object: section,
  onClose: () =>
    console.log(`Share section ${section.translated_name} of id ${section.id}`),
};

export const TutorialShareLessonDialog = CustomTemplate.bind({});

TutorialShareLessonDialog.args = {
  open: true,
  identifier: TUTORIAL_GENERIC_DIALOG_SHARE_LESSON,
  object: lesson,
  onClose: () =>
    console.log(`Share lesson ${lesson.translated_name} of id ${lesson.id}`),
};

export default {
  title: 'Library/Tutorial/TutorialGenericDialog',
  component: TutorialGenericDialog,
  parameters: {
    docs: {
      page: null,
    },
  },
};
