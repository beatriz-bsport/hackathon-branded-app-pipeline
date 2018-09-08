import FactoryBot from 'ya-factorybot';
import faker from 'faker';

import { METRO_COLORS } from 'bsport-commons/lib/colors';

faker.locale = 'fr';

const LINES = Object.keys(METRO_COLORS);

function randomLines() {
  return [LINES[Math.floor(Math.random() * LINES.length)]];
}

FactoryBot.define('EasyAccess', {
  id: FactoryBot.sequence(),
  name: faker.lorem.word,
  lines: () => randomLines(),
});
