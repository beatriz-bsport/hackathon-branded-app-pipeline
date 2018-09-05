import React from 'react';

import moment from 'moment';
import { object, number } from '@storybook/addon-knobs';

import { storiesOf } from '../../stories';

import ConsumersPackSummaryTable from './ConsumersPackSummaryTable.component';

storiesOf('PaymentPack/ConsumersPackSummaryTable', module).add(
  'default',
  () => {
    const paymentPack = object('Payment pack', {
      credits: number('Credits', 10),
      consumer_payment_packs: [
        {
          available_credits: 2,
          consumer: {
            first_name: 'John',
            last_name: 'Doe',
          },
        },
      ],
    });
    return <ConsumersPackSummaryTable paymentPack={paymentPack} />;
  },
);
