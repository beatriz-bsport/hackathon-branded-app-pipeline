// @ts-expect-error
import FactoryBotCompany from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';

FactoryBotCompany.define('company', {
  id: FactoryBotCompany.sequence(),
  name: faker.company.name(),
  email: faker.internet.email(),
  representative_first_name: faker.person.firstName(),
  representative_last_name: faker.person.lastName(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  postal_code: faker.location.zipCode(),
  state: faker.location.state(),
  country: faker.location.countryCode(),
  currency: faker.finance.currencyCode(),
  business_name: faker.company.name(),
  business_tax_id: faker.number.int(),
  owner_address: faker.location.streetAddress(),
  owner_city: faker.location.city(),
  owner_postal_code: faker.location.zipCode(),
  owner_state: faker.location.state(),
  owner_country: faker.location.country(),
  iban: faker.finance.iban(),
});

export default FactoryBotCompany;
