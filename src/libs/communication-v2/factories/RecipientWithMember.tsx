import type { RecipientWithMember } from '../types';
import { MemberFactory } from '#libs/member/factories/Member';

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function randomBoolean() {
  const table = [true, false];
  return table[randomInt(2)];
}

export function RecipientWithMemberFactory(): RecipientWithMember {
  return {
    member: MemberFactory({}),
    email_sent: randomInt(1000),
    campaign: 'My campaign',
    communication_sent: 'My communication sent',
    read_count: 10,
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
): Array<RecipientWithMember> {
  const res = new Array(length).fill(0);
  return res.map(() => RecipientWithMemberFactory());
}
