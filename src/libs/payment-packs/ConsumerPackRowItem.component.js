// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment';

import { formatAsDate } from '../../datetime';
import RedButton from '../../components/button/RedButton.component';
import type { PaymentPack, ConsumerPaymentPack } from './types';

type Props = {
  loading: boolean,
  hideConsumer: ?boolean,

  consumerPack: ConsumerPaymentPack,
  paymentPack: PaymentPack,
  button: ?Node,

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
    const { credits, unlimited } = paymentPack;
    const { available_credits } = consumerPack;

    if (subscribeToOffer) {
      return (
        <Button
          onClick={() => subscribeToOffer(consumerPack.id)}
          variant="outlined"
          id={`btn-payment-pack-${consumerPack.id}`}
        >
          {t('paymentPack.subscribeToOffer')}
        </Button>
      );
    }

    if (unlimited) {
      if (consumerPack.disabled) {
        return (
          <Button
            onClick={() => incrementCredit(consumerPack.id)}
            variant="outlined"
          >
            {t('paymentPack.enableConsumer')}
          </Button>
        );
      }
      return (
        <RedButton
          onClick={() => decrementCredit(consumerPack.id)}
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
          onClick={() => incrementCredit(consumerPack.id)}
        >
          +1
        </IconButton>
        <IconButton
          aria-label="change-credits"
          color="secondary"
          onClick={() => decrementCredit(consumerPack.id)}
        >
          -1
        </IconButton>
      </div>
    );
  };

  render() {
    const { t, consumerPack, button, hideConsumer, paymentPack } = this.props;
    const { consumer } = consumerPack;
    const isExpired = moment(consumerPack.ending_date).isBefore(moment());

    const { credits, unlimited } = paymentPack;
    const { available_credits } = consumerPack;

    const creditStatus = unlimited ? (
      <Typography variant="caption" color="primary" component="span">
        {`${t('paymentPack.unlimitedCredits')}`}
      </Typography>
    ) : (
      <Typography
        component="span"
        variant="caption"
        color={available_credits / credits > 0.2 ? 'primary' : 'error'}
      >
        {`${available_credits} / ${credits} ${t(
          'paymentPack.credits',
        ).toLowerCase()}`}
      </Typography>
    );

    return (
      <ListItem dense divider>
        {hideConsumer ? null : <Avatar src={consumer.photo} />}
        <ListItemText
          primary={
            <span>
              <Typography>
                {hideConsumer
                  ? paymentPack.name
                  : `${consumer.first_name} ${consumer.last_name}`}
              </Typography>
              {creditStatus}
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
    );
  }
}

export default withNamespaces()(ConsumerPackRowItem);
