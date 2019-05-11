// @flow

import React, { PureComponent } from 'react';
import {
  withStyles,
  Avatar,
  Button,
  IconButton,
  ListItem,
  ListItemIcon,
  Typography,
  ListItemText,
  Badge,
  ListItemSecondaryAction,
} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CachedIcon from '@material-ui/icons/Cached';
import CancelIcon from '@material-ui/icons/Cancel';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import moment from 'moment';
import { getBookingStatusCode } from './Booking.utils';

import RedButton from '../button/RedButton.component';
import { formatAsDatetime, formatAsDate } from '../../datetime';
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

const getPackDate = (consumerPack) => {
  const { ending_date, starting_date } = consumerPack;
  return [
    `${formatAsDate(starting_date)}→${formatAsDate(ending_date)}`,
    moment(ending_date).isBefore(moment().add(6, 'day')),
  ];
};

const AttendanceButton = (props) => {
  if (props.attendance) {
    return (
      <Button
        color="primary"
        variant={props.variant}
        onClick={props.discardBookingAttendance}
      >
        {props.t('booking.attend')}
        <CachedIcon className={props.classes.iconButton} />
      </Button>
    );
  }
  return (
    <RedButton variant={props.variant} onClick={props.confirmBookingAttendance}>
      {props.t('booking.doNotAttend')}
      <CachedIcon className={props.classes.iconButton} />
    </RedButton>
  );
};

export class BookingItemForManager extends PureComponent<Props> {
  state = { menuAnchor: null };

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
        return [[t('common.loading'), 'secondary']];
      }
      if (!payment_pack) {
        return [[t('common.loading'), 'secondary']];
      }
      const [packDates, soonExpired] = getPackDate(consumer_payment_pack);
      if (payment_pack.unlimited) {
        return [
          [payment_pack.name, 'secondary'],
          [`${packDates} - illimité`, soonExpired ? 'error' : 'primary'],
        ];
      }
      const { available_credits } = consumer_payment_pack;
      const { credits } = payment_pack;
      return [
        [payment_pack.name, 'secondary'],
        [
          ` ${packDates} - ${available_credits}/${credits}${
            booking.was_refunded ? `, (${t('booking.wasRefunded')})` : ''
          }`,
          available_credits / credits < 0.1 || soonExpired
            ? 'error'
            : 'primary',
        ],
      ];
    }
    if (booking.source === 0) {
      return [['Payé via application bsport', 'primary']];
    }
    return [['Impayé', 'error']];
  };

  renderCompactMenu = () => {
    const closeAndAction = (actionCallback) => () => {
      actionCallback();
      this.setState({ menuAnchor: null });
    };
    const {
      onQuickInvoiceClick,
      confirmBookingAttendance,
      discardBookingAttendance,
      handleRevert,
      booking,
      classes,
      t,
    } = this.props;
    const attendText = booking.attendance
      ? t('booking.attend')
      : t('booking.doNotAttend');
    const switchAttendance = booking.attendance
      ? discardBookingAttendance
      : confirmBookingAttendance;

    return (
      <ListItemSecondaryAction>
        <IconButton
          onClick={(event) =>
            this.setState({ menuAnchor: event.currentTarget })
          }
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="simple-menu"
          anchorEl={this.state.menuAnchor}
          open={Boolean(this.state.menuAnchor)}
          onClose={closeAndAction(() => {})}
        >
          <MenuItem onClick={closeAndAction(onQuickInvoiceClick)}>
            <ListItemText>Facturer</ListItemText>
            <ListItemIcon className={classes.iconButton}>
              <EuroSymbolIcon />
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick={closeAndAction(switchAttendance)}>
            <ListItemText>{attendText}</ListItemText>
            <ListItemIcon>
              <CachedIcon className={classes.iconButton} />
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick={closeAndAction(handleRevert)}>
            <ListItemText>Désinscrire</ListItemText>
            <ListItemIcon className={classes.iconButton}>
              <CancelIcon />
            </ListItemIcon>
          </MenuItem>
        </Menu>
      </ListItemSecondaryAction>
    );
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
      compact,
    } = this.props;

    if (compact) {
      return this.renderCompactMenu();
    }

    return (
      <ListItemSecondaryAction>
        <AttendanceButton
          attendance={booking.attendance}
          variant="outlined"
          t={t}
          classes={classes}
          discardBookingAttendance={discardBookingAttendance}
          confirmBookingAttendance={confirmBookingAttendance}
        />
        {showQuickInvoiceButton ? (
          <Button
            variant="outlined"
            color="secondary"
            onClick={this.props.onQuickInvoiceClick}
            className={classes.rightButton}
          >
            <EuroSymbolIcon />
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
        let creditColor = 'primary';
        if (credits >= 0) {
          creditsFormatted = `${credits.toFixed(1)}€`;
          creditColor = 'primary';
        }
        if (!credits) {
          creditColor = 'secondary';
        }
        if (credits < 0) {
          creditsFormatted = `${-credits.toFixed(1)}€`;
          creditColor = 'error';
        }

        return (
          <Badge
            badgeContent={creditsFormatted}
            color={creditColor}
            colorSecondary={{ color: 'gray' }}
            classes={{ badge: classes.badge }}
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
    const bookingStatus = this.getStatusText(booking);
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
          primaryTypographyProps={{ variant: 'subtitle2' }}
          secondary={
            <React.Fragment>
              {bookingStatus.map(([txt, color]) => {
                return <Typography color={color}>{txt}</Typography>;
              })}
            </React.Fragment>
          }
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
    right: '0%',
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
