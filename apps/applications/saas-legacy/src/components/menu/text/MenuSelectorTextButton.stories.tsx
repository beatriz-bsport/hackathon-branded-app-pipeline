import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import MenuSelectorTextButton from '.';

export default {
  title: 'Components/Buttons/MenuSelectorTextButton',
  component: MenuSelectorTextButton,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Selector menu button made for cadence usage',
    },
  },
  argTypes: {
    actionList: {
      description: 'List of the actions in the menu',
    },
    label: {
      control: 'text',
      description: 'Text to display in the button',
    },
    customColor: {
      control: 'color',
      description:
        '[Optional] Color of the icon button and the icons in the menu, if not default color is "black"',
    },
    optionOnClick: {
      action: 'optionOnClick',
      description: '[Optional] Optional action to add on click',
    },
  },
} as ComponentMeta<typeof MenuSelectorTextButton>;

const actions = [
  {
    label: 'Action 1',
    icon: 'Delete',
    onClick: () => {},
    customColor: 'rgba(144, 59, 229, 1)',
  },
  {
    label: 'Action 2',
    icon: 'Add',
    onClick: () => {},
    customColor: 'rgba(144, 59, 229, 1)',
  },
];

const Template: ComponentStory<typeof MenuSelectorTextButton> = (
  args: React.ComponentProps<typeof MenuSelectorTextButton>,
) => <MenuSelectorTextButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: '+ add',
  actionList: actions,
  customColor: 'rgba(144, 59, 229, 1)',
};
