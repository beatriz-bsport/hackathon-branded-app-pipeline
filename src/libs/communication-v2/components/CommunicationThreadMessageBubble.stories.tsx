import React from 'react';
import {
  CommunicationThreadMessageBubble,
  Props,
} from './CommunicationThreadMessageBubble.component';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind';
import { Communication } from '../types';
import { Member } from '#libs/member/types';
import { CommunicationFactory } from '../factories/Communication';
import MembersFactory from '#libs/member/factories/Member';

const CustomTemplate = (args: Props) => (
  <CommunicationThreadMessageBubble {...args} />
);

const photos = MembersFactory(4).map((member: Member) => member.photo);

const communicationEmail: Communication = CommunicationFactory(
  1,
  10,
  'alpha',
  COMMUNICATION_KIND_EMAIL,
);

const communicationSMS: Communication = CommunicationFactory(
  2,
  20,
  'beta',
  COMMUNICATION_KIND_SMS,
);

const communicationPush: Communication = CommunicationFactory(
  3,
  30,
  'charlie',
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
);

const options = {
  photos: photos,
  isSingleRecipientThread: false,
  onShowInformationClick: () => {},
  onShowEmailTemplate: (title: string, html: string) => {},
  reverse: Math.random() < 0.3,
};

export const Email = CustomTemplate.bind({});

Email.args = {
  ...options,
  channel: 'Session',
  communication: communicationEmail,
};

export const Sms = CustomTemplate.bind({});

Sms.args = {
  ...options,
  channel: 'Smartlist',
  communication: communicationSMS,
};

export const PushNotif = CustomTemplate.bind({});

PushNotif.args = {
  ...options,
  channel: 'Notification',
  communication: communicationPush,
};

export default {
  title: 'Library/Communication-V2/ThreadCommunication',
  component: CommunicationThreadMessageBubble,
  parameters: {
    docs: {
      page: null,
    },
  },
};
