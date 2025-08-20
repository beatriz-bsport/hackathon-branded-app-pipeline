// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withTranslation, TFunction } from 'react-i18next';
import { PAYMENT_INTENT_TYPE_INVOICE } from '@bsport/common/lib/master-data/payment-group.js';
import { Collapse, ButtonBase } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import clsx from 'clsx';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import type { Member } from '#src/libs/member/types';
import type { Invoice } from '#src/libs/invoice/types';
import type { ConsumerGiftcard, Giftcard } from '#src/libs/giftcard/types';
import type { StripeReader } from '#src/libs/terminal/types';
import QuickInvoice from '../../libs/invoice/quick-invoice/QuickInvoice.component';
import PaymentDialog from '../../libs/payment/components/PaymentDialog.component';
import InvoiceTable from '../../libs/invoice/components/InvoiceTable.component';
import { requestClientSecret as requestClientSecretAPI } from '../../libs/invoice/api';
import ObjectLevelPermissionProvider from '../../libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type {
  OptionCallback,
  OptionBackgroundCallback,
} from '../../state/types';
import { InternalPaymentPayload } from '../../libs/payment/types';
import { TEMPORARY_AMOUNT_TO_FORCE_INTERNAL_PAYMENT_CTS } from '../../libs/invoice/constants';

type Props = {
  classes: Object,
  t: TFunction,
  unevenSavedInvoices: Array<Invoice>,
  quickInvoices: Array<Invoice>,
  createInvoice: (InvoiceData: Invoice, options: OptionCallback) => void,
  closeQuickInvoice: (memberId: number) => void,
  availableBuyableItems: { [buyable_item_identifier: number]: BuyableItem },
  invoiceToBill: Invoice,
  setInvoiceToBill: (invoice?: Invoice) => void,
  refreshInvoice: (invoiceUuid: string) => void,
  availablePaymentMethodList: number[],
  className: {},
  establishmentBillingGroups: Array<EstablishmentBillingGroup>,
  snackbarSuccess: (string) => void,
  stripePaymentElementConfig: StripePaymentElementConfig,
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
  displayNewWebshop: boolean,
  isCustomDiscountReasonRequired: boolean,
  panelRef?: React.RefObject<any>,
};

type State = {
  clientSecretLoading: boolean,
  clientSecret?: string,
  paymentGroupId?: number,
  paymentGroupPriceCts?: number,
  isOpen: boolean,
};

export class QuickInvoicePanel extends React.PureComponent<Props, State> {
  state = {
    clientSecretLoading: false,
    clientSecret: null,
    paymentGroupId: null,
    paymentGroupPriceCts: null,
    isOpen: false,
  };

  componentDidUpdate = (prevProps) => {
    if (
      (this.props.quickInvoices?.length ||
        this.props.unevenSavedInvoices?.length) &&
      (prevProps.quickInvoices?.length !== this.props.quickInvoices?.length ||
        prevProps.unevenSavedInvoices?.length !==
          this.props.unevenSavedInvoices?.length)
    ) {
      this.setIsOpen(true);
    }
    if (
      this.props.invoiceToBill &&
      this.props.invoiceToBill?.uuid !== prevProps.invoiceToBill?.uuid
    ) {
      this.setState({
        paymentGroupPriceCts: this.props.invoiceToBill.amount_due_cts,
      });
    }
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

  setIsOpen = (value: boolean) => this.setState({ isOpen: value });

  toggleIsOpen = () =>
    this.setState(({ isOpen: previousValue }) => ({ isOpen: !previousValue }));

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
          <Paper
            ref={this.props.panelRef}
            className={clsx(classes.root, className)}
          >
            <ButtonBase
              className={classes.titleContainer}
              onClick={this.toggleIsOpen}
            >
              <Typography variant="h6">
                {t('offer.myOpenedInvoices')}
              </Typography>
              {this.state.isOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </ButtonBase>
            <Divider />
            <Collapse in={this.state.isOpen}>
              <div className={classes.marginTop}>
                {quickInvoices?.length ? (
                  quickInvoices.map((quickInvoice, index) => (
                    <QuickInvoice
                      key={`${quickInvoice.memberId}:${index}`}
                      availableBuyableItems={this.props.availableBuyableItems}
                      createInvoice={
                        this.handleCreateInvoiceAndOpenBillingModal
                      }
                      displayNewWebshop={!!this.props?.displayNewWebshop}
                      enableMultiLocalization={
                        this.props.enableMultiLocalization
                      }
                      establishmentBillingGroups={
                        this.props.establishmentBillingGroups
                      }
                      isCustomDiscountReasonRequired={
                        this.props.isCustomDiscountReasonRequired
                      }
                      member={quickInvoice.member}
                      memberCreditAccountBalance={
                        quickInvoice.creditAccount || 0.0
                      }
                      memberDetails={this.props.memberDetails}
                      onClose={closeQuickInvoice}
                      quickInvoice={quickInvoice}
                      quickInvoiceTitle={quickInvoice.memberName}
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
                  !!unevenSavedInvoices?.length && (
                    <React.Fragment>
                      <Typography
                        className={classes.bookingsHeader}
                        variant="h6"
                      >
                        {t('offer.unpaidInvoices')}
                      </Typography>
                      <Divider />
                      <InvoiceTable
                        compactMode
                        hidePagination
                        showOpenInvoiceNested
                        applyGiftcardOnInvoice={
                          this.props.applyGiftcardOnInvoice
                        }
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
                  )}
              </div>
            </Collapse>
            {!!this.props.invoiceToBill &&
              !!this.props.invoiceToBill.member &&
              !!this.props.invoiceToBill.amount_due_cts && (
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
                  onlyInternal={
                    !this.props.onlinePaymentEnabled ||
                    this.props.invoiceToBill.amount_due_cts <
                      TEMPORARY_AMOUNT_TO_FORCE_INTERNAL_PAYMENT_CTS
                  }
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
                  stripePaymentElementConfig={
                    this.props.stripePaymentElementConfig
                  }
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
  root: { padding: theme.spacing(2) },
  bookingsHeader: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(),
  withState('invoiceToBill', 'setInvoiceToBill', null),
)(QuickInvoicePanel);
