import { COMMUNICATION_KIND_EMAIL } from '@bsport/common/lib/master-data/communication-kind';
// @ts-ignore
import faker from 'faker';
import {
  COMMUNICATION_SENT_SENDING_SUCCESS,
  FILTER_CHANNELS,
  FILTER_KINDS,
} from '../constants';
import { Communication, ThreadCommunication } from '../types';
import { RecipientCompactListFactory } from './RecipientWithMember';
import { Member } from '#libs/member/types';
import MembersFactory from '#libs/member/factories/Member';
import fakerHTML from '#components/html/fakerHTML';

faker.locale = 'fr';

function randomInt(max: number) {
  return Math.floor(Math.random() * max - 0.00001);
}

function randomArray(length: number, max: number) {
  return Array(length)
    .fill(0)
    .map(() => Math.round(Math.random() * max));
}

function randomMetadata() {
  const keys = [
    'offer_id',
    'notification_id',
    'smartlist_id',
    'member_id',
    'automated_campaign_id',
  ];
  const metadata = {};
  // @ts-ignore
  metadata[keys[randomInt(4)]] = randomInt(2000);
  return metadata;
}

function randomChannel(): number {
  const channels = Object.keys(FILTER_CHANNELS);
  return parseInt(channels[randomInt(channels.length)]);
}

function randomKind(): number {
  return FILTER_KINDS[randomInt(FILTER_KINDS.length)];
}

function fakerTextContent() {
  let fakeText = '';
  for (let i = 0; i < randomInt(7) + 1; i += 1) {
    fakeText += faker.hacker.phrase();
  }
  return fakeText;
}

export function CommunicationFactory(
  id?: number,
  total_recipient?: number,
  campaign_id?: string,
  communicationKind?: number,
  memberList?: Member[],
  isAnswer?: boolean,
  status?: number,
): Communication {
  const kind = communicationKind < 3 ? communicationKind : randomKind();
  const campaign = campaign_id ?? 'foolooloo';
  const communicationId = id ?? randomInt(50000);
  let total_recipients;
  if (total_recipient) total_recipients = total_recipient;
  else if (memberList) total_recipients = memberList.length;
  else total_recipients = randomInt(20);
  const data = {
    uuid: `foo_uuid_${communicationId}`,
    subject: faker.hacker.phrase(),
    body: fakerTextContent(),
    recipient_list: RecipientCompactListFactory(total_recipients, memberList),
    tags_group: [0],
  };
  if (kind === COMMUNICATION_KIND_EMAIL && Math.random() < 0.3) {
    data.body = fakerHTML();
  }
  return {
    id,
    uuid: 'foo',
    campaign_id: campaign,
    data,
    total_recipients,
    date_created: faker.date.past().toString(),
    total_read: randomInt(3),
    total_click: randomInt(3),
    text: fakerTextContent(),
    sms_text: 'useless sms_text',
    title: faker.hacker.phrase(),
    kind,
    metadata: randomMetadata(),
    recipient_member_id_list:
      memberList?.map((member) => member.id) ||
      randomArray(total_recipients, 5000),
    is_answer: isAnswer !== undefined ? isAnswer : Math.random() < 0.3,
    status: status ?? COMMUNICATION_SENT_SENDING_SUCCESS,
  };
}

export function ThreadCommunicationFactory(
  id?: number,
  communicationMemberList?: Member[],
) {
  const idy = id ?? randomInt(50000);
  const memberList = communicationMemberList ?? MembersFactory(randomInt(30));
  const communication = CommunicationFactory(idy, memberList.length);
  const photos = memberList
    .slice(0, Math.min(4, memberList.length))
    .map((member: Member) => member.photo);
  const answerSourceMember =
    communication.is_answer && memberList?.length ? memberList[0] : undefined;
  return {
    channel: randomChannel(),
    communication,
    photos,
    answerSourceMember,
  };
}

export default function ThreadCommunicationListFactory(
  length: number,
  memberListBase?: Member[],
): Array<ThreadCommunication> {
  const memberList = !memberListBase?.length
    ? MembersFactory(randomInt(30))
    : memberListBase;
  const nbMember = memberList.length;
  const list: ThreadCommunication[] = [];
  let newMemberList: Member[];
  for (let i = 0; i < length; i += 1) {
    newMemberList = [...memberListBase]
      .sort(() => 0.5 - Math.random())
      .slice(0, randomInt(nbMember) + 1);
    list.push(ThreadCommunicationFactory(i, newMemberList));
  }
  return list;
}
