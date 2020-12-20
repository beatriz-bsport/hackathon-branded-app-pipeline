// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { compose, withHandlers, withState, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
import Fab from '@material-ui/core/Fab';
import PersonIcon from '@material-ui/icons/Person';
import { push as pushRouter } from 'connected-react-router';
import { PAYMENT_INTENT_TYPE_INVOICE } from '@bsport/common/lib/master-data/payment-group';
import withTitle from '../../hocs/with-title.hoc';
import {
  getInvoice,
  withMember,
  withAuthor,
  withInvoiceItem,
  getPaymentListInInvoice,
} from '../../libs/invoice/selectors';
import { getPermissions } from '../../libs/role/selectors';
import { formatAsDate } from '../../datetime';
import { fetchMember } from '../../libs/member/actions';
import {
  fetchSpecificInvoice as fetchInvoice,
  fetchInvoiceItemList,
  fetchPaymentList as fetchPaymentListAction,
  revertInvoice as revertInvoiceAction,
  finalizeInvoice as finalizeInvoiceAction,
  updatePaymentMethod as updatePaymentMethodAction,
  allocateDebt,
} from '../../libs/invoice/actions';
import { fetchCompanyRoles } from '../../libs/role/actions';

import InvoiceHeader from '../../libs/invoice/components/InvoiceHeader.component';
import InvoiceContent from '../../libs/invoice/components/InvoiceContent.component';
import InvoicePaymentPanel from '../../libs/invoice/components/InvoicePaymentPanel.component';
import InvoiceReverterDialog from '../../libs/invoice/components/InvoiceReverterDialog.component';
import { requestClientSecret as requestClientSecretAPI } from '../../libs/invoice/api';

import PaymentDialog from '../../libs/payment/components/PaymentDialog.component';
import CreditMemberBadge from '../../libs/member/components/CreditMemberBadge.component';

type Props = {
  fetchCompanyRoles: () => void,
  uuid: string,
  fetchInvoiceItemList: (params: any) => void,
  fetchMember: (number) => void,
  fetchPaymentList: (params: any) => void,
  invoice: Invoice,
  openPaymentDialog: () => void,
  paymentLoading: boolean,
  setOpenPaymentDialog: (boolean) => void,
  permission: Permission,
  revertInvoice: (uuid: string) => void,
  classes: any,
  paymentList: Array<Payment>,
  fetchInvoice: (string, OptionCallback) => void,
  goToInvoice: (uuid: string) => void,
  goToMemberPage: (number) => void,
  memberLoading: boolean,
  revertDialogOpen: boolean,
  closeRevertDialog: () => void,
  openRevertDialog: () => void,
  invoiceItemLoading: boolean,
  finalizeInvoice: (string) => void,
  allocateDebt: (uuid: string) => void,
  updatePaymentMethod: (
    paymentUuid: string,
    newMethod: number,
    options: OptionCallback,
  ) => void,
};

type State = {
  clientSecret: ?string,
  clientSecretLoading: boolean,
};

export class InvoiceDetail extends React.Component<Props, State> {
  state = { clientSecret: null, clientSecretLoading: false };

  componentDidMount() {
    this.fetchInvoiceData();
    this.props.fetchCompanyRoles();
  }

  fetchInvoiceData = () => {
    this.props.fetchInvoice(this.props.uuid, {
      onSuccess: (invoice) => {
        this.props.fetchMember(invoice.member);
      },
    });
    this.props.fetchInvoiceItemList({
      invoice__uuid: this.props.uuid,
      page_size: 100,
    });
    this.props.fetchPaymentList({
      invoice__uuid: this.props.uuid,
      page_size: 100,
    });
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.uuid !== this.props.uuid) {
      this.fetchInvoiceData();
    }
  }

  allocateDebt = (options) => {
    this.props.allocateDebt(this.props.uuid, {
      onSuccess: () => {
        this.fetchInvoiceData();
        if (options && options.onSuccess) options.onSuccess();
      },
      onError: () => {
        this.fetchInvoiceData();
        if (options && options.onError) options.onError();
      },
    });
  };

  requestClientSecret = (paymentEngine: number) => {
    this.setState({ clientSecretLoading: true });
    requestClientSecretAPI(paymentEngine, PAYMENT_INTENT_TYPE_INVOICE, {
      invoice: this.props.uuid,
    })
      .then((r) => {
        this.setState({
          clientSecret: r.data.client_secret,
          paymentGroupId: r.data.payment_group,
          paymentGroupPriceCts: r.data.price_cts,
          clientSecretLoading: false,
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ clientSecretLoading: false });
      });
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <Grid container direction="row">
          <Grid item xs={12} md={6}>
            <InvoiceHeader
              onClickInvoice={this.props.goToInvoice}
              invoice={this.props.invoice}
            />
            <InvoiceContent
              invoice={this.props.invoice}
              invoiceItemLoading={this.props.invoiceItemLoading}
              invoiceItemList={this.props.invoice.invoice_items.filter(
                (ii) => !!ii,
              )}
              amountInvoiceitem={this.props.invoice.amount_due_cts / 100}
              finalizeInvoice={this.props.finalizeInvoice}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InvoicePaymentPanel
              invoice={this.props.invoice}
              paymentList={this.props.paymentList}
              handleChangeMethod={this.props.updatePaymentMethod}
              onRevert={this.props.openRevertDialog}
              onPaymentIntent={() => this.props.setOpenPaymentDialog(true)}
              paymentLoading={this.props.paymentLoading}
              consumeBalance={this.allocateDebt}
              accountBalanceLoading={this.props.memberLoading}
              accountBalance={
                this.props.invoice &&
                this.props.invoice.member &&
                this.props.invoice.member.credit_account_balance
              }
            />
          </Grid>
          {!!this.props.openPaymentDialog && (
            <PaymentDialog
              memberId={this.props.invoice.member.id}
              onError={() =>
                setTimeout(() => {
                  this.props.fetchPaymentList({
                    invoice__uuid: this.props.uuid,
                    page_size: 100,
                  });
                }, 2000)
              }
              onSuccess={(callback) => {
                setTimeout(() => {
                  this.props.setOpenPaymentDialog(false);
                  this.fetchInvoiceData();
                  if (typeof callback === 'function') callback();
                }, 2000);
              }}
              requestClientSecret={this.requestClientSecret}
              clientSecret={
                this.state.clientSecretLoading ? null : this.state.clientSecret
              }
              clientSecretLoading={this.state.clientSecretLoading}
              paymentGroupId={this.state.paymentGroupId}
              paymentGroupPriceCts={this.state.paymentGroupPriceCts}
              amountToPay={parseFloat(
                this.props.invoice.amount_due_cts -
                  this.props.invoice.amount_paid_cts,
              ).toFixed(2)}
              onCancel={() => this.props.setOpenPaymentDialog(false)}
            />
          )}
        </Grid>
        <InvoiceReverterDialog
          invoice={this.props.invoice}
          onSubmit={this.props.revertInvoice}
          open={this.props.revertDialogOpen}
          onClose={this.props.closeRevertDialog}
        />
        {this.props.permission.member.retrieve && this.props.invoice.member && (
          <div className={this.props.classes.navigationButton}>
            <Grow in={this.props.invoice && this.props.invoice.member}>
              <CreditMemberBadge
                credit={this.props.invoice.member.credit_account_balance}
              >
                <Fab
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    this.props.goToMemberPage(this.props.invoice.member.id)
                  }
                >
                  <PersonIcon />
                  <Hidden xsDown>
                    <span className={this.props.classes.rightText}>
                      {this.props.invoice.member.name}
                    </span>
                  </Hidden>
                </Fab>
              </CreditMemberBadge>
            </Grow>
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(10),
  },
  navigationButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(4),
  },
  rightText: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['invoice']),
  withStyles(styles),
  withState('openPaymentDialog', 'setOpenPaymentDialog', false),
  withStateHandlers(
    { revertDialogOpen: false },
    {
      closeRevertDialog: () => () => {
        return { revertDialogOpen: false };
      },
      openRevertDialog: () => () => {
        return { revertDialogOpen: true };
      },
    },
  ),
  connect(
    (state, { uuid }) => ({
      invoice: withAuthor(withInvoiceItem(withMember(getInvoice)))(state, uuid),
      memberLoading: state.member.loading,
      paymentList: getPaymentListInInvoice(state, uuid),
      paymentLoading: state.invoice.payment.loading,
      invoiceItemLoading: state.invoice.invoiceItem.loading,
      permission: getPermissions(state),
    }),
    {
      fetchInvoiceItemList,
      fetchInvoice,
      fetchPaymentList: fetchPaymentListAction,
      fetchMember,
      fetchCompanyRoles,
      revertInvoice: revertInvoiceAction,
      goToMemberPage: (id) => pushRouter(`/member/${id}/`),
      goToInvoice: (uuid) => pushRouter(`/invoice/${uuid}/`),
      finalizeInvoice: finalizeInvoiceAction,
      updatePaymentMethod: updatePaymentMethodAction,
      allocateDebt,
    },
  ),
  withHandlers({
    updatePaymentMethod: ({ updatePaymentMethod }) => (
      paymentUuid,
      newMethod,
      options,
    ) =>
      updatePaymentMethod(paymentUuid, newMethod, {
        onSuccess: (payment) => {
          if (options && options.onSuccess) options.onSuccess(payment);
        },
        onError: options && options.onError,
      }),
    finalizeInvoice: ({ finalizeInvoice, uuid }) => () =>
      finalizeInvoice(uuid, {
        onSuccess: (invoice) => {
          window.open(invoice.stripe_invoice_pdf);
        },
      }),
    revertInvoice: ({ revertInvoice, goToInvoice, uuid }) => (
      reverse_type,
      payment_method_to_reverse,
      options,
    ) => {
      revertInvoice(
        uuid,
        {
          reverse_type,
          payment_method_to_reverse,
        },
        {
          onSuccess: (invoice) => {
            goToInvoice(
              invoice.reverse_invoices[invoice.reverse_invoices.length - 1],
            );
            if (options && options.onSuccess) {
              options.onSuccess(invoice);
            }
          },
          onError: options && options.onError,
        },
      );
    },
  }),
  withTitle(
    ({ t, uuid, invoice }) =>
      `${t('titles:invoice.invoiceEdit')} - ${
        uuid ? uuid.slice(0, 8).toUpperCase() : ''
      } - ${invoice && invoice.date ? formatAsDate(invoice.date) : ''}`,
  ),
)(InvoiceDetail);
