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
import { translate } from 'react-i18next';
import {
  CB_MANUAL as PAYMENT_METHOD_CB_MANUAL,
  CHECK as PAYMENT_METHOD_CHECK,
  CASH as PAYMENT_METHOD_CASH,
} from 'bsport-commons/lib/master-data/payment-methods';
import type { TFunction } from 'react-i18next';
import PriceInput from '../input/PriceInput.component';
import InvoiceItemList from './InvoiceItemList.component';
import InvoiceItemSelector from './InvoiceItemSelector.container';
import UnevenInvoiceDialog from './UnevenInvoiceDialog.component';
import { SELECTOR_SHOP as INVOICE_SELECTOR_SHOP_TAB } from './InvoiceItemSelector.component';
import { formatAsDate } from '../../datetime';
import { Moment } from '../../i18n';

type Props = {
  quickInvoice: { member: Member },
  onClose: () => void,
  classes: Object,
  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  createInvoice: (data: [*]) => void,
  t: TFunction,
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
  return acc + parseInt(invoiceItem.price, 10);
}

export class QuickInvoice extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      cb: 0,
      cash: 0,
      check: 0,
      voucher: 0,
      showInvoiceItemSelector: true,
      additionalPaymentPacks: [],
      additionalShopItems: [],
      unevenInvoiceAlertOpen: false,
    };
  }

  getTotalPayment = () => {
    const { cb, cash, check, voucher } = this.state;
    return cb + check + cash + voucher;
  };

  handlePaymentChange = (payment_type) => (e) => {
    this.setState({ [payment_type]: parseInt(e.target.value, 10) });
  };

  handleVoucher = (event) => {
    this.setState({ voucher: parseInt(event.target.value, 10) });
  };

  getFinalPrice = () => {
    const { additionalShopItems, additionalPaymentPacks } = this.state;
    const sumPack = additionalPaymentPacks.reduce(getTotal, 0);
    const sumShop = additionalShopItems.reduce(getTotal, 0);
    return sumPack + sumShop;
  };

  choseInvoiceItem = () => {
    this.setState({ showInvoiceItemSelector: true });
  };

  renderHeader() {
    const { classes, onClose, quickInvoice } = this.props;
    const { member } = quickInvoice;
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.header}
      >
        <Grid item>
          <Typography variant="title">{member.name}</Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={onClose} color="secondary">
            <CancelIcon />
          </IconButton>
        </Grid>
      </Grid>
    );
  }

  closeUnevenInvoiceDialog = () => {
    this.setState({ unevenInvoiceAlertOpen: false });
  };

  renderPayment = () => {
    const { classes, t } = this.props;
    const { unevenInvoiceAlertOpen } = this.state;
    const finalPrice = this.getFinalPrice();
    const totalPayment = this.getTotalPayment();
    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        className={classes.paymentContainer}
      >
        <Grid item xs={6}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography>{t('paymentMethod.CB')}</Typography>
            </Grid>
            <Grid item>
              <PriceInput
                value={this.state.cb}
                onChange={this.handlePaymentChange('cb')}
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography>{t('paymentMethod.CASH')}</Typography>
            </Grid>
            <Grid item>
              <PriceInput
                value={this.state.cash}
                onChange={this.handlePaymentChange('cash')}
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography>{t('paymentMethod.CHECK')}</Typography>
            </Grid>
            <Grid item>
              <PriceInput
                value={this.state.check}
                onChange={this.handlePaymentChange('check')}
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography>{t('payment.voucher')}</Typography>
            </Grid>
            <Grid item>
              <PriceInput
                value={this.state.voucher}
                onChange={this.handleVoucher}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item container justify="center" alignItems="center">
            <Button
              color="primary"
              onClick={() => this.checkUnvenOrSubmit(finalPrice, totalPayment)}
              disabled={totalPayment === 0 && finalPrice === 0}
            >
              {t('common.save')}
            </Button>
          </Grid>
        </Grid>
        <UnevenInvoiceDialog
          open={unevenInvoiceAlertOpen}
          onClose={this.closeUnevenInvoiceDialog}
          onSubmit={this.onSubmit}
          totalPayment={totalPayment}
          totalItem={finalPrice}
        />
      </Grid>
    );
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
    createInvoice(invoiceData);
    this.setState({ unevenInvoiceAlertOpen: false });
  };

  checkUnvenOrSubmit = (finalPrice: number, totalPayment: number) => {
    if (finalPrice === totalPayment) {
      this.onSubmit();
    } else {
      this.setState({ unevenInvoiceAlertOpen: true });
    }
  };

  renderInvoiceItemSelector = () => {
    const { classes } = this.props;
    return (
      <div className={classes.paper}>
        <InvoiceItemSelector
          onAddPaymentPack={this.addPaymentPack}
          onAddShopItem={this.addShopItem}
          showCancel
          defaultTab={INVOICE_SELECTOR_SHOP_TAB}
          onCancel={() => this.setState({ showInvoiceItemSelector: false })}
        />
      </div>
    );
  };

  renderInvoiceItemsPanel = () => {
    if (this.state.showInvoiceItemSelector) {
      return this.renderInvoiceItemSelector();
    }
    return this.renderInvoiceItemList();
  };

  deletePaymentPack = (paymentPackId) => {
    const { additionalPaymentPacks } = this.state;
    additionalPaymentPacks.splice(
      additionalPaymentPacks.findIndex((pp) => pp.id === paymentPackId),
      1,
    );
    this.setState({ additionalPaymentPacks });
  };

  deleteShopItem = (shopItemId) => {
    const { additionalShopItems } = this.state;
    additionalShopItems.splice(
      additionalShopItems.findIndex((siii) => siii.id === shopItemId),
      1,
    );
    this.setState({ additionalShopItems });
  };

  renderInvoiceItemList = () => {
    const { classes } = this.props;
    return (
      <Grid container direction="row">
        <Grid item xs={9} className={classes.invoiceItemListContainer}>
          <InvoiceItemList
            compact
            paymentPackInvoiceItems={this.state.additionalPaymentPacks}
            shopItemInvoiceItems={this.state.additionalShopItems}
            deletePPackInvoiceItem={this.deletePaymentPack}
            deleteShopItemInvoiceItem={this.deleteShopItem}
          />
        </Grid>
        <Grid item xs={3}>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            direction="row"
          >
            <Grid item>
              <Button onClick={this.choseInvoiceItem} color="primary">
                <AddIcon />
              </Button>
            </Grid>
            <Grid item className={classes.totalInvoiceItemContainer}>
              <Typography variant="subheading">
                TOTAL: {this.getFinalPrice()}€
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {this.renderHeader()}
        <Divider />
        {this.renderInvoiceItemsPanel()}
        <Divider />
        {this.renderPayment()}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    backgroundColor: '#F2F2F2',
  },
  header: {
    paddingLeft: theme.spacing.unit * 2,
  },
  paymentContainer: {
    margin: theme.spacing.unit * 2,
  },
  totalInvoiceItemContainer: {
    backgroundColor: '#F8F8F8',
    border: 'solid 1px #E0E0E0',
    padding: theme.spacing.unit,
    margin: theme.spacing.unit,
  },
  invoiceItemListContainer: {
    backgroundColor: '#F8F8F8',
    border: 'solid 1px #E0E0E0',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
  },
});

export default withStyles(styles)(translate()(QuickInvoice));
