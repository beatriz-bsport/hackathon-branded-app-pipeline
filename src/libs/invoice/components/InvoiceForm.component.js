// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withStateHandlers } from 'recompose';
import Grid from '@material-ui/core/Grid';

import {
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_CREDIT,
} from '@bsport/common/lib/master-data/buyable-items';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import InvoiceContent from './InvoiceContent.component';
import InvoiceEditor from './InvoiceEditor.component';
import UnevenInvoiceDialog from '../dialog/UnevenInvoiceDialog.component';
import FinalizeInvoiceDialog from '../dialog/FinalizeInvoiceDialog.component';
// import InvoiceActions from './InvoiceActions.component';
import InvoiceHeader from './InvoiceHeader.component';
import type { OptionCallback } from '../../../state/types';

type Props = {
  classes: Object,

  invoice: ?Invoice,
  paymentItemList: Array<PaymentItem>,
  invoiceItemList: Array<InvoiceItem>,

  member: Member,
  finalizeInvoice: (uuid: string) => void,
  goToSubscription: (id: number) => void,
  unevenInvoiceAlertOpen: boolean,
  closeUnevenInvoiceDialog: () => void,
  onSubmit: (
    {
      buyable_items: Array<BuyableItem>,
      payment_methods: Array<PaymentMethod>,
    },
    options: OptionCallback,
  ) => void,
  availableBuyableItems: { [identifier: number]: Array<any> },
  openUnevenInvoiceDialog: () => void,
  finalizeInvoiceAlertOpen: boolean,
  closeFinalizeInvoiceDialog: () => void,
  updatePaymentMethod: (uuid: string, paymentMethodId: number) => void,
  isReturningPayment: boolean,
  returnPayment: (uuid: string) => void,
  revertInvoice: () => void,
  initialItems?: { withPrivatePass?: string, withCredit?: string },
  t: TFunction,

  savedPaymentMethodList: Array<PaymentMethod>,
  requestSetupIntentSecret: () => void,
  refreshSavedPaymentMethodList: () => void,
};

type State = {
  paymentItemList: Array<PaymentItem>,
  invoiceItemList: Array<InvoiceItem>,
};

const asEditable = (editable, items) => {
  if (items) {
    return items.map((i) => ({ ...i, editable }));
  }
  return [];
};

export class InvoiceForm extends React.Component<Props, State> {
  state = { paymentItemList: [], invoiceItemList: [] };

  componentDidMount() {
    const { initialItems } = this.props;
    if (initialItems) {
      if (initialItems.withPrivatePass) {
        const privatePass = this.props.availableBuyableItems[
          BUYABLE_ITEM_PRIVATE_PASS
        ].find((bi) => bi.id === parseInt(initialItems.withPrivatePass, 10));
        this.addBuyableItem(BUYABLE_ITEM_PRIVATE_PASS, {
          ...privatePass,
          price: parseFloat(privatePass.price).toFixed(2),
          voucher: '0.00',
          buyable_item_id: privatePass.id,
        });
      }
      if (initialItems.withCredit) {
        this.addBuyableItem(BUYABLE_ITEM_CREDIT, {
          buyable_item_id: 0,
          price: parseFloat(initialItems.withCredit).toFixed(2),
          voucher: '0.00',
          name: this.props.t('invoiceItem.credit.label'),
        });
      }
    }
  }

  removeInvoiceItem = (id: number) => {
    this.setState((prevState) => {
      const idx = prevState.invoiceItemList.findIndex((ii) => ii.id === id);
      return {
        invoiceItemList: prevState.invoiceItemList.filter((ii, idx_) => {
          return idx_ !== idx;
        }),
      };
    });
  };

  removePaymentItem = (id: number) => {
    this.setState((prevState) => ({
      paymentItemList: prevState.paymentItemList.filter((p) => p.id !== id),
    }));
  };

  addBuyableItem = (buyable_item_identifier: number, item: any) => {
    this.setState((prevState) => ({
      invoiceItemList: [
        ...prevState.invoiceItemList,
        {
          ...item,
          voucher:
            (parseFloat(item.price) >= 0
              ? Math.min(parseFloat(item.price), item.voucher || 0)
              : 0) || 0,
          buyable_item_identifier,
        },
      ],
    }));
  };

  addPaymentItem = (paymentItem: PaymentItem) => {
    this.setState((prevState) => ({
      paymentItemList: [...prevState.paymentItemList, paymentItem],
    }));
  };

  getInvoiceItemAmount = () => {
    return [
      ...(this.props.invoiceItemList || []),
      ...this.state.invoiceItemList,
    ]
      .filter((ii) => !!ii && !ii.reverted)
      .reduce(
        (acc, v) => acc + parseFloat(v.price) - parseFloat(v.voucher || 0),
        0,
      );
  };

  getPaymentItemAmount = () => {
    return [
      ...(this.props.paymentItemList || []),
      ...this.state.paymentItemList,
    ]
      .filter((p) => !!p && !p.reverted && p.payment_received)
      .reduce((acc, v) => acc + parseFloat(v.price), 0);
  };

  invoiceItemIsEmpty = () => {
    return (
      this.state.invoiceItemList.length === 0 &&
      (this.props.invoiceItemList || []).length === 0
    );
  };

  onSubmit = (options?: OptionCallback) => {
    const invoiceItemAmount = this.getInvoiceItemAmount();
    const paymentAmount = this.getPaymentItemAmount();
    if (
      paymentAmount !== invoiceItemAmount &&
      !this.props.unevenInvoiceAlertOpen
    ) {
      return this.props.openUnevenInvoiceDialog();
    }
    this.props.closeUnevenInvoiceDialog();

    this.props.onSubmit(
      {
        buyable_items: this.state.invoiceItemList,
        payment_methods: this.state.paymentItemList,
      },
      options,
    );
    return null;
  };

  render() {
    const { classes } = this.props;
    const invoiceItemAmount = this.getInvoiceItemAmount();
    const paymentAmount = this.getPaymentItemAmount();
    return (
      <Grid container spacing={1} className={classes.container}>
        <Grid item xs={12} md={6}>
          <InvoiceHeader invoice={this.props.invoice} />
          <InvoiceContent
            removeInvoiceItem={this.removeInvoiceItem}
            invoiceItemList={[
              ...asEditable(false, this.props.invoiceItemList),
              ...asEditable(true, this.state.invoiceItemList),
            ]}
            amountInvoiceitem={invoiceItemAmount}
            removePaymentItem={this.removePaymentItem}
            paymentItemList={[
              ...asEditable(false, this.props.paymentItemList),
              ...asEditable(true, this.state.paymentItemList),
            ]}
            amountPaymentItem={paymentAmount}
            updatePaymentMethod={this.props.updatePaymentMethod}
            isReturningPayment={this.props.isReturningPayment}
            returnPayment={this.props.returnPayment}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InvoiceEditor
            savedPaymentMethodList={this.props.savedPaymentMethodList}
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
            refreshSavedPaymentMethodList={
              this.props.refreshSavedPaymentMethodList
            }
            availableBuyableItems={this.props.availableBuyableItems}
            onAddBuyableItem={this.addBuyableItem}
            onAddPaymentItem={this.addPaymentItem}
            invoiceItemIsEmpty={this.invoiceItemIsEmpty()}
            revertInvoice={this.props.revertInvoice}
            invoice={this.props.invoice}
            invoiceHasChanged={
              this.state.invoiceItemList.length ||
              this.state.paymentItemList.length
            }
            amountInvoiceitem={invoiceItemAmount}
            amountPaymentItem={paymentAmount}
            isEquilibrated={paymentAmount === invoiceItemAmount}
            member={this.props.member}
            onSubmit={this.onSubmit}
            finalizeInvoice={this.props.finalizeInvoice}
            goToSubscription={this.props.goToSubscription}
          />
        </Grid>
        <UnevenInvoiceDialog
          open={this.props.unevenInvoiceAlertOpen}
          onClose={this.props.closeUnevenInvoiceDialog}
          totalItem={this.getInvoiceItemAmount().toFixed(2)}
          totalPayment={paymentAmount.toFixed(2)}
          onSubmit={this.onSubmit}
        />
        <FinalizeInvoiceDialog
          open={this.props.finalizeInvoiceAlertOpen}
          onClose={this.props.closeFinalizeInvoiceDialog}
          onSubmit={() => {
            this.props.finalizeInvoice();
            this.props.closeFinalizeInvoiceDialog();
          }}
        />
      </Grid>
    );
  }
}

const styles = () => ({
  container: {},
});

export default compose(
  withStyles(styles),
  withStateHandlers(
    { unevenInvoiceAlertOpen: false, finalizeInvoiceAlertOpen: false },
    {
      closeUnevenInvoiceDialog: () => () => ({ unevenInvoiceAlertOpen: false }),
      openUnevenInvoiceDialog: () => () => ({ unevenInvoiceAlertOpen: true }),
      closeFinalizeInvoiceDialog: () => () => ({
        finalizeInvoiceAlertOpen: false,
      }),
      openFinalizeInvoiceDialog: () => () => ({
        finalizeInvoiceAlertOpen: true,
      }),
    },
  ),
  withTranslation(['invoice']),
)(InvoiceForm);
