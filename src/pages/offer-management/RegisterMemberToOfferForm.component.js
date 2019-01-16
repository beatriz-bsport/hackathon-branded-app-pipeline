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
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';

import { consumerPaymentPack as consumerPackActions } from '../../actions';
import ConsumerPackRowItem from '../../components/payment-pack/ConsumerPackRowItem.component';
import PaymentPackSummary from '../../components/payment-pack/PaymentPackSummary.component';

type Props = {
  loading: boolean,
  consumerPacksLoading: boolean,

  member: Member,
  offer: Offer,
  compatiblePacks: Array<PaymentPack>,
  consumerPacks: Array<ConsumerPaymentPack>,
  allPaymentPacks: Array<PaymentPack>,

  onCancel: () => void,
  fetchConsumerPackByOfferByMember: (offerId: number, memberId: number) => void,
  subscribeToPackAndOffer: (paymentPackId: number) => void,
  subscribeToOffer: (id: number) => void,

  t: TFunction,
};

export class RegisterMemberToOfferForm extends Component<Props> {
  componentDidMount() {
    this.props.fetchConsumerPackByOfferByMember(
      this.props.offer.id,
      this.props.member.id,
    );
  }

  renderContent = () => {
    const { subscribeToOffer, compatiblePacks, t, member } = this.props;
    const availablePacks = (compatiblePacks || []).filter((pack) =>
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

  renderWarning = (text: string) => (
    <Grid container direction="row" spacing={24}>
      <Grid item>
        <WarningIcon color="error" />
      </Grid>
      <Grid item>
        <Typography>{text}</Typography>
      </Grid>
    </Grid>
  );

  renderPaymentPacks = () => {
    const { compatiblePacks, t } = this.props;
    if (!compatiblePacks.length) {
      return this.renderWarning(t('offer.noPackAvailableForOfferPurchase'));
    }

    return (
      <List>
        {compatiblePacks.map((pack) => (
          <PaymentPackSummary
            buyButton={
              <Button
                variant="outlined"
                onClick={() => this.props.subscribeToPackAndOffer(pack.id)}
              >
                {t('offer.createBooking')}
              </Button>
            }
            key={pack.id}
            paymentPack={pack}
            hideConsumer
          />
        ))}
      </List>
    );
  };

  renderConsumerPacks = () => {
    const { consumerPacks, t, subscribeToOffer, allPaymentPacks } = this.props;
    if (!consumerPacks.length) {
      return this.renderWarning(t('offer.noConsumerPackAvailableForPurchase'));
    }
    return (
      <List>
        {this.props.consumerPacks.map((cp) => (
          <ConsumerPackRowItem
            key={cp.id}
            paymentPack={allPaymentPacks.find(
              (pp) => pp.id === parseInt(cp.payment_pack_id, 10),
            )}
            hideConsumer
            subscribeToOffer={subscribeToOffer}
            consumerPack={cp}
          />
        ))}
      </List>
    );
  };

  render() {
    const { t, onCancel, member, consumerPacksLoading, loading } = this.props;
    if (!member || loading || consumerPacksLoading) {
      return <CircularProgress />;
    }
    return (
      <Grid container spacing={24} direction="column">
        <Grid item>
          <Typography variant="h3">Inscription à la séance</Typography>
        </Grid>
        <Grid item>{this.renderConsumerPacks()}</Grid>
        <Grid item>{this.renderPaymentPacks()}</Grid>
        <Grid item>
          <Button variant="outlined" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default translate()(
  connect(
    (state) => ({
      consumerPacksLoading: state.consumerPaymentPack.loading,
      consumerPacks: state.consumerPaymentPack.byOfferByMember,
      allPaymentPacks: state.paymentPack.all,
    }),
    {
      fetchConsumerPackByOfferByMember:
        consumerPackActions.fetchByOfferByMember,
    },
  )(RegisterMemberToOfferForm),
);
