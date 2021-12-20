import FactoryBot from 'ya-factorybot';
import faker from 'faker';
import moment from 'moment';
import {
  PerformanceTrackingMemberProgram,
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from './types';
import MemberFactory from '#libs/member/factories/MemberMinimal';

faker.locale = 'fr';
const iconNameList = ['AcUnit', 'AccessAlarm', 'Accessible', 'AddBox'];

FactoryBot.define('Metric', {
  id: FactoryBot.sequence(),
  is_disable: false,
  program: () => 0,
  name: () => faker.random.word(),
  machine_id: () => faker.random.word(),
  min_value: () => 0,
  max_value: () => 100,
  default_value: () => 50,
  color: () => faker.internet.color(),
  index: (metric: PerformanceTrackingMetric) => metric.id,
});

FactoryBot.define('Program', {
  company: 0,
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  description: () => faker.lorem.sentence(),
  machine_id: () => faker.random.word(),
  icon: () => iconNameList[Math.floor(Math.random() * iconNameList.length)],
  color: () => faker.internet.color(),
  is_disabled: false,
  is_default: false,
  metric_list: (program: PerformanceTrackingProgram) =>
    FactoryBot.Metric.create(5, { program: program.id }),
});

FactoryBot.define('MemberProgram', {
  id: FactoryBot.sequence(),
  is_disabled: false,
  member: () => MemberFactory.Member.createOne(),
  program: () => FactoryBot.Program.createOne(),
  metric_record: (memberProgram: PerformanceTrackingMemberProgram) => ({
    general: {
      metrics: memberProgram.program.metric_list.map((metric) => ({
        metric,
        value: metric.default_value,
      })),
      creationDate: moment(faker.date.past().toString()).format('DD/MM/YYYY'),
    },
  }),
});

export default FactoryBot;
