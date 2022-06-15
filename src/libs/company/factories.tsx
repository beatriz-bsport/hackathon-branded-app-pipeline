import FactoryBotCompany from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBotCompany.define('company', {
  id: FactoryBotCompany.sequence(),
  name: faker.random.word(),
  email: faker.internet.email(),
  representative_first_name: faker.name.firstName(),
  representative_last_name: faker.name.lastName(),
  address: faker.address.streetAddress(),
  city: faker.address.city(),
  postal_code: faker.address.zipCode(),
  state: faker.address.state(),
  country: faker.random.locale(),
  currency: faker.finance.currencyCode(),
  business_name: faker.company.companyName(),
  business_tax_id: faker.random.number(),
  owner_address: faker.address.streetAddress(),
  owner_city: faker.address.city(),
  owner_postal_code: faker.address.zipCode(),
  owner_state: faker.address.state(),
  owner_country: faker.random.locale(),
  iban: faker.finance.iban(),
});

export default FactoryBotCompany;
