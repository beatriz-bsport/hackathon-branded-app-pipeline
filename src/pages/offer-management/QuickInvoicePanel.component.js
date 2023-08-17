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
import type { Establishment } from '../../libs/establishment/types';
import type { Member } from '#libs/member/types';
import type { Invoice } from '#libs/invoice/types';
import type { ConsumerGiftcard, Giftcard } from '#libs/giftcard/types';
import type { OptionCallback } from '../../state/types';
import type { StripeReader } from '#libs/terminal/types';

type Props = {
  classes: Object,
  t: TFunction,
  unevenSavedInvoices: Array<Invoice>,
  quickInvoices: Array<Invoice>,
  createInvoice: (InvoiceData: Invoice) => void,
  closeQuickInvoice: (memberId: number) => void,
  availableBuyableItems: { [buyable_item_identifier: number]: BuyableItem },
  invoiceToBill: Array<Invoice>,
  setInvoiceToBill: (invoice: ?Invoice) => void,
  refreshInvoice: () => void,
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

  render() {
    const {
      classes,
      t,
      unevenSavedInvoices,
      quickInvoices,
      createInvoice,
      closeQuickInvoice,
      className,
    } = this.props;

    return (
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
              createInvoice={createInvoice}
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
        {unevenSavedInvoices && unevenSavedInvoices.length ? (
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
              invoiceList={unevenSavedInvoices}
              onBill={this.props.setInvoiceToBill}
              snackbarSuccess={this.props.snackbarSuccess}
            />
          </React.Fragment>
        ) : null}
        {!!this.props.invoiceToBill && !!this.props.invoiceToBill.member && (
          <PaymentDialog
            termsAndConditionsAccepted
            amountToPay={parseFloat(
              this.props.invoiceToBill.amount_due_cts -
                this.props.invoiceToBill.amount_paid_cts,
            ).toFixed(2)}
            availablePaymentMethodList={this.props.availablePaymentMethodList}
            cardBillingDetailsMandatory={this.props.cardBillingDetailsMandatory}
            clientSecret={
              this.state.clientSecretLoading ? null : this.state.clientSecret
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
          />
        )}
      </Paper>
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
