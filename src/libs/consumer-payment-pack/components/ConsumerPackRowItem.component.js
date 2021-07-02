// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import EventIcon from '@material-ui/icons/Event';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment-timezone';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '../../../components/Tooltip.component';

import { formatAsDate } from '../../../utils/datetime';
import RedButton from '../../../components/button/RedButton.component';
import type { ConsumerPaymentPack } from '../types';
import type { PaymentPack } from '../../payment-packs/types';
import { MaxoutBooking } from '../types';

import CreditStatus from './CreditStatus.component';
import { showDeleteDialog } from '../../../components/GenericDialog/CustomDialogs';
import { Offer } from '../../offer/types';

type Props = {
  loading: boolean,
  hideConsumer: ?boolean,
  selected?: boolean,
  noDivider: ?boolean,
  disabled: ?boolean,

  consumerPack: ConsumerPaymentPack,
  paymentPack: ?PaymentPack,
  maxoutBooking?: MaxoutBooking,
  button: ?Node,

  unblock: ?(id: number) => void,

  onClick: ?() => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  onBook: ?(id: number) => void,

  t: TFunction,
  isNonCompatible?: boolean,
  classes: Object,
  onBookOne: (id: number) => void,
  onBookMultiple: (id: number) => void,
  offer?: Offer,
};

export class ConsumerPackRowItem extends Component<Props> {
  checkMaxoutBeforeBook = async (callback: () => void) => {
    const { t } = this.props;
    const maxoutStatus = this.getCppMaxoutStatus(
      this.props.maxoutBooking,
      this.props.offer,
    );

    let book = true;

    if (maxoutStatus) {
      let maxBooking = 0;

      if (maxoutStatus === 'days') {
        maxBooking = this.props.paymentPack.max_bookings_per_day;
      }
      if (maxoutStatus === 'weeks') {
        maxBooking = this.props.paymentPack.max_bookings_per_week;
      }
      if (maxoutStatus === 'months') {
        maxBooking = this.props.paymentPack.max_bookings_per_month;
      }

      const unit = this.props.t(`consumerPaymentPack.maxout.${maxoutStatus}`);

      book = await showDeleteDialog(
        t('consumerPaymentPack.maxout.dialogTitle'),
        t('consumerPaymentPack.maxout.dialog_message', {
          count: maxBooking,
          unit,
        }),
      );
    }

    if (book) {
      callback();
    }
  };

  renderButton = () => {
    const {
      paymentPack,
      consumerPack,
      incrementCredit,
      decrementCredit,
      onBook,
      onBookOne,
      onBookMultiple,
      isNonCompatible,
      loading,
      t,
    } = this.props;
    if (isNonCompatible) {
      return (
        <RedButton
          variant="outlined"
          disabled
          color="primary"
          id={`btn-payment-pack-${consumerPack.id}`}
        >
          {t('isNonCompatible')}
        </RedButton>
      );
    }
    if (onBook) {
      return (
        <Button
          onClick={() =>
            this.checkMaxoutBeforeBook(() => onBook(consumerPack.id))
          }
          variant="outlined"
          color="primary"
          id={`btn-payment-pack-${consumerPack.id}`}
        >
          {t('use')}
        </Button>
      );
    }
    if (onBookOne && onBookMultiple) {
      return (
        <div className={this.props.classes.buttonRow}>
          <Button
            onClick={() =>
              this.checkMaxoutBeforeBook(() => onBookOne(consumerPack.id))
            }
            variant="outlined"
            color="primary"
            id={`btn-payment-pack-${consumerPack.id}`}
          >
            <EventIcon />
          </Button>
          <Tooltip title={t('multipleBookingTooltip')}>
            <Button
              onClick={() =>
                this.checkMaxoutBeforeBook(() =>
                  onBookMultiple(consumerPack.id),
                )
              }
              variant="outlined"
              color="secondary"
              id={`btn-payment-pack-${consumerPack.id}`}
            >
              <DateRangeIcon />
            </Button>
          </Tooltip>
        </div>
      );
    }

    if (consumerPack.dst_consumer_payment_pack) {
      return null;
    }
    if (!paymentPack) {
      return <CircularProgress />;
    }
    const { credits, unlimited } = paymentPack;
    const { available_credits, reverted } = consumerPack;

    if (reverted) {
      return <Button>{t('reverted')}</Button>;
    }

    if (unlimited && incrementCredit && decrementCredit) {
      if (consumerPack.disabled && !consumerPack.dst_consumer_payment_pack) {
        return (
          <Button
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              incrementCredit(consumerPack.id);
            }}
            variant="outlined"
          >
            {t('enableConsumer')}
          </Button>
        );
      }
      return (
        <RedButton
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            decrementCredit(consumerPack.id);
          }}
          variant="outlined"
        >
          {t('disableConsumer')}
        </RedButton>
      );
    }

    if (!incrementCredit || !decrementCredit) {
      return null;
    }

    if (loading) {
      return (
        <div>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <IconButton
          aria-label="change-credits"
          disabled={available_credits >= credits}
          color="primary"
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            incrementCredit(consumerPack.id);
          }}
        >
          <ExposurePlus1Icon />
        </IconButton>
        <IconButton
          aria-label="change-credits"
          color="secondary"
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            decrementCredit(consumerPack.id);
          }}
        >
          <ExposureNeg1Icon />
        </IconButton>
        {consumerPack.disabled && this.props.unblock && (
          <Button
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              this.props.unblock(consumerPack.id);
            }}
            variant="outlined"
          >
            {t('enableConsumer')}
          </Button>
        )}
      </div>
    );
  };

  getCppMaxoutStatus = (maxoutBooking: MaxoutBooking, offer?: Offer) => {
    if (!maxoutBooking || !offer) {
      return undefined;
    }

    const maxout = {
      days: false,
      weeks: false,
      months: false,
    };

    const offerStart = moment(offer.date_start);

    Object.entries(maxoutBooking).forEach(([key, data]) => {
      if (data) {
        data.forEach((d) => {
          const maxoutStart = moment(d.start_date);
          const maxoutEnd = moment(d.end_date);

          if (
            offerStart.isSameOrAfter(maxoutStart, 'day') &&
            offerStart.isSameOrBefore(maxoutEnd, 'day') &&
            d.booking_available === 0
          ) {
            maxout[key] = true;
          }
        });
      }
    });

    if (maxout.months) {
      return 'months';
    }

    if (maxout.weeks) {
      return 'weeks';
    }

    if (maxout.days) {
      return 'days';
    }
    return undefined;
  };

  renderMaxoutError = () => {
    if (this.props.maxoutBooking) {
      const maxoutStatus = this.getCppMaxoutStatus(
        this.props.maxoutBooking,
        this.props.offer,
      );

      if (maxoutStatus) {
        const unit = this.props.t(`consumerPaymentPack.maxout.${maxoutStatus}`);

        return (
          <Typography color="error">
            {this.props.t('consumerPaymentPack.maxout.limit_reach', {
              unit,
            })}
          </Typography>
        );
      }
    }

    return null;
  };

  render() {
    const {
      t,
      consumerPack,
      button,
      hideConsumer,
      paymentPack,
      onClick,
    } = this.props;
    const { consumer } = consumerPack;
    const isExpired = moment(consumerPack.ending_date).isBefore(moment());
    const isFromShare = consumerPack && consumerPack.dst_consumer_payment_pack;
    const isOwnerOfShares =
      consumerPack &&
      consumerPack.src_consumer_payment_pack &&
      consumerPack.src_consumer_payment_pack.length;
    return (
      <div>
        <ListItem
          dense
          divider={!this.props.noDivider}
          selected={!!this.props.selected}
          disabled={!!consumerPack.reverted || !!this.props.disabled}
          button={!!onClick}
          onClick={onClick || null}
          style={
            consumerPack.disabled || !!this.props.isNonCompatible
              ? { backgroundColor: 'rgba(255,0,0,.05)' }
              : {}
          }
        >
          {hideConsumer ? null : (
            <ListItemAvatar>
              <Avatar src={consumer ? consumer.photo : null} />
            </ListItemAvatar>
          )}
          <ListItemText
            primary={
              <div>
                <Typography>
                  {hideConsumer
                    ? (paymentPack && paymentPack.name) || ' - '
                    : `${
                        // eslint-disable-next-line
                        consumer && consumer.name
                          ? consumer.name
                          : consumer && consumer.first_name
                          ? consumer.first_name
                          : ' - '
                      } ${
                        consumer && consumer.last_name ? consumer.last_name : ''
                      }`}
                </Typography>
                <CreditStatus
                  paymentPack={paymentPack}
                  consumerPack={consumerPack}
                />
              </div>
            }
            secondary={
              <div variant="caption" color={isExpired ? 'error' : 'inherit'}>
                <Typography>
                  {t('consumer.expiresOn')}
                  {formatAsDate(consumerPack.ending_date)}
                </Typography>
                {this.renderMaxoutError()}
              </div>
            }
          />
          {button || this.renderButton()}
        </ListItem>
        {isFromShare || isOwnerOfShares ? (
          <React.Fragment>
            <Typography
              style={{ paddingLeft: 16 }}
              variant="caption"
              color="textSecondary"
            >
              {' '}
              {isOwnerOfShares ? t('consumer.isOwnerOfShares') : ''}
              {isFromShare && consumerPack.disabled
                ? t('consumer.isFromDisabledShare')
                : ''}
              {isFromShare && !consumerPack.disabled
                ? t('consumer.isFromShare')
                : ''}
            </Typography>
            <Divider />
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  buttonRow: {
    '&>*': {
      marginLeft: theme.spacing(1),
    },
  },
});

export default compose(
  withTranslation(['paymentPack']),
  withStyles(styles),
)(ConsumerPackRowItem);
