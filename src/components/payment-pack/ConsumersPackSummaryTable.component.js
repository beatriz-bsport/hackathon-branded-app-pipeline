// @flow

import React from 'react';

import { Grid } from '@material-ui/core';
import { translate } from 'react-i18next';

import ConsumerPackRowItem from './ConsumerPackRowItem.component';

type Props = {
  paymentPack: Object,
  updatingConsumerPacks: Array<number>,
  consumerPacks: Array<ConsumerPaymentPack>,
  decrementCredit: (id: number) => void,
  incrementCredit: (id: number) => void,
};

export function ConsumersPackSummaryTable(props: Props) {
  const {
    paymentPack,
    updatingConsumerPacks,
    decrementCredit,
    incrementCredit,
    consumerPacks,
  } = props;
  return (
    <Grid container direction="column" spacing={8}>
      {consumerPacks.map((cpp) => (
        <ConsumerPackRowItem
          key={cpp.id}
          consumerPack={cpp}
          paymentPack={paymentPack}
          decrementCredit={decrementCredit}
          incrementCredit={incrementCredit}
          loading={
            (updatingConsumerPacks || []).filter((id) => id === cpp.id).length >
            0
          }
        />
      ))}
    </Grid>
  );
}

export default translate()(ConsumersPackSummaryTable);
