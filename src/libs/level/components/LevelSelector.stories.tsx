import React from 'react';

import LevelSelector, { Props } from './LevelSelector.component';

const CustomTemplate = (args: Props) => {
  const [selectedLevel, setSelectedLevel] = React.useState(null)
  const onSelect = (id:number) => setSelectedLevel(id)
  return(<LevelSelector 
    {...args}
    selectedLevel={selectedLevel}
    onSelect={onSelect} />)}


export const Default = CustomTemplate.bind({});

const defaultLevel = [
  {
    id: 1,
    name: '1',
  },
  {
    id: 2,
    name: '1',
  },
  {
    id: 3,
    name: '1',
  },
  {
    id: 4,
    name: '1',
  },
  {
    id: 5,
    name: '1',
  },
];

Default.args = {
  customLevels: defaultLevel,
  onCreateLevel: () => {},
  onEditLevel: () => {},
  onDeleteLevel: () => {},
};

export const DefaultSelected = CustomTemplate.bind({});

DefaultSelected.args = {
  customLevels: defaultLevel,
  selectedLevel: 1,
  onCreateLevel: () => {},
  onEditLevel: () => {},
  onDeleteLevel: () => {},
  onSelect: () => {},
};

export const WithCustomLevel = CustomTemplate.bind({});

WithCustomLevel.args = {
  customLevels: [
    ...defaultLevel,
    {
      id: 42,
      name: 'Hardcore',
      color: '#ff00aa',
    },
    {
      id: 40,
      name: 'abc',
      color: '#aff',
    },
    {
      id: 20,
      name: 'z@ mais avec un nom tres tres tres tres tres long',
      color: '#0d0',
    },
  ],
  isInScrollbar: true,
  selectedLevel: null,
  onCreateLevel: () => {},
  onEditLevel: () => {},
  onDeleteLevel: () => {},
  onSelect: () => {},
};

export default {
  title: 'Library/Level/LevelSelector',
  component: LevelSelector,
  parameters: {
    docs: {
      page: null,
    },
  },
};
