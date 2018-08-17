import React from 'react';

import moment from 'moment';
import { object } from '@storybook/addon-knobs';

import { storiesOf } from '../../stories';

import ConsumerActivities from './ConsumerActivities.component';

storiesOf('Consumer/ConsumerActivities', module).add('default', () => {
  const activities = [
    {
      id: 2,
      name: 'Aquagym',
      date: moment().add(5, 'days'),
    },
  ];
  return <ConsumerActivities activities={activities} />;
});
