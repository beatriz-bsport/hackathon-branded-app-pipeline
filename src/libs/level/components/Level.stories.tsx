// @ts-nocheck
import React from 'react';

import Level, { Props } from './Level.component';

const CustomTemplate = (args: Props) => <Level {...args} />;

export const LevelAll = CustomTemplate.bind({});

LevelAll.args = {
  customLevel: {
    id: 1,
  },
};

export const LevelBegginer = CustomTemplate.bind({});

LevelBegginer.args = {
  customLevel: {
    id: 2,
  },
};

export const LevelIntermediate = CustomTemplate.bind({});

LevelIntermediate.args = {
  customLevel: {
    id: 3,
  },
};

export const LevelAdanced = CustomTemplate.bind({});

LevelAdanced.args = {
  customLevel: {
    id: 4,
  },
};

export const LevelNoDisplay = CustomTemplate.bind({});

LevelNoDisplay.args = {
  customLevel: {
    id: 5,
  },
};

export const CustomLevel = CustomTemplate.bind({});

CustomLevel.args = {
  customLevel: {
    id: 12,
    name: 'Hardcore',
    color: '#ff00aa',
  },
};

export const CustomLevelNoStyle = CustomTemplate.bind({});

CustomLevelNoStyle.args = {
  customLevel: {
    id: 12,
    name: 'Hardcore',
    color: '#ff00aa',
  },
  noStyle: true,
};

export const CustomLevelCaption = CustomTemplate.bind({});

CustomLevelCaption.args = {
  customLevel: {
    id: 12,
    name: 'Hardcore',
    color: '#ff00aa',
  },
  variant: 'caption',
};

export const CustomLevelChip = CustomTemplate.bind({});

CustomLevelChip.args = {
  customLevel: {
    id: 12,
    name: 'Hardcore',
    color: '#ff00aa',
  },
  isChip: true,
};

export default {
  title: 'Library/Level/Level',
  component: Level,
  parameters: {
    docs: {
      page: null,
    },
  },
};
