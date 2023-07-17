import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceExitCard, {
  CadenceExitCardProps,
} from './CadenceExitCard.component';
import { DestinationStatus } from '#libs/sequential_marketing/constants';

export default {
  title: 'Components/Cadences/CadenceNodes/Exit',
  component: CadenceExitCard,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Exit card for cadence graph',
    },
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: [DestinationStatus.WIN, DestinationStatus.FAIL],
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof CadenceExitCard>;

const Template: ComponentStory<typeof CadenceExitCard> = (
  args: CadenceExitCardProps,
) => <CadenceExitCard {...args} />;

export const Win = Template.bind({});
Win.args = { status: DestinationStatus.WIN };

export const Lose = Template.bind({});
Lose.args = { status: DestinationStatus.FAIL };
