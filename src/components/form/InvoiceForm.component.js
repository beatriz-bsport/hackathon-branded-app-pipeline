// @flow

import React, { Component } from 'react';

import {
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  withStyles,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import {
  InvoiceItemSelector,
  InvoiceVoucher,
  InvoiceItemList,
  UnevenInvoiceDialog,
} from '../invoice';
import PaymentForm from './PaymentForm.component';
import PaymentList from './PaymentList.component';
import { formatAsDate } from '../../datetime';
import { Moment } from '../../i18n';

import type { PaymentPack, InvoiceItem } from '../../api/types';
import type { InvoiceDataFront } from './types';

type Props = {
  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  uneditablePayments: Array<Payment>,
  uneditableInvoiceItems: Array<InvoiceItem>,
  editMode: ?boolean,
  processing: boolean,
  onCancel: () => void,
  createOrUpdate: (invoiceData: InvoiceDataFront) => void,
  updatePaymentStatus: (uuid: string, payment_received: boolean) => void,
  t: TFunction,
  classes: Object,
};

type State = {
  paymentPackInvoiceItems: Array<InvoiceItem>,
  shopItemInvoiceItems: Array<InvoiceItem>,
  voucher: ?number,
  paymentItems: Array<PaymentItemData>,
  step: number,
  unevenInvoiceAlertOpen: boolean,
};

const STEP_ADD_INVOICE_ITEMS = 0;
const STEP_ADD_INVOICE_PAYMENTS = 1;

function getTotal(acc, invoiceItem) {
  return acc + parseInt(invoiceItem.price, 10);
}

export class InvoiceForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paymentPackInvoiceItems: [],
      shopItemInvoiceItems: [],
      voucher: 0,
      paymentItems: [],
      step: props.editMode ? STEP_ADD_INVOICE_PAYMENTS : STEP_ADD_INVOICE_ITEMS,
      unevenInvoiceAlertOpen: false,
    };
  }

  createInvoice = () => {
    if (
      this.getTotalPayment() !== this.getFinalPrice() &&
      !this.state.unevenInvoiceAlertOpen
    ) {
      return this.setState({ unevenInvoiceAlertOpen: true });
    }
    this.closeUnevenInvoiceAlert();
    const {
      voucher,
      paymentPackInvoiceItems,
      shopItemInvoiceItems,
      paymentItems,
    } = this.state;

    const data = {
      voucher,
      shop_item_ids: shopItemInvoiceItems.map((siii) => siii.id),
      payment_pack_ids: paymentPackInvoiceItems.map((ppii) => [
        ppii.id,
        ppii.date_bought,
      ]),
      payment_items: paymentItems,
    };
    return this.props.createOrUpdate(data);
  };

  cancelPayments = () => {
    if (this.props.editMode) {
      this.props.onCancel();
    } else {
      this.setState({
        step: STEP_ADD_INVOICE_ITEMS,
        paymentItems: [],
      });
    }
  };

  goToPayment = () => {
    this.setState({ step: STEP_ADD_INVOICE_PAYMENTS });
  };

  getTotalPayment = () => {
    const { uneditablePayments } = this.props;
    const { paymentItems } = this.state;

    return (
      // prettier-ignore
      paymentItems.filter((pi) => pi.payment_received).reduce(getTotal, 0)
      + (uneditablePayments || [])
        .filter((pi) => pi.payment_received)
        .reduce(getTotal, 0)
    );
  };

  getFinalPrice = () => {
    const { uneditableInvoiceItems } = this.props;
    const {
      shopItemInvoiceItems,
      paymentPackInvoiceItems,
      voucher,
    } = this.state;

    const sumPack = paymentPackInvoiceItems.reduce(getTotal, 0);
    const sumShop = shopItemInvoiceItems.reduce(getTotal, 0);
    const sumUneditableInvoiceItems = (uneditableInvoiceItems || []).reduce(
      getTotal,
      0,
    );

    return sumPack - (voucher || 0) + sumUneditableInvoiceItems + sumShop;
  };

  deleteVoucher = () => {
    this.setState({ voucher: 0 });
  };

  deletePPackInvoiceItem = (ppackId: number) => {
    const { paymentPackInvoiceItems } = this.state;
    paymentPackInvoiceItems.splice(
      paymentPackInvoiceItems.findIndex((pp) => pp.id === ppackId),
      1,
    );
    this.setState({
      paymentPackInvoiceItems,
    });
  };

  deleteShopItemInvoiceItem = (shopItemIIId: number) => {
    const { shopItemInvoiceItems } = this.state;
    shopItemInvoiceItems.splice(
      shopItemInvoiceItems.findIndex((siii) => siii.id === shopItemIIId),
      1,
    );
    this.setState({
      shopItemInvoiceItems,
    });
  };

  deletePaymentItem = (paymentItem) => {
    this.setState((prevState) => ({
      paymentItems: prevState.paymentItems.filter(
        (pi) => pi.id !== paymentItem.id,
      ),
    }));
  };

  onUpdateVoucher = (voucher) => {
    this.setState((prevState) => ({
      voucher: (prevState.voucher || 0) + voucher,
    }));
  };

  submitFinalizedInvoice = () => {
    console.log(this.state);
  };

  addPaymentItem = (paymentItem) => {
    this.setState((prevState) => ({
      paymentItems: [...prevState.paymentItems, paymentItem],
    }));
  };

  onAddPaymentPack = (paymentPackId: number, date_bought: Object) => {
    const paymentPack = this.props.paymentPacks.find(
      (p) => p.id === paymentPackId,
    );
    if (paymentPack) {
      this.setState((prevState) => ({
        paymentPackInvoiceItems: [
          ...prevState.paymentPackInvoiceItems,
          {
            name: paymentPack.name,
            price: paymentPack.price,
            id: paymentPack.id,
            subtitle: formatAsDate(date_bought || Moment()),
            date_bought: date_bought.format('YYYY-MM-DD'),
          },
        ],
      }));
    }
  };

  onAddShopItem = (shopItemId: number) => {
    const shopItem = this.props.shopItems.find((si) => si.id === shopItemId);
    if (shopItem) {
      this.setState((prevState) => ({
        shopItemInvoiceItems: [
          ...prevState.shopItemInvoiceItems,
          {
            name: shopItem.name,
            price: shopItem.price,
            id: shopItem.id,
            subtitle: shopItem.subtitle,
          },
        ],
      }));
    }
  };

  renderBottomActionButton = () => {
    const { step, voucher } = this.state;
    const { processing, classes, t } = this.props;

    if (step === STEP_ADD_INVOICE_PAYMENTS) {
      return (
        <Grid
          container
          direction="row"
          spacing={16}
          className={classes.paymentSelectorButtons}
          justify="flex-end"
        >
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.cancelPayments}
            >
              <ArrowBackIcon className={classes.leftIcon} />
              {t('common.previous')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={this.createInvoice}
            >
              {processing ? (
                <CircularProgress
                  className={classes.leftIcon}
                  size={20}
                  color="inherit"
                />
              ) : (
                <AddIcon className={classes.leftIcon} />
              )}
              {t('common.save')}
            </Button>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid
        container
        direction="row"
        spacing={16}
        className={classes.paymentSelectorButtons}
        justify="flex-end"
      >
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.props.onCancel}
          >
            <CancelIcon className={classes.leftIcon} />
            {t('common.cancel')}
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={this.goToPayment}
            variant="contained"
            color="primary"
            disabled={this.getFinalPrice() + (voucher || 0) === 0}
          >
            <AttachMoneyIcon className={classes.leftIcon} />
            {t('payment.addThisPaymentItem')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  renderRightPanel = () => {
    const {
      paymentPacks,
      t,
      classes,
      uneditablePayments,
      updatePaymentStatus,
    } = this.props;
    const { step, paymentItems } = this.state;
    const finalPrice = this.getFinalPrice();
    const totalPayment = this.getTotalPayment();

    if (step === STEP_ADD_INVOICE_ITEMS) {
      return (
        <Grid
          container
          direction="column"
          alignItems="stretch"
          justify="space-between"
          style={{ height: '100%' }}
        >
          <Grid item style={{ flexGrow: 1 }}>
            <InvoiceItemSelector
              onAddOffer={this.onAddOffer}
              onAddPaymentPack={this.onAddPaymentPack}
              onAddShopItem={this.onAddShopItem}
              paymentPacks={paymentPacks}
            />
          </Grid>
          <Grid item>
            <Divider />
            <div className={classes.voucher}>
              <InvoiceVoucher onUpdateVoucher={this.onUpdateVoucher} />
            </div>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid
        container
        direction="column"
        className={classes.paymentFormContainer}
        justify="space-between"
        alignItems="stretch"
      >
        <Grid item className={classes.paymentItemFormContainer}>
          <PaymentForm onSubmit={this.addPaymentItem} />
        </Grid>
        <Grid item className={classes.leftPanelSubBlock}>
          <Grid container direction="column" spacing={16}>
            <Grid item>
              <Typography variant="h6">
                {t('payment.paymentItemsListTitle')}
              </Typography>
            </Grid>
            <Grid item className={classes.paymentItemsListContainer}>
              <PaymentList
                paymentItems={paymentItems}
                onDelete={this.deletePaymentItem}
                uneditablePayments={uneditablePayments}
                updateStatus={updatePaymentStatus}
              />
              <Grid
                container
                justify="space-between"
                alignItems="center"
                className={classes.totalUnpaid}
              >
                <Grid item>
                  <Typography variant="subheading">
                    {t('payment.stillUnpaid')}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h6"
                    color={finalPrice - totalPayment <= 0 ? 'primary' : 'error'}
                  >
                    {finalPrice - totalPayment} €
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderTotal = () => {
    const { t, classes } = this.props;
    const finalPrice = this.getFinalPrice();
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

  renderLeftPanel = () => {
    const { uneditableInvoiceItems } = this.props;
    const {
      paymentPackInvoiceItems,
      shopItemInvoiceItems,
      voucher,
    } = this.state;

    return (
      <Grid container direction="column" justify="space-between">
        <Grid item>
          <InvoiceItemList
            deleteOfferInvoiceItem={this.deleteOfferInvoiceItem}
            deletePPackInvoiceItem={this.deletePPackInvoiceItem}
            deleteShopItemInvoiceItem={this.deleteShopItemInvoiceItem}
            deleteVoucher={this.deleteVoucher}
            paymentPackInvoiceItems={paymentPackInvoiceItems}
            shopItemInvoiceItems={shopItemInvoiceItems}
            uneditableInvoiceItems={uneditableInvoiceItems || []}
            voucher={voucher}
          />
        </Grid>
        <Grid item>{this.renderTotal()}</Grid>
      </Grid>
    );
  };

  closeUnevenInvoiceAlert = () => {
    this.setState({ unevenInvoiceAlertOpen: false });
  };

  renderUnevenInvoiceAlert = () => {
    const { unevenInvoiceAlertOpen } = this.state;

    const totalPayments = this.getTotalPayment();
    const totalInvoiceItems = this.getFinalPrice();
    return (
      <UnevenInvoiceDialog
        open={unevenInvoiceAlertOpen}
        onClose={this.closeUnevenInvoiceAlert}
        totalItem={totalInvoiceItems}
        totalPayment={totalPayments}
        onSubmit={this.createInvoice}
      />
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.paperContainer}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item xs={12} md={6} className={classes.invoiceList}>
              {this.renderLeftPanel()}
            </Grid>
            <Grid item xs={12} md={6}>
              {this.renderRightPanel()}
            </Grid>
          </Grid>
        </Paper>
        {this.renderBottomActionButton()}
        {this.renderUnevenInvoiceAlert()}
      </div>
    );
  }
}

const styles = (theme) => ({
  paperContainer: {},
  voucher: {
    padding: theme.spacing.unit * 2,
    backgroundColor: '#F8F8F8',
  },
  invoiceList: {
    padding: theme.spacing.unit,
    backgroundColor: '#F8F8F8',
    border: '2px solid #E8E8E8',
  },
  paymentSelectorButtons: {
    marginTop: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  paymentFormContainer: {
    padding: theme.spacing.unit * 2,
    height: '100%',
  },
  leftPanelSubBlock: {
    marginTop: theme.spacing.unit * 3,
  },
  paymentItemsListContainer: {
    backgroundColor: '#F8F8F8',
    border: '2px solid #E8E8E8',
  },
  paymentItemFormContainer: {
    backgroundColor: '#F8F8F8',
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  totalUnpaid: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  totalLine: {
    padding: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(translate()(InvoiceForm));
