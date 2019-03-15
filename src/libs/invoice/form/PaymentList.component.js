// @flow
import React, { Component } from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  withStyles,
  Typography,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import CachedIcon from '@material-ui/icons/Cached';

import PAYMENT_METHODS, {
  CB as PAYMENT_METHOD_CB,
} from '@bsport/common/lib/master-data/payment-methods';

type Props = {
  paymentItems: Array<PaymentItemData>,
  uneditablePayments: Array<PaymentItemData>,
  classes: Object,
  onDelete: (paymentId: number) => void,
  updateStatus: (uuid: string, newStatus: boolean) => void,
  t: TFunction,
};

export class PaymentList extends Component<Props> {
  renderSecondaryAction = (paymentItem: PaymentItem, uneditable: boolean) => {
    const { onDelete, updateStatus } = this.props;
    if (uneditable) {
      return (
        <IconButton
          disabled={paymentItem.payment_method === PAYMENT_METHOD_CB.id}
          onClick={() => {
            // prettier-ignore
            updateStatus(paymentItem.uuid, !paymentItem.payment_received);
          }}
          color="primary"
        >
          <CachedIcon />
        </IconButton>
      );
    }
    return (
      <IconButton onClick={() => onDelete(paymentItem)} color="primary">
        <DeleteIcon />
      </IconButton>
    );
  };

  renderPaymentItem = (paymentItem, uneditable) => {
    const { t } = this.props;
    const {
      price,
      payment_received,
      payment_note,
      id,
      uuid,
      payment_method,
    } = paymentItem;
    const paymentMethodText = PAYMENT_METHODS.find(
      (pm) => pm.id === payment_method,
    ).text;
    return (
      <ListItem
        dense
        divider
        key={`${uuid}-${id}-{payment_method}-{price}`}
        disabled={uneditable}
      >
        <ListItemIcon>
          {payment_received ? (
            <CheckIcon color="secondary" />
          ) : (
            <CancelIcon color="secondary" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={`${price} €  -  ${t(
            `payment.paymentMethods.${paymentMethodText}`,
          )}`}
          secondary={payment_note}
        />
        <ListItemSecondaryAction>
          {this.renderSecondaryAction(paymentItem, uneditable)}
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  render() {
    const { paymentItems, t, classes, uneditablePayments } = this.props;
    if (paymentItems.length + uneditablePayments.length === 0) {
      return (
        <Typography className={classes.emptyPaymentExplainer} variant="caption">
          {t('payment.noPaymentItem')}
        </Typography>
      );
    }
    return (
      <List disablePadding>
        {paymentItems.map((pi) => this.renderPaymentItem(pi, false))}
        {uneditablePayments.map((pi) => this.renderPaymentItem(pi, true))}
      </List>
    );
  }
}

const styles = (theme) => ({
  emptyPaymentExplainer: {
    padding: theme.spacing.unit,
  },
});

export default withNamespaces()(withStyles(styles)(PaymentList));
