// @flow
import React, { Component } from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Grid,
  withStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  paymentPackInvoiceItems: Array<InvoiceItem>,
  shopItemInvoiceItems: Array<InvoiceItem>,
  voucher: ?number,
  uneditableInvoiceItems: ?Array<InvoiceItem>,
  deleteOfferInvoiceItem: (id: number) => void,
  deletePPackInvoiceItem: (id: number) => void,
  deleteShopItemInvoiceItem: (id: number) => void,
  deleteVoucher: () => void,
  compact: boolean,
  classes: Object,
  t: TFunction,
};

export class InvoiceItemList extends Component<Props> {
  renderInvoiceItem = (invoiceItem, onDelete) => (
    <ListItem divider key={invoiceItem.id} dense disabled={onDelete === null}>
      <ListItemText
        primary={invoiceItem.name}
        secondary={invoiceItem.subtitle || null}
      />
      <ListItemSecondaryAction>
        <Grid container alignItems="center" spacing={16}>
          <Grid item>
            <Typography>{invoiceItem.price} €</Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => onDelete(invoiceItem.id)}
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

  // prettier-ignore
  renderOfferInvoiceItem = (invoiceItem) => (
    this.renderInvoiceItem(invoiceItem, this.props.deleteOfferInvoiceItem)
    )

  // prettier-ignore
  renderPPackInvoiceItem = (invoiceItem) => (
    this.renderInvoiceItem(invoiceItem, this.props.deletePPackInvoiceItem)
  )

  // prettier-ignore
  renderShopItemInvoiceItem= (invoiceItem) => (
    this.renderInvoiceItem(invoiceItem, this.props.deleteShopItemInvoiceItem)
  )

  // prettier-ignore
  renderVoucherInvoiceItem = (voucher: number) => {
    const { t } = this.props;
    const voucherAsInvoiceItem = {
          name: t('payment.voucher'),
          price: -voucher,
          id: -1,
        };
      return this.renderInvoiceItem(voucherAsInvoiceItem, this.props.deleteVoucher);
  }

  // prettier-ignore
  renderUneditableItems = (invoiceItem) => (
    this.renderInvoiceItem(invoiceItem, null)
  )

  render() {
    const {
      paymentPackInvoiceItems,
      shopItemInvoiceItems,
      voucher,
      uneditableInvoiceItems,
      compact,
      classes,
    } = this.props;
    return (
      <div className={compact ? classes.compactContainer : classes.container}>
        <List disablePadding>
          {(uneditableInvoiceItems || []).map((ii) =>
            this.renderUneditableItems(ii),
          )}
          {// prettier-ignore
          paymentPackInvoiceItems.map((ii) => this.renderPPackInvoiceItem(ii))}
          {shopItemInvoiceItems.map((ii) => this.renderShopItemInvoiceItem(ii))}
          {voucher ? this.renderVoucherInvoiceItem(voucher) : null}
        </List>
      </div>
    );
  }
}

const styles = () => ({
  container: {
    height: '100%',
    minHeight: 400,
  },
  compactContainer: {
    width: '100%',
  },
});

export default translate()(withStyles(styles)(InvoiceItemList));
