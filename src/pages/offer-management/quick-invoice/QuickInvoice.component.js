// @flow
import React, { Component } from 'react';

import {
  Button,
  Divider,
  Grid,
  Typography,
  IconButton,
  withStyles,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import {
  CB_MANUAL as PAYMENT_METHOD_CB_MANUAL,
  CHECK as PAYMENT_METHOD_CHECK,
  CASH as PAYMENT_METHOD_CASH,
} from 'bsport-commons/lib/master-data/payment-methods';
import InvoiceItemList from '../../../components/invoice/InvoiceItemList.component';
import UnevenInvoiceDialog from '../../../components/invoice/UnevenInvoiceDialog.component';
import InvoiceItemSelector from '../../../components/invoice/InvoiceItemSelector.container';
import { SELECTOR_SHOP as INVOICE_SELECTOR_SHOP_TAB } from '../../../components/invoice/InvoiceItemSelector.component';
import { formatAsDate } from '../../../datetime';
import { Moment } from '../../../i18n';
import PaymentInfo from './PaymentInfo.component';

type Props = {
  quickInvoiceTitle: string,
  quickInvoice: { member: Member },
  uneditableInvoiceItems: Array<InvoiceItem>,
  editMode: ?boolean,
  onClose: ?() => void,
  classes: Object,
  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  createInvoice: (data: [*]) => void,
  updateInvoice: (data: [*]) => void,
};

type State = {
  cb: number,
  check: number,
  cash: number,
  voucher: number,
  showInvoiceItemSelector: boolean,
  additionalPaymentPacks: Array<PaymentPack>,
  additionalShopItems: Array<ShopItem>,
  unevenInvoiceAlertOpen: boolean,
};

function getTotal(acc, invoiceItem) {
  return acc + parseFloat(invoiceItem.price);
}

export class QuickInvoice extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      cb: 0,
      cash: 0,
      check: 0,
      voucher: 0,
      showInvoiceItemSelector: !props.editMode,
      additionalPaymentPacks: [],
      additionalShopItems: [],
      unevenInvoiceAlertOpen: false,
    };
  }

  getTotalPayment = () => {
    const { cb, cash, check, voucher } = this.state;
    return (cb || 0) + (check || 0) + (cash || 0) + (voucher || 0);
  };

  handlePaymentChange = (payment_type) => (e) => {
    this.setState({ [payment_type]: parseFloat(e.target.value) });
  };

  handleVoucher = (event) => {
    this.setState({ voucher: parseFloat(event.target.value) });
  };

  getFinalPrice = () => {
    const { uneditableInvoiceItems } = this.props;
    const { additionalShopItems, additionalPaymentPacks } = this.state;
    const sumPack = additionalPaymentPacks.reduce(getTotal, 0);
    const sumShop = additionalShopItems.reduce(getTotal, 0);
    const sumUneditable = (uneditableInvoiceItems || []).reduce(getTotal, 0);
    return sumPack + sumShop + sumUneditable;
  };

  choseInvoiceItem = () => {
    this.setState({ showInvoiceItemSelector: true });
  };

  closeUnevenInvoiceDialog = () => {
    this.setState({ unevenInvoiceAlertOpen: false });
  };

  addPaymentPack = (paymentPackId: number, date_bought: Object) => {
    const ppToAdd = this.props.paymentPacks.find(
      (pp) => pp.id === paymentPackId,
    );
    this.setState((prevState) => ({
      additionalPaymentPacks: [
        ...prevState.additionalPaymentPacks,
        {
          name: ppToAdd.name,
          price: ppToAdd.price,
          id: ppToAdd.id,
          subtitle: formatAsDate(date_bought || Moment()),
          date_bought: date_bought.format('YYYY-MM-DD'),
        },
      ],
      showInvoiceItemSelector: false,
    }));
  };

  addShopItem = (shopItemId: number) => {
    const shopItem = this.props.shopItems.find((si) => si.id === shopItemId);
    if (shopItem) {
      this.setState((prevState) => ({
        additionalShopItems: [
          ...prevState.additionalShopItems,
          {
            name: shopItem.name,
            price: shopItem.price,
            id: shopItem.id,
            subtitle: shopItem.subtitle,
          },
        ],
        showInvoiceItemSelector: false,
      }));
    }
  };

  generatePaymentItemsObject = () => {
    const payment_items = [];
    const { cb, cash, check } = this.state;
    if (cb) {
      payment_items.push({
        payment_received: true,
        price: cb,
        payment_method: PAYMENT_METHOD_CB_MANUAL.id,
      });
    }
    if (check) {
      payment_items.push({
        payment_received: true,
        price: check,
        payment_method: PAYMENT_METHOD_CHECK.id,
      });
    }
    if (cash) {
      payment_items.push({
        payment_received: true,
        price: cash,
        payment_method: PAYMENT_METHOD_CASH.id,
      });
    }
    return payment_items;
  };

  onSubmit = () => {
    const { additionalShopItems, additionalPaymentPacks, voucher } = this.state;
    const { quickInvoice, createInvoice } = this.props;
    const invoiceData = {
      shop_item_ids: additionalShopItems.map((siii) => siii.id),
      payment_pack_ids: additionalPaymentPacks.map((ppii) => [
        ppii.id,
        ppii.date_bought,
      ]),
      voucher,
      payment_items: this.generatePaymentItemsObject(),
      member: quickInvoice.member.id,
    };
    if (this.props.editMode) {
      this.props.updateInvoice(invoiceData);
    } else {
      createInvoice(invoiceData);
    }
    this.setState({ unevenInvoiceAlertOpen: false });
  };

  checkUnvenOrSubmit = () => {
    const finalPrice = this.getFinalPrice();
    const totalPayment = this.getTotalPayment();
    if (finalPrice === totalPayment) {
      this.onSubmit();
    } else {
      this.setState({ unevenInvoiceAlertOpen: true });
    }
  };

  deletePaymentPack = (paymentPackId: number) => {
    const { additionalPaymentPacks } = this.state;
    additionalPaymentPacks.splice(
      additionalPaymentPacks.findIndex((pp) => pp.id === paymentPackId),
      1,
    );
    this.setState({ additionalPaymentPacks });
  };

  deleteShopItem = (shopItemId: number) => {
    const { additionalShopItems } = this.state;
    additionalShopItems.splice(
      additionalShopItems.findIndex((siii) => siii.id === shopItemId),
      1,
    );
    this.setState({ additionalShopItems });
  };

  render() {
    const {
      classes,
      onClose,
      quickInvoiceTitle,
      uneditableInvoiceItems,
    } = this.props;
    const {
      cb,
      cash,
      check,
      voucher,
      additionalShopItems,
      additionalPaymentPacks,
      unevenInvoiceAlertOpen,
    } = this.state;

    const finalPrice = this.getFinalPrice();
    const totalPayment = this.getTotalPayment();
    return (
      <div className={classes.container}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.header}
        >
          <Grid item>
            <Typography variant="title">{quickInvoiceTitle}</Typography>
          </Grid>
          {onClose ? (
            <Grid item>
              <IconButton onClick={onClose} color="secondary">
                <CancelIcon />
              </IconButton>
            </Grid>
          ) : null}
        </Grid>
        <Divider />
        {this.state.showInvoiceItemSelector ? (
          <div className={classes.paper}>
            <InvoiceItemSelector
              onAddPaymentPack={this.addPaymentPack}
              onAddShopItem={this.addShopItem}
              showCancel={
                additionalPaymentPacks.length || additionalShopItems.length
              }
              defaultTab={INVOICE_SELECTOR_SHOP_TAB}
              onCancel={() => this.setState({ showInvoiceItemSelector: false })}
            />
          </div>
        ) : (
          <React.Fragment>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={9} className={classes.invoiceItemListContainer}>
                <InvoiceItemList
                  compact
                  uneditableInvoiceItems={uneditableInvoiceItems}
                  paymentPackInvoiceItems={additionalPaymentPacks}
                  shopItemInvoiceItems={additionalShopItems}
                  deletePPackInvoiceItem={this.deletePaymentPack}
                  deleteShopItemInvoiceItem={this.deleteShopItem}
                />
              </Grid>
              <Grid item xs={3}>
                <Grid container item justify="center" alignItems="center">
                  <Button
                    disabled={this.props.editMode}
                    onClick={this.choseInvoiceItem}
                    color="primary"
                    variant="contained"
                  >
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            <PaymentInfo
              finalPrice={finalPrice}
              totalPayment={totalPayment}
              cb={cb}
              cash={cash}
              check={check}
              voucher={voucher}
              handlePaymentChange={this.handlePaymentChange}
              handleVoucher={this.handleVoucher}
              onSubmit={this.checkUnvenOrSubmit}
            />
          </React.Fragment>
        )}
        <UnevenInvoiceDialog
          open={unevenInvoiceAlertOpen}
          onClose={this.closeUnevenInvoiceDialog}
          onSubmit={this.onSubmit}
          totalPayment={totalPayment}
          totalItem={finalPrice}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    backgroundColor: '#F2F2F2',
  },
  header: {
    paddingLeft: theme.spacing.unit * 2,
  },
  invoiceItemListContainer: {
    backgroundColor: '#F8F8F8',
    border: 'solid 1px #E0E0E0',
  },
  paper: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.background.paper,
  },
});

export default withStyles(styles)(QuickInvoice);
