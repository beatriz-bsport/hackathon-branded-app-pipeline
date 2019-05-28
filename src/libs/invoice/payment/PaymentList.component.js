// @flow
import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import CachedIcon from '@material-ui/icons/Cached';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';

import PAYMENT_METHODS, {
  SUBSCRIPTION_CB as PAYMENT_METHOD_SUBSCRIPTION_CB,
} from '@bsport/common/lib/master-data/payment-methods';

import type { PaymentItemData, PaymentItem } from './types';

type Props = {
  paymentItems: Array<PaymentItemData>,
  uneditablePayments: Array<PaymentItem>,
  classes: Object,
  onDelete: (paymentId: number) => void,
  updatePaymentMethod: (uuid: string, newMethod: number) => void,
  t: TFunction,
};

type PaymentItemProps = {
  paymentItem: PaymentItem | PaymentItemData,
  classes: Object,
  onDelete: (paymentId: number) => void,
  updatePaymentMethod: (uuid: string, newMethod: number) => void,
  t: TFunction,
  uneditable: boolean,
};

type PaymentItemState = {
  changeMethodAnchorEl: ?Object,
};
const styles = (theme) => ({
  emptyPaymentExplainer: {
    padding: theme.spacing.unit,
  },
  revert: {
    textDecoration: 'line-through',
  },
});

class PaymentListItem extends Component<PaymentItemProps, PaymentItemState> {
  state = {
    changeMethodAnchorEl: null,
  };

  handleChangeMethod = (uuid: string, id: number) => {
    this.props.updatePaymentMethod(uuid, id);
    this.setState({ changeMethodAnchorEl: null });
  };

  renderSecondaryAction = (
    paymentItem: PaymentItem | PaymentItemData,
    uneditable: boolean,
  ) => {
    const { onDelete } = this.props;
    if (uneditable) {
      return (
        <div>
          <IconButton
            disabled={!paymentItem.is_method_editable}
            onClick={(e) =>
              this.setState({ changeMethodAnchorEl: e.currentTarget })
            }
            color="primary"
          >
            <CachedIcon />
          </IconButton>
          <Menu
            id={`simple-menu${paymentItem.uuid}`}
            anchorEl={this.state.changeMethodAnchorEl}
            open={Boolean(this.state.changeMethodAnchorEl)}
            onClose={() => this.setState({ changeMethodAnchorEl: null })}
          >
            {PAYMENT_METHODS.filter((pm) => pm.is_method_editable).map((pm) => (
              <MenuItem
                key={pm.id + paymentItem.uuid}
                disabled={pm.id === paymentItem.payment_method}
                onClick={() => this.handleChangeMethod(paymentItem.uuid, pm.id)}
                value={pm.id}
              >
                {this.props.t(`payment.paymentMethods.${pm.text}`)}
              </MenuItem>
            ))}
          </Menu>
        </div>
      );
    }
    return (
      <IconButton onClick={() => onDelete(paymentItem)} color="primary">
        <DeleteIcon />
      </IconButton>
    );
  };

  renderPaymentReceived = (paymentItem: PaymentItem | PaymentItemData) => {
    if (paymentItem.payment_received) {
      return <CheckIcon color="secondary" />;
    }
    if (paymentItem.payment_method === PAYMENT_METHOD_SUBSCRIPTION_CB.id) {
      return <HourglassEmpty color="secondary" />;
    }
    return <CancelIcon color="secondary" />;
  };

  render() {
    const { paymentItem, uneditable } = this.props;
    const { t } = this.props;
    const { price, payment_note, uuid, payment_method } = paymentItem;
    const paymentMethodText = PAYMENT_METHODS.find(
      (pm) => pm.id === payment_method,
    ).text;
    return (
      <ListItem
        dense
        divider
        key={`${uuid}-{payment_method}-{price}`}
        disabled={uneditable}
      >
        <ListItemIcon>{this.renderPaymentReceived(paymentItem)}</ListItemIcon>
        <ListItemText
          primary={`${price} €  -  ${t(
            `payment.paymentMethods.${paymentMethodText}`,
          )}`}
          secondary={payment_note}
          primaryTypographyProps={{
            className: paymentItem.reverted ? this.props.classes.revert : {},
          }}
          secondaryTypographyProps={{
            className: paymentItem.reverted ? this.props.classes.revert : {},
          }}
        />
        <ListItemSecondaryAction>
          {this.renderSecondaryAction(paymentItem, uneditable)}
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

const PaymentListItemComposed = withStyles(styles)(
  withNamespaces()(PaymentListItem),
);

export function PaymentList(props: Props) {
  const { paymentItems, t, classes, uneditablePayments } = props;
  if (paymentItems.length + uneditablePayments.length === 0) {
    return (
      <Typography className={classes.emptyPaymentExplainer} variant="caption">
        {t('payment.noPaymentItem')}
      </Typography>
    );
  }
  return (
    <List disablePadding>
      {paymentItems.map((pi, idx) => (
        <PaymentListItemComposed
          paymentItem={pi}
          uneditable={false}
          key={`${pi.price}-${idx}`}
          onDelete={props.onDelete}
          updatePaymentMethod={props.updatePaymentMethod}
        />
      ))}
      {uneditablePayments.map((pi) => (
        <PaymentListItemComposed
          paymentItem={pi}
          key={pi.uuid}
          uneditable
          updatePaymentMethod={props.updatePaymentMethod}
        />
      ))}
    </List>
  );
}

export default withNamespaces()(withStyles(styles)(PaymentList));
