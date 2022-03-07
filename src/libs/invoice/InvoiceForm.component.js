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
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PersonIcon from '@material-ui/icons/Person';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { withTranslation, TFunction } from 'react-i18next';
import { CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT } from '@bsport/common/lib/master-data/payment-methods';
import sum from 'lodash/sum';
import {
  getCurrencyDisplay,
  getCurrencyDisplayWithPrice,
} from '../theme/selectors';

import PaymentForm from './payment/PaymentForm.component';
import PaymentList from './payment/PaymentList.component';

import type { Invoice, PaymentPack, InvoiceItem } from '../../api/types';
import type { InvoiceDataFront } from './payment/types';

import InvoiceVoucher from './payment/InvoiceVoucher.component';
import UnevenInvoiceDialog from './dialog/UnevenInvoiceDialog.component';
import InvoiceItemList from './invoice-item/InvoiceItemList.component';
import InvoiceItemSelector from './invoice-item/InvoiceItemSelector.component';
import CreditMemberBadge from '../member/components/CreditMemberBadge.component';
import type { PrivatePass } from '../private-service/types';

import RedButton from '../../components/button/RedButton.component';

type Props = {
  editMode: ?boolean,
  processing: boolean,
  uneditableVoucher: ?number,
  withCredit: ?number,
  withPrivatePass: ?number,

  returnPayment: (paymentId: string) => void,
  isReturningPayment: boolean,

  member: Member,
  invoice: ?Invoice,

  paymentPacks: Array<PaymentPack>,
  privatePassList: Array<PrivatePass>,
  paymentComboList: Array<PaymentCombo>,
  shopItems: Array<ShopItem>,
  uneditablePayments: Array<Payment>,
  uneditableInvoiceItems: Array<InvoiceItem>,

  onCancel: () => void,
  goToMemberPage: () => void,
  goToSubscription: (billingPlanId: number) => void,
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
  privatePassInvoiceItems: Array<InvoiceItem>,
  paymentComboInvoiceItems: Array<InvoiceItem>,
};

const STEP_ADD_INVOICE_ITEMS = 0;
const STEP_ADD_INVOICE_PAYMENTS = 1;

function getTotal(acc, invoiceItem) {
  return acc + parseFloat(invoiceItem.price);
}

const DownloadButton = (props: {
  onClick: () => void,
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
  onClick: () => void,
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
  onClick: () => void,
  classes: any,
  processing: boolean,
}) => (
  <Button
    variant="contained"
    color="primary"
    disabled={props.processing}
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
      privatePassInvoiceItems: props.withPrivatePass
        ? props.privatePassList.filter((pp) => pp.id === props.withPrivatePass)
        : [],
      shopItemInvoiceItems: [],
      paymentComboInvoiceItems: [],
      voucher: 0,
      paymentItems: [],
      topUp: props.withCredit ? props.withCredit : 0,
      step: props.editMode,
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
      privatePassInvoiceItems,
      paymentComboInvoiceItems,
      shopItemInvoiceItems,
      paymentItems,
      topUp,
    } = this.state;

    const data = {
      voucher,
      top_up: topUp,
      shop_item_ids: shopItemInvoiceItems.map((siii) => siii.id),
      payment_pack_ids: paymentPackInvoiceItems.map((ppii) => [ppii.id]),
      private_pass_ids: privatePassInvoiceItems.map((ppii) => ppii.id),
      payment_combo_ids: paymentComboInvoiceItems.map((ppii) => ppii.id),
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
      privatePassInvoiceItems,
      paymentComboInvoiceItems,
      voucher,
      topUp,
    } = this.state;

    const sumPack = paymentPackInvoiceItems.reduce(getTotal, 0);
    const sumPrivatePass = privatePassInvoiceItems.reduce(getTotal, 0);
    const sumPaymentCombo = paymentComboInvoiceItems.reduce(getTotal, 0);
    const sumShop = shopItemInvoiceItems.reduce(getTotal, 0);
    const sumUneditableInvoiceItems = (uneditableInvoiceItems || []).reduce(
      getTotal,
      0,
    );
    return (
      topUp +
      sumPrivatePass +
      sumPaymentCombo +
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

  deletePrivatePassInvoiceItem = (privatePassId: number) => {
    const { privatePassInvoiceItems } = this.state;
    privatePassInvoiceItems.splice(
      privatePassInvoiceItems.findIndex((pp) => pp.id === privatePassId),
      1,
    );
    this.setState({
      privatePassInvoiceItems,
    });
  };

  deletePaymentComboInvoiceItem = (comboId: number) => {
    const { paymentComboInvoiceItems } = this.state;
    paymentComboInvoiceItems.splice(
      paymentComboInvoiceItems.findIndex((pp) => pp.id === comboId),
      1,
    );
    this.setState({
      paymentComboInvoiceItems,
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

  onAddPaymentCombo = (comboId: number) => {
    const combo = this.props.paymentComboList.find((pp) => pp.id === comboId);
    if (combo) {
      this.setState((prevState) => ({
        paymentComboInvoiceItems: [
          ...prevState.paymentComboInvoiceItems,
          {
            name: combo.name,
            price: combo.price,
            id: combo.id,
          },
        ],
      }));
    }
  };

  onAddPrivatePass = (privatePassId: number) => {
    const privatePass = this.props.privatePassList.find(
      (pp) => pp.id === privatePassId,
    );
    if (privatePass) {
      this.setState((prevState) => ({
        privatePassInvoiceItems: [
          ...prevState.privatePassInvoiceItems,
          {
            name: privatePass.name,
            price: privatePass.price,
            id: privatePass.id,
          },
        ],
      }));
    }
  };

  onAddPaymentPack = (paymentPackId: number) => {
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
      {this.props.member ? (
        <CreditMemberBadge credit={this.props.member.credit_account_balance}>
          <Button
            variant="contained"
            color="secondary"
            disabled={!this.props.goToMemberPage}
            onClick={this.props.goToMemberPage || (() => {})}
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
                (this.state.privatePassInvoiceItems || []).length ||
                (this.state.paymentComboInvoiceItems || []).length ||
                (this.state.shopItemInvoiceItems || []).length ||
                (this.props.uneditableInvoiceItems || []).length ||
                !!this.state.topUp
              )
            }
          >
            {getCurrencyDisplay() === '€' ? (
              <EuroSymbolIcon className={classes.leftIcon} />
            ) : (
              <AttachMoneyIcon className={classes.leftIcon} />
            )}
            {t('payment.payment')}
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
    if (this.props.invoice && this.props.invoice.plannedinvoice) {
      return (
        <div>
          <Typography style={{ padding: 12 }}>
            {this.props.t('payment.invoiceFromSubscriptionThusNotEditable')}
          </Typography>
          <Button
            className={this.props.classes.buttonWithMargin}
            onClick={() =>
              this.props.goToSubscription(this.props.invoice.billing_plan)
            }
            color="primary"
            variant="outlined"
          >
            {this.props.t('payment.goToSubscription')}
            <ArrowForwardIcon className={this.props.classes.rightIcon} />
          </Button>
        </div>
      );
    }
    const finalPrice = this.getFinalPrice();
    const totalPayment = this.getTotalPayment();
    return (
      <PaymentForm
        onSubmit={this.addPaymentItem}
        amountDue={finalPrice - totalPayment}
        creditAccountBalance={this.getUpdatedCreditAccountBalance()}
      />
    );
  };

  renderRightPanel = () => {
    const {
      paymentPacks,
      shopItems,
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
        <div className={classes.itemSelectorPanel}>
          <InvoiceItemSelector
            creditAccountBalance={this.getUpdatedCreditAccountBalance()}
            onAddPaymentPack={this.onAddPaymentPack}
            onAddPrivatePass={this.onAddPrivatePass}
            onAddShopItem={this.onAddShopItem}
            onAddPaymentCombo={this.onAddPaymentCombo}
            onTopUp={this.onTopUp}
            paymentPacks={paymentPacks}
            privatePassList={this.props.privatePassList}
            paymentComboList={this.props.paymentComboList}
            shopItems={shopItems}
          />
          <Divider />
          <div className={classes.voucher}>
            <InvoiceVoucher onUpdateVoucher={this.onUpdateVoucher} />
          </div>
        </div>
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
              returnPayment={this.props.returnPayment}
              isReturningPayment={this.props.isReturningPayment}
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
                {getCurrencyDisplayWithPrice(
                  (finalPrice - totalPayment).toFixed(2),
                )}
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
      privatePassInvoiceItems,
      paymentComboInvoiceItems,
      shopItemInvoiceItems,
    } = this.state;

    return (
      <div className={this.props.classes.invoiceItemListPanel}>
        <InvoiceItemList
          deletePPackInvoiceItem={this.deletePPackInvoiceItem}
          deletePrivatePassInvoiceItem={this.deletePrivatePassInvoiceItem}
          deletePaymentComboInvoiceItem={this.deletePaymentComboInvoiceItem}
          deleteShopItemInvoiceItem={this.deleteShopItemInvoiceItem}
          deleteVoucher={this.deleteVoucher}
          deleteTopUp={this.deleteTopUp}
          paymentPackInvoiceItems={paymentPackInvoiceItems}
          privatePassInvoiceItems={privatePassInvoiceItems}
          paymentComboInvoiceItems={paymentComboInvoiceItems}
          shopItemInvoiceItems={shopItemInvoiceItems}
          uneditableInvoiceItems={uneditableInvoiceItems || []}
        />
        <Divider />
        <div className={this.props.classes.totalLine}>
          <Typography variant="h6">{this.props.t('payment.total')}</Typography>
          <Typography
            className={
              this.props.invoice && this.props.invoice.reverted
                ? this.props.classes.revert
                : {}
            }
            variant="h6"
          >
            {getCurrencyDisplayWithPrice(this.getFinalPrice().toFixed(2))}
          </Typography>
        </div>
      </div>
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
  itemSelectorPanel: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  voucher: {
    padding: theme.spacing(2),
    backgroundColor: '#F8F8F8',
    width: '100%',
  },
  invoiceList: {
    padding: theme.spacing(1),
    backgroundColor: '#F8F8F8',
    border: '2px solid #E8E8E8',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
  },
  paymentSelectorButtons: {
    marginTop: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightText: {
    marginLeft: theme.spacing(1),
  },
  navigationButton: {
    marginRight: theme.spacing(1),
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  paymentFormContainer: {
    paddingLeft: theme.spacing(2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  leftPanelSubBlock: {
    marginTop: theme.spacing(3),
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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  totalUnpaid: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLine: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  revert: {
    textDecoration: 'line-through',
  },
  bottomButtonBar: {
    paddingTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoiceItemListPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  buttonWithMargin: {
    margin: theme.spacing(1),
  },
});

export default withStyles(styles)(withTranslation()(InvoiceForm));
