import React from 'react';

import moment from 'moment';
import { object } from '@storybook/addon-knobs';

import { storiesOf } from '../../stories';

import ConsumerPacks from './ConsumerPacks.component';

storiesOf('Consumer/ConsumerPacks', module).add('default', () => {
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
  return <ConsumerPacks packs={packs} />;
});
