// @flow
import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

import DeleteIcon from '@material-ui/icons/Delete';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { getCurrencyDisplay } from '../../theme/selectors';

import type { InvoiceItem } from './types';

type Props = {
  compact: boolean,
  voucher: ?number,
  topUp: ?number,
  uneditableVoucher: ?number,

  paymentPackInvoiceItems: Array<InvoiceItem>,
  privatePassInvoiceItems: Array<InvoiceItem>,
  paymentComboInvoiceItems: Array<InvoiceItem>,
  shopItemInvoiceItems: Array<InvoiceItem>,
  uneditableInvoiceItems: ?Array<InvoiceItem>,

  deleteTopUp: () => void,
  deleteVoucher: () => void,

  deletePPackInvoiceItem: (id: number) => void,
  deletePrivatePassInvoiceItem: (id: number) => void,
  deleteShopItemInvoiceItem: (id: number) => void,
  deletePaymentComboInvoiceItem: (id: number) => void,

  classes: Object,
  t: TFunction,
};

export class InvoiceItemList extends Component<Props> {
  renderInvoiceItem = (
    invoiceItem: InvoiceItem,
    onDelete: ?(invoiceItemId: number) => void,
  ) => (
    <ListItem key={invoiceItem.id} dense disabled={onDelete === null}>
      <ListItemText
        primary={invoiceItem.name}
        secondary={invoiceItem.subtitle || null}
        primaryTypographyProps={{
          className: invoiceItem.reverted ? this.props.classes.revert : {},
        }}
        secondaryTypographyProps={{
          className: invoiceItem.reverted ? this.props.classes.revert : {},
        }}
      />
      <ListItemSecondaryAction>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Typography
              className={invoiceItem.reverted ? this.props.classes.revert : {}}
            >
              {invoiceItem.price} ${getCurrencyDisplay()}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => (onDelete || (() => {}))(invoiceItem.id)}
              disabled={onDelete === null}
              color="primary"
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </ListItemSecondaryAction>
    </ListItem>
  );

  renderPPackInvoiceItem = (invoiceItem: InvoiceItem) =>
    this.renderInvoiceItem(invoiceItem, this.props.deletePPackInvoiceItem);

  renderPrivatePassInvoiceItem = (invoiceItem: InvoiceItem) =>
    this.renderInvoiceItem(
      invoiceItem,
      this.props.deletePrivatePassInvoiceItem,
    );

  renderPaymentComboInvoiceItem = (invoiceItem: InvoiceItem) =>
    this.renderInvoiceItem(
      invoiceItem,
      this.props.deletePaymentComboInvoiceItem,
    );

  renderShopItemInvoiceItem = (invoiceItem: InvoiceItem) =>
    this.renderInvoiceItem(invoiceItem, this.props.deleteShopItemInvoiceItem);

  renderVoucherInvoiceItem = (voucher: number, editable: boolean) => {
    const { t } = this.props;
    const voucherAsInvoiceItem = {
      name: t('payment.voucher'),
      price: -voucher,
      id: -1,
    };
    return this.renderInvoiceItem(
      voucherAsInvoiceItem,
      editable ? this.props.deleteVoucher : null,
    );
  };

  renderTopUpInvoiceItem = (topUp: number, editable: boolean) => {
    const { t } = this.props;
    const topUpAsInvoiceItem = {
      name: t('payment.topUp'),
      price: topUp,
      id: -2,
    };
    return this.renderInvoiceItem(
      topUpAsInvoiceItem,
      editable ? this.props.deleteTopUp : null,
    );
  };

  renderUneditableItems = (invoiceItem: InvoiceItem) =>
    this.renderInvoiceItem(invoiceItem, null);

  render() {
    const {
      paymentPackInvoiceItems,
      privatePassInvoiceItems,
      paymentComboInvoiceItems,
      shopItemInvoiceItems,
      voucher,
      uneditableInvoiceItems,
      uneditableVoucher,
      compact,
      classes,
      topUp,
    } = this.props;
    return (
      <div className={compact ? classes.compactContainer : classes.container}>
        <List disablePadding>
          {(uneditableInvoiceItems || []).map((ii) =>
            this.renderUneditableItems(ii),
          )}
          {paymentPackInvoiceItems.map((ii) => this.renderPPackInvoiceItem(ii))}
          {privatePassInvoiceItems.map((ii) =>
            this.renderPrivatePassInvoiceItem(ii),
          )}
          {paymentComboInvoiceItems.map((ii) =>
            this.renderPaymentComboInvoiceItem(ii),
          )}
          {shopItemInvoiceItems.map((ii) => this.renderShopItemInvoiceItem(ii))}
          {voucher ? this.renderVoucherInvoiceItem(voucher, true) : null}
          {topUp ? this.renderTopUpInvoiceItem(topUp, true) : null}
          {uneditableVoucher
            ? this.renderVoucherInvoiceItem(uneditableVoucher, false)
            : null}
        </List>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      minHeight: '400px',
    },
  },
  compactContainer: {
    width: '100%',
  },
  revert: {
    textDecoration: 'line-through',
  },
});

export default withTranslation()(withStyles(styles)(InvoiceItemList));
