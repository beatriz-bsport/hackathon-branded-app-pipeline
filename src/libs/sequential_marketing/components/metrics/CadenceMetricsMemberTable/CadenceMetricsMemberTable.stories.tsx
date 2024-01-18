import React from 'react';

import type { ComponentMeta, ComponentStory } from '@storybook/react';
import CadenceMetricsMemberTable from './CadenceMetricsMemberTable.component';

function createData(
  id: string,
  photo: string,
  first_name: string,
  last_name: string,
  currentStepName: string,
  entry_date: string,
  exit_date: string,
  status: number,
) {
  return {
    id,
    photo,
    first_name,
    last_name,
    currentStepName,
    entry_date,
    exit_date,
    status,
  };
}

const fakeMembersData = [
  createData(
    '1',
    '',
    'Frozen',
    'yoghurt',
    'currentStepName',
    '25/07/2022',
    '25/07/2022',
    0,
  ),
  createData(
    '2',
    '',
    'Ice cream',
    'sandwich',
    'currentStepName',
    '25/07/2022',
    '25/07/2022',
    0,
  ),
  createData(
    '3',
    '',
    'Eclair',
    'Delune',
    'currentStepName',
    '25/07/2022',
    '25/07/2022',
    1,
  ),
  createData(
    '4',
    '',
    'Cup',
    'Cake',
    'currentStepName',
    '25/07/2022',
    '25/07/2022',
    1,
  ),
  createData(
    '5',
    '',
    'Ginger',
    'Gread',
    'currentStepName',
    '25/07/2022',
    '25/07/2022',
    0,
  ),
];

const MemberTableTemplate: ComponentStory<typeof CadenceMetricsMemberTable> = (
  args: React.ComponentProps<typeof CadenceMetricsMemberTable>,
) => {
  return <CadenceMetricsMemberTable {...args} />;
};

export const MetricsMemberTable = MemberTableTemplate.bind({});
MetricsMemberTable.args = { membersData: fakeMembersData };

export default {
  title: 'Components/Cadences/LandingPage/MetricsMemberTable',
  component: CadenceMetricsMemberTable,
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
} as ComponentMeta<typeof CadenceMetricsMemberTable>;
