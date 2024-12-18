import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import QuicksaleItemAdditionDrawer from '.';
import { action } from '@storybook/addon-actions';
import FactoryBot from '../../factories/QuicksaleItemsByItemIdentifierByCategory';

const actionsData = {
  onClose: action('onClose'),
  addItems: action('addItems'),
};

const availableItems =
  FactoryBot.QuicksaleItemsByItemIdentifierByCategory.createOne();

export default {
  title: 'Components/Quicksale/QuicksaleItemAdditionDrawer',
  component: QuicksaleItemAdditionDrawer,
  argTypes: {
    onClose: actionsData.onClose,
    addItems: actionsData.addItems,
    availableItems: {
      mapping: { Default: availableItems },
    },
  },
  args: {
    open: true,
  },
} as ComponentMeta<typeof QuicksaleItemAdditionDrawer>;

const QuicksaleItemAdditionDrawerTemplate: ComponentStory<
  typeof QuicksaleItemAdditionDrawer
> = (args) => <QuicksaleItemAdditionDrawer {...args} />;

export const QuicksaleItemAdditionDrawerDefault =
  QuicksaleItemAdditionDrawerTemplate.bind({});
QuicksaleItemAdditionDrawerDefault.args = {
  availableItems: 'Default',
};
