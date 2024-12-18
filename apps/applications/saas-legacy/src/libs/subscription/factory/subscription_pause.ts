import { fakerEN as faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
/**
 * Generates a subscription pause with Faker.
 * @returns {SubscriptionPause}
 */
export const subscriptionPauseFactory = () => {
  return {
    id: faker.number.int(10000),
    days: faker.number.int(10),
    date_created: DateTime.now().minus({ weeks: 2 }).toISO(),
    date_ended: DateTime.now().minus({ days: 5 }).toISO(),
    from_date: DateTime.now().minus({ days: 10 }).toISO(),
    until_date: DateTime.now().plus({ days: 10 }).toISO(),
    billing_plan: faker.number.int(10000),
    name: faker.lorem.sentence(2),
    first_paused_planned_invoice: faker.number.int(10000),
    creator_staff_name: faker.person.fullName(),
    version: faker.number.int(20).toString(),
    contract_pause: faker.number.int(10000),
  };
};

/**
 * Generates a list of subscription pause with Faker
 * @param count The number of subscription pause to generate
 * @returns {SubscriptionPause[]}
 */
export const subscriptionPauseListFactory = (count: number) => {
  return faker.helpers.multiple(() => subscriptionPauseFactory(), { count });
};

export default subscriptionPauseFactory;
