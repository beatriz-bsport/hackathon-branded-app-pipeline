import React from 'react';
import { faker } from '@faker-js/faker';

import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { cadenceStepFactory } from '#libs/sequential_marketing/factories';
import { DestinationStatus } from '#libs/sequential_marketing/constants';
import CadenceMetricsMemberTable from './CadenceMetricsMemberTable.component';
import MembersFactory from '#libs/member/factories/Member';
import type { Member } from '#libs/member/types';

const members = MembersFactory(faker.number.int({ min: 1, max: 8 }));
const cadenceSteps = members.map((_) => {
  const cadenceStep = cadenceStepFactory({});
  return cadenceStep;
});
const membersData = members.map((member, index) => ({
  member_id: member.id,
  current_step_id: cadenceSteps[index].id,
  entry_date: faker.date.past(),
  exit_date: faker.date.recent(),
  status: faker.helpers.arrayElement(Object.values(DestinationStatus)),
}));
const membersById = members.reduce<{ [id: string]: Member<number, number> }>(
  (byId, member) => {
    byId[member.id] = member;
    return byId;
  },
  {},
);
const getCadenceStep = (stepId: number) =>
  cadenceSteps.find((step) => step.id === stepId);

const MemberTableTemplate: ComponentStory<typeof CadenceMetricsMemberTable> = (
  args: React.ComponentProps<typeof CadenceMetricsMemberTable>,
) => {
  return <CadenceMetricsMemberTable {...args} />;
};

export const PresentMemberTable = MemberTableTemplate.bind({});
PresentMemberTable.args = {
  isHistoric: false,
  membersData: membersData,
  membersById: membersById,
  page: 1,
  totalMembers: faker.number.int({
    min: members.length,
    max: members.length + faker.number.int(50),
  }),
  totalPages: faker.number.int({ min: 1, max: 7 }),
  getCadenceStep: getCadenceStep,
};

export const HistoricMemberTable = MemberTableTemplate.bind({});
HistoricMemberTable.args = {
  isHistoric: true,
  membersData: membersData,
  membersById: membersById,
  page: 1,
  totalMembers: faker.number.int({
    min: members.length,
    max: members.length + faker.number.int(50),
  }),
  totalPages: faker.number.int({ min: 1, max: 7 }),
  getCadenceStep: getCadenceStep,
};

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
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'Member tables used in Audience metrics to display information about members currently in a workflow or those who have exited it.',
    },
  },
  argTypes: {
    isHistoric: {
      control: 'boolean',
      description:
        '[Optional] Boolean indicating which table to display (exited or present members).',
    },
    loading: {
      control: 'boolean',
      description: '[Optional] Boolean indicating the loading status.',
    },
    membersById: {
      control: 'object',
      description: 'Dictionary of members indexed by their IDs.',
    },
    membersData: {
      control: 'object',
      description: "List of members' data.",
    },
    page: {
      control: 'number',
      description: 'The current page of the table.',
    },
    totalMembers: {
      control: 'number',
      description: 'The total number of members in the table.',
    },
    totalPages: {
      control: 'number',
      description: 'The total number of pages.',
    },
    getCadenceStep: {
      action: 'getCadenceStep',
      description: 'Function to get the cadence step from its ID.',
    },
    updatePageNumber: {
      action: 'updatePageNumber',
      description: 'Function to change of page.',
    },
  },
} as ComponentMeta<typeof CadenceMetricsMemberTable>;
