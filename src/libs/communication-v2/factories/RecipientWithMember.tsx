import type { RecipientWithMember, ThreadCommunication } from '../types';
import { Member } from '#libs/member/types';
import { MemberFactory } from '#libs/member/factories/Member';

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function randomBoolean() {
  return Math.random() < 0.5;
}

export function RecipientWithMemberFactory(
  member?: Member,
): RecipientWithMember {
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

export function RecipientWithMemberFromThreadCommunicationFactory(
  communication: ThreadCommunication,
  memberList: Member[],
): Array<RecipientWithMember> {
  const recipients: Array<RecipientWithMember> = [];
  communication.members.forEach((memberId: number) =>
    recipients.push(
      RecipientWithMemberFactory(
        memberList.find((member: Member) => member.id === memberId),
      ),
    ),
  );
  return recipients;
}

export default function RecipientsWithMemberFactory(
  length: number,
): Array<RecipientWithMember> {
  const res = new Array(length).fill(0);
  return res.map(() => RecipientWithMemberFactory());
}
