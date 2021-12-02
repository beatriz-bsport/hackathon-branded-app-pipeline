import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBot.define('PaymentPackCategory', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  company_id: 1,
  category_ordering: () => Math.floor(Math.random() * 10),
});

export default FactoryBot;
