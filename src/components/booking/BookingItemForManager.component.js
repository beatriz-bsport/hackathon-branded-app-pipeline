// @flow

import React, { PureComponent } from 'react';
import {
  withStyles,
  Avatar,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  Badge,
  ListItemSecondaryAction,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import CancelIcon from '@material-ui/icons/Cancel';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { getBookingStatusCode } from './Booking.utils';

import RedButton from '../button/RedButton.component';
import { formatAsDatetime } from '../../datetime';
import type { PaymentPack, Booking } from '../../api/types';

type Props = {
  t: TFunction,
  classes: Object,
  heading: ?string,
  booking: Object,
  member: Member,
  paymentPacks: PaymentPack[],
  showQuickInvoiceButton: ?boolean,
  showRevertBookingButton: ?boolean,
  redirectToMember: ?boolean,
  newTab: ?boolean,

  push: (path: string) => void,
  onQuickInvoiceClick: () => void,
  handleRevert: () => void,
  confirmBookingAttendance: () => void,
  discardBookingAttendance: () => void,
};

export class BookingItemForManager extends PureComponent<Props> {
  getStatusStyleProps = (status: ?boolean) => {
    if (status) {
      return { color: 'primary' };
    }
    return {};
  };

  getPaymentPack = memoize((paymentPacks, booking) =>
    paymentPacks.find((pp) => pp.id === booking.payment_pack),
  );

  getStatusText = (booking: Booking) => {
    const { paymentPacks, t } = this.props;
    const { consumer_payment_pack } = booking;
    if (consumer_payment_pack && booking.payment_pack) {
      const payment_pack = this.getPaymentPack(paymentPacks, booking);

      if (!consumer_payment_pack) {
        return [t('common.loading'), 'secondary'];
      }
      if (!payment_pack) {
        return [t('common.loading'), 'secondary'];
      }
      if (payment_pack.unlimited) {
        return [`${payment_pack.name} (illimité)`, 'primary'];
      }
      const { available_credits } = consumer_payment_pack;
      const { credits } = payment_pack;
      return [
        `${payment_pack.name}: ${available_credits}/${credits}${
          booking.was_refunded ? ` (${t('booking.wasRefunded')})` : ''
        }`,
        available_credits / credits < 0.1 ? 'error' : 'primary',
      ];
    }
    if (booking.source === 0) {
      return ['Payé via application bsport', 'primary'];
    }
    return ['Impayé', 'error'];
  };

  renderButtons = () => {
    const {
      t,
      booking,
      showQuickInvoiceButton,
      discardBookingAttendance,
      confirmBookingAttendance,
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
            onClick={discardBookingAttendance}
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
        <RedButton variant="outlined" onClick={confirmBookingAttendance}>
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
    const { heading, booking, classes, member } = this.props;
    if (!member) {
      return null;
    }
    switch (heading) {
      case 'date_start':
        return null;
      default: {
        const credits = parseFloat(member.credit_account_balance);
        let creditsFormatted = '';
        if (credits >= 0) {
          creditsFormatted = `${credits.toFixed(1)}€`;
        }
        if (credits < 0) {
          creditsFormatted = `${-credits.toFixed(1)}€`;
        }
        return (
          <Badge
            badgeContent={creditsFormatted}
            color={credits >= 0 ? 'primary' : 'error'}
            className={classes.badge}
          >
            <Avatar src={booking.user.photo} />
          </Badge>
        );
      }
    }
  };

  handleListItemClick = (event) => {
    event.preventDefault();
    const { redirectToMember, booking, newTab } = this.props;
    const url = `/member/${booking.member}`;
    if (redirectToMember && newTab) {
      const win = window.open(url);
      win.focus();
      return;
    }
    if (redirectToMember) {
      this.props.push(`/member/${booking.member}`);
    }
  };

  render() {
    const { t, booking, redirectToMember } = this.props;
    // <TableCell>{t(`booking.sources.${b.source}`)}</TableCell>
    const [statusText, color] = this.getStatusText(booking);
    console.log(`rendering ${booking.id}`);
    return (
      <ListItem
        divider
        button={redirectToMember}
        onClick={this.handleListItemClick}
      >
        {this.getAvatar()}
        <ListItemText
          primary={this.getHeading() + getBookingStatusCode(t, booking)}
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
  badge: {
    marginLeft: theme.spacing.unit,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    push(path) {
      dispatch(routerPush(path));
    },
  };
}

export default withNamespaces()(
  withStyles(styles)(
    connect(
      null,
      mapDispatchToProps,
    )(BookingItemForManager),
  ),
);
