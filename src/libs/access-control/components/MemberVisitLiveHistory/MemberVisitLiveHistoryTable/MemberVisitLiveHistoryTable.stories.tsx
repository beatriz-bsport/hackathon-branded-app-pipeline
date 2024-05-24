import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import MemberVisitLiveHistoryTable, {
  Props,
} from './MemberVisitLiveHistoryTable.component';
import MemberVisitFactoryBot from '#libs/access-control/factories';

const actionData = {
  handleMemberProfileClick: action('handleMemberProfileClick'),
  handleSelectMemberVisit: action('handleSelectMemberVisit'),
};

export default {
  title: 'Libs/AccessControl/MemberVisitLiveHistoryTable',
  component: MemberVisitLiveHistoryTable,
} as ComponentMeta<typeof MemberVisitLiveHistoryTable>;

const fakeState = {
  count: 100,
  page: 1,
  allIds: [1],
  byId: {},
  loading: false,
  unreadCount: 0,
};

const MemberVisitLiveHistoryTableTemplate: ComponentStory<
  typeof MemberVisitLiveHistoryTable
> = (args: Props) => (
  <MemberVisitLiveHistoryTable
    {...actionData}
    {...args}
    memberVisitState={fakeState}
  />
);

const memberVisitList = MemberVisitFactoryBot.MemberVisitREST.create(4);

export const Default = MemberVisitLiveHistoryTableTemplate.bind({});
Default.args = {
  memberVisitList,
};

export const Loading = MemberVisitLiveHistoryTableTemplate.bind({});
Loading.args = {
  isLoading: true,
};
