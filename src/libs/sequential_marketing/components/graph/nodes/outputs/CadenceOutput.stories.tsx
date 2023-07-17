import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceOutput, { CadenceOutputProps } from './CadenceOutput.component';
import {
  DestinationStatus,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import {
  triggerBatchFactory,
  triggerFactory,
} from '#libs/sequential_marketing/factories';
import { smartlistFactory } from '#libs/smart-list/factories';

export default {
  title: 'Components/Cadences/CadenceNodes/Output',
  component: CadenceOutput,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Output card for cadence graph',
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
} as ComponentMeta<typeof CadenceOutput>;

const Template: ComponentStory<typeof CadenceOutput> = (
  args: CadenceOutputProps,
) => <CadenceOutput {...args} />;

const getSmartlist = (id: number) => smartlistFactory(id);

export const EmptyWin = Template.bind({});
EmptyWin.args = {
  status: DestinationStatus.WIN,
};

export const EmptyLose = Template.bind({});
EmptyLose.args = {
  status: DestinationStatus.FAIL,
};

export const EmptyDisabled = Template.bind({});
EmptyDisabled.args = {
  status: DestinationStatus.WIN,
  disabled: true,
};

export const WithTimeoutTrigger = Template.bind({});
WithTimeoutTrigger.args = {
  status: DestinationStatus.WIN,
  triggerList: [triggerFactory(TriggerKind.ONLY_TIMEOUT)],
  getSmartlist: getSmartlist,
};

export const WithTriggersDisabled = Template.bind({});
WithTriggersDisabled.args = {
  status: DestinationStatus.WIN,
  disabled: true,
  triggerList: triggerBatchFactory(2),
  getSmartlist: getSmartlist,
};
