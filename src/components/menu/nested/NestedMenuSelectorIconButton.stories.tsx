import React from 'react';
import Immutable from 'seamless-immutable';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import NestedMenuSelectorIconButton from '.';
import type { MenuAction, NestedMenuAction } from '#components/menu/types';

export default {
  title: 'Components/Buttons/NestedMenuSelectorIconButton',
  component: NestedMenuSelectorIconButton,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'Icon button opening a selector menu for different actions at the bottom left on click, made for cadence usage',
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
      control: 'text',
      description:
        '[Optional] Name of the icon for the button, if not default icon is "MoreVert"',
    },
    noTextWrap: {
      control: 'boolean',
      description: '[Optional] Optional boolean to avoid text wrapping',
    },
    toolTipText: {
      control: 'text',
      description: '[Optional] Optional string to display in the tooltip',
    },
    optionOnClick: {
      action: 'optionOnClick',
      description: '[Optional] Optional action to add on click',
    },
  },
} as ComponentMeta<typeof NestedMenuSelectorIconButton>;

const Template: ComponentStory<typeof NestedMenuSelectorIconButton> = (
  args: React.ComponentProps<typeof NestedMenuSelectorIconButton>,
) => <NestedMenuSelectorIconButton {...args} />;

const nestedActions: Immutable.ImmutableArray<MenuAction> = Immutable([
  {
    label: 'Nest 1',
    icon: 'Delete',
    onClick: () => {},
    customColor: 'red',
  },
  {
    label: 'Nest 2',
    icon: 'Add',
    onClick: () => {},
    customColor: 'purple',
  },
]);

const actions: Immutable.ImmutableArray<NestedMenuAction> = Immutable([
  {
    label: 'Action 1',
    icon: 'Delete',
    onClick: () => {},
    actionList: nestedActions,
    customColor: 'green',
  },
  {
    label: 'Action 2',
    icon: 'Add',
    onClick: () => {},
    actionList: null,
    customColor: 'blue',
  },
]);

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
