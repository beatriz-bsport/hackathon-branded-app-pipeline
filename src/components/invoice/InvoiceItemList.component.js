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

type Props = {
  offerInvoiceItems: Array<InvoiceItem>,
  paymentPackInvoiceItems: Array<InvoiceItem>,
  voucherInvoiceItems: Array<InvoiceItem>,
  uneditableInvoiceItems: Array<InvoiceItem>,
  deleteOfferInvoiceItem: (id: number) => void,
  deletePPackInvoiceItem: (id: number) => void,
  deleteVoucher: () => void,
  compact: boolean,
  classes: Object,
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
  renderVoucherInvoiceItem = (invoiceItem) => (
    this.renderInvoiceItem(invoiceItem, this.props.deleteVoucher)
  )

  // prettier-ignore
  renderUneditableItems = (invoiceItem) => (
    this.renderInvoiceItem(invoiceItem, null)
  )

  render() {
    const {
      paymentPackInvoiceItems,
      offerInvoiceItems,
      voucherInvoiceItems,
      uneditableInvoiceItems,
      compact,
      classes,
    } = this.props;
    return (
      <div className={compact ? classes.compactContainer : classes.container}>
        <List disablePadding>
          {uneditableInvoiceItems.map((ii) => this.renderUneditableItems(ii))}
          {// prettier-ignore
          paymentPackInvoiceItems.map((ii) => this.renderPPackInvoiceItem(ii))}
          {offerInvoiceItems.map((ii) => this.renderOfferInvoiceItem(ii))}
          {voucherInvoiceItems.map((ii) => this.renderVoucherInvoiceItem(ii))}
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

export default withStyles(styles)(InvoiceItemList);
