import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceExit, { CadenceExitProps } from './CadenceExit.component';
import { DestinationStatus } from '#libs/sequential_marketing/constants';

export default {
  title: 'Components/Cadences/CadenceNodes/Exit',
  component: CadenceExit,
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
} as ComponentMeta<typeof CadenceExit>;

const Template: ComponentStory<typeof CadenceExit> = (
  args: CadenceExitProps,
) => <CadenceExit {...args} />;

export const Win = Template.bind({});
Win.args = { status: DestinationStatus.WIN };

export const Lose = Template.bind({});
Lose.args = { status: DestinationStatus.FAIL };
