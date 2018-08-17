import React from 'react';

import moment from 'moment';
import { object } from '@storybook/addon-knobs';

import { storiesOf } from '../../stories';

import RuleCard from './RuleCard.component';

storiesOf('Marketing/RuleCard', module).add('default', () => {
  const rule = object('Rule', {
    id: 1,
    name: 'Stratégie #1',
    date: moment(),
    conversionRate: 0.04,
    averageBuy: 70,
    sales: 10,
    totalBuy: 700,
    SMSSent: 240,
    EmailSent: 510,
    notificationSent: 110,
    clientReached: 521,
    criterias: [
      {
        name: 'sport',
        value: 'Yoga',
      },
      {
        name: 'sexe',
        value: 'F',
      },
      {
        name: 'location',
        value: 'Gymnase Beaulieu',
      },
      {
        name: 'Abandon depuis',
        value: '4 séances',
      },
    ],
  });
  return <RuleCard rule={rule} />;
});
