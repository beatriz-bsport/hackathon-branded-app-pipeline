import { fakerEN as faker } from '@faker-js/faker';
import { COMMUNICATION_KIND_EMAIL } from '@bsport/common/lib/master-data/communication-kind';
import { CommunicationScheduled } from '#src/libs/communication-v2/types';
import type { SmartList } from './types';

function generateMemberIdsBatch(length?: number): number[] {
  const intTab: number[] = [];
  for (let i = 0; i < Math.max(length, 300); i += 1) {
    intTab.push(i);
  }

  const res: number[] = [];
  for (let i = 0; i < length; i += 1) {
    res.push(faker.helpers.arrayElement(intTab));
  }

  return res;
}

export function smartlistFactory(
  id?: number,
  companyId?: number,
  randomName?: boolean,
  numberOfMembers?: number,
): Partial<SmartList> {
  const smartlistId = id || faker.number.int(99);

  return {
    id: smartlistId,
    company: companyId || faker.number.int(300),
    name: randomName ? faker.lorem.words(2) : `Smartlist n°${smartlistId}`,
    description: faker.hacker.phrase(),
    members: generateMemberIdsBatch(numberOfMembers || 3),
    member_base: 0,
  };
}

export function smartlistBatchFactory(length: number): Partial<SmartList>[] {
  const companyId = faker.number.int(100);
  const res: Partial<SmartList>[] = [];

  for (let i = 0; i < length; i += 1) {
    res.push(smartlistFactory(i, companyId));
  }

  return res;
}

/**
 * Factory function to create a CommunicationScheduled object with provided values or default ones.
 *
 * @param {Partial<CommunicationScheduled>} params - Partial values for initializing the CommunicationScheduled object.
 * @returns {CommunicationScheduled} - The created CommunicationScheduled object.
 *
 * @property {number | null} id - The unique ID for the communication.
 * @property {number | null} company - The company associated with the communication.
 * @property {number | null} smartlist - The smartlist ID associated with the communication.
 * @property {string | null} communication_kind - The kind of communication (default: COMMUNICATION_KIND_EMAIL).
 * @property {string | null} text - The text content of the communication.
 * @property {number | null} email_design - The design details for the email.
 * @property {string | null} title - The subject of the communication.
 * @property {string | null} datetime_scheduled - The scheduled date and time for the communication.
 * @property {string | null} datetime_sent - The date and time when the communication was sent (null if not sent).
 * @property {boolean | null} disabled - Indicates if the communication is disabled.
 * @property {number | null} email_resend_delay - The delay for email resend (null if not applicable).
 * @property {number | null} email_resend_count - The count of email resends (null if not applicable).
 *
 * @example
 * // Example usage of communicationScheduledFactory
 * const communication = communicationScheduledFactory({
 *   company: 54,
 *   smartlist: 42,
 *   communication_kind: COMMUNICATION_KIND_SMS,
 *   text: 'Hello, this is a test sms!',
 *   datetime_scheduled: '2024-03-01T12:00:00',
 * });
 */
export const communicationScheduledFactory = ({
  id,
  company,
  smartlist,
  communication_kind,
  text,
  email_design,
  title,
  datetime_scheduled,
  datetime_sent,
  disabled,
  email_resend_delay,
  email_resend_count,
}: Partial<CommunicationScheduled>): CommunicationScheduled => {
  return {
    id: id || faker.number.int(300),
    company: company || null,
    smartlist: smartlist || faker.number.int(20),
    communication_kind: communication_kind || COMMUNICATION_KIND_EMAIL,
    text: text || faker.hacker.phrase(),
    email_design,
    title: title || faker.lorem.word(2),
    datetime_scheduled:
      datetime_scheduled || faker.date.future().toDateString(),
    datetime_sent,
    disabled: disabled || false,
    email_resend_delay,
    email_resend_count,
  };
};

export const communicationScheduledBatchFactory = (
  length: number,
  instance?: Partial<CommunicationScheduled>,
): CommunicationScheduled[] =>
  faker.helpers.multiple<CommunicationScheduled>(
    () => communicationScheduledFactory(instance || {}),
    { count: length },
  );
