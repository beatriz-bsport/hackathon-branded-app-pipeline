import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';

import MenuSelectorCustomButton from '.';

export default {
  title: 'Components/Buttons/MenuSelectorCustomButton',
  component: MenuSelectorCustomButton,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'Selector menu button opening at the top right of its children element on click, made for cadence usage',
    },
  },
  argTypes: {
    customColor: {
      control: 'color',
      description: 'Color of the icons in the list',
    },
    customHoverBackgroundColor: {
      control: 'color',
      description: 'Color of the background color on hover of the menu items',
    },
    actionList: {
      description: 'List of actions',
    },
    informationText: {
      control: 'text',
      description: 'Texte displayed above the list',
    },
    optionOnClick: {
      action: 'optionOnClick',
      description: 'Optional action to add on click',
    },
  },
} as ComponentMeta<typeof MenuSelectorCustomButton>;

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const actions = [
  {
    label: capitalize(faker.word.verb()),
    icon: 'Delete',
    onClick: () => {},
  },
  {
    label: capitalize(faker.word.verb()),
    icon: 'Add',
    onClick: () => {},
  },
];

const TemplateWithChildren: ComponentStory<typeof MenuSelectorCustomButton> = (
  args: React.ComponentProps<typeof MenuSelectorCustomButton>,
) => (
  <MenuSelectorCustomButton {...args}>
    <IconButton color="inherit" size="small">
      <AddCircleIcon fontSize="small" />
    </IconButton>
  </MenuSelectorCustomButton>
);

export const Children = TemplateWithChildren.bind({});
Children.args = {
  actionList: actions,
  informationText: faker.lorem.sentence({ min: 3, max: 5 }),
};
