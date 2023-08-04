import { fakerEN as faker } from '@faker-js/faker';
import moment from 'moment-timezone';

/**
 * Generates a subscription pause with Faker.
 * @returns {SubscriptionPause}
 */
export const subscriptionPauseFactory = () => {
  return {
    id: faker.number.int(10000),
    days: faker.number.int(10),
    date_created: moment().subtract(2, 'week').format(),
    date_ended: moment().subtract(5, 'day').format(),
    from_date: moment().subtract(10, 'day').format(),
    until_date: moment().add(10, 'day').format(),
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
