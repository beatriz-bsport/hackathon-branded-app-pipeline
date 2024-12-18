import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import QuicksaleConfigurationItemList from '.';
import createQuicksaleCardInfo from '../../factories/QuicksaleCardInfo';
import { action } from '@storybook/addon-actions';

const actionsData = {
  openDeleteModal: action('openDeleteModal'),
  openColorModal: action('openColorModal'),
  addItem: action('addItem'),
};

export default {
  title: 'Components/Quicksale/QuicksaleConfigurationItemList',
  component: QuicksaleConfigurationItemList,
  argTypes: {
    openColorModal: actionsData.openColorModal,
    openDeleteModal: actionsData.openDeleteModal,
    addItem: actionsData.addItem,
  },
  args: {
    sectionName: 'Carte de cours',
    sectionIcon: 'VpnKey',
    itemList: createQuicksaleCardInfo(15),
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: '90vh' }}>
        {/* otherwise, the AutoSizer is not displayed */}
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof QuicksaleConfigurationItemList>;

const QuicksaleConfigurationItemListTemplate: ComponentStory<
  typeof QuicksaleConfigurationItemList
> = (args) => <QuicksaleConfigurationItemList {...args} />;

export const QuicksaleConfigurationItemListDefault =
  QuicksaleConfigurationItemListTemplate.bind({});

export const QuicksaleConfigurationItemListLoading =
  QuicksaleConfigurationItemListTemplate.bind({});
QuicksaleConfigurationItemListLoading.args = {
  loading: true,
};
