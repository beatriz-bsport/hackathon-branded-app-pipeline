// @flow

import React, { Component } from 'react';

import { Grid } from '@material-ui/core';
import { translate } from 'react-i18next';

import ConsumerPackRowItem from './ConsumerPackRowItem.component';

type Props = {
  paymentPack: Object,
  updatingConsumerPacks: Array<Number>,
  decrementCredit: (id: Number) => void,
  incrementCredit: (id: Number) => void,
};

export class ConsumersPackSummaryTable extends Component<Props> {
  render() {
    const {
      paymentPack,
      updatingConsumerPacks,
      decrementCredit,
      incrementCredit,
    } = this.props;
    const { consumer_payment_packs } = paymentPack;
    return (
      <Grid container direction="column" spacing={8}>
        {consumer_payment_packs.map((cpp) => (
          <ConsumerPackRowItem
            key={cpp.id}
            consumerPack={cpp}
            paymentPack={paymentPack}
            decrementCredit={decrementCredit}
            incrementCredit={incrementCredit}
            loading={
              updatingConsumerPacks.filter((id) => id === cpp.id).length > 0
            }
          />
        ))}
      </Grid>
    );
  }
}

export default translate()(ConsumersPackSummaryTable);
