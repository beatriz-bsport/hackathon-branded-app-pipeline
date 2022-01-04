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
import {
  PLANNED_PAYMENT_EVENT_STATUS_PENDING,
  PLANNED_PAYMENT_EVENT_STATUS_REGISTERED,
  PLANNED_PAYMENT_EVENT_STATUS_CANCELED,
} from '@bsport/common/lib/master-data/planned-payment-event';
import { INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER } from '@bsport/common/lib/master-data/invoice-type';
import withTitle from '../../hocs/with-title.hoc';
import {
  getInvoice,
  withMember,
  withAuthor,
  withInvoiceItem,
  getPaymentListInInvoice,
  getPlannedPaymentEventList,
  withEstablishment,
} from '../../libs/invoice/selectors';
import {
  getPaymentGroupRequiringActionList,
  getSavedPaymentMethodList,
} from '../../libs/payment/selectors';
import { formatAsDate } from '../../utils/datetime';
import { fetchMember } from '../../libs/member/actions';
import {
  fetchSpecificInvoice as fetchInvoice,
  fetchInvoiceItemList,
  fetchPaymentList as fetchPaymentListAction,
  revertInvoice as revertInvoiceAction,
  finalizeInvoice as finalizeInvoiceAction,
  updatePaymentMethod as updatePaymentMethodAction,
  allocateDebt,
  editCustomFooter as editCustomFooterAction,
  editBillingEstablishment as editBillingEstablishmentAction,
  fetchPlannedPaymentEventList,
  enablePlannedPaymentEvent as enablePlannedPaymentEventAction,
  registerNowPlannedPaymentEvent as registerNowPlannedPaymentEventAction,
  cancelPlannedPaymentEvent as cancelPlannedPaymentEventAction,
  schedulePayment,
} from '../../libs/invoice/actions';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import {
  updatePaymentGroupPriceCts,
  fetchPaymentGroupList as fetchPaymentGroupListAction,
  fetchPaymentMethodList as fetchPaymentMethodListAction,
} from '../../libs/payment/actions';

import { fetchCompanyUserRoles } from '../../libs/role/actions';
import { snackbarSuccess, snackbarWarning } from '../../libs/snackbar/actions';
import InvoiceHeader from '../../libs/invoice/components/InvoiceHeader.component';
import InvoiceContent from '../../libs/invoice/components/InvoiceContent.component';
import InvoicePaymentPanel from '../../libs/invoice/components/InvoicePaymentPanel.component';
import InvoiceReverterDialog from '../../libs/invoice/components/InvoiceReverterDialog.component';
import { requestClientSecret as requestClientSecretAPI } from '../../libs/invoice/api';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';

import PaymentDialog from '../../libs/payment/components/PaymentDialog.component';
import InstalmentPaymentDialog from '../../libs/payment/components/InstalmentPaymentForm.dialog';
import CreditMemberBadge from '../../libs/member/components/CreditMemberBadge.component';
import CheckPermission from '../../libs/role/components/CheckPermission.component';
import type { Establishment } from '../../libs/establishment/types';
import themeSelectors from '../../libs/theme/selectors';
import type { Theme as CompanyThemeType } from '../../libs/theme/types';
import { withMemberBannerHOC } from '../../hocs/banner.hoc';

const PAYMENT_INTENT_STATUS_REQUIRES_ACTION = 150;

type Props = {
  fetchCompanyUserRoles: () => void,
  uuid: string,
  fetchInvoiceItemList: (params: any) => void,
  fetchMember: (number) => void,
  editCustomFooter: (string, OptionCallback) => void,
  fetchPaymentList: (params: any) => void,
  invoice: Invoice,
  openPaymentDialog: () => void,
  paymentLoading: boolean,
  setOpenPaymentDialog: (boolean) => void,
  revertInvoice: (uuid: string) => void,
  classes: any,
  goToSubscription: (id: number) => void,
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
  fetchPlannedPaymentEventList: (params: any) => void,
  updatePaymentMethod: (
    paymentUuid: string,
    newMethod: number,
    options: OptionCallback,
  ) => void,

  plannedPaymentEventList: Array<PlannedPaymentEvent>,

  fetchPaymentGroupRequiringActionList: () => void,
  paymentGroupRequiringActionList: Array<PaymentGroup>,
  payment_method_available_manager: number[],
  updatePaymentGroupPriceCts: (
    paymentGroupId: number,
    priceCts: number,
    options: OptionCallback,
  ) => void,
  registerNowPlannedPaymentEvent: (id: number, options: OptionCallback) => void,
  enablePlannedPaymentEvent: (id: number, options: OptionCallback) => void,
  cancelPlannedPaymentEvent: (id: number, options: OptionCallback) => void,

  isOpenInstalmentPaymentDialog: boolean,
  closeInstalmentPaymentDialog: () => void,
  openInstalmentPaymentDialog: () => void,

  fetchPaymentMethodList: (dat: { member: number }) => void,

  schedulePayment: (
    invoiceUuid: string,
    data: PaymentInstalmentData,
    options: OptionCallback,
  ) => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  fetchEstablishments: () => void,
  establishments: Array<Establishment>,
  editBillingEstablishment: (
    uuid: string,
    estabishmentID: number,
    options: OptionCallback,
  ) => void,
  companyTheme: CompanyThemeType,
  companyId: number,
  snackbarSuccess: (msg: string) => void,
  snackbarWarning: (msg: string) => void,
};

type State = {
  clientSecret: ?string,
  clientSecretLoading: boolean,
  coupon_list: Array<{ coupon_code: string, coupon_voucher: number }>,
  paymentGroupPriceCts: number,
};

export class InvoiceDetail extends React.Component<Props, State> {
  state = {
    clientSecret: null,
    clientSecretLoading: false,
    paymentGroupPriceCts: 0,
  };

  componentDidMount() {
    this.fetchInvoiceData();
    this.props.fetchCompanyUserRoles();
    this.props.fetchEstablishments();
  }

  fetchInvoiceData = () => {
    this.props.fetchInvoice(this.props.uuid, {
      onSuccess: (invoice) => {
        this.props.fetchMember(invoice.member);
        if (invoice.plannedinvoice) {
          this.props.fetchPaymentGroupRequiringActionList();
        }
        this.props.fetchPaymentMethodList({ member: invoice.member });
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
    this.props.fetchPlannedPaymentEventList({
      invoice: this.props.uuid,
      status__in: `${PLANNED_PAYMENT_EVENT_STATUS_PENDING},${PLANNED_PAYMENT_EVENT_STATUS_CANCELED},${PLANNED_PAYMENT_EVENT_STATUS_REGISTERED}`,
    });
  };

  schedulePayment = (data: PaymentInstalmentData, options: OptionCallback) => {
    this.props.schedulePayment(this.props.uuid, data, {
      onSuccess: () => {
        this.fetchInvoiceData();
        if (options && options.onSuccess) options.onSuccess();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
  };

  registerNowPlannedPaymentEvent = (id: number, options: OptionCallback) => {
    this.props.registerNowPlannedPaymentEvent(id, {
      onSuccess: (data) => {
        this.fetchInvoiceData();
        if (options && options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: options && options.onError,
    });
  };

  cancelPlannedPaymentEvent = (id: number, options: OptionCallback) => {
    this.props.cancelPlannedPaymentEvent(id, {
      onSuccess: (data) => {
        this.fetchInvoiceData();
        if (options && options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: options && options.onError,
    });
  };

  enablePlannedPaymentEvent = (id: number, options: OptionCallback) => {
    this.props.enablePlannedPaymentEvent(id, {
      onSuccess: (data) => {
        this.fetchInvoiceData();
        if (options && options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: options && options.onError,
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
        this.handleClientSecretError(err);
      });
  };

  handleClientSecretError = (error: Error) => {
    if (error.response?.data?.error_code) {
      this.props.setOpenPaymentDialog(false);
      this.props.snackbarWarning(
        `clientSecret.errors.${error.response.data.error_code}`,
      );
      this.setState({ clientSecretLoading: false });
    } else {
      this.setState({ clientSecretLoading: false });
    }
  };

  requestSetupIntentSecret = () => {
    return requestSetupIntentSecretAPI(this.props.invoice.member.id);
  };

  onValidatePaymentGroup = (pg: PaymentGroup) => {
    this.setState(
      {
        clientSecret: pg.client_secret,
        paymentGroupId: pg.id,
        paymentGroupPriceCts: pg.price_cts,
        clientSecretLoading: false,
      },
      () => this.props.setOpenPaymentDialog(true),
    );
  };

  updatePaymentGroupPriceCts = (priceCts: number, options: OptionCallback) => {
    this.setState({ clientSecretLoading: true });
    this.props.updatePaymentGroupPriceCts(this.state.paymentGroupId, priceCts, {
      onSuccess: (pg) => {
        this.setState({
          paymentGroupPriceCts: pg.price_cts,
          clientSecretLoading: false,
        });
        if (options && options.onSuccess) options.onSuccess(pg);
      },
      onError: () => {
        this.setState({
          clientSecretLoading: false,
        });
      },
    });
  };

  fetchPaymentMethodList = () =>
    this.props.fetchPaymentMethodList({ member: this.props.invoice.member.id });

  render() {
    return (
      <>
        <div className={this.props.classes.container}>
          <Grid container direction="row">
            <Grid item xs={12} md={6}>
              <InvoiceHeader
                onClickInvoice={this.props.goToInvoice}
                invoice={this.props.invoice}
                establishments={this.props.establishments}
                editBillingEstablishment={this.props.editBillingEstablishment}
                enableMultiLocalization={
                  this.props.companyTheme.enable_multi_localization
                }
              />
              {this.props.invoice.invoice_type !==
                INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER && (
                <InvoiceContent
                  invoice={this.props.invoice}
                  invoiceItemLoading={this.props.invoiceItemLoading}
                  editCustomFooter={this.props.editCustomFooter}
                  invoiceItemList={this.props.invoice.invoice_items.filter(
                    (ii) => !!ii,
                  )}
                  amountInvoiceitem={this.props.invoice.amount_due_cts / 100}
                  finalizeInvoice={this.props.finalizeInvoice}
                  goToSubscription={this.props.goToSubscription}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <InvoicePaymentPanel
                invoice={this.props.invoice}
                paymentList={this.props.paymentList}
                plannedPaymentEventList={this.props.plannedPaymentEventList}
                onValidate={this.onValidatePaymentGroup}
                paymentGroupRequiringActionList={
                  this.props.paymentGroupRequiringActionList
                }
                handleChangeMethod={this.props.updatePaymentMethod}
                onRevert={this.props.openRevertDialog}
                onPaymentIntent={() => this.props.setOpenPaymentDialog(true)}
                onInstalmentPayment={this.props.openInstalmentPaymentDialog}
                paymentLoading={this.props.paymentLoading}
                consumeBalance={this.allocateDebt}
                accountBalanceLoading={this.props.memberLoading}
                accountBalance={
                  this.props.invoice &&
                  this.props.invoice.member &&
                  this.props.invoice.member.credit_account_balance
                }
                plannedPaymentEventActions={{
                  onDisable: this.cancelPlannedPaymentEvent,
                  onEnable: this.enablePlannedPaymentEvent,
                  onRegisterNow: this.registerNowPlannedPaymentEvent,
                }}
                companyId={this.props.companyId}
                snackbarSuccess={this.props.snackbarSuccess}
              />
            </Grid>
            {!!this.props.isOpenInstalmentPaymentDialog && (
              <InstalmentPaymentDialog
                requestSetupIntentSecret={this.requestSetupIntentSecret}
                totalPriceCts={
                  this.props.invoice.amount_due_cts -
                  this.props.invoice.amount_paid_cts
                }
                enabledPaymentGroupMethodIdentifier={[1, 2]}
                availablePaymentMethodList={
                  this.props.payment_method_available_manager
                }
                onClose={this.props.closeInstalmentPaymentDialog}
                savedPaymentMethodList={this.props.savedPaymentMethodList}
                fetchPaymentMethodList={this.fetchPaymentMethodList}
                onSubmit={this.schedulePayment}
              />
            )}

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
                  this.state.clientSecretLoading
                    ? null
                    : this.state.clientSecret
                }
                clientSecretLoading={this.state.clientSecretLoading}
                paymentGroupId={this.state.paymentGroupId}
                termsAndConditionsAccepted
                paymentGroupPriceCts={this.state.paymentGroupPriceCts}
                updatePriceCts={this.updatePaymentGroupPriceCts}
                amountToPay={parseFloat(
                  this.props.invoice.amount_due_cts -
                    this.props.invoice.amount_paid_cts,
                ).toFixed(2)}
                onCancel={() => this.props.setOpenPaymentDialog(false)}
                availablePaymentMethodList={
                  this.props.payment_method_available_manager
                }
                defaultUserName={this.props.invoice.member.name}
                defaultUserEmail={this.props.invoice.member.email}
              />
            )}
          </Grid>
          <InvoiceReverterDialog
            invoice={this.props.invoice}
            payments={this.props.paymentList}
            onSubmit={this.props.revertInvoice}
            open={this.props.revertDialogOpen}
            onClose={this.props.closeRevertDialog}
          />
          <CheckPermission requiredPermissions="member.retrieve">
            {this.props.invoice.member && (
              <div className={this.props.classes.navigationButton}>
                <Grow in={this.props.invoice && this.props.invoice.member}>
                  <CreditMemberBadge
                    credit={this.props.invoice.member.credit_account_balance}
                  >
                    <Fab
                      variant="extended"
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
          </CheckPermission>
        </div>
      </>
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
  withStateHandlers(
    { isOpenInstalmentPaymentDialog: false },
    {
      closeInstalmentPaymentDialog: () => () => {
        return { isOpenInstalmentPaymentDialog: false };
      },
      openInstalmentPaymentDialog: () => () => {
        return { isOpenInstalmentPaymentDialog: true };
      },
    },
  ),
  connect(
    (state, { uuid }) => ({
      invoice: withAuthor(
        withInvoiceItem(withMember(withEstablishment(getInvoice))),
      )(state, uuid),
      memberLoading: state.member.loading,
      paymentList: getPaymentListInInvoice(state, uuid),
      paymentLoading: state.invoice.payment.loading,
      invoiceItemLoading: state.invoice.invoiceItem.loading,
      plannedPaymentEventList: getPlannedPaymentEventList(state, uuid),
      paymentGroupRequiringActionList: getPaymentGroupRequiringActionList(
        state,
        uuid,
      ),
      payment_method_available_manager:
        state.theme.theme.payment_method_available_manager,
      savedPaymentMethodList: getSavedPaymentMethodList(state),

      establishments: getAllEstablishments(state),
      companyTheme: themeSelectors.getTheme(state),
      companyId: state.theme.theme.company,
    }),
    {
      fetchInvoiceItemList,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      fetchInvoice,
      fetchPaymentList: fetchPaymentListAction,
      goToSubscription: (id) => pushRouter(`/subscription/${id}/`),
      fetchPaymentGroupList: fetchPaymentGroupListAction,
      fetchPlannedPaymentEventList,
      fetchMember,
      fetchCompanyUserRoles,
      revertInvoice: revertInvoiceAction,
      goToMemberPage: (id) => pushRouter(`/member/${id}/`),
      goToInvoice: (uuid) => pushRouter(`/invoice/${uuid}/`),
      finalizeInvoice: finalizeInvoiceAction,
      updatePaymentMethod: updatePaymentMethodAction,
      allocateDebt,
      editCustomFooter: editCustomFooterAction,
      updatePaymentGroupPriceCts,
      cancelPlannedPaymentEvent: cancelPlannedPaymentEventAction,
      enablePlannedPaymentEvent: enablePlannedPaymentEventAction,
      registerNowPlannedPaymentEvent: registerNowPlannedPaymentEventAction,
      schedulePayment,
      fetchEstablishments,
      editBillingEstablishment: editBillingEstablishmentAction,
      snackbarSuccess,
      snackbarWarning,
    },
  ),
  withHandlers({
    editCustomFooter:
      ({ editCustomFooter, uuid }) =>
      (customFooter, options) =>
        editCustomFooter(uuid, customFooter, options),
    fetchPaymentGroupRequiringActionList:
      ({ fetchPaymentGroupList, uuid }) =>
      () => {
        return fetchPaymentGroupList({
          invoice: uuid,
          status: PAYMENT_INTENT_STATUS_REQUIRES_ACTION,
        });
      },
    editBillingEstablishment:
      ({ editBillingEstablishment, uuid }) =>
      (establishment_billing_id, options) =>
        editBillingEstablishment(uuid, establishment_billing_id, options),
    updatePaymentMethod:
      ({ updatePaymentMethod }) =>
      (paymentUuid, newMethod, options) =>
        updatePaymentMethod(paymentUuid, newMethod, {
          onSuccess: (payment) => {
            if (options && options.onSuccess) options.onSuccess(payment);
          },
          onError: options && options.onError,
        }),
    finalizeInvoice:
      ({ finalizeInvoice, uuid }) =>
      () =>
        finalizeInvoice(uuid, {
          onSuccess: (invoice) => {
            window.open(invoice.stripe_invoice_pdf);
          },
        }),
    revertInvoice:
      ({ revertInvoice, goToInvoice, uuid }) =>
      (reverse_type, payment_method_to_reverse, options) => {
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
  withMemberBannerHOC(({ invoice }) => invoice.member),
)(InvoiceDetail);
