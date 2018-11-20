// @flow
import React, { Component } from 'react';

import {
  CircularProgress,
  Button,
  Grid,
  Typography,
  List,
} from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { translate } from 'react-i18next';

import ConsumerPackRowItem from '../payment-pack/ConsumerPackRowItem.component';

type Props = {
  compatiblePacks: Array<PaymentPack>,
  member: Member,
  onCancel: () => void,
  t: (x: string) => string,
  loading: boolean,
  subscribeToOffer: (id) => void,
};

export class RegisterMemberToOfferForm extends Component<Props> {
  renderContent = () => {
    const {
      loading,
      subscribeToOffer,
      compatiblePacks,
      t,
      member,
    } = this.props;
    if (loading) {
      return <CircularProgress />;
    }
    const availablePacks = compatiblePacks.filter((pack) =>
      pack.consumer_payment_packs.find((cpp) => cpp.member_id === member.id),
    );

    if (!availablePacks.length) {
      return (
        <Grid container direction="row" spacing={24}>
          <Grid item>
            <WarningIcon color="error" />
          </Grid>
          <Grid item>
            <Typography>
              {t('offer.noPackAvailableForOfferPurchase')}
            </Typography>
          </Grid>
        </Grid>
      );
    }
    if (availablePacks.length === 1) {
      // auto book with first pack if only one is available
      const availableConsumerPacks = availablePacks[0].consumer_payment_packs.filter(
        (cpp) => cpp.member_id === member.id,
      );
      if (availableConsumerPacks.length === 1) {
        subscribeToOffer(availableConsumerPacks[0].id);
        return <CircularProgress />;
      }
    }
    return (
      <List>
        {availablePacks.map((compatiblePack) => (
          <ConsumerPackRowItem
            key={compatiblePack.id}
            paymentPack={compatiblePack}
            hideConsumer
            subscribeToOffer={subscribeToOffer}
            consumerPack={compatiblePack.consumer_payment_packs.find(
              (cpp) => cpp.member_id === member.id,
            )}
          />
        ))}
      </List>
    );
  };

  render() {
    const { t, onCancel } = this.props;
    return (
      <Grid container spacing={24} direction="column">
        <Grid item>
          <Typography variant="h3">Inscription à la séance</Typography>
        </Grid>
        <Grid item>{this.renderContent()}</Grid>
        <Grid item>
          <Button variant="outlined" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default translate()(RegisterMemberToOfferForm);
