import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';

import MinimalSubscriptionCard, {
  MinimalSubscriptionCardForStorybook,
  type Props,
} from '.';
import { subscriptionFactory } from '#libs/subscription/factory';

const subscription = subscriptionFactory();

export default {
  title: 'Components/Marketplace/MinimalCards/SubscriptionMinimalCard',
  component: MinimalSubscriptionCard,
  decorators: [
    (Story) => (
      <div className="bs-booking-item__container">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof MinimalSubscriptionCardForStorybook>;

const Template: ComponentStory<typeof MinimalSubscriptionCard> = (
  args: Props,
) => (
  //@ts-expect-error
  <MinimalSubscriptionCardForStorybook {...args} />
);

export const Default = Template.bind({});
Default.args = {
  subscription: subscription,
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  subscription: subscription,
};
