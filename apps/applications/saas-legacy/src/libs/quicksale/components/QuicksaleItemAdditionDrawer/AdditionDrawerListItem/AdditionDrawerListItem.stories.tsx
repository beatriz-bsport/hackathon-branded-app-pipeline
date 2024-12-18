import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import AdditionDrawerListItem from '.';
import { action } from '@storybook/addon-actions';
import createQuicksaleCardInfo from '../../../factories/QuicksaleCardInfo';

const actionsData = {
  dispatch: action('dispatch'),
  onSelectCallback: action('onSelectCallback'),
};

export default {
  title: 'Components/Quicksale/AdditionDrawerListItem',
  component: AdditionDrawerListItem,
  argTypes: {
    dispatch: actionsData.dispatch,
    onSelectCallback: actionsData.onSelectCallback,
  },
  args: {
    item: createQuicksaleCardInfo(),
    noDivider: false,
    displayBin: false,
    clickToSelect: false,
    checked: undefined,
  },
} as ComponentMeta<typeof AdditionDrawerListItem>;

const AdditionDrawerListItemTemplate: ComponentStory<
  typeof AdditionDrawerListItem
> = (args) => <AdditionDrawerListItem {...args} />;

export const AdditionDrawerListItemDefault =
  AdditionDrawerListItemTemplate.bind({});

export const AdditionDrawerListItemWithCheckbox =
  AdditionDrawerListItemTemplate.bind({});
AdditionDrawerListItemWithCheckbox.args = { checked: true };

export const AdditionDrawerListItemWithBinIcon =
  AdditionDrawerListItemTemplate.bind({});
AdditionDrawerListItemWithBinIcon.args = { displayBin: true };

export const AdditionDrawerListItemClickable =
  AdditionDrawerListItemTemplate.bind({});
AdditionDrawerListItemClickable.args = { clickToSelect: true };
