import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { fakerEN as faker } from '@faker-js/faker';
import CadenceMetrics from './CadenceMetrics.component';
import { cadenceFactory } from '#src/libs/sequential_marketing/factories';

export default {
  title: 'Components/Cadences/Metrics/AllMetrics',
  component: CadenceMetrics,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Component to display the metrics for a particular workflow',
    },
    backgrounds: {
      default: 'light-grey',
      values: [
        { name: 'light-grey', value: '#f7f7f7' },
        { name: 'grey', value: '#e2e2e2' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '2em',
          display: 'block',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof CadenceMetrics>;

const Template: ComponentStory<typeof CadenceMetrics> = (
  args: React.ComponentProps<typeof CadenceMetrics>,
) => <CadenceMetrics {...args} />;

const globalMetrics = {
  count_members_that_entered: faker.number.int(1000),
  success_rate: faker.number.int(100),
  average_success_time: faker.number.int(50),
  tags_count: faker.number.int(10000),
  emails_count: faker.number.int(10000),
  sms_count: faker.number.int(10000),
  push_notif_count: faker.number.int(10000),
};

const getGlobalMetrics = (_: number) => globalMetrics;

export const Primary = Template.bind({});
Primary.args = {
  cadence: cadenceFactory({}),
  getGlobalMetrics: getGlobalMetrics,
};
