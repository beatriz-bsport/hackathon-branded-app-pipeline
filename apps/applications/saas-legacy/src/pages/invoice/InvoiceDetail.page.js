// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { compose, withHandlers, withState, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { TFunction, withTranslation } from 'react-i18next';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
import Fab from '@material-ui/core/Fab';
import PersonIcon from '@material-ui/icons/Person';
import { push as pushRouter } from 'connected-react-router';
import { PAYMENT_INTENT_TYPE_INVOICE } from '@bsport/common/lib/master-data/payment-group.js';
import { INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER } from '@bsport/common/lib/master-data/invoice-type.js';
import withTitle from '#src/hocs/with-title.hoc';
import {
  getInvoice,
  withMember,
  withAuthor,
  withInvoiceItem,
  getPaymentListInInvoice,
  getPlannedPaymentEventList,
  withEstablishment,
  withEstablishmentBillingGroup,
  getEditEstablishmentBillingGroupIsLoading,
  getInvoiceMemberFullDetail,
} from '#src/libs/invoice/selectors';
import {
  getPaymentGroupRequiringActionList,
  getSavedPaymentMethodList,
  getStripeBalanceTotal,
} from '#src/libs/payment/selectors';
import {
  fetchMember,
  fetchMemberBulkById as fetchMemberBulkByIdAction,
} from '#src/libs/member/actions';
import { refreshCompanyTheme } from '#src/libs/theme/actions';
import {
  fetchSpecificInvoice as fetchInvoiceAction,
  fetchInvoiceItemList,
  fetchPaymentList as fetchPaymentListAction,
  revertInvoice as revertInvoiceAction,
  finalizeInvoice as finalizeInvoiceAction,
  updatePaymentMethod as updatePaymentMethodAction,
  allocateDebt,
  editCustomFooter as editCustomFooterAction,
  editEstablishmentBillingGroup as editEstablishmentBillingGroupAction,
  fetchPlannedPaymentEventList,
  enablePlannedPaymentEvent as enablePlannedPaymentEventAction,
  registerNowPlannedPaymentEvent as registerNowPlannedPaymentEventAction,
  cancelPlannedPaymentEvent as cancelPlannedPaymentEventAction,
  changePaymentMethodAndRegisterPlannedPaymentEvent,
  schedulePayment,
  applyGiftcardOnInvoice as applyGiftcardOnInvoiceAction,
  fetchInvoiceConfiguration as fetchInvoiceConfigurationAction,
} from '#src/libs/invoice/actions';
import {
  fetchEstablishments,
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
} from '#src/libs/establishment/actions';
import { fetchStripeReaders } from '#src/libs/terminal/actions';
import { getEnabledEstablishmentBillingGroups } from '#src/libs/establishment/selectors';
import { getStripeReaders } from '#src/libs/terminal/selectors';
import {
  updatePaymentGroupPriceCts,
  fetchPaymentGroupList as fetchPaymentGroupListAction,
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  fetchStripeBalance as fetchStripeBalanceAction,
  detachPaymentMethod,
} from '#src/libs/payment/actions';

import { fetchCompanyUserRoles } from '#src/libs/role/actions';
import {
  snackbarSuccess,
  snackbarWarning,
  snackbarError,
} from '#src/libs/snackbar/actions';
import InvoiceHeader from '#src/libs/invoice/components/InvoiceHeader.component';
import InvoiceContent from '#src/libs/invoice/components/InvoiceContent.component';
import InvoicePaymentPanel from '#src/libs/invoice/components/InvoicePaymentPanel.component';
import InvoiceReverterDialog from '#src/libs/invoice/components/InvoiceReverterDialog.component';
import PlannedPaymentEventMethodSwitcherDialog from '#src/libs/invoice/dialog/PlannedPaymentEventMethodSwitcherDialog.component';
import { requestClientSecret as requestClientSecretAPI } from '#src/libs/invoice/api';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#src/libs/payment/api';

import PaymentDialog from '#src/libs/payment/components/PaymentDialog.component';
import InstalmentPaymentDialog from '#src/libs/payment/components/InstalmentPaymentForm.dialog';
import CreditMemberBadge from '#src/libs/member/components/CreditMemberBadge.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import themeSelectors, {
  getStripeRegion,
  getCompanyCountry,
} from '#src/libs/theme/selectors';
import { withMemberBannerHOC } from '#src/hocs/banner.hoc';
import {
  fetchGiftcardBulk as fetchGiftcardBulkAction,
  fetchConsumerGiftcardReceivedList as fetchConsumerGiftcardReceivedListAction,
  fetchConsumerGiftcardList as fetchConsumerGiftcardListAction,
  attributeByPrintableCode as attributeByPrintableCodeAction,
} from '#src/libs/giftcard/actions';
import {
  getConsumerGiftcardReceivedList,
  withGiftcard,
  withSender,
  withReceiver,
  onlyUsable,
  getConsumerGiftcard,
} from '#src/libs/giftcard/selectors';
import { getBackofficeEnabledPaymentGroupMethods } from '#src/libs/payment/utils';
import { withDefaultBillingEstablishment } from '#src/libs/member/selectors';
import { getInvoiceIdentifier } from '#src/libs/invoice/utils';
import RevalidateMandateDialog from '#src/libs/payment/components/payment-backend-stripe/RevalidateMandateDialog.component';
import ConsumerPrintableGiftcardDetails from '#src/libs/giftcard/components/ConsumerPrintableGiftcardDetails.components.tsx';
import type { EstablishmentBillingGroup } from '../../libs/establishment/types';
import type { Theme as CompanyThemeType } from '../../libs/theme/types';
import type { Payment, PaymentMethod } from '../../libs/payment/types';
import type { OptionCallback } from '../../state/types';
import type {
  ConsumerGiftcard,
  Giftcard,
  GiftcardAttributePrintableCodePayload,
} from '../../libs/giftcard/types';
import type {
  PlannedPaymentEvent,
  InvoiceV1Serializer,
  InvoiceConfigurationSerializer,
} from '#src/libs/invoice/types';
import type { StripeReader } from '../../libs/terminal/types';
import { TEMPORARY_AMOUNT_TO_FORCE_INTERNAL_PAYMENT_CTS } from '../../libs/invoice/constants';
import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';

import { formatAsDate } from '../../utils/datetime';
import isEqual from 'lodash/isEqual';

const PAYMENT_INTENT_STATUS_REQUIRES_ACTION = 150;

type Props = {
  fetchCompanyUserRoles: () => void,
  uuid: string,
  fetchInvoiceItemList: (params: any) => void,
  fetchMember: (number) => void,
  editCustomFooter: (footer: string, options?: OptionCallback) => void,
  fetchPaymentList: (params: any) => void,
  refreshCompanyTheme: () => void,
  invoice: InvoiceV1Serializer,
  member: Member,
  openPaymentDialog: () => void,
  detachPaymentMethod: (pm_id: string) => void,
  detachPaymentMethodLoading: boolean,
  openPlannedPaymentMethodDialog: boolean,
  selectedPlannedPaymentEvent: null | PlannedPaymentEvent,
  setOpenPlannedPaymentMethodDialog: (b: boolean) => void,
  setSelectedPlannedPaymentEvent: (b: null | PlannedPaymentEvent) => void,
  registerNow: boolean,
  setRegisterNow: (value: boolean) => void,
  plannedPaymentEventLoading: boolean,
  paymentLoading: boolean,
  setOpenPaymentDialog: (boolean) => void,
  plannedPaymentDialogProcessing: boolean,
  setPlannedPaymentDialogProcessing: (value: boolean) => void,
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
  enablePlannedPaymentEvent: (id: number, options: OptionCallback) => void,
  cancelPlannedPaymentEvent: (id: number, options: OptionCallback) => void,
  changePaymentMethodAndRegisterPlannedPaymentEvent: (
    ppeId: number,
    paymentMethod: number,
    selectedPmId: string,
    applyToAllFuturePayments: boolean,
    registerNow: boolean,
    extraData: any,
    options: OptionCallback,
  ) => void,

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
  companyTheme: CompanyThemeType,
  companyId: number,
  snackbarSuccess: (msg: string) => void,
  snackbarWarning: (msg: string) => void,
  snackbarError: (msg: string) => void,
  fetchConsumerGiftcardReceivedList: (
    memberId: number,
    options: OptionCallback,
  ) => void,
  consumerGiftcardList: Array<ConsumerGiftcard<Giftcard>>,
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void,
  stripeBalanceSum: number,
  stripeReaders: StripeReader[],
  fetchStripeBalance: () => void,
  fetchStripeReaders: () => void,
  editEstablishmentBillingGroup: (
    establishmentBillingGroupId: string,
    options?: OptionCallback<InvoiceV1Serializer>,
  ) => void,
  fetchAllEstablishmentBillingGroup: (params: { company: number }) => void,
  establishmentBillingGroups: EstablishmentBillingGroup[],
  editEstablishmentBillingGroupIsLoading: boolean,
  fetchConsumerGiftcardList: (
    params: ConsumerGiftcardFilterParams,
    options?: OptionCallback<Array<ConsumerGiftcard>>,
  ) => void,
  getConsumerGiftcard: (id: number) => ConsumerGiftcard,
  attributeByPrintableCode: (
    data: GiftcardAttributePrintableCodePayload,
    options?: OptionCallback<ConsumerGiftcard>,
  ) => void,
  invoiceConfiguration: InvoiceConfigurationSerializer,
  isInvoiceConfigurationLoading: boolean,
  fetchInvoiceConfiguration: () => void,
  t: TFunction,
};

type State = {
  clientSecret?: string,
  clientSecretLoading: boolean,
  coupon_list: Array<{ coupon_code: string, coupon_voucher: number }>,
  paymentGroupPriceCts: number,
  paymentGroupMethodIdentifierToRevalidate: number,
  paymentMethodIdToRevalidate: string,
  selectedConsumerPrintableGiftcard: ConsumerGiftcard | null,
  onPaymentMethodRefreshed: () => void,
};

export class InvoiceDetail extends React.Component<Props, State> {
  state = {
    clientSecret: null,
    clientSecretLoading: false,
    paymentGroupPriceCts: 0,
    selectedConsumerPrintableGiftcard: null,
  };

  componentDidMount() {
    this.fetchInvoiceData();
    this.props.fetchCompanyUserRoles();
    this.props.fetchEstablishments();
    this.props.fetchStripeReaders();
    this.props.refreshCompanyTheme();
    this.props.fetchStripeBalance();
    this.props.fetchInvoiceConfiguration();
    if (this.props.companyTheme.enable_multi_localization) {
      this.props.fetchAllEstablishmentBillingGroup({
        params: { company: this.props.companyId },
      });
    }

    const { t } = this.props;
    const queryParams = new URLSearchParams(window.location.search);
    const redirectStatus = queryParams.get('redirect_status');
    const paymentMethodType = queryParams.get('payment_method_type');

    if (redirectStatus === 'failed') {
      const errorMessage = paymentMethodType
        ? t('invoice:invoice.paymentFailedWithMethod', {
            paymentMethod: paymentMethodType,
          })
        : t('invoice:invoice.paymentFailed');
      this.props.snackbarError(errorMessage);
    }
  }

  /** Whenever clicking on the details of a physical consumer gift card, when the invoice item is one  */
  handleSelectPrintableGiftcard = (id: number) => () => {
    const physicalConsumerGiftcard = this.props.getConsumerGiftcard(id);
    !!physicalConsumerGiftcard &&
      this.setState({
        selectedConsumerPrintableGiftcard: physicalConsumerGiftcard,
      });
  };

  /** Get all invoice items that are linked to a printable giftcard */
  getPhysicalConsumerGiftcardIdList = () => {
    return (
      this.props.invoice?.invoice_items
        ?.filter(
          (invoiceItem) =>
            !!invoiceItem &&
            !!invoiceItem.consumer_giftcard_kind &&
            invoiceItem.consumer_giftcard_kind ===
              ConsumerGiftcardKind.PRINTABLE,
        )
        .map((invoiceItem) => invoiceItem.object_id) ?? []
    );
  };

  fetchInvoiceData = () => {
    this.props.fetchInvoice(this.props.uuid, {
      onSuccess: (invoice) => {
        this.props.fetchMember(invoice.member, {
          onSuccess: () => {
            this.props.fetchConsumerGiftcardReceivedList(
              this.props.invoice?.member?.id,
            );
          },
        });
        if (invoice.plannedinvoice) {
          this.props.fetchPaymentGroupRequiringActionList();
        }
        this.props.fetchPaymentMethodList({ member: invoice.member });
      },
    });
    this.props.fetchInvoiceItemList(
      {
        invoice__uuid: this.props.uuid,
        page_size: 100,
      },
      {
        onSuccess: () => {
          const giftcardInvoiceItemIdList =
            this.getPhysicalConsumerGiftcardIdList();
          giftcardInvoiceItemIdList.length > 0 &&
            this.props.fetchConsumerGiftcardList({
              id__in: giftcardInvoiceItemIdList,
            });
        },
      },
    );
    this.props.fetchPaymentList({
      invoice__uuid: this.props.uuid,
      page_size: 100,
    });
    this.props.fetchPlannedPaymentEventList({
      invoice: this.props.uuid,
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

  registerNowPlannedPaymentEvent = (ppe: PlannedPaymentEvent) => {
    this.props.setSelectedPlannedPaymentEvent(ppe);
    this.props.setOpenPlannedPaymentMethodDialog(true);
    this.props.setRegisterNow(true);
  };

  onSubmitChangePaymentMethodAndRegister = (
    ppeId,
    paymentMethod,
    selectedPmId,
    applyToAllFuturePayments,
    registerNow,
    extraData,
  ) => {
    this.props.setPlannedPaymentDialogProcessing(true);
    this.props.changePaymentMethodAndRegisterPlannedPaymentEvent(
      ppeId,
      paymentMethod,
      selectedPmId,
      applyToAllFuturePayments,
      registerNow,
      extraData,
      {
        onSuccess: () => {
          this.props.setRegisterNow(false);
          this.props.setOpenPlannedPaymentMethodDialog(false);
          this.props.setPlannedPaymentDialogProcessing(false);
          this.fetchInvoiceData();
        },
        onError: () => {
          this.props.setPlannedPaymentDialogProcessing(false);
        },
      },
    );
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

  changeMethodPlannedPaymentEvent = (ppe: PlannedPaymentEvent) => {
    this.props.setSelectedPlannedPaymentEvent(ppe);
    this.props.setOpenPlannedPaymentMethodDialog(true);
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

  requestClientSecret = (paymentEngine: number, params?: any) => {
    this.setState({ clientSecretLoading: true });
    requestClientSecretAPI(paymentEngine, PAYMENT_INTENT_TYPE_INVOICE, {
      invoice: this.props.uuid,
      ...(params || {}),
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

  requestSetupIntentSecret = (paymentMethodIdToRevalidate?: string) => {
    return requestSetupIntentSecretAPI(
      this.props.invoice.member.id,
      undefined,
      false,
      paymentMethodIdToRevalidate,
    );
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

  applyGiftcardOnInvoice = (
    invoice_uuid: string,
    consumerGiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) =>
    this.props.applyGiftcardOnInvoice(
      invoice_uuid,
      consumerGiftCardId,
      amount,
      {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          this.props.fetchConsumerGiftcardReceivedList(
            this.props.invoice?.member?.id,
          );
        },
        onError: () => {
          if (options && options.onError) options.onError();
          this.props.fetchConsumerGiftcardReceivedList(
            this.props.invoice?.member?.id,
          );
        },
      },
    );

  revalidateMandateAndRegisterNow = (
    plannedPaymentEvent: PlannedPaymentEvent,
  ) => {
    this.setState({
      paymentMethodIdToRevalidate:
        plannedPaymentEvent._payment_backend_payment_method_id,
      paymentGroupMethodIdentifierToRevalidate:
        plannedPaymentEvent.payment_method_identifier,
      // we store the callback for what todo when paymentmethod revalidated
      //  so basically we resubmit the plannedpaymentevent immediately
      onPaymentMethodRefreshed: () =>
        this.props.changePaymentMethodAndRegisterPlannedPaymentEvent(
          plannedPaymentEvent.id,
          plannedPaymentEvent.payment_method_identifier,
          plannedPaymentEvent._payment_backend_payment_method_id,
          false,
          true,
          {},
          {
            onSuccess: () => {
              this.props.setRegisterNow(false);
              this.props.setOpenPlannedPaymentMethodDialog(false);
              this.props.setPlannedPaymentDialogProcessing(false);
              this.fetchInvoiceData();
              this.setState({
                paymentMethodIdToRevalidate: '',
              });
            },
            onError: () => {
              this.props.setPlannedPaymentDialogProcessing(false);
            },
          },
        ),
    });
  };

  closeRevalidateMandate = () => {
    this.setState({
      paymentMethodIdToRevalidate: '',
    });
  };

  handleCloseConsumerPrintableGiftcardModal = () =>
    this.setState({ selectedConsumerPrintableGiftcard: null });

  handleAttributeByPrintableCode = (
    code: string,
    options?: OptionCallback<ConsumerGiftcard>,
  ) => {
    !!this.props.invoice?.member?.id &&
      this.props.attributeByPrintableCode?.(
        {
          dst_member: this.props.invoice?.member?.id,
          code,
        },
        {
          onSuccess: () => {
            this.props.fetchConsumerGiftcardReceivedList(
              this.props.invoice?.member?.id,
            );
            options?.onSuccess();
          },
          onError: (error) => options?.onError(error),
        },
      );
  };

  render() {
    const stripeRegion = getStripeRegion();
    const companyCountry = getCompanyCountry();

    return (
      <>
        <div className={this.props.classes.container}>
          <Grid container direction="row">
            <Grid item md={6} xs={12}>
              <InvoiceHeader
                editEstablishmentBillingGroup={
                  this.props.editEstablishmentBillingGroup
                }
                editEstablishmentBillingGroupIsLoading={
                  this.props.editEstablishmentBillingGroupIsLoading
                }
                enableEditEstablishmentBillingGroup={
                  this.props.companyTheme.enable_multi_localization &&
                  !this.props.companyTheme?.is_multi_location_webshop_enabled
                }
                establishmentBillingGroups={
                  this.props.establishmentBillingGroups
                }
                invoice={this.props.invoice}
                onClickInvoice={this.props.goToInvoice}
              />
              {this.props.invoice.invoice_type !==
                INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER && (
                <InvoiceContent
                  amountInvoiceItem={this.props.invoice.amount_due_cts / 100}
                  editCustomFooter={this.props.editCustomFooter}
                  finalizeInvoice={this.props.finalizeInvoice}
                  goToSubscription={this.props.goToSubscription}
                  handleShowPrintableGiftcardDetails={
                    this.handleSelectPrintableGiftcard
                  }
                  invoice={this.props.invoice}
                  invoiceItemList={this.props.invoice.invoice_items.filter(
                    (ii) => !!ii,
                  )}
                  invoiceItemLoading={this.props.invoiceItemLoading}
                />
              )}
            </Grid>
            <Grid item md={6} xs={12}>
              <InvoicePaymentPanel
                accountBalance={
                  this.props.invoice &&
                  this.props.invoice.member &&
                  this.props.invoice.member.credit_account_balance
                }
                accountBalanceLoading={this.props.memberLoading}
                applyGiftcardOnInvoice={this.applyGiftcardOnInvoice}
                companyId={this.props.companyId}
                consumeBalance={this.allocateDebt}
                consumerGiftcardList={this.props.consumerGiftcardList}
                handleAttributeByPrintableCode={
                  this.handleAttributeByPrintableCode
                }
                handleChangeMethod={this.props.updatePaymentMethod}
                invoice={this.props.invoice}
                onInstalmentPayment={this.props.openInstalmentPaymentDialog}
                onPaymentIntent={() => this.props.setOpenPaymentDialog(true)}
                onRevert={this.props.openRevertDialog}
                onValidate={this.onValidatePaymentGroup}
                paymentGroupRequiringActionList={
                  this.props.paymentGroupRequiringActionList
                }
                paymentList={this.props.paymentList}
                paymentLoading={this.props.paymentLoading}
                plannedPaymentEventActions={{
                  onDisable: this.cancelPlannedPaymentEvent,
                  onEnable: this.enablePlannedPaymentEvent,
                  onRegisterNow: this.registerNowPlannedPaymentEvent,
                  onChangeMethod: this.changeMethodPlannedPaymentEvent,
                  recoverableErrorActions: {
                    mandate_invalid: this.revalidateMandateAndRegisterNow,
                  },
                }}
                plannedPaymentEventList={this.props.plannedPaymentEventList}
                snackbarSuccess={this.props.snackbarSuccess}
              />
              <RevalidateMandateDialog
                onCancel={this.closeRevalidateMandate}
                onSuccess={this.state.onPaymentMethodRefreshed}
                open={!!this.state.paymentMethodIdToRevalidate}
                paymentGroupMethodIdentifier={
                  this.state.paymentGroupMethodIdentifierToRevalidate
                }
                paymentMethodIdToRevalidate={
                  this.state.paymentMethodIdToRevalidate
                }
                requestSetupIntentSecret={this.requestSetupIntentSecret}
              />
            </Grid>
            {!!this.props.isOpenInstalmentPaymentDialog && (
              <InstalmentPaymentDialog
                availablePaymentMethodList={
                  this.props.payment_method_available_manager
                }
                cardBillingDetailsMandatory={
                  this.props.companyTheme.force_billing_details_on_cards
                }
                companyId={this.props.companyId}
                defaultUserEmail={this.props.invoice.member.email}
                defaultUserName={this.props.invoice.member.name}
                enabledPaymentGroupMethodIdentifier={getBackofficeEnabledPaymentGroupMethods(
                  {
                    currency: this.props.companyTheme.currency,
                    companyCountry,
                    withCredit: true,
                    withTerminal: true,
                    stripeRegion,
                  },
                )}
                fetchPaymentMethodList={this.fetchPaymentMethodList}
                onClose={this.props.closeInstalmentPaymentDialog}
                onlinePaymentEnabled={
                  this.props.companyTheme.online_payment_enabled
                }
                onSubmit={this.schedulePayment}
                requestSetupIntentSecret={this.requestSetupIntentSecret}
                savedPaymentMethodList={this.props.savedPaymentMethodList}
                stripeReaders={this.props.stripeReaders}
                totalPriceCts={
                  this.props.invoice.amount_due_cts -
                  this.props.invoice.amount_paid_cts
                }
              />
            )}
            {!!this.props.openPaymentDialog && (
              <PaymentDialog
                termsAndConditionsAccepted
                amountToPay={parseFloat(
                  this.props.invoice.amount_due_cts -
                    this.props.invoice.amount_paid_cts,
                ).toFixed(2)}
                availablePaymentMethodList={
                  this.props.payment_method_available_manager
                }
                cardBillingDetailsMandatory={
                  this.props.companyTheme.force_billing_details_on_cards
                }
                clientSecret={
                  this.state.clientSecretLoading
                    ? null
                    : this.state.clientSecret
                }
                clientSecretLoading={this.state.clientSecretLoading}
                companyId={this.props.companyId}
                defaultUserEmail={this.props.invoice.member.email}
                defaultUserName={this.props.invoice.member.name}
                memberId={this.props.invoice.member.id}
                onCancel={() => this.props.setOpenPaymentDialog(false)}
                onError={() =>
                  setTimeout(() => {
                    this.props.fetchPaymentList({
                      invoice__uuid: this.props.uuid,
                      page_size: 100,
                    });
                  }, 2000)
                }
                onlyInternal={
                  !this.props.companyTheme.online_payment_enabled ||
                  this.props.invoice.amount_due_cts <
                    TEMPORARY_AMOUNT_TO_FORCE_INTERNAL_PAYMENT_CTS
                }
                onSuccess={(callback) => {
                  setTimeout(() => {
                    this.props.setOpenPaymentDialog(false);
                    this.fetchInvoiceData();
                    if (typeof callback === 'function') callback();
                  }, 2000);
                }}
                paymentGroupId={this.state.paymentGroupId}
                paymentGroupPriceCts={this.state.paymentGroupPriceCts}
                requestClientSecret={this.requestClientSecret}
                stripePaymentElementConfig={{
                  isDefaultForRegion:
                    this.props.companyTheme.is_default_for_region,
                  stripeId: this.props.companyTheme.stripe_id,
                }}
                stripeReaders={this.props.stripeReaders}
                updatePriceCts={this.updatePaymentGroupPriceCts}
              />
            )}
            {this.props.openPlannedPaymentMethodDialog &&
              !!stripeRegion &&
              !!companyCountry && (
                <PlannedPaymentEventMethodSwitcherDialog
                  availablePaymentMethodList={
                    this.props.payment_method_available_manager
                  }
                  companyId={this.props.companyId}
                  detachPaymentMethod={this.props.detachPaymentMethod}
                  detachPaymentMethodLoading={
                    this.props.detachPaymentMethodLoading
                  }
                  dispApplyForAll={
                    (this.props.plannedPaymentEventList ?? []).length > 1
                  }
                  enabledPaymentMethods={getBackofficeEnabledPaymentGroupMethods(
                    {
                      currency: this.props.companyTheme.currency,
                      companyCountry,
                      withCredit: true,
                      withTerminal: true,
                      stripeRegion,
                    },
                  )}
                  memberId={this.props.invoice.member.id}
                  onClose={() => {
                    this.props.setOpenPlannedPaymentMethodDialog(false);
                    this.props.setRegisterNow(false);
                  }}
                  onSubmitChangePaymentMethodAndRegister={
                    this.onSubmitChangePaymentMethodAndRegister
                  }
                  open={this.props.openPlannedPaymentMethodDialog}
                  plannedPaymentEventLoading={
                    this.props.plannedPaymentEventLoading
                  }
                  processing={this.props.plannedPaymentDialogProcessing}
                  refreshSavedPaymentMethodList={this.fetchPaymentMethodList}
                  registerNow={this.props.registerNow}
                  requestSetupIntentSecret={this.requestSetupIntentSecret}
                  savedPaymentMethodList={this.props.savedPaymentMethodList}
                  selectedPPE={this.props.selectedPlannedPaymentEvent}
                  sepaDefaultEmail={this.props.invoice.member.email}
                  sepaDefaultName={this.props.invoice.member.name}
                  snackbarErrorMsg={this.props.snackbarError}
                  snackbarSuccessMsg={this.props.snackbarSuccess}
                  stripeReaders={this.props.stripeReaders || []}
                />
              )}
          </Grid>
          <InvoiceReverterDialog
            invoice={this.props.invoice}
            isAutoDebitActivated={
              this.props.companyTheme.is_auto_debit_activated
            }
            isInChurn={!!this.props.companyTheme.churn_last_paid_month}
            isInvoiceConfigurationLoading={
              this.props.isInvoiceConfigurationLoading
            }
            isRevertReasonRequired={
              this.props.invoiceConfiguration?.is_invoice_revert_reason_required
            }
            onClose={this.props.closeRevertDialog}
            onOpen={this.props.openRevertDialog}
            onSubmit={this.props.revertInvoice}
            open={this.props.revertDialogOpen}
            payments={this.props.paymentList}
            refundBlockingLimit={this.props.companyTheme.refund_blocking_limit}
            stripeBalanceSum={this.props.stripeBalanceSum}
          />
          {this.props.invoice.member && !this.props.invoice.is_member_pos && (
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="member.allowed_actions.accessProfile"
            >
              <div className={this.props.classes.navigationButton}>
                <Grow in={this.props.invoice && this.props.invoice.member}>
                  <CreditMemberBadge
                    credit={this.props.member?.credit_account_balance ?? 0}
                    unpaidAmount={this.props.member?.total_unpaid_amount ?? 0}
                  >
                    <Fab
                      color="secondary"
                      onClick={() =>
                        this.props.goToMemberPage(this.props.invoice.member.id)
                      }
                      variant="extended"
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
            </ObjectLevelPermissionWrapper>
          )}
        </div>

        {!!this.state.selectedConsumerPrintableGiftcard && (
          <ConsumerPrintableGiftcardDetails
            consumerGiftcard={this.state.selectedConsumerPrintableGiftcard}
            isOpen={!!this.state.selectedConsumerPrintableGiftcard}
            onClose={this.handleCloseConsumerPrintableGiftcardModal}
          />
        )}
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
    right: theme.spacing(8),
  },
  rightText: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['invoice']),
  withStyles(styles),
  withState('openPaymentDialog', 'setOpenPaymentDialog', false),
  withState(
    'openPlannedPaymentMethodDialog',
    'setOpenPlannedPaymentMethodDialog',
    false,
  ),
  withState(
    'plannedPaymentDialogProcessing',
    'setPlannedPaymentDialogProcessing',
    false,
  ),
  withState(
    'selectedPlannedPaymentEvent',
    'setSelectedPlannedPaymentEvent',
    null,
  ),
  withState('registerNow', 'setRegisterNow', false),
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
        withInvoiceItem(
          withMember(
            withEstablishment(withEstablishmentBillingGroup(getInvoice)),
          ),
        ),
      )(state, uuid),
      member: withDefaultBillingEstablishment(
        getInvoiceMemberFullDetail(getInvoice),
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

      companyTheme: themeSelectors.getTheme(state),
      companyId: state.theme.theme.company,
      consumerGiftcardList: withSender(
        withReceiver(onlyUsable(withGiftcard(getConsumerGiftcardReceivedList))),
      )(state),
      detachPaymentMethodLoading:
        state.paymentBackend.detachPaymentMethod.loading,
      plannedPaymentEventLoading: state.invoice.planned_payment_event.loading,
      stripeBalanceSum: getStripeBalanceTotal(state),
      stripeReaders: getStripeReaders(state),
      establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
      editEstablishmentBillingGroupIsLoading:
        getEditEstablishmentBillingGroupIsLoading(state),
      getConsumerGiftcard: (id: number) => getConsumerGiftcard(state, id),
      invoiceConfiguration: state.invoice.configuration.result,
      isInvoiceConfigurationLoading: state.invoice.configuration.loading,
    }),
    {
      attributeByPrintableCode: attributeByPrintableCodeAction,
      fetchConsumerGiftcardList: fetchConsumerGiftcardListAction,
      fetchInvoiceItemList,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      fetchInvoice: fetchInvoiceAction,
      fetchPaymentList: fetchPaymentListAction,
      goToSubscription: (id) => pushRouter(`/subscription/${id}/`),
      fetchPaymentGroupList: fetchPaymentGroupListAction,
      fetchPlannedPaymentEventList,
      fetchMember,
      fetchCompanyUserRoles,
      refreshCompanyTheme,
      revertInvoice: revertInvoiceAction,
      detachPaymentMethodAction: detachPaymentMethod,
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
      changePaymentMethodAndRegisterPlannedPaymentEvent,
      schedulePayment,
      fetchEstablishments,
      editEstablishmentBillingGroup: editEstablishmentBillingGroupAction,
      snackbarSuccess,
      snackbarWarning,
      snackbarError,
      fetchConsumerGiftcardReceivedList:
        fetchConsumerGiftcardReceivedListAction,
      fetchGiftcardBulk: fetchGiftcardBulkAction,
      applyGiftcardOnInvoice: applyGiftcardOnInvoiceAction,
      fetchMemberBulkById: fetchMemberBulkByIdAction,
      fetchStripeBalance: fetchStripeBalanceAction,
      fetchStripeReaders,
      fetchAllEstablishmentBillingGroup:
        fetchAllEstablishmentBillingGroupAction,
      fetchInvoiceConfiguration: fetchInvoiceConfigurationAction,
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
      (reverse_type, payment_method_to_reverse, revert_reason, options) => {
        revertInvoice(
          uuid,
          {
            reverse_type,
            payment_method_to_reverse,
            revert_reason,
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
    fetchConsumerGiftcardReceivedList:
      ({
        fetchConsumerGiftcardReceivedList,
        fetchGiftcardBulk,
        fetchMemberBulkById,
      }) =>
      (id, options?: OptionCallback) => {
        fetchConsumerGiftcardReceivedList(
          id,
          {
            page: 1,
            page_size: 15,
            active: true,
            reverted: false,
            has_amount_left: true,
            in_timeframe: true,
          },
          {
            onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
              fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
              fetchMemberBulkById([
                ...consumerGiftcardList.map((cg) => cg.src_member),
                ...consumerGiftcardList.map((cg) => cg.dst_member),
              ]);
              if (options && options.onSuccess) options.onSuccess();
            },
            onError: () => {
              if (options && options.onError) options.onError();
            },
          },
        );
      },
    applyGiftcardOnInvoice:
      ({
        applyGiftcardOnInvoice,
        fetchInvoice,
        fetchPaymentList,
        fetchConsumerGiftcardReceivedList,
        member,
      }) =>
      (
        invoice_uuid: string,
        consumerGiftCardId: number,
        amount: number,
        options?: OptionCallback,
      ) => {
        applyGiftcardOnInvoice(invoice_uuid, consumerGiftCardId, amount, {
          onSuccess: () => {
            fetchInvoice(invoice_uuid, {
              onSuccess: () => {
                fetchPaymentList({
                  invoice__uuid: invoice_uuid,
                  page_size: 100,
                });
                if (options && options.onSuccess) options.onSuccess();
              },
            });
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
    detachPaymentMethod:
      ({
        detachPaymentMethodAction,
        fetchPaymentMethodList,
        invoice,
        member,
      }) =>
      (pm_id: number, options: OptionCallback) => {
        if (member?.id) {
          detachPaymentMethodAction(
            { member: member.id, payment_method_id: pm_id },
            {
              onSuccess: () => {
                fetchPaymentMethodList({ member: invoice.member.id });
                if (options && options.onSuccess) options.onSuccess();
              },
              onError: options && options.onError,
            },
          );
        }
      },
    editEstablishmentBillingGroup:
      ({ editEstablishmentBillingGroup, invoice }) =>
      (establishmentBillingGroupId: number, options?: OptionCallback) =>
        editEstablishmentBillingGroup(
          invoice.uuid,
          establishmentBillingGroupId,
          options,
        ),
  }),
  withTitle(({ t, invoice }) => {
    return `${t('titles:invoice.invoiceEdit')} - ${getInvoiceIdentifier(
      invoice,
    )} - ${invoice && invoice.date ? formatAsDate(invoice.date) : ''}`;
  }),
  withMemberBannerHOC(({ invoice }) => invoice.member),
)(InvoiceDetail);
