// @flow
import React, { Component } from 'react';
import sum from 'lodash/sum';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import PAYMENT_METHODS, {
  CB as PAYMENT_METHOD_CB,
  DISPUTE as PAYMENT_METHOD_DISPUTE,
  SUBSCRIPTION_CB as PAYMENT_METHOD_SUBSCRIPTION_CB,
  CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';

import CreditMemberBadge from '../../member/components/CreditMemberBadge.component';

import InvoiceItem from '../components/InvoiceItem.component';
import UnevenInvoiceDialog from '../dialog/UnevenInvoiceDialog.component';
import InvoiceItemEditor from '../components/InvoiceItemEditor.component';

import PaymentInfo from './PaymentInfo.component';

type Props = {
  quickInvoiceTitle: string,
  quickInvoice: { creditAccount: number, member: Member },
  editMode: ?boolean,
  onClose: ?() => void,
  classes: Object,
  createInvoice: (data: [*]) => void,
  updateInvoice: (data: [*]) => void,
  availableBuyableItems: {
    [buyable_item_identifier: number]: Array<BuyableItem>,
  },
  removeInvoiceItem: (number) => void,
  uneditableInvoiceItems: Array<InvoiceItem>,
};

type State = {
  payments: Array<{ id: number, text: string, amount: number }>,
  showInvoiceItemSelector: boolean,
  unevenInvoiceAlertOpen: boolean,
  invoiceItemList: Array<InvoiceItem>,
};

const mapPaymentMethodToState = () =>
  PAYMENT_METHODS.map((pm) => ({
    id: pm.id,
    text: pm.text,
    amount: 0,
  }))
    .filter(
      (pm) =>
        pm.id !== PAYMENT_METHOD_SUBSCRIPTION_CB.id &&
        pm.id !== PAYMENT_METHOD_CB.id &&
        pm.id !== PAYMENT_METHOD_DISPUTE.id &&
        pm.id !== PAYMENT_METHOD_CREDIT_ACCOUNT.id,
    )
    .sort((pm, pm_) => pm.id - pm_.id);

export class QuickInvoice extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      payments: mapPaymentMethodToState(),
      showInvoiceItemSelector: !props.editMode,
      invoiceItemList: [],
    };
  }

  getTotalPayment = () => {
    const { payments } = this.state;
    return sum(payments.map((pm) => pm.amount || 0));
  };

  handlePaymentChange = (payment_type: number) => (e: SyntheticEvent) => {
    const newAmount = parseFloat(e.target.value);
    this.setState((prevState) => {
      const oldPayment = prevState.payments.filter(
        (pm) => pm.id === payment_type,
      )[0];
      return {
        payments: [
          ...prevState.payments.filter((pm) => pm.id !== payment_type),
          { ...oldPayment, amount: newAmount },
        ].sort((pm, pm_) => pm.id - pm_.id),
      };
    });
  };

  getFinalPrice = () => {
    return (
      this.state.invoiceItemList.reduce(
        (acc, v) => parseFloat(v.price) - parseFloat(v.voucher || 0) + acc,
        0,
      ) +
      (this.props.uneditableInvoiceItems || []).reduce(
        (acc, ii) =>
          (ii ? parseFloat(ii.price) || 0 : 0) -
          (ii ? parseFloat(ii.voucher) || 0 : 0) +
          acc,
        0,
      )
    );
  };

  choseInvoiceItem = () => {
    this.setState({ showInvoiceItemSelector: true });
  };

  closeUnevenInvoiceDialog = () => {
    this.setState({ unevenInvoiceAlertOpen: false });
  };

  generatePaymentItemsObject = () => {
    const { payments } = this.state;
    const payment_items = payments.map((pm) => ({
      payment_received: true,
      price: pm.amount,
      payment_method: pm.id,
    }));
    return payment_items;
  };

  onSubmit = () => {
    const { quickInvoice, createInvoice } = this.props;
    const invoiceData = {
      payment_methods: this.generatePaymentItemsObject(),
      buyable_items: this.state.invoiceItemList,
      member: quickInvoice.memberId,
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

  addBuyableItem = (buyable_item_identifier, buyableItem) => {
    this.setState((prevState) => ({
      invoiceItemList: [
        {
          ...buyableItem,
          buyable_item_identifier,
          editable: true,
        },
        ...prevState.invoiceItemList,
      ],
      showInvoiceItemSelector: false,
    }));
  };

  render() {
    const { classes, onClose, quickInvoiceTitle, quickInvoice } = this.props;

    const finalPrice = this.getFinalPrice();
    const totalPayment = this.getTotalPayment();
    if (!quickInvoice.member) {
      return <CircularProgress />;
    }
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
            <CreditMemberBadge
              credit={quickInvoice.member.credit_account_balance}
            >
              <Typography variant="h6" inline>
                {quickInvoiceTitle}
              </Typography>
            </CreditMemberBadge>
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
          <div>
            <InvoiceItemEditor
              availableBuyableItems={this.props.availableBuyableItems}
              onAddBuyableItem={this.addBuyableItem}
              member={quickInvoice.member}
            />
          </div>
        ) : (
          <React.Fragment>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={9} className={classes.invoiceItemListContainer}>
                {[
                  ...(this.state.invoiceItemList || []),
                  ...(this.props.uneditableInvoiceItems || []).map((ii) => ({
                    ...ii,
                    editable: false,
                  })),
                ].map((ii) => (
                  <div>
                    <InvoiceItem
                      invoiceItem={ii}
                      key={`${ii.buyable_item_identifier}:${ii.id}:${ii.voucher}`}
                      onDelete={() => this.props.removeInvoiceItem(ii.id)}
                    />
                  </div>
                ))}
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
              paymentItems={this.state.payments}
              handlePaymentChange={this.handlePaymentChange}
              onSubmit={this.checkUnvenOrSubmit}
              onClose={onClose}
              disabled={
                !this.state.invoiceItemList.length &&
                !(this.props.uneditableInvoiceItems || []).length
              }
            />
          </React.Fragment>
        )}
        <UnevenInvoiceDialog
          open={this.state.unevenInvoiceAlertOpen}
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
    margin: theme.spacing(1),
    backgroundColor: '#F8F8F8',
    border: 'solid 1px #E0E0E0',
    borderRadius: '4px',
  },
  header: {
    paddingLeft: theme.spacing(1),
  },
  invoiceItemListContainer: {
    backgroundColor: '#F8F8F8',
  },
  badge: {
    marginTop: (theme.spacing(1) * 1) / 4,
    padding: (theme.spacing(1) * 1) / 2,
  },
});

export default withStyles(styles)(QuickInvoice);
