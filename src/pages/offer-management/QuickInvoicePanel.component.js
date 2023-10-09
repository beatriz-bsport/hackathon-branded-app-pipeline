// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withTranslation, TFunction } from 'react-i18next';
import { PAYMENT_INTENT_TYPE_INVOICE } from '@bsport/common/lib/master-data/payment-group';
import QuickInvoice from '../../libs/invoice/quick-invoice/QuickInvoice.component';
import PaymentDialog from '../../libs/payment/components/PaymentDialog.component';
import InvoiceTable from '../../libs/invoice/components/InvoiceTable.component';
import { requestClientSecret as requestClientSecretAPI } from '../../libs/invoice/api';
import ObjectLevelPermissionProvider from '../../libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type { Establishment } from '../../libs/establishment/types';
import type { Member } from '#libs/member/types';
import type { Invoice } from '#libs/invoice/types';
import type { ConsumerGiftcard, Giftcard } from '#libs/giftcard/types';
import type {
  OptionCallback,
  OptionBackgroundCallback,
} from '../../state/types';
import type { StripeReader } from '#libs/terminal/types';
import { InternalPaymentPayload } from '../../libs/payment/types';

type Props = {
  classes: Object,
  t: TFunction,
  unevenSavedInvoices: Array<Invoice>,
  quickInvoices: Array<Invoice>,
  createInvoice: (InvoiceData: Invoice, options: OptionCallback) => void,
  closeQuickInvoice: (memberId: number) => void,
  availableBuyableItems: { [buyable_item_identifier: number]: BuyableItem },
  invoiceToBill: Invoice,
  setInvoiceToBill: (invoice: ?Invoice) => void,
  refreshInvoice: (invoiceUuid: string) => void,
  availablePaymentMethodList: number[],
  className: {},
  establishments: Array<Establishment>,
  snackbarSuccess: (string) => void,
  stripeId: string | null,
  companyId: number,
  memberDetails: { [id: number]: Member },
  consumerGiftcardList: Array<ConsumerGiftcard<Giftcard>>,
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void,
  onlinePaymentEnabled: boolean,
  enableMultiLocalization: boolean,
  stripeReaders: StripeReader[],
  cardBillingDetailsMandatory: boolean,
  getInvoicePaymentGroupIsProcessing?: (invoiceUuid: string) => void,
  submitInternalPaymentInBackground: (
    paymentGroupId: number,
    invoiceUuid: string,
    data: InternalPaymentPayload,
    options?: OptionBackgroundCallback<
      { paymentGroupId: number, invoiceUuid: string },
      { paymentGroupId: number, invoiceUuid: string },
    >,
  ) => void,
};

type State = {
  clientSecretLoading: boolean,
  clientSecret: ?string,
  paymentGroupId: ?number,
  paymentGroupPriceCts: ?number,
};

export class QuickInvoicePanel extends React.PureComponent<Props, State> {
  state = {
    clientSecretLoading: false,
    clientSecret: null,
    paymentGroupId: null,
    paymentGroupPriceCts: null,
  };

  requestClientSecret = (paymentEngine: number, params?: any) => {
    this.setState({ clientSecretLoading: true });
    requestClientSecretAPI(paymentEngine, PAYMENT_INTENT_TYPE_INVOICE, {
      invoice: this.props.invoiceToBill.uuid,
      ...(params || {}),
    })
      .then((r) => {
        this.setState({
          clientSecret: r.data.client_secret,
          clientSecretLoading: false,
          paymentGroupId: r.data.payment_group,
          paymentGroupPriceCts: r.data.price_cts,
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ clientSecretLoading: false });
      });
  };

  handleCreateInvoiceAndOpenBillingModal = (
    InvoiceData: Invoice,
    options: OptionCallback,
  ) => {
    this.props.createInvoice(InvoiceData, {
      onSuccess: (invoice: Invoice) => {
        if (options && options.onSuccess) options.onSuccess?.();
        this.props.setInvoiceToBill(invoice);
      },
      onError: () => {
        if (options && options.onError) options.onError?.();
      },
    });
  };

  submitInternalPaymentInBackground = (
    data: InternalPaymentPayload,
    options?: OptionBackgroundCallback<
      { paymentGroupId: number, invoiceUuid: string },
      { paymentGroupId: number, invoiceUuid: string },
    >,
  ) => {
    if (
      this.props.invoiceToBill &&
      this.props.invoiceToBill.uuid &&
      this.state.paymentGroupId
    ) {
      const invoiceUuid = this.props.invoiceToBill.uuid;
      this.props.submitInternalPaymentInBackground(
        this.state.paymentGroupId,
        this.props.invoiceToBill.uuid,
        data,
        {
          onSuccess: () => {
            this.props.setInvoiceToBill(null);
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
          onBackgroundSuccess: () => {
            this.props.refreshInvoice(invoiceUuid);
            if (options && options.onBackgroundSuccess)
              options.onBackgroundSuccess();
          },
          onBackgroundError: () => {
            if (options && options.onBackgroundError)
              options.onBackgroundError();
          },
        },
      );
    }
  };

  render() {
    const {
      classes,
      t,
      unevenSavedInvoices,
      quickInvoices,
      closeQuickInvoice,
      className,
    } = this.props;

    return (
      <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.readInvoices">
        {(hasReadInvoicePermission) => (
          <Paper className={className}>
            <Typography className={classes.bookingsHeader} variant="h6">
              {t('offer.myOpenedInvoices')}
            </Typography>
            <Divider />
            {quickInvoices.length ? (
              quickInvoices.map((qi, idx) => (
                <QuickInvoice
                  key={`${qi.memberId}:${idx}`}
                  availableBuyableItems={this.props.availableBuyableItems}
                  createInvoice={this.handleCreateInvoiceAndOpenBillingModal}
                  enableMultiLocalization={this.props.enableMultiLocalization}
                  establishments={this.props.establishments}
                  member={qi.member}
                  memberCreditAccountBalance={qi.creditAccount || 0.0}
                  memberDetails={this.props.memberDetails}
                  onClose={closeQuickInvoice}
                  quickInvoice={qi}
                  quickInvoiceTitle={qi.memberName}
                />
              ))
            ) : (
              <div className={classes.emptyTextContainer}>
                <Typography color="textSecondary" variant="caption">
                  {t('offer.noQuickInvoiceOpened')}
                </Typography>
              </div>
            )}
            {hasReadInvoicePermission &&
            unevenSavedInvoices &&
            unevenSavedInvoices.length ? (
              <React.Fragment>
                <Typography className={classes.bookingsHeader} variant="h6">
                  {t('offer.unpaidInvoices')}
                </Typography>
                <Divider />
                <InvoiceTable
                  compactMode
                  hidePagination
                  showOpenInvoiceNested
                  applyGiftcardOnInvoice={this.props.applyGiftcardOnInvoice}
                  companyId={this.props.companyId}
                  consumerGiftcardList={this.props.consumerGiftcardList}
                  getInvoicePaymentGroupIsProcessing={
                    this.props.getInvoicePaymentGroupIsProcessing
                  }
                  invoiceList={unevenSavedInvoices}
                  onBill={this.props.setInvoiceToBill}
                  snackbarSuccess={this.props.snackbarSuccess}
                />
              </React.Fragment>
            ) : null}
            {!!this.props.invoiceToBill &&
              !!this.props.invoiceToBill.member && (
                <PaymentDialog
                  termsAndConditionsAccepted
                  amountToPay={parseFloat(
                    this.props.invoiceToBill.amount_due_cts -
                      this.props.invoiceToBill.amount_paid_cts,
                  ).toFixed(2)}
                  availablePaymentMethodList={
                    this.props.availablePaymentMethodList
                  }
                  cardBillingDetailsMandatory={
                    this.props.cardBillingDetailsMandatory
                  }
                  clientSecret={
                    this.state.clientSecretLoading
                      ? null
                      : this.state.clientSecret
                  }
                  clientSecretLoading={this.state.clientSecretLoading}
                  companyId={this.props.companyId}
                  defaultUserEmail={this.props.invoiceToBill.member.email}
                  defaultUserName={this.props.invoiceToBill.member.name}
                  memberId={
                    (this.props.invoiceToBill.member &&
                      this.props.invoiceToBill.member.id) ||
                    this.props.invoiceToBill.member
                  }
                  onCancel={() => this.props.setInvoiceToBill(null)}
                  onError={() => {}}
                  onlyInternal={!this.props.onlinePaymentEnabled}
                  onSuccess={(callback) => {
                    setTimeout(() => {
                      this.props.refreshInvoice(this.props.invoiceToBill.uuid);
                      this.props.setInvoiceToBill(null);
                      if (typeof callback === 'function') callback();
                    }, 3000);
                  }}
                  paymentGroupId={this.state.paymentGroupId}
                  paymentGroupPriceCts={this.state.paymentGroupPriceCts}
                  requestClientSecret={this.requestClientSecret}
                  stripeId={this.props.stripeId}
                  stripeReaders={this.props.stripeReaders}
                  submitInternalPaymentInBackground={
                    this.submitInternalPaymentInBackground
                  }
                />
              )}
          </Paper>
        )}
      </ObjectLevelPermissionProvider>
    );
  }
}

const styles = (theme) => ({
  bookingsHeader: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  emptyTextContainer: {
    padding: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(),
  withState('invoiceToBill', 'setInvoiceToBill', null),
)(QuickInvoicePanel);
