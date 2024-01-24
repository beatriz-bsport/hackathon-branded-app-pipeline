import React from 'react';
import { ConsumerSubscriptionCardStorybook } from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

// TO NOT REVIEW YET
ConsumerSubscriptionCardStorybook.displayName = 'ConsumerSubscriptionCard';

const ConsumerSubscriptionCardTemplate: ComponentStory<
  typeof ConsumerSubscriptionCardStorybook
> = (args) => {
  return <ConsumerSubscriptionCardStorybook {...args} />;
};

const defaultArgs = {};

export const ConsumerSubscriptionCardEverythingDisplayed =
  ConsumerSubscriptionCardTemplate.bind({});
ConsumerSubscriptionCardEverythingDisplayed.args = defaultArgs;

export default {
  title: 'ConsumerSubscriptionCard',
  component: ConsumerSubscriptionCardStorybook,
  argTypes: {},
} as ComponentMeta<typeof ConsumerSubscriptionCardStorybook>;
