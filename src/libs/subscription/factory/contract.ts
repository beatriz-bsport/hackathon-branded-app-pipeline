import { fakerEN as faker } from '@faker-js/faker';

import {
  ContractFactoryOptions,
  ContractInterval,
} from '#src/libs/subscription/types';
import {
  generateRandomDescription,
  generateRandomName,
  generateRandomPrice,
} from '../../../utils/factories';
import { FakerTextLength } from '../../../utils/types';

const randomContractInterval = faker.helpers.arrayElement<ContractInterval>([
  'month',
  'week',
]);

/**
 * Generates a contract with Faker. You can use the options parameter to alter properties of the returned object
 * @param options The options given to alter properties of generated contract
 * @returns {Contract}
 * @example
 * const fakeContract = contractFactory({
 *  hasPaymentPack: true,
 *  monthBillingDay: 5
 * })
 */
export const contractFactory = (options?: ContractFactoryOptions) => {
  return {
    id: faker.number.int(10000),
    company: parseInt(faker.finance.accountNumber(4)),
    payment_pack: options?.hasPaymentPack ? faker.number.int(10000) : null,
    private_pass: options?.hasPrivatePass ? faker.number.int(10000) : null,
    payment_combo: options?.hasPaymentCombo ? faker.number.int(10000) : null,
    name: generateRandomName(faker),
    description: generateRandomDescription(faker, FakerTextLength.LONG),
    contract: faker.finance.accountNumber(4),
    manager_only: options?.isManagerOnly ?? faker.datatype.boolean(),
    auto_renewal: options?.isAutoRenewal ?? faker.datatype.boolean(),
    flat_fee: generateRandomPrice(faker, { min: 5, max: 100 }).toString(),
    recurrent_price: generateRandomPrice(faker, {
      min: 5,
      max: 100,
    }).toString(),
    nb_interval: faker.number.int({ min: 6, max: 24 }),
    disabled: options?.isDisabled ?? faker.datatype.boolean(),
    interval: randomContractInterval,
    recurrence_basis: faker.number.int(20),
    tax: faker.number.int(20).toString(),
    contract_terms_pdf_link: faker.internet.url(),
    is_usable_by_staff: options?.isUsableByStaff ?? faker.datatype.boolean(),
    month_billing_day: options?.monthBillingDay ?? null,
    highlighted_as_recommended: options?.isHighlightedAsRecommended ?? false,
    tags_on_first_billing: [1, 2],
    nb_interval_after_auto_renewal: faker.number.int({ min: 2, max: 12 }),
    contract_template: options?.hasContractTemplate
      ? faker.number.int(10000)
      : null,
  };
};

/**
 * Generates a list of contracts with Faker
 * @param count The number of contracts to generate
 * @returns {Contract[]}
 */
export const contractListFactory = (
  count: number,
  options?: ContractFactoryOptions,
) => {
  return faker.helpers.multiple(() => contractFactory(options), { count });
};

export default contractFactory;
