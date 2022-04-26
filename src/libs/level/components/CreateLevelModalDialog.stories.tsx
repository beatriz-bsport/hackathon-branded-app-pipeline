import React from 'react';
import CreateLevelModal, { OuterProps } from './CreateLevelModal.dialog';

const CustomTemplate = (args: OuterProps) => <CreateLevelModal {...args} />;

export const CreateState = CustomTemplate.bind({});

CreateState.args = {
  initial: null,
  open: true,
  onSubmit: () => {},
  onClose: () => {},
};

export const EditState = CustomTemplate.bind({});

EditState.args = {
  initial: {
    name: 'Hardcore',
    color: '#ff00aa',
  },
  open: true,
  onSubmit: () => {},
  onClose: () => {},
};

export default {
  title: 'Library/Level/LeveLModal',
  component: CreateLevelModal,
  parameters: {
    docs: {
      page: null,
    },
  },
};
