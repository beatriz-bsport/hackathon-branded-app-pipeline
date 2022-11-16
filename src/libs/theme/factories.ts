import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBot.define('companyTheme', {
  id: FactoryBot.sequence(),
  company_name: () => faker.random.word(),
  stripe_pk_key: () => faker.random.word(),
  locale: 'fr_FR',
});

FactoryBot.define('ProvincialTax', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  value: () => faker.datatype.float(),
});

export default FactoryBot;
