import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import MultipleActionsMenuOnHover, {
  MultipleActionsMenuOnHoverProps,
} from './MultipleActionsMenuOnHover.component';

export default {
  title: 'Components/Buttons/MultipleActionsMenuOnHover',
  component: MultipleActionsMenuOnHover,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'Icon button opening a selector menu for different actions at the bottom left on hover, made for cadence usage',
    },
  },
  argTypes: {
    actionList: {
      description: 'List of the actions in the menu',
    },
    customColor: {
      control: 'color',
      description:
        '[Optional] Color of the icon button and the icons in the menu, if not default color is "black"',
    },
    customIcon: {
      control: 'string',
      description:
        '[Optional] Name of the icon for the button, if not default icon is "MoreVert"',
    },
    optionOnClick: {
      action: 'optionOnClick',
      description: '[Optional] Optional action to add on click',
    },
    optionOnLeave: {
      action: 'optionOnLeave',
      description: '[Optional] Optional action to add when leaving the button',
    },
  },
} as ComponentMeta<typeof MultipleActionsMenuOnHover>;

const Template: ComponentStory<typeof MultipleActionsMenuOnHover> = (
  args: MultipleActionsMenuOnHoverProps,
) => <MultipleActionsMenuOnHover {...args} />;

const actions = [
  {
    label: 'Action 1',
    icon: 'Delete',
    onClick: () => {},
  },
  {
    label: 'Action 2',
    icon: 'Add',
    onClick: () => {},
  },
];

export const Simple = Template.bind({});
Simple.args = {
  actionList: actions,
};

export const CustomizedIcon = Template.bind({});
CustomizedIcon.args = {
  actionList: actions,
  customIcon: 'Label',
  customColor: 'rgba(0, 0, 0, 0.54)',
};

export const CustomizedIconAndActions = Template.bind({});
CustomizedIconAndActions.args = {
  actionList: [
    {
      label: 'Delete',
      icon: 'Delete',
      onClick: () => {},
      customColor: 'rgba(144, 59, 229, 1)',
    },
    {
      label: 'Send an email',
      icon: 'Email',
      onClick: () => {},
      customColor: 'rgba(4, 109, 200, 1)',
    },
  ],
  customIcon: 'Label',
  customColor: 'rgba(144, 190, 109, 1)',
};
