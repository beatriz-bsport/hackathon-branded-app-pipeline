import React from 'react';

import moment from 'moment-timezone';


import RuleCard from './RuleCard.component';


export default {
  title: 'Marketing/RuleCard',
  component: RuleCard,
}

const Template = (rule) => <RuleCard rule={rule} />

export const Primary = Template.bind({})

Primary.args = {
    id: 1,
    name: 'Stratégie #1',
    date: moment(),
    conversionRate: 0.04,
    averageBuy: 70,
    sales: 10,
    totalBuy: 700,
    SMSSent: 476545,
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
}
