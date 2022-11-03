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
import { Communication } from '#libs/communication-v2/types';
import { Member } from '#libs/member/types';
import { CommunicationFactory } from '#libs/communication-v2/factories/Communication';
import MembersFactory from '#libs/member/factories/Member';
import {
  COMMUNICATION_CHANNEL_MESSAGE_DIRECT,
  COMMUNICATION_CHANNEL_SESSION,
  COMMUNICATION_CHANNEL_SMARTLIST,
} from '@bsport/common/lib/master-data/communication-filters';

const CustomTemplate = (args: Props) => (
  <CommunicationThreadMessageBubble {...args} />
);

const photos = MembersFactory(4).map((member: Member) => member.photo);
const singleMember = MembersFactory(1)[0];

const communicationEmail: Communication = CommunicationFactory(
  1,
  10,
  'alpha',
  COMMUNICATION_KIND_EMAIL,
  undefined,
  false,
);

const communicationSMS: Communication = CommunicationFactory(
  2,
  20,
  'beta',
  COMMUNICATION_KIND_SMS,
  undefined,
  false,
);

const communicationPush: Communication = CommunicationFactory(
  3,
  30,
  'charlie',
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
  undefined,
  false,
);

const answerEmail: Communication = CommunicationFactory(
  4,
  1,
  '1',
  COMMUNICATION_KIND_EMAIL,
  [singleMember],
  true,
);

const answerSMS: Communication = CommunicationFactory(
  5,
  1,
  '2',
  COMMUNICATION_KIND_SMS,
  [singleMember],
  true,
);

const options = {
  onShowInformationClick: () => {},
  onShowEmailTemplate: (title: string, html: string) => {},
};

export const Email = CustomTemplate.bind({});

Email.args = {
  ...options,
  threadCommunication: {
    photos,
    channel: COMMUNICATION_CHANNEL_SESSION,
    communication: communicationEmail,
  },
};

export const EmailOnSingleMemberThread = CustomTemplate.bind({});

EmailOnSingleMemberThread.args = {
  ...options,
  oneToOneThreadMember: singleMember,
  threadCommunication: {
    photos,
    channel: COMMUNICATION_CHANNEL_SESSION,
    communication: communicationEmail,
  },
};

export const Sms = CustomTemplate.bind({});

Sms.args = {
  ...options,
  threadCommunication: {
    photos,
    channel: COMMUNICATION_CHANNEL_SMARTLIST,
    communication: communicationSMS,
  },
};

export const SmsOnSingleMemberThread = CustomTemplate.bind({});

SmsOnSingleMemberThread.args = {
  ...options,
  oneToOneThreadMember: singleMember,
  threadCommunication: {
    photos,
    channel: COMMUNICATION_CHANNEL_SMARTLIST,
    communication: communicationSMS,
  },
};

export const PushNotif = CustomTemplate.bind({});

PushNotif.args = {
  ...options,
  threadCommunication: {
    photos,
    channel: COMMUNICATION_CHANNEL_MESSAGE_DIRECT,
    communication: communicationPush,
  },
};

export const EmailAnswer = CustomTemplate.bind({});

EmailAnswer.args = {
  ...options,
  threadCommunication: {
    channel: COMMUNICATION_CHANNEL_SMARTLIST,
    communication: answerEmail,
    photos: photos,
    answerSourceMember: singleMember,
  },
};

export const SmsAnswer = CustomTemplate.bind({});

SmsAnswer.args = {
  ...options,
  threadCommunication: {
    channel: COMMUNICATION_CHANNEL_SMARTLIST,
    communication: answerSMS,
    photos: photos,
    answerSourceMember: singleMember,
  },
  oneToOneThreadMember: singleMember,
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
