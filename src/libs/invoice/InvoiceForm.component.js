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
import DownloadIcon from '@material-ui/icons/Attachment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PersonIcon from '@material-ui/icons/Person';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT } from '@bsport/common/lib/master-data/payment-methods';
import sum from 'lodash/sum';

import PaymentForm from './form/PaymentForm.component';
import PaymentList from './form/PaymentList.component';
import { formatAsDate } from '../../datetime';
import { Moment } from '../../i18n';

import type { Invoice, PaymentPack, InvoiceItem } from '../../api/types';
import type { InvoiceDataFront } from './form/types';

import InvoiceVoucher from './form/InvoiceVoucher.component';
import UnevenInvoiceDialog from './dialog/UnevenInvoiceDialog.component';
import InvoiceItemList from './invoice-item/InvoiceItemList.component';
import InvoiceItemSelector from './invoice-item/InvoiceItemSelector.component';

type Props = {
  editMode: ?boolean,
  processing: boolean,
  uneditableVoucher: ?number,

  member: Member,
  invoice: ?Invoice,

  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  uneditablePayments: Array<Payment>,
  uneditableInvoiceItems: Array<InvoiceItem>,

  onCancel: () => void,
  goToMemberPage: () => void,
  createOrUpdate: (invoiceData: InvoiceDataFront) => void,
  updatePaymentStatus: (uuid: string, payment_received: boolean) => void,

  t: TFunction,
  classes: Object,
};

type State = {
  step: number,
  unevenInvoiceAlertOpen: boolean,

  voucher: ?number,
  topUp: ?number,

  paymentItems: Array<PaymentItemData>,
  shopItemInvoiceItems: Array<InvoiceItem>,
  paymentPackInvoiceItems: Array<InvoiceItem>,
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
      topUp: 0,
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
      topUp,
    } = this.state;

    const data = {
      voucher,
      top_up: topUp,
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
    }
    this.setState({
      step: STEP_ADD_INVOICE_ITEMS,
      paymentItems: [],
    });
  };

  goToPayment = () => {
    this.setState({ step: STEP_ADD_INVOICE_PAYMENTS });
  };

  deleteTopUp = () => {
    this.setState({ topUp: 0 });
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

  getUpdatedCreditAccountBalance = () =>
    (this.props.member.credit_account_balance || 0) -
    sum(
      this.state.paymentItems
        .filter((pi) => pi.payment_method === PAYMENT_METHOD_CREDIT_ACCOUNT.id)
        .map((pi) => parseFloat(pi.price)),
    );

  getFinalPrice = () => {
    const { uneditableInvoiceItems } = this.props;
    const {
      shopItemInvoiceItems,
      paymentPackInvoiceItems,
      voucher,
      topUp,
    } = this.state;

    const sumPack = paymentPackInvoiceItems.reduce(getTotal, 0);
    const sumShop = shopItemInvoiceItems.reduce(getTotal, 0);
    const sumUneditableInvoiceItems = (uneditableInvoiceItems || []).reduce(
      getTotal,
      0,
    );

    return (
      topUp +
      sumPack -
      (voucher || 0) +
      sumUneditableInvoiceItems +
      sumShop -
      parseFloat(this.props.uneditableVoucher || 0)
    );
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

  onTopUp = (amount: number) => {
    this.setState((prevState) => ({
      topUp: prevState.topUp + amount,
    }));
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

  downloadInvoicePdf = () => {
    window.location.href = this.props.invoice.stripe_invoice_pdf;
  };

  createOrDownloadButton = () => {
    const { processing, invoice, classes, t } = this.props;
    if (!invoice || !invoice.stripe_invoice_pdf) {
      return (
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
      );
    }
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={this.downloadInvoicePdf}
      >
        <DownloadIcon className={classes.leftIcon} />
        {t('common.download')}
      </Button>
    );
  };

  renderBottomActionButton = () => {
    const { step } = this.state;
    const { classes, t } = this.props;

    if (step === STEP_ADD_INVOICE_PAYMENTS) {
      return (
        <Grid
          container
          direction="row"
          className={classes.paymentSelectorButtons}
          justify="space-between"
        >
          <Grid item>
            {this.props.goToMemberPage ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={this.props.goToMemberPage}
              >
                <PersonIcon className={classes.leftIcon} />
                {this.props.member.name}
              </Button>
            ) : (
              <div />
            )}
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={16}>
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
              <Grid item>{this.createOrDownloadButton()}</Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid
        container
        direction="row"
        className={classes.paymentSelectorButtons}
        justify="space-between"
      >
        <Grid item>
          {this.props.goToMemberPage ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={this.props.goToMemberPage}
            >
              <PersonIcon className={classes.leftIcon} />
              {this.props.member.name}
            </Button>
          ) : (
            <div />
          )}
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={16}>
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
                disabled={
                  !(
                    (this.state.paymentPackInvoiceItems || []).length ||
                    (this.state.shopItemInvoiceItems || []).length ||
                    (this.props.uneditableInvoiceItems || []).length ||
                    !!this.state.topUp
                  )
                }
              >
                <AttachMoneyIcon className={classes.leftIcon} />
                {t('payment.addThisPaymentItem')}
              </Button>
            </Grid>
          </Grid>
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
    const updatedCreditAccountBalance = this.getUpdatedCreditAccountBalance();

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
              creditAccountBalance={updatedCreditAccountBalance}
              onAddPaymentPack={this.onAddPaymentPack}
              onAddShopItem={this.onAddShopItem}
              onTopUp={this.onTopUp}
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
          {this.props.invoice && this.props.invoice.stripe_invoice_pdf ? (
            <Typography style={{ padding: 12 }}>
              {t('payment.invoiceFinalizedThusNotEditable')}
            </Typography>
          ) : (
            <PaymentForm
              onSubmit={this.addPaymentItem}
              creditAccountBalance={updatedCreditAccountBalance}
            />
          )}
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
                  <Typography variant="subtitle1">
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
      topUp,
      voucher,
    } = this.state;

    return (
      <Grid container direction="column" justify="space-between">
        <Grid item>
          <InvoiceItemList
            deletePPackInvoiceItem={this.deletePPackInvoiceItem}
            deleteShopItemInvoiceItem={this.deleteShopItemInvoiceItem}
            deleteVoucher={this.deleteVoucher}
            deleteTopUp={this.deleteTopUp}
            paymentPackInvoiceItems={paymentPackInvoiceItems}
            shopItemInvoiceItems={shopItemInvoiceItems}
            uneditableInvoiceItems={uneditableInvoiceItems || []}
            uneditableVoucher={parseFloat(this.props.uneditableVoucher)}
            voucher={voucher}
            topUp={topUp}
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
    border: '2px solid #E8E8E8',
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

export default withStyles(styles)(withNamespaces()(InvoiceForm));
