import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import QuicksaleItemGroupAdditionDrawer from '.';
import { action } from '@storybook/addon-actions';
import FactoryBot from '../../../factories/QuicksaleItemsByItemIdentifierByCategory';

const actionsData = {
  onClose: action('onClose'),
  addToSelectedItems: action('addItems'),
};
const availableItems =
  FactoryBot.QuicksaleItemsByItemIdentifierByCategory.createOne();

export default {
  title: 'Components/Quicksale/QuicksaleItemGroupAdditionDrawer',
  component: QuicksaleItemGroupAdditionDrawer,
  argTypes: {
    onClose: actionsData.onClose,
    addToSelectedItems: actionsData.addToSelectedItems,
    availableItems: {
      mapping: { Default: availableItems },
    },
  },
  args: {
    open: true,
  },
} as ComponentMeta<typeof QuicksaleItemGroupAdditionDrawer>;

const QuicksaleItemGroupAdditionDrawerTemplate: ComponentStory<
  typeof QuicksaleItemGroupAdditionDrawer
> = (args) => <QuicksaleItemGroupAdditionDrawer {...args} />;

export const QuicksaleItemGroupAdditionDrawerDefault =
  QuicksaleItemGroupAdditionDrawerTemplate.bind({});
QuicksaleItemGroupAdditionDrawerDefault.args = {
  availableItems: 'Default',
};
