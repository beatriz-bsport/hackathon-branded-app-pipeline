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
import { formatAsDatetime } from '../../datetime';

type Props = {
  quickInvoice: { member: Member, invoiceItems: { offers: Array<Event> } },
  onClose: () => void,
  classes: Object,
  offers: Array<Event>,
  activities: Array<Activity>,
  paymentPacks: Array<PaymentPack>,
  createInvoice: (data: [*]) => void,
  t: TFunction,
};

function getTotal(acc, invoiceItem) {
  return acc + parseInt(invoiceItem.price, 10);
}

export class QuickInvoice extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      cb: 0,
      cash: 0,
      check: 0,
      showInvoiceItemSelector: false,
      additionalOffers: [],
      additionalPaymentPacks: [],
    };
  }

  getTotalPayment = () => {
    const { cb, cash, check } = this.state;
    return cb + check + cash;
  };

  handlePaymentChange = (payment_type) => (e) => {
    this.setState({ [payment_type]: e.target.value });
  };

  getFinalPrice = () => {
    const { additionalOffers, additionalPaymentPacks } = this.state;
    const sumBooking = additionalOffers.reduce(getTotal, 0);
    const sumPack = additionalPaymentPacks.reduce(getTotal, 0);
    const sumUneditableOffers = this.props.quickInvoice.invoiceItems.offers.reduce(
      getTotal,
      0,
    );

    return sumBooking + sumPack + sumUneditableOffers;
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

  renderPayment = () => {
    const { classes, t } = this.props;
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
        </Grid>
        <Grid item xs={6}>
          <Grid item container justify="center" alignItems="center">
            <Button
              color="primary"
              onClick={this.onSubmit}
              disabled={totalPayment === 0 && finalPrice === 0}
            >
              {t('common.save')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  addOffer = (offerId: number) => {
    const addedOffer = this.props.offers.find((o) => o.id === offerId);
    const { name } = this.props.activities.find(
      (a) => a.id === addedOffer.activity,
    );

    this.setState((prevState) => ({
      additionalOffers: [
        ...prevState.additionalOffers,
        {
          name,
          subtitle: formatAsDatetime(addedOffer.date_start),
          price: addedOffer.price,
          id: offerId,
        },
      ],
      showInvoiceItemSelector: false,
    }));
  };

  addPaymentPack = (paymentPackId: number) => {
    this.setState((prevState) => ({
      additionalPaymentPacks: [
        ...prevState.additionalPaymentPacks,
        this.props.paymentPacks.find((pp) => pp.id === paymentPackId),
      ],
      showInvoiceItemSelector: false,
    }));
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
    const invoiceData = {
      offer_ids: [
        ...this.state.additionalOffers.map((oii) => oii.id),
        ...this.props.quickInvoice.invoiceItems.offers.map((o) => o.id),
      ],
      payment_pack_ids: this.state.additionalPaymentPacks.map(
        (ppii) => ppii.id,
      ),
      voucher: 0,
      payment_items: this.generatePaymentItemsObject(),
      member: this.props.quickInvoice.member.id,
    };
    this.props.createInvoice(invoiceData);
  };

  renderInvoiceItemSelector = () => {
    return (
      <InvoiceItemSelector
        onAddOffer={this.addOffer}
	onAddPaymentPack={this.addPaymentPack}
	showCancel
	onCancel={() => this.setState({ showInvoiceItemSelector: false})}
      />
    );
  };

  renderInvoiceItemsPanel = () => {
    if (this.state.showInvoiceItemSelector) {
      return this.renderInvoiceItemSelector();
    }
    return this.renderInvoiceItemList();
  };

  deleteOffer = (offerId) => {
    const { additionalOffers } = this.state;
    additionalOffers.splice(
      additionalOffers.findIndex((o) => o.id === offerId),
      1,
    );
    this.setState({ additionalOffers });
  };

  deletePaymentPack = (paymentPackId) => {
    const { additionalPaymentPacks } = this.state;
    additionalPaymentPacks.splice(
      additionalPaymentPacks.findIndex((pp) => pp.id === paymentPackId),
      1,
    );
    this.setState({ additionalPaymentPacks });
  };

  renderInvoiceItemList = () => {
    const { classes } = this.props;
    const { invoiceItems } = this.props.quickInvoice;
    return (
      <Grid container direction="row">
        <Grid item xs={9} className={classes.invoiceItemListContainer}>
          <InvoiceItemList
            compact
            offerInvoiceItems={this.state.additionalOffers}
            paymentPackInvoiceItems={this.state.additionalPaymentPacks}
            uneditableInvoiceItems={invoiceItems.offers}
            voucherInvoiceItems={[]}
            deleteOfferInvoiceItem={this.deleteOffer}
            deletePPackInvoiceItem={this.deletePaymentPack}
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
});

export default withStyles(styles)(translate()(QuickInvoice));
