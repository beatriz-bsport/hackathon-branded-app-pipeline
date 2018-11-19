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

import {
  InvoiceItemSelector,
  InvoiceVoucher,
  InvoiceItemList,
} from '../invoice';
import PaymentForm from './PaymentForm.component';
import PaymentList from './PaymentList.component';
import { formatAsDate, formatAsDatetime } from '../../datetime';
import { Moment } from '../../i18n';

import type {
  PaymentPack,
  Activity,
  Offer,
  InvoiceItem,
} from '../../api/types';
import type { InvoiceDataFront } from './types';

type Props = {
  offers: Array<Offer>,
  paymentPacks: Array<PaymentPack>,
  activities: Array<Activity>,
  uneditablePayments: Array<Payment>,
  uneditableInvoiceItems: Array<InvoiceItem>,
  editMode: ?boolean,
  processing: boolean,
  onCancel: () => void,
  createOrUpdate: (invoiceData: InvoiceDataFront) => void,
  updatePaymentStatus: (uuid: string, payment_received: boolean) => void,
  t: (x: string) => string,
  classes: Object,
};

type State = {
  offerInvoiceItems: Array<InvoiceItem>,
  paymentPackInvoiceItems: Array<InvoiceItem>,
  voucherInvoiceItems: Array<InvoiceItem>,
  paymentItems: Array<PaymentItemData>,
  step: number,
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
      offerInvoiceItems: [],
      paymentPackInvoiceItems: [],
      voucherInvoiceItems: [],
      paymentItems: [],
      step: props.editMode ? STEP_ADD_INVOICE_PAYMENTS : STEP_ADD_INVOICE_ITEMS,
    };
  }

  createInvoice = () => {
    const {
      offerInvoiceItems,
      voucherInvoiceItems,
      paymentPackInvoiceItems,
      paymentItems,
    } = this.state;

    const data = {
      offer_ids: offerInvoiceItems.map((oii) => oii.id),
      voucher: -voucherInvoiceItems.reduce(getTotal, 0),
      payment_pack_ids: paymentPackInvoiceItems.map((ppii) => ppii.id),
      payment_items: paymentItems,
    };
    this.props.createOrUpdate(data);
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
      offerInvoiceItems,
      paymentPackInvoiceItems,
      voucherInvoiceItems,
    } = this.state;

    const sumBooking = offerInvoiceItems.reduce(getTotal, 0);
    const sumPack = paymentPackInvoiceItems.reduce(getTotal, 0);
    const sumVoucher = voucherInvoiceItems.reduce(getTotal, 0);
    const sumUneditableInvoiceItems = (uneditableInvoiceItems || []).reduce(
      getTotal,
      0,
    );

    return sumBooking + sumPack + sumVoucher + sumUneditableInvoiceItems;
  };

  deleteVoucher = () => {
    this.setState({ voucherInvoiceItems: [] });
  };

  deleteOfferInvoiceItem = (offerId: number) => {
    const { offerInvoiceItems } = this.state;
    offerInvoiceItems.splice(
      offerInvoiceItems.findIndex((o) => o.id === offerId),
      1,
    );

    this.setState({
      offerInvoiceItems,
    });
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

  deletePaymentItem = (paymentItem) => {
    this.setState((prevState) => ({
      paymentItems: prevState.paymentItems.filter(
        (pi) => pi.id !== paymentItem.id,
      ),
    }));
  };

  onUpdateVoucher = (voucher) => {
    const { t } = this.props;
    this.setState({
      voucherInvoiceItems: [
        {
          name: t('payment.voucher'),
          price: -voucher,
          id: -1,
        },
      ],
    });
  };

  submitFinalizedInvoice = () => {
    console.log(this.state);
  };

  addPaymentItem = (paymentItem) => {
    this.setState((prevState) => ({
      paymentItems: [...prevState.paymentItems, paymentItem],
    }));
  };

  onAddOffer = (offerId: number) => {
    const offer = this.props.offers.find((o) => o.id === offerId);
    const { name } = this.props.activities.find((a) => a.id === offer.activity);
    if (offer) {
      this.setState((prevState) => ({
        offerInvoiceItems: [
          ...prevState.offerInvoiceItems,
          {
            price: offer.price,
            id: offer.id,
            subtitle: formatAsDatetime(offer.date_start),
            name,
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
            subtitle: formatAsDate(Moment()),
          },
        ],
      }));
    }
  };

  renderBottomActionButton = () => {
    const { step } = this.state;
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
              {t('payment.createInvoice')}
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
            disabled={this.getFinalPrice() === 0}
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
      offers,
      activities,
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
              paymentPacks={paymentPacks}
              activities={activities}
              events={offers}
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
      offerInvoiceItems,
      paymentPackInvoiceItems,
      voucherInvoiceItems,
    } = this.state;

    return (
      <Grid container direction="column" justify="space-between">
        <Grid item>
          <InvoiceItemList
            offerInvoiceItems={offerInvoiceItems}
            deleteOfferInvoiceItem={this.deleteOfferInvoiceItem}
            deletePPackInvoiceItem={this.deletePPackInvoiceItem}
            deleteVoucher={this.deleteVoucher}
            paymentPackInvoiceItems={paymentPackInvoiceItems}
            uneditableInvoiceItems={uneditableInvoiceItems || []}
            voucherInvoiceItems={voucherInvoiceItems}
          />
        </Grid>
        <Grid item>{this.renderTotal()}</Grid>
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
