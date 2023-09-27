import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MultipleActionsMenuOnHover, {
  MultipleActionsMenuOnHoverProps,
} from './MultipleActionsMenuOnHover.component';

export default {
  title: 'Components/Buttons/MultipleActionsMenuOnHover',
  component: MultipleActionsMenuOnHover,
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
