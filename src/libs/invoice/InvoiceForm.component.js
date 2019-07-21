// @flow

import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DownloadIcon from '@material-ui/icons/Attachment';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PersonIcon from '@material-ui/icons/Person';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT } from '@bsport/common/lib/master-data/payment-methods';
import sum from 'lodash/sum';

import PaymentForm from './payment/PaymentForm.component';
import PaymentList from './payment/PaymentList.component';
import { formatAsDate } from '../../datetime';
import { Moment } from '../../i18n';

import type { Invoice, PaymentPack, InvoiceItem } from '../../api/types';
import type { InvoiceDataFront } from './payment/types';

import InvoiceVoucher from './payment/InvoiceVoucher.component';
import UnevenInvoiceDialog from './dialog/UnevenInvoiceDialog.component';
import InvoiceItemList from './invoice-item/InvoiceItemList.component';
import InvoiceItemSelector from './invoice-item/InvoiceItemSelector.component';
import CreditMemberBadge from '../member/components/CreditMemberBadge.component';

import RedButton from '../../components/button/RedButton.component';

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
  updatePaymentMethod: (uuid: string, payment_method: number) => void,
  revertInvoice: (uuid: string) => void,

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
  return acc + parseFloat(invoiceItem.price);
}

const DownloadButton = (props: {
  onClick: (*) => void,
  classes: Object,
  t: TFunction,
}) => (
  <Button
    variant="contained"
    onClick={props.onClick}
    color="primary"
    className={props.classes.actionButton}
  >
    <DownloadIcon />
    <Hidden xsDown>
      <span className={props.classes.rightText}>
        {props.t('common.download')}
      </span>
    </Hidden>
  </Button>
);

const RevertButton = (props: {
  reverted: boolean,
  processing: boolean,
  onClick: (*) => void,
  classes: Object,
  t: TFunction,
}) => (
  <RedButton
    variant="contained"
    color="primary"
    onClick={props.onClick}
    disabled={props.processing || props.reverted}
  >
    <CancelIcon className={props.classes.leftIcon} />
    <Hidden xsDown>
      {props.reverted
        ? props.t('invoice.invoiceReverted')
        : props.t('invoice.revert')}
    </Hidden>
  </RedButton>
);

const SaveButton = (props: {
  t: TFunction,
  onClick: (*) => void,
  classes: *,
  processing: boolean,
}) => (
  <Button
    variant="contained"
    color="primary"
    onClick={props.onClick}
    className={props.classes.actionButton}
  >
    {props.processing ? (
      <CircularProgress
        className={props.classes.leftIcon}
        size={20}
        color="inherit"
      />
    ) : (
      <SaveIcon className={props.classes.leftIcon} />
    )}
    <Hidden xsDown>{props.t('common.save')}</Hidden>
  </Button>
);

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
      voucher: (prevState.voucher || 0) + parseFloat(voucher),
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

  closeUnevenInvoiceAlert = () => {
    this.setState({ unevenInvoiceAlertOpen: false });
  };

  renderNavigationButtons = () => (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={this.cancelPayments}
        className={this.props.classes.navigationButton}
      >
        <ArrowBackIcon />
        <Hidden xsDown>
          <span className={this.props.classes.rightText}>
            {this.props.t('common.previous')}
          </span>
        </Hidden>
      </Button>
      {this.props.goToMemberPage ? (
        <CreditMemberBadge credit={this.props.member.credit_account_balance}>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.props.goToMemberPage}
            className={this.props.classes.navigationButton}
          >
            <PersonIcon />
            <Hidden xsDown>
              <span className={this.props.classes.rightText}>
                {this.props.member.name}
              </span>
            </Hidden>
          </Button>
        </CreditMemberBadge>
      ) : (
        <div />
      )}
    </div>
  );

  renderActionButtons = () => {
    const { step } = this.state;
    const { invoice, processing, classes, t } = this.props;

    if (step === STEP_ADD_INVOICE_ITEMS) {
      return (
        <div>
          <Button
            onClick={this.goToPayment}
            variant="contained"
            color="primary"
            className={this.props.classes.actionButton}
            disabled={
              !(
                (this.state.paymentPackInvoiceItems || []).length ||
                (this.state.shopItemInvoiceItems || []).length ||
                (this.props.uneditableInvoiceItems || []).length ||
                !!this.state.topUp
              )
            }
          >
            <EuroSymbolIcon className={classes.leftIcon} />
            {t('payment.addThisPaymentItem')}
          </Button>
        </div>
      );
    }
    return (
      <div>
        {invoice && invoice.uuid ? (
          <RevertButton
            t={this.props.t}
            onClick={() => this.props.revertInvoice(invoice.uuid)}
            processing={this.props.processing}
            reverted={invoice.reverted}
            classes={classes}
          />
        ) : null}
        {invoice && invoice.stripe_invoice_pdf ? (
          <DownloadButton
            classes={classes}
            onClick={this.downloadInvoicePdf}
            t={t}
          />
        ) : null}

        {!invoice ||
        (invoice && !invoice.stripe_invoice_pdf && !invoice.reverted) ? (
          <SaveButton
            onClick={this.createInvoice}
            processing={processing}
            invoiceReverted={invoice && invoice.reverted}
            classes={this.props.classes}
            t={this.props.t}
          />
        ) : null}
      </div>
    );
  };

  renderBottomActionButton = () => (
    <div className={this.props.classes.bottomButtonBar}>
      {this.renderNavigationButtons()}
      {this.renderActionButtons()}
    </div>
  );

  renderPaymentForm = () => {
    if (this.props.invoice && !!this.props.invoice.stripe_invoice_pdf) {
      return (
        <Typography style={{ padding: 12 }}>
          {this.props.t('payment.invoiceFinalizedThusNotEditable')}
        </Typography>
      );
    }
    if (this.props.invoice && this.props.invoice.reverted) {
      return (
        <Typography style={{ padding: 12 }}>
          {this.props.t('payment.invoiceRevertedThusNotEditable')}
        </Typography>
      );
    }
    return (
      <PaymentForm
        onSubmit={this.addPaymentItem}
        creditAccountBalance={this.getUpdatedCreditAccountBalance()}
      />
    );
  };

  renderRightPanel = () => {
    const {
      paymentPacks,
      t,
      classes,
      uneditablePayments,
      updatePaymentMethod,
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
              creditAccountBalance={this.getUpdatedCreditAccountBalance()}
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
      <div className={classes.paymentFormContainer}>
        <div className={classes.paymentItemFormContainer}>
          {this.renderPaymentForm()}
        </div>
        <div className={classes.leftPanelSubBlock}>
          <Typography variant="h6">
            {t('payment.paymentItemsListTitle')}
          </Typography>
          <div className={classes.paymentItemsListContainer}>
            <PaymentList
              paymentItems={paymentItems}
              onDelete={this.deletePaymentItem}
              uneditablePayments={uneditablePayments}
              updatePaymentMethod={updatePaymentMethod}
            />
            <div className={classes.totalUnpaid}>
              <Typography variant="subtitle1">
                {t('payment.stillUnpaid')}
              </Typography>
              <Typography
                variant="h6"
                color={finalPrice - totalPayment <= 0 ? 'primary' : 'error'}
                className={
                  this.props.invoice && this.props.invoice.reverted
                    ? this.props.classes.revert
                    : {}
                }
              >
                {(finalPrice - totalPayment).toFixed(2)} €
              </Typography>
            </div>
          </div>
        </div>
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
        <Divider />
        <Grid item>
          <div className={this.props.classes.totalLine}>
            <Typography variant="h6">
              {this.props.t('payment.total')}
            </Typography>
            <Typography
              className={
                this.props.invoice && this.props.invoice.reverted
                  ? this.props.classes.revert
                  : {}
              }
              variant="h6"
            >
              {this.getFinalPrice().toFixed(2)} €
            </Typography>
          </div>
        </Grid>
      </Grid>
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
        <UnevenInvoiceDialog
          open={this.state.unevenInvoiceAlertOpen}
          onClose={this.closeUnevenInvoiceAlert}
          totalItem={this.getFinalPrice()}
          totalPayment={this.getTotalPayment().toFixed(2)}
          onSubmit={this.createInvoice}
        />
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
  rightText: {
    marginLeft: theme.spacing.unit,
  },
  navigationButton: {
    marginRight: theme.spacing.unit,
  },
  actionButton: {
    marginLeft: theme.spacing.unit,
  },
  paymentFormContainer: {
    paddingLeft: theme.spacing.unit * 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
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
    padding: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLine: {
    padding: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  revert: {
    textDecoration: 'line-through',
  },
  bottomButtonBar: {
    paddingTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default withStyles(styles)(withNamespaces()(InvoiceForm));
