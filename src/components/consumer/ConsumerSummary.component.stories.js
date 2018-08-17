import React from 'react';

import moment from 'moment';
import { object } from '@storybook/addon-knobs';

import { storiesOf } from '../../stories';

import ConsumerSummary from './ConsumerSummary.component';

storiesOf('Consumer/ConsumerSummary', module).add('default', () => {
  const packs = [
    {
      id: 1,
      name: 'My pack',
      used_credits: 5,
      deactivated_until: null,
      base: {
        startingDate: moment().subtract(1, 'month'),
        endingDate: moment().add(18, 'months'),
        company: {
          name: 'Yoga Factory',
        },
        credits: 15,
        base_name: 'The Yoga Apprentice',
      },
    },
  ];
  const activities = [
    {
      id: 2,
      name: 'Aquagym',
      date: moment().add(5, 'days'),
    },
  ];
  return <ConsumerSummary packs={packs} activities={activities} />;
});
