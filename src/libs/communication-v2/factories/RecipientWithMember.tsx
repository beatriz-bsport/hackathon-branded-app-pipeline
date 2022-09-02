import type {
  Recipient,
  ThreadCommunication,
  RecipientCompact,
} from '../types';
import { Member } from '#libs/member/types';
import { MemberFactory } from '#libs/member/factories/Member';

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function randomBoolean() {
  return Math.random() < 0.5;
}

export function RecipientCompactFactory(member?: Member): RecipientCompact {
  const memberSource =
    member ??
    MemberFactory(
      {
        credit_account_balance: 0,
        total_unpaid_amount: '0',
        number_tags: 0,
      },
      true,
    );
  return {
    accept_marketing_email: memberSource.accept_email,
    accept_marketing_sms: memberSource.accept_sms,
    email: memberSource.email,
    phone_number: memberSource.phone ?? memberSource.phone_number,
    member_id: memberSource.id,
    user_id: randomInt(50000),
    name: memberSource.name,
  };
}

export function RecipientCompactListFactory(
  length: number,
  memberList?: Member[],
): RecipientCompact[] {
  if (memberList) {
    return memberList.map((member: Member) => RecipientCompactFactory(member));
  }
  const recipientCompactList = new Array(length);
  return recipientCompactList.map(() => RecipientCompactFactory());
}

export function RecipientWithMemberFactory(member?: Member): Recipient<Member> {
  return {
    member:
      member ??
      MemberFactory(
        {
          credit_account_balance: 0,
          total_unpaid_amount: '0',
          number_tags: 0,
        },
        true,
      ),
    email_sent: randomInt(1000),
    campaign: 'My campaign',
    communication_sent: 'My communication sent',
    read_count: randomInt(4),
    last_read: 'Never',
    links_opened: 'oops',
    links_opened_count: 9,
    status: randomInt(5),
    spam_report: randomBoolean(),
    email: 'sayukazy@bsport.io',
    id: randomInt(50000),
    sms_num_segments: null,
    sms_extra_segments_billed: randomBoolean(),
    sms_error_code: randomInt(5),
    sms_message_sid: 'hello',
  };
}

export default function RecipientsWithMemberFactory(
  length: number,
): Array<Recipient<Member>> {
  const res = new Array(length).fill(0);
  return res.map(() => RecipientWithMemberFactory());
}

export function RecipientWithMemberFromThreadCommunicationFactory(
  communication: ThreadCommunication,
  allMemberList: Member[],
): Array<Recipient<Member>> {
  const recipients: Array<Recipient<Member>> = [];
  const nbRecipients = communication.communication.total_recipients;
  allMemberList
    .sort(() => Math.random() - 0.5)
    .slice(0, nbRecipients)
    .forEach((member) => recipients.push(RecipientWithMemberFactory(member)));
  return recipients;
}
