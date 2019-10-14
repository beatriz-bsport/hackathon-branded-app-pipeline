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
import PAYMENT_METHODS, {
  CB as PAYMENT_METHOD_CB,
  SUBSCRIPTION_CB as PAYMENT_METHOD_SUBSCRIPTION_CB,
  CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';

import CreditMemberBadge from '../../member/components/CreditMemberBadge.component';

import InvoiceItemList from '../invoice-item/InvoiceItemList.component';
import UnevenInvoiceDialog from '../dialog/UnevenInvoiceDialog.component';
import InvoiceItemSelector, {
  SELECTOR_SHOP as INVOICE_SELECTOR_SHOP_TAB,
} from '../invoice-item/InvoiceItemSelector.component';

import PaymentInfo from './PaymentInfo.component';
import type { PrivatePass } from '../../private-service/types';

type Props = {
  quickInvoiceTitle: string,
  quickInvoice: { creditAccount: number, member: Member },
  uneditableInvoiceItems: Array<InvoiceItem>,
  editMode: ?boolean,
  onClose: ?() => void,
  classes: Object,
  paymentPacks: Array<PaymentPack>,
  privatePassList: Array<PrivatePass>,
  shopItems: Array<ShopItem>,
  createInvoice: (data: [*]) => void,
  updateInvoice: (data: [*]) => void,
  memberCreditAccountBalance: number,
};

type State = {
  payments: Array<{ id: number, text: string, amount: number }>,
  voucher: number,
  showInvoiceItemSelector: boolean,
  additionalPaymentPacks: Array<PaymentPack>,
  additionalShopItems: Array<ShopItem>,
  unevenInvoiceAlertOpen: boolean,
};

function getTotal(acc, invoiceItem) {
  return acc + parseFloat(invoiceItem.price);
}

// initiliaze a 0€ payment for all payment method except Stripe CB
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
        pm.id !== PAYMENT_METHOD_CREDIT_ACCOUNT.id,
    )
    .sort((pm, pm_) => pm.id - pm_.id);

export class QuickInvoice extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      payments: mapPaymentMethodToState(),
      voucher: 0,
      showInvoiceItemSelector: !props.editMode,
      additionalPaymentPacks: [],
      additionalShopItems: [],
      additionalPrivatePasses: [],
      topUp: 0,
      unevenInvoiceAlertOpen: false,
    };
  }

  getTotalPayment = () => {
    const { payments, voucher } = this.state;
    return sum(payments.map((pm) => pm.amount || 0)) + (voucher || 0);
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

  handleVoucher = (event) => {
    this.setState({ voucher: parseFloat(event.target.value) });
  };

  getFinalPrice = () => {
    const { uneditableInvoiceItems } = this.props;
    const {
      additionalShopItems,
      additionalPrivatePasses,
      additionalPaymentPacks,
      topUp,
    } = this.state;
    const sumPack = additionalPaymentPacks.reduce(getTotal, 0);
    const sumShop = additionalShopItems.reduce(getTotal, 0);
    const sumPrivatePass = additionalPrivatePasses.reduce(getTotal, 0);
    const sumUneditable = (uneditableInvoiceItems || []).reduce(getTotal, 0);
    return sumPack + sumShop + sumUneditable + topUp + sumPrivatePass;
  };

  choseInvoiceItem = () => {
    this.setState({ showInvoiceItemSelector: true });
  };

  closeUnevenInvoiceDialog = () => {
    this.setState({ unevenInvoiceAlertOpen: false });
  };

  addPaymentPack = (paymentPackId: number) => {
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
        },
      ],
      showInvoiceItemSelector: false,
    }));
  };

  addPrivatePass = (privatePassId: number) => {
    const ppToAdd = this.props.privatePassList.find(
      (pp) => pp.id === privatePassId,
    );
    this.setState((prevState) => ({
      additionalPrivatePasses: [
        ...prevState.additionalPrivatePasses,
        {
          name: ppToAdd.name,
          price: ppToAdd.price,
          id: ppToAdd.id,
        },
      ],
      showInvoiceItemSelector: false,
    }));
  };

  onTopUp = (amount: number) => {
    this.setState((prevState) => ({
      topUp: prevState.topUp + amount,
      showInvoiceItemSelector: false,
    }));
  };

  deleteTopUp = () => {
    this.setState({ topUp: 0 });
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
    const { payments } = this.state;
    const payment_items = payments.map((pm) => ({
      payment_received: true,
      price: pm.amount,
      payment_method: pm.id,
    }));
    return payment_items;
  };

  onSubmit = () => {
    const {
      topUp,
      additionalShopItems,
      additionalPaymentPacks,
      additionalPrivatePasses,
      voucher,
    } = this.state;
    const { quickInvoice, createInvoice } = this.props;
    const invoiceData = {
      shop_item_ids: additionalShopItems.map((siii) => siii.id),
      payment_pack_ids: additionalPaymentPacks.map((ppii) => [ppii.id]),
      private_pass_ids: additionalPrivatePasses.map((ppii) => ppii.id),
      voucher,
      payment_items: this.generatePaymentItemsObject(),
      top_up: topUp,
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

  deletePaymentPack = (paymentPackId: number) => {
    const { additionalPaymentPacks } = this.state;
    additionalPaymentPacks.splice(
      additionalPaymentPacks.findIndex((pp) => pp.id === paymentPackId),
      1,
    );
    this.setState({ additionalPaymentPacks });
  };

  deletePrivatePass = (privatePassId: number) => {
    const { additionalPrivatePasses } = this.state;
    additionalPrivatePasses.splice(
      additionalPrivatePasses.findIndex((pp) => pp.id === privatePassId),
      1,
    );
    this.setState({ additionalPrivatePasses });
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
      memberCreditAccountBalance,
    } = this.props;
    const {
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
            <CreditMemberBadge credit={memberCreditAccountBalance}>
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
            <InvoiceItemSelector
              creditAccountBalance={this.props.quickInvoice.creditAccount}
              shopItems={this.props.shopItems}
              paymentPacks={this.props.paymentPacks}
              privatePassList={this.props.privatePassList}
              onTopUp={this.onTopUp}
              onAddPaymentPack={this.addPaymentPack}
              onAddPrivatePass={this.addPrivatePass}
              onAddShopItem={this.addShopItem}
              showCancel={
                additionalPaymentPacks.length ||
                additionalShopItems.length ||
                this.state.additionalPrivatePasses.length
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
                  privatePassInvoiceItems={this.state.additionalPrivatePasses}
                  shopItemInvoiceItems={additionalShopItems}
                  topUp={this.state.topUp}
                  deletePPackInvoiceItem={this.deletePaymentPack}
                  deletePrivatePassInvoiceItem={this.deletePrivatePass}
                  deleteShopItemInvoiceItem={this.deleteShopItem}
                  deleteTopUp={this.deleteTopUp}
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
              paymentItems={this.state.payments}
              voucher={voucher}
              handlePaymentChange={this.handlePaymentChange}
              handleVoucher={this.handleVoucher}
              onSubmit={this.checkUnvenOrSubmit}
              onClose={onClose}
              disabled={
                !(
                  (this.state.additionalPaymentPacks || []).length ||
                  (this.state.additionalPrivatePasses || []).length ||
                  (this.state.additionalShopItems || []).length ||
                  (this.props.uneditableInvoiceItems || []).length ||
                  !!this.state.topUp
                )
              }
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
    backgroundColor: '#F8F8F8',
    border: 'solid 1px #E0E0E0',
    borderRadius: '4px',
  },
  header: {
    paddingLeft: theme.spacing.unit,
  },
  invoiceItemListContainer: {
    backgroundColor: '#F8F8F8',
  },
  badge: {
    marginTop: (theme.spacing.unit * 1) / 4,
    padding: (theme.spacing.unit * 1) / 2,
  },
});

export default withStyles(styles)(QuickInvoice);
