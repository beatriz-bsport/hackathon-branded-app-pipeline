import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import QuicksaleItemCard from '.';
import createQuicksaleCardInfo from '../../factories/QuicksaleCardInfo';
import { action } from '@storybook/addon-actions';

const actionsData = {
  openColorModal: action('openColorModal'),
  openDeleteModal: action('openDeleteModal'),
  addToBasket: action('addToBasket'),
};

export default {
  title: 'Components/Quicksale/QuicksaleItemCard',
  component: QuicksaleItemCard,
  argTypes: {
    openColorModal: actionsData.openColorModal,
    openDeleteModal: actionsData.openDeleteModal,
    addToBasket: actionsData.addToBasket,
  },
  args: {
    item: createQuicksaleCardInfo(),
    adminView: false,
    outOfStock: false,
    restrictedPurchase: false,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '40%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} as ComponentMeta<typeof QuicksaleItemCard>;

const QuicksaleItemCardTemplate: ComponentStory<typeof QuicksaleItemCard> = (
  args,
) => <QuicksaleItemCard {...args} />;

export const QuicksaleItemCardDefault = QuicksaleItemCardTemplate.bind({});

export const QuicksaleItemcCardAdminView = QuicksaleItemCardTemplate.bind({});
QuicksaleItemcCardAdminView.args = {
  adminView: true,
  outOfStock: true,
  restrictedPurchase: true,
};

export const QuicksaleItemCardWithALongTitle = QuicksaleItemCardTemplate.bind(
  {},
);
QuicksaleItemCardWithALongTitle.args = {
  item: createQuicksaleCardInfo(1, Array(100).fill('Long title').join(' ')),
  outOfStock: true,
  restrictedPurchase: true,
};
