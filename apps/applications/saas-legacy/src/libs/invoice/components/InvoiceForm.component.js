// Semi-deprecated component, interface of historical v1 invoices
// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withStateHandlers } from 'recompose';
import Grid from '@material-ui/core/Grid';

import {
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_CREDIT,
} from '@bsport/common/lib/master-data/buyable-items.js';
import { withTranslation, TFunction } from 'react-i18next';
import InvoiceContent from './InvoiceContent.component';
import UnevenInvoiceDialog from '../dialog/UnevenInvoiceDialog.component';
import FinalizeInvoiceDialog from '../dialog/FinalizeInvoiceDialog.component';
// import InvoiceActions from './InvoiceActions.component';
import InvoiceHeader from './InvoiceHeader.component';
import type { OptionCallback } from '../../../state/types';

type Props = {
  classes: Object,

  invoice?: Invoice,
  paymentItemList: Array<PaymentItem>,
  invoiceItemList: Array<InvoiceItem>,

  finalizeInvoice: (uuid: string) => void,
  unevenInvoiceAlertOpen: boolean,
  closeUnevenInvoiceDialog: () => void,
  onSubmit: (
    data: {
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
  initialItems?: { withPrivatePass?: string, withCredit?: string },
  t: TFunction,
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
      ...(this.props.invoiceItemList ?? []),
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
      ...(this.props.paymentItemList ?? []),
      ...this.state.paymentItemList,
    ]
      .filter((p) => !!p && !p.reverted && p.payment_received)
      .reduce((acc, v) => acc + parseFloat(v.price), 0);
  };

  invoiceItemIsEmpty = () => {
    return (
      this.state.invoiceItemList.length === 0 &&
      (this.props.invoiceItemList ?? []).length === 0
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
      <Grid container className={classes.container} spacing={1}>
        <Grid item md={8} sm={12} xs={12}>
          <InvoiceHeader invoice={this.props.invoice} />
          <InvoiceContent
            amountInvoiceItem={invoiceItemAmount}
            amountPaymentItem={paymentAmount}
            invoice={this.props.invoice}
            invoiceItemList={[
              ...asEditable(false, this.props.invoiceItemList),
              ...asEditable(true, this.state.invoiceItemList),
            ]}
            isReturningPayment={this.props.isReturningPayment}
            paymentItemList={[
              ...asEditable(false, this.props.paymentItemList),
              ...asEditable(true, this.state.paymentItemList),
            ]}
            removeInvoiceItem={this.removeInvoiceItem}
            removePaymentItem={this.removePaymentItem}
            returnPayment={this.props.returnPayment}
            updatePaymentMethod={this.props.updatePaymentMethod}
          />
        </Grid>
        {/* Historical V1 invoices no longer can take payments (deprecated
        endpoints) nor can they be edited/finalized */}
        {/* <Grid item md={6} xs={12}> */}
        {/* <DEPRECATEDInvoiceEditor */}
        {/*   amountInvoiceItem={invoiceItemAmount} */}
        {/*   amountPaymentItem={paymentAmount} */}
        {/*   availableBuyableItems={this.props.availableBuyableItems} */}
        {/*   detachPaymentMethod={this.props.detachPaymentMethod} */}
        {/*   detachPaymentMethodLoading={this.props.detachPaymentMethodLoading} */}
        {/*   finalizeInvoice={this.props.finalizeInvoice} */}
        {/*   goToSubscription={this.props.goToSubscription} */}
        {/*   invoice={this.props.invoice} */}
        {/*   invoiceHasChanged={ */}
        {/*     this.state.invoiceItemList.length || */}
        {/*     this.state.paymentItemList.length */}
        {/*   } */}
        {/*   invoiceItemIsEmpty={this.invoiceItemIsEmpty()} */}
        {/*   isEquilibrated={paymentAmount === invoiceItemAmount} */}
        {/*   member={this.props.member} */}
        {/*   onAddBuyableItem={this.addBuyableItem} */}
        {/*   onAddPaymentItem={this.addPaymentItem} */}
        {/*   onSubmit={this.onSubmit} */}
        {/*   refreshSavedPaymentMethodList={ */}
        {/*     this.props.refreshSavedPaymentMethodList */}
        {/*   } */}
        {/*   requestSetupIntentSecret={this.props.requestSetupIntentSecret} */}
        {/*   revertInvoice={this.props.revertInvoice} */}
        {/*   savedPaymentMethodList={this.props.savedPaymentMethodList} */}
        {/*   snackbarErrorMsg={this.props.snackbarErrorMsg} */}
        {/*   snackbarSuccessMsg={this.props.snackbarSuccessMsg} */}
        {/* /> */}
        {/* </Grid> */}
        <UnevenInvoiceDialog
          onClose={this.props.closeUnevenInvoiceDialog}
          onSubmit={this.onSubmit}
          open={this.props.unevenInvoiceAlertOpen}
          totalItem={this.getInvoiceItemAmount().toFixed(2)}
          totalPayment={paymentAmount.toFixed(2)}
        />
        <FinalizeInvoiceDialog
          onClose={this.props.closeFinalizeInvoiceDialog}
          onSubmit={() => {
            this.props.finalizeInvoice();
            this.props.closeFinalizeInvoiceDialog();
          }}
          open={this.props.finalizeInvoiceAlertOpen}
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
