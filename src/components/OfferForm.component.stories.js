import React from 'react';

import moment from 'moment';
import { action } from '@storybook/addon-actions';
import { object } from '@storybook/addon-knobs';

import { storiesOf } from '../stories';

import OfferForm from './OfferForm.component';

storiesOf('Booking/OfferForm', module).add('default', () => {
  const metaActivity = {
    etablissements: [
      {
        id: 1,
      },
    ],
    coaches: [{ id: 1 }],
  };
  const coaches = [
    {
      id: 1,
    },
  ];
  const establishments = [];
  return (
    <OfferForm
      metaActivity={metaActivity}
      coaches={coaches}
      establishments={establishments}
      onSubmit={action('onSubmit')}
    />
  );
});
