// @flow

import React, { Component } from 'react';
import {
  withStyles,
  Avatar,
  Button,
  Grid,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import RedButton from '../button/RedButton.component';
import { formatAsDatetime } from '../../datetime';

type Props = {
  t: TFunction,
  classes: Object,
  heading: ?string,
  booking: Object,
  paymentPacks: Array<PaymentPack>,
  invoices: Array<Invoice>,
  showQuickInvoiceButton: boolean,
  onQuickInvoiceClick: () => void,
  bookingUpdaters: {
    confirmBooking: () => void,
    discardBooking: () => void,
    confirmBookingAttendance: () => void,
    discardBookingAttendance: () => void,
  },
};

export class BookingItemForManager extends Component<Props> {
  getStatusStyleProps = (status: ?boolean) => {
    if (status) {
      return { color: 'primary' };
    }
    return {};
  };

  renderButton = () => {
    const { t, booking, bookingUpdaters } = this.props;
    const { confirmBooking, discardBooking } = bookingUpdaters;

    switch (booking.status) {
      case true:
        /*
            <Grid item>
              <Button variant="outlined" disabled color="primary">
                {t('booking.confirm')}
              </Button>
            </Grid>
            */
        return (
          <Grid container direction="row" spacing={16}>
            <Grid item>{this.getAttendance()}</Grid>
            <Grid item>
              <RedButton variant="outlined" disabled onClick={discardBooking}>
                {t('booking.discard')}
              </RedButton>
            </Grid>
          </Grid>
        );
      case false:
        // should never be reached via API but whatever
        return (
          <Grid container direction="row" spacing={16}>
            <Grid item>{this.getAttendance()}</Grid>
            <Grid item>
              <Button variant="outlined" disabled>
                {t('booking.confirm')}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" disabled>
                {t('booking.discard')}
              </Button>
            </Grid>
          </Grid>
        );
      default:
        return (
          <Grid container direction="row" spacing={16}>
            <Grid item>{this.getAttendance()}</Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={confirmBooking}
              >
                {t('booking.confirm')}
              </Button>
            </Grid>
            <Grid item>
              <RedButton variant="outlined" onClick={discardBooking}>
                {t('booking.discard')}
              </RedButton>
            </Grid>
          </Grid>
        );
    }
  };

  getStatusText = (booking: Booking) => {
    const { paymentPacks, invoices } = this.props;
    if (booking.consumer_payment_pack && booking.payment_pack) {
      const payment_pack = paymentPacks.find(
        (pp) => pp.id === booking.payment_pack,
      );
      const consumer_payment_pack = (
        payment_pack.consumer_payment_packs || []
      ).find((cpp) => cpp.id === booking.consumer_payment_pack);
      if (!payment_pack.credits) {
        return [`${payment_pack.name} (illimité)`, 'primary'];
      }
      const { available_credits } = consumer_payment_pack;
      const { credits } = payment_pack;
      return [
        `${payment_pack.name}: ${available_credits}/${credits}`,
        available_credits / credits < 0.1 ? 'error' : 'primary',
      ];
    }
    const invoice = invoices.find((inv) => inv.uuid === booking.invoice);
    if (invoice) {
      if (invoice.fully_payed) {
        return ['Payé via application bsport', 'primary'];
      }
      return [`Impayé : ${invoice.price_due - invoice.price_payed} €`, 'error'];
    }
    return ['Impayé', 'error'];
  };

  getAttendance = () => {
    const {
      t,
      booking,
      showQuickInvoiceButton,
      bookingUpdaters,
      classes,
    } = this.props;

    if (booking.attendance) {
      return (
        <ListItemSecondaryAction>
          <Button
            color="primary"
            variant="outlined"
            onClick={bookingUpdaters.discardBookingAttendance}
          >
            {t('booking.attend')}
            <CachedIcon className={classes.iconButton} />
          </Button>
          {showQuickInvoiceButton ? (
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.props.onQuickInvoiceClick}
              className={classes.rightButton}
            >
              <AttachMoneyIcon />
            </Button>
          ) : null}
        </ListItemSecondaryAction>
      );
    }
    return (
      <ListItemSecondaryAction>
        <RedButton
          variant="outlined"
          onClick={bookingUpdaters.confirmBookingAttendance}
        >
          {t('booking.doNotAttend')}
          <CachedIcon className={classes.iconButton} />
        </RedButton>
        {showQuickInvoiceButton ? (
          <Button
            variant="outlined"
            color="secondary"
            onClick={this.props.onQuickInvoiceClick}
            className={classes.rightButton}
          >
            <AttachMoneyIcon />
          </Button>
        ) : null}
      </ListItemSecondaryAction>
    );
  };

  getHeading = () => {
    const { heading, booking } = this.props;
    switch (heading) {
      case 'date_start':
        return formatAsDatetime(booking.date_start);
      default:
        return booking.user.name;
    }
  };

  getAvatar = () => {
    const { heading, booking } = this.props;
    switch (heading) {
      case 'date_start':
        return null;
      default:
        return <Avatar src={booking.user.photo} />;
    }
  };

  render() {
    const { booking } = this.props;
    // <TableCell>{t(`booking.sources.${b.source}`)}</TableCell>
    const [statusText, color] = this.getStatusText(booking);
    return (
      <ListItem disabled={!booking.attendance} divider>
        {this.getAvatar()}
        <ListItemText
          primary={this.getHeading()}
          secondary={statusText}
          secondaryTypographyProps={{ color }}
        />
        {this.getAttendance()}
      </ListItem>
    );
  }
}

const styles = (theme) => ({
  iconButton: {
    marginLeft: theme.spacing.unit,
  },
  rightButton: {
    marginLeft: theme.spacing.unit,
  },
});

export default translate()(withStyles(styles)(BookingItemForManager));
