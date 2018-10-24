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
  Divider,
  withStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { translate } from 'react-i18next';

type Props = {
  finalPrice: number,
  offerInvoiceItems: Array<InvoiceItem>,
  paymentPackInvoiceItems: Array<InvoiceItem>,
  voucherInvoiceItems: Array<InvoiceItem>,
  uneditableInvoiceItems: Array<InvoiceItem>,
  deleteOfferInvoiceItem: (id: number) => void,
  deletePPackInvoiceItem: (id: number) => void,
  deleteVoucher: () => void,
  t: (x: string) => string,
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

  renderOfferInvoiceItem = (invoiceItem) =>
    this.renderInvoiceItem(invoiceItem, this.props.deleteOfferInvoiceItem);

  renderPPackInvoiceItem = (invoiceItem) =>
    this.renderInvoiceItem(invoiceItem, this.props.deletePPackInvoiceItem);

  renderVoucherInvoiceItem = (invoiceItem) =>
    this.renderInvoiceItem(invoiceItem, this.props.deleteVoucher);

  renderUneditableItems = (invoiceItem) =>
    this.renderInvoiceItem(invoiceItem, null);

  renderTotal = () => {
    const { t, classes, finalPrice } = this.props;
    return (
      <div>
        <Divider />
        <Grid
          container
          direction="row"
          justify="space-between"
          className={classes.totalLine}
        >
          <Grid item>
            <Typography variant="h6">{t('payment.total')}</Typography>
          </Grid>
          <Grid>
            <Typography variant="h6">{finalPrice} €</Typography>
          </Grid>
        </Grid>
      </div>
    );
  };

  render() {
    const {
      paymentPackInvoiceItems,
      offerInvoiceItems,
      voucherInvoiceItems,
      uneditableInvoiceItems,
      classes,
    } = this.props;
    return (
      <Grid
        container
        direction="column"
        justify="space-between"
        className={classes.container}
      >
        <Grid item>
          <List disablePadding>
            {uneditableInvoiceItems.map((ii) => this.renderUneditableItems(ii))}
            {paymentPackInvoiceItems.map((ii) =>
              this.renderPPackInvoiceItem(ii),
            )}
            {offerInvoiceItems.map((ii) => this.renderOfferInvoiceItem(ii))}
            {voucherInvoiceItems.map((ii) => this.renderVoucherInvoiceItem(ii))}
          </List>
        </Grid>
        <Grid item>{this.renderTotal()}</Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  container: {
    height: '100%',
    minHeight: 400,
  },
  totalLine: {
    padding: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(translate()(InvoiceItemList));
