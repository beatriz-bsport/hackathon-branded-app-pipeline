// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
import {
  PerformanceTrackingMemberProgram,
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from './types';
import MemberFactory from '#libs/member/factories/MemberMinimal';

const iconNameList = ['AcUnit', 'AccessAlarm', 'Accessible', 'AddBox'];

FactoryBot.define('Metric', {
  id: FactoryBot.sequence(),
  is_disable: false,
  program: () => 0,
  name: () => faker.lorem.word(),
  machine_id: () => faker.lorem.word(),
  min_value: () => 0,
  max_value: () => 100,
  default_value: () => 50,
  color: () => faker.internet.color(),
  index: (metric: PerformanceTrackingMetric) => metric.id,
});

FactoryBot.define('Program', {
  company: 0,
  id: FactoryBot.sequence(),
  name: () => faker.lorem.word(),
  description: () => faker.lorem.sentence(),
  machine_id: () => faker.lorem.word(),
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
      creationDate: DateTime.fromISO(faker.date.past().toString()).toFormat(
        'D',
      ),
    },
  }),
});

export default FactoryBot;
