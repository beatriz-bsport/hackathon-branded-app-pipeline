import FactoryBotProvincialTax from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBotProvincialTax.define('ProvincialTax', {
  id: FactoryBotProvincialTax.sequence(),
  name: () => faker.random.word(),
  value: () => faker.datatype.float(),
});

export default FactoryBotProvincialTax;
