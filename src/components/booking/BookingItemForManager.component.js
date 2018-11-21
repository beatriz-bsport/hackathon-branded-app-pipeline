// @flow

import React, { Component } from 'react';
import {
  withStyles,
  Avatar,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import CancelIcon from '@material-ui/icons/Cancel';
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
  showQuickInvoiceButton: ?boolean,
  showRevertBookingButton: ?boolean,
  onQuickInvoiceClick: () => void,
  handleRevert: () => void,
  requestRefreshPaymentPack: () => void,
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

  getStatusText = (booking: Booking) => {
    const { paymentPacks, invoices, t } = this.props;
    if (booking.consumer_payment_pack && booking.payment_pack) {
      const payment_pack = paymentPacks.find(
        (pp) => pp.id === booking.payment_pack,
      );
      const consumer_payment_pack = (
        payment_pack.consumer_payment_packs || []
      ).find((cpp) => cpp.id === booking.consumer_payment_pack);

      if (!consumer_payment_pack) {
        this.props.requestRefreshPaymentPack();
        return [t('common.loading'), 'secondary'];
      }
      if (payment_pack.unlimited) {
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

  renderButtons = () => {
    const {
      t,
      booking,
      showQuickInvoiceButton,
      bookingUpdaters,
      showRevertBookingButton,
      handleRevert,
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
          {showRevertBookingButton ? (
            <IconButton color="secondary" onClick={handleRevert}>
              <CancelIcon />
            </IconButton>
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
          {showRevertBookingButton ? (
            <IconButton color="secondary" onClick={handleRevert}>
              <CancelIcon />
            </IconButton>
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
        {this.renderButtons()}
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
