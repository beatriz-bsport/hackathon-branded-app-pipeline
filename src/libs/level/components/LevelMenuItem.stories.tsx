// @ts-nocheck
import React from 'react';

import LevelMenuItem, { Props } from './LevelMenuItem.component';

const CustomTemplate = (args: Props) => <LevelMenuItem {...args} />;

export const LevelAll = CustomTemplate.bind({});

LevelAll.args = {
  level: {
    id: 1,
  },
  isSelected: false,
  onEditLevel: () => {},
  onDeleteLevel: () => {},
};

export const LevelBegginer = CustomTemplate.bind({});

LevelBegginer.args = {
  level: {
    id: 2,
  },
  isSelected: false,
  onEditLevel: () => {},
  onDeleteLevel: () => {},
};

export const LevelIntermediate = CustomTemplate.bind({});

LevelIntermediate.args = {
  level: {
    id: 3,
  },
  isSelected: false,
  onEditLevel: () => {},
  onDeleteLevel: () => {},
};

export const LevelAdanced = CustomTemplate.bind({});

LevelAdanced.args = {
  level: {
    id: 4,
  },
  isSelected: false,
  onEditLevel: () => {},
  onDeleteLevel: () => {},
};

export const LevelNoDisplay = CustomTemplate.bind({});

LevelNoDisplay.args = {
  level: {
    id: 5,
  },
  isSelected: false,
  onEditLevel: () => {},
  onDeleteLevel: () => {},
};

export const CustomLevel = CustomTemplate.bind({});

CustomLevel.args = {
  level: {
    id: 12,
    name: 'Hardcore',
    color: '#ff00aa',
  },
  isSelected: false,
  onEditLevel: () => {},
  onDeleteLevel: () => {},
};

export const CustomLevelDisabled = CustomTemplate.bind({});

CustomLevelDisabled.args = {
  level: {
    id: 12,
    name: 'Hardcore',
    color: '#ff00aa',
  },
  isDisabled: true,
  onEditLevel: () => {},
  onDeleteLevel: () => {},
};

export const CustomLevelSelected = CustomTemplate.bind({});

CustomLevelSelected.args = {
  level: {
    id: 12,
    name: 'z@ mais avec un nom tres tres tres tres tres long',
    color: '#ff00aa',
  },
  isSelected: true,
  onEditLevel: () => {},
  onDeleteLevel: () => {},
};

export default {
  title: 'Library/Level/LevelMenuItem',
  component: LevelMenuItem,
  parameters: {
    docs: {
      page: null,
    },
  },
};
