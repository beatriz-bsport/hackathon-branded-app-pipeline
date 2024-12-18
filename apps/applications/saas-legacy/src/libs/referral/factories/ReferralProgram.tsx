import { fakerEN as faker } from '@faker-js/faker';
import { tagWithoutGroupFactory } from '#src/libs/tag/factory';
import { generateRandomName } from '../../../utils/factories';
import type { ReferralProgram } from '../types';
import {
  ReferralTimeLimitUnits,
  ReferredVoucherTypeChoices,
} from '../constants';

/**
 * Generates a referral program with Faker
 * @returns {ReferralProgram}
 */
export const referralProgramFactory = (): ReferralProgram => {
  return {
    id: faker.number.int(100),
    name: generateRandomName(faker),
    company: faker.number.int(10000),
    minimum_basket_amount: faker.number.float({ max: 70 }).toFixed(2),
    maximum_referral_uses: faker.number.int({ min: 1, max: 10 }),
    amount_off_referred: faker.number.float({ max: 20 }).toFixed(2),
    percent_off_referred: faker.number.int(20),
    referred_voucher_type: faker.helpers.arrayElement(
      Object.values(ReferredVoucherTypeChoices),
    ),
    application_time_limit_intervals: faker.number.int(90),
    application_time_limit_unit: faker.helpers.enumValue(
      ReferralTimeLimitUnits,
    ),
    amount_reward_referring: faker.number.float({ max: 20 }).toFixed(2),
    redirect_link: `https://${faker.lorem.slug(3)}.com`,
    tag_referred_member: tagWithoutGroupFactory(),
  };
};
