import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

const random_hex_color_code = () => {
  const n = (Math.random() * 0xfffff * 1000000).toString(16);
  return `#${n.slice(0, 6)}`;
};

const iconNameList = ['AcUnit', 'AccessAlarm', 'Accessible', 'AddBox'];

FactoryBot.define('Tag', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  group: () => ({
    id: Math.floor(Math.random() * 1000),
    name: faker.random.word(),
    kind: Math.floor(Math.random() * 1000),
  }),
  color: () => random_hex_color_code(),
  icon: () => iconNameList[Math.floor(Math.random() * iconNameList.length)],
});

export default FactoryBot;
