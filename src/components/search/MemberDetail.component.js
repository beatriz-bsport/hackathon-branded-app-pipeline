// @flow

import React, { Component } from 'react';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import BookingTable from '../booking/BookingTable.component';
import ConsumerPackRowItem from '../payment-pack/ConsumerPackRowItem.component';

type Props = {
  member: *,
  bookings: *[],
  t: TFunction,
  classes: Object,
  paymentPacks: *[],
  incrementCredit: () => void,
  decrementCredit: () => void,
  bookingUpdaters: {
    confirmBooking: (id: number) => void,
    confirmBookingAttendance: (id: number) => void,
    discardBooking: (id: number) => void,
    discardBookingAttendance: (id: number) => void,
  },
};
type State = {};

export class MemberDetail extends Component<Props, State> {
  state = {};

  renderSessions = () => {
    const { bookings, bookingUpdaters } = this.props;
    if (!bookings) {
      return null;
    }

    return (
      <BookingTable
        bookingOptions={[]}
        bookings={bookings}
        heading="date_start"
        bookingUpdaters={bookingUpdaters}
      />
    );
  };

  renderPaymentPacks = () => {
    const { member, t, classes } = this.props;
    const packs = member.consumer_payment_pack;
    if (!packs || !packs.length) {
      return (
        <Typography variant="caption" className={classes.noPass}>
          {t('paymentPack.noPaymentPackSubscribed')}
        </Typography>
      );
    }
    return packs.map((consumerPack) => {
      const paymentPack = this.props.paymentPacks.find(
        (p) => p.id === +consumerPack.payment_pack_id,
      );
      return (
        <ConsumerPackRowItem
          key={consumerPack.id}
          hideConsumer
          consumerPack={consumerPack}
          paymentPack={paymentPack}
          decrementCredit={this.props.decrementCredit}
          incrementCredit={this.props.incrementCredit}
        />
      );
    });
  };

  render() {
    const { t } = this.props;
    return (
      <Grid container spacing={16} direction="column">
        <Grid item>
          <Typography variant="title">
            {t('search.member.packs.title')}
          </Typography>
          {this.renderPaymentPacks()}
        </Grid>
        <Divider />
        <Grid item>
          <Typography variant="title">
            {t('search.member.sessions.title')}
          </Typography>
          {this.renderSessions()}
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  noPass: {
    margin: theme.spacing.unit * 4,
  },
});

export default translate()(withStyles(styles)(MemberDetail));
