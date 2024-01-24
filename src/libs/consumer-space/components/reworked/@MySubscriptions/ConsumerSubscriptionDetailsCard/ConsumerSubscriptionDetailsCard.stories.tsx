import React from 'react';
import { ConsumerSubscriptionDetailsCardStorybook } from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

ConsumerSubscriptionDetailsCardStorybook.displayName =
  'ConsumerSubscriptionCard';

// DONT REVIEW
const ConsumerSubscriptionDetailsCardTemplate: ComponentStory<
  typeof ConsumerSubscriptionDetailsCardStorybook
> = (args) => {
  return <ConsumerSubscriptionDetailsCardStorybook {...args} />;
};

const defaultArgs = {};

export const ConsumerSubscriptionDetailsCard =
  ConsumerSubscriptionDetailsCardTemplate.bind({});
ConsumerSubscriptionDetailsCard.args = defaultArgs;

export default {
  title: 'ConsumerSubscriptionDetailsCard',
  component: ConsumerSubscriptionDetailsCardStorybook,
  argTypes: {},
} as ComponentMeta<typeof ConsumerSubscriptionDetailsCardStorybook>;
