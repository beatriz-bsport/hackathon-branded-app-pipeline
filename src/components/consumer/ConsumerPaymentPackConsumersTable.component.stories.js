import React from 'react';

import moment from 'moment';
import { object, number } from '@storybook/addon-knobs';

import { storiesOf } from '../../stories';

import ConsumerPaymentPackConsumersTable from './ConsumerPaymentPackConsumersTable.component';

storiesOf('Consumer/ConsumerPaymentPackConsumersTable', module).add(
  'default',
  () => {
    const paymentPack = object('Payment pack', {
      credits: number('Credits', 10),
      consumer_payment_packs: [
        {
          used_credits: 5,
          consumer: {
            first_name: 'John',
            last_name: 'Doe',
          },
        },
      ],
    });
    return <ConsumerPaymentPackConsumersTable paymentPack={paymentPack} />;
  },
);
