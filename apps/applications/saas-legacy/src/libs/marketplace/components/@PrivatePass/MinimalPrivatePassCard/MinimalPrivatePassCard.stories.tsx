import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';

import MinimalPrivatePassCard, { MinimalPrivatePassCardForStorybook } from '.';

import type { Props } from '.';
import { privatePassFactory } from '#src/libs/private-service/factory';

const privatePass = privatePassFactory();

export default {
  title: 'Components/Marketplace/MinimalCards/PrivatePassMinimalCard',
  component: MinimalPrivatePassCard,
  decorators: [
    (Story) => (
      <div className="bs-booking-item__container">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof MinimalPrivatePassCardForStorybook>;

const Template: ComponentStory<typeof MinimalPrivatePassCard> = (
  args: Props,
) => <MinimalPrivatePassCardForStorybook {...args} />;

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  privatePass: privatePass,
};

export const WithoutQuantity = Template.bind({});
WithoutQuantity.args = {
  privatePass: privatePass,
};

export const WithQuantity = Template.bind({});
WithQuantity.args = {
  privatePass: privatePass,
  quantity: 3,
};
