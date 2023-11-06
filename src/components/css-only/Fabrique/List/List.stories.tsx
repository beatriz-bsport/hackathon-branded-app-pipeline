import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ListStorybook } from '.';
import ListItem from '#Fabrique/ListItem';
import { ArrowBlockLeft } from '#components/untitledui';

type NumberKey = '1' | '2' | '3' | '4' | '5';
const numbersDict: Record<NumberKey, boolean> = {
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
};

const numbersArray = ['1', '2', '3', '4', '5'];

const ListStorybookTemplate: ComponentStory<typeof ListStorybook> = (args) => (
  <ListStorybook {...args}>
    {numbersArray.map((number) => (
      <ListItem key={number} label={number} icon={<ArrowBlockLeft />} />
    ))}
  </ListStorybook>
);

const ListStorybookRadioTemplate: ComponentStory<typeof ListStorybook> = (
  args,
) => {
  const [numberSelected, setNumberSelected] = React.useState('1');
  const handleRadioChange = (number: NumberKey) => () => {
    setNumberSelected(number);
  };
  return (
    <ListStorybook {...args}>
      {numbersArray.map((number: NumberKey) => (
        <ListItem
          key={number}
          label={number}
          captionText={`I'm number ${number}`}
          onClick={handleRadioChange(number)}
          isSelected={numberSelected === number}
          type="radio"
        />
      ))}
    </ListStorybook>
  );
};

const ListStorybookCheckboxTemplate: ComponentStory<typeof ListStorybook> = (
  args,
) => {
  const [numbersSelected, setNumbersSelected] = React.useState(numbersDict);
  const handleCheckboxChange = (number: NumberKey) => () => {
    setNumbersSelected((prevState) => ({
      ...prevState,
      [number]: !prevState[number],
    }));
  };
  return (
    <ListStorybook {...args}>
      {numbersArray.map((number: NumberKey) => (
        <ListItem
          key={number}
          label={number}
          captionText={`I'm number ${number}`}
          onClick={handleCheckboxChange(number)}
          isSelected={numbersSelected[number]}
          type="checkbox"
        />
      ))}
    </ListStorybook>
  );
};

ListStorybook.displayName = 'ListItem';
const defaultArgs = { listTitle: 'List title' };
export const Listdefault = ListStorybookTemplate.bind({});
Listdefault.args = defaultArgs;
export const Listradio = ListStorybookRadioTemplate.bind({});
Listradio.args = defaultArgs;
export const Listcheckbox = ListStorybookCheckboxTemplate.bind({});
Listcheckbox.args = defaultArgs;

export default {
  title: 'Fabrique/List&ListItem/ListStories',
  component: ListStorybook,
  argTypes: {
    listTitle: {
      description: 'Name of the group title',
      control: 'text',
    },
  },
} as ComponentMeta<typeof ListStorybook>;
