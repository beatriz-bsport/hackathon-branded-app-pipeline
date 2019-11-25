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
import CircularProgress from '@material-ui/core/CircularProgress';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment';

import { formatAsDate } from '../../../datetime';
import RedButton from '../../../components/button/RedButton.component';
import type { ConsumerPaymentPack } from '../types';
import type { PaymentPack } from '../../payment-packs/types';

import CreditStatus from './CreditStatus.component';

type Props = {
  loading: boolean,
  hideConsumer: ?boolean,
  selected?: boolean,
  noDivider: ?boolean,
  disabled: ?boolean,

  consumerPack: ConsumerPaymentPack,
  paymentPack: ?PaymentPack,
  button: ?Node,

  onClick: ?() => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  subscribeToOffer: ?(id: number) => void,

  t: TFunction,
};

export class ConsumerPackRowItem extends Component<Props> {
  renderButton = () => {
    const {
      paymentPack,
      consumerPack,
      incrementCredit,
      decrementCredit,
      subscribeToOffer,
      loading,
      t,
    } = this.props;
    if (consumerPack.dst_consumer_payment_pack) {
      return null;
    }
    if (!paymentPack) {
      return <CircularProgress />;
    }
    const { credits, unlimited } = paymentPack;
    const { available_credits, reverted } = consumerPack;

    if (reverted) {
      return <Button>{t('paymentPack.reverted')}</Button>;
    }

    if (subscribeToOffer) {
      return (
        <Button
          onClick={() => subscribeToOffer(consumerPack.id)}
          variant="outlined"
          color="primary"
          id={`btn-payment-pack-${consumerPack.id}`}
        >
          {t('paymentPack.use')}
        </Button>
      );
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
            {t('paymentPack.enableConsumer')}
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
          {t('paymentPack.disableConsumer')}
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
          +1
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
          -1
        </IconButton>
      </div>
    );
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
      (consumerPack.src_consumer_payment_pack &&
        consumerPack.src_consumer_payment_pack.length);
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
            consumerPack.disabled
              ? { backgroundColor: 'rgba(255,0,0,.05)' }
              : {}
          }
        >
          {hideConsumer ? null : (
            <Avatar src={consumer ? consumer.photo : null} />
          )}
          <ListItemText
            primary={
              <span>
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
              </span>
            }
            secondary={`${t('paymentPack.consumer.expiresOn')}${formatAsDate(
              consumerPack.ending_date,
            )}`}
            secondaryTypographyProps={{
              variant: 'caption',
              color: isExpired ? 'error' : 'inherit',
            }}
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
              {isOwnerOfShares ? t('paymentPack.consumer.isOwnerOfShares') : ''}
              {isFromShare && consumerPack.disabled
                ? t('paymentPack.consumer.isFromDisabledShare')
                : ''}
              {isFromShare && !consumerPack.disabled
                ? t('paymentPack.consumer.isFromShare')
                : ''}
            </Typography>
            <Divider />
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default withNamespaces()(ConsumerPackRowItem);
