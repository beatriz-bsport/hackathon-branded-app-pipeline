// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { PAYMENT_INTENT_TYPE_INVOICE } from '@bsport/common/lib/master-data/payment-group';
import QuickInvoice from '../../libs/invoice/quick-invoice/QuickInvoice.component';
import PaymentDialog from '../../libs/payment/components/PaymentDialog.component';
import InvoiceTable from '../../libs/invoice/components/InvoiceTable.component';
import { requestClientSecret as requestClientSecretAPI } from '../../libs/invoice/api';

type Props = {
  classes: Object,
  t: TFunction,
  unevenSavedInvoices: Array<Invoice>,
  quickInvoices: Array<Invoice>,
  createInvoice: (InvoiceData) => void,
  closeQuickInvoice: (memberId: number) => void,
  availableBuyableItems: { [buyable_item_identifier: number]: BuyableItem },
  invoiceToBill: Array<Invoice>,
  setInvoiceToBill: (?Invoice) => void,
  refreshInvoice: () => void,
  availablePaymentMethodList: number[],
  className: {},
};

type State = {
  clientSecretLoading: boolean,
  clientSecret: ?strin,
  paymentGroupId: ?number,
  paymentGroupPriceCts: ?number,
};

export class QuickInvoicePanel extends React.Component<Props, State> {
  state = {
    clientSecretLoading: false,
    clientSecret: null,
    paymentGroupId: null,
    paymentGroupPriceCts: null,
  };

  requestClientSecret = (paymentEngine) => {
    this.setState({ clientSecretLoading: true });
    requestClientSecretAPI(paymentEngine, PAYMENT_INTENT_TYPE_INVOICE, {
      invoice: this.props.invoiceToBill.uuid,
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
          quickInvoices.map((qi) => (
            <QuickInvoice
              memberCreditAccountBalance={qi.creditAccount || 0.0}
              member={qi.member}
              quickInvoiceTitle={qi.memberName}
              key={qi.memberId}
              quickInvoice={qi}
              availableBuyableItems={this.props.availableBuyableItems}
              onClose={() => closeQuickInvoice(qi.memberId, qi)}
              createInvoice={createInvoice}
            />
          ))
        ) : (
          <div className={classes.emptyTextContainer}>
            <Typography variant="caption" color="textSecondary">
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
              showOpenInvoiceNested
              hidePagination
              onBill={this.props.setInvoiceToBill}
              invoiceList={unevenSavedInvoices}
            />
          </React.Fragment>
        ) : null}
        {!!this.props.invoiceToBill && !!this.props.invoiceToBill.member && (
          <PaymentDialog
            termsAndConditionsAccepted
            memberId={
              (this.props.invoiceToBill.member &&
                this.props.invoiceToBill.member.id) ||
              this.props.invoiceToBill.member
            }
            onError={() => {}}
            onSuccess={(callback) => {
              setTimeout(() => {
                this.props.refreshInvoice(this.props.invoiceToBill.uuid);
                this.props.setInvoiceToBill(null);
                if (typeof callback === 'function') callback();
              }, 3000);
            }}
            requestClientSecret={this.requestClientSecret}
            paymentGroupId={this.state.paymentGroupId}
            paymentGroupPriceCts={this.state.paymentGroupPriceCts}
            clientSecret={
              this.state.clientSecretLoading ? null : this.state.clientSecret
            }
            clientSecretLoading={this.state.clientSecretLoading}
            amountToPay={parseFloat(
              this.props.invoiceToBill.amount_due_cts -
                this.props.invoiceToBill.amount_paid_cts,
            ).toFixed(2)}
            onCancel={() => this.props.setInvoiceToBill(null)}
            availablePaymentMethodList={this.props.availablePaymentMethodList}
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
