import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';

import {
  returnPaymentActions,
  invoiceConfigurationDetailActions,
  invoiceConfigurationPatchActions,
  finalizeInvoiceActions,
  quickInvoiceActions,
  retrieveInvoiceActions,
  updatePaymentMethodActions,
  createOrUpdateInvoiceActions,
  listPaymentActions,
  listInvoiceItemActions,
  listInvoiceActions,
  listPlannedPaymentEventActions,
  editCustomFooterActions,
  editBillingEstablishmentActions,
  editEstablishmentBillingGroupActions,
  checkInvoiceInfoActions,
  cancelPlannedPaymentEventActions,
  enablePlannedPaymentEventActions,
  registerNowPlannedPaymentEventActions,
  changePaymentMethodAndRegisterPlannedPaymentEventActions,
  schedulePaymentActions,
  sendInvoiceToQuickbooksActions,
  applyBalanceToInvoiceActions,
  applyGiftcardOnInvoiceActions,
  generateInvoiceXmlActions,
  generateInvoiceXmlBulkActions,
  checkFiskalyOnboardingStatusActions,
  getFiskalyOnboardingRequirementsActions,
  onboardFiskalyCompanyActions,
  getLastGeneratedAgreementUrlActions,
  getLastUploadedSignedAgreementActions,
  uploadSignedAgreementActions,
  fetchFiskalySignEsInvoiceActions,
  manuallySendInvoiceToSignEsActions,
} from '#src/libs/invoice/actions';

import type {
  InvoiceConfigurationSerializer,
  InvoiceDetailsSerializer,
  InvoiceInfoSerializer,
  InvoiceV1Serializer,
  InvoiceState,
  PlannedPaymentEventSerializer,
  FiskalyOnboardingRequirement,
  FiskalySignEsInvoiceDetails,
} from '#src/libs/invoice/types';
import type { PaymentItem } from '#src/libs/invoice/payment/types';
import type { InvoiceItem } from '#src/libs/invoice/invoice-item/types';
import type { PaginatedResponse } from '#src/state/types';

type PayloadReduceTypeUuid<T> = { [uuid: string]: T };
type PayloadReduceTypeIdStr<T> = { [id: string]: T };
type PayloadReduceTypeIdNbr<T> = { [id: number]: T };

const initialState: Immutable.Immutable<InvoiceState> = Immutable<InvoiceState>(
  {
    error: null,
    loading: true,
    byId: {},
    list: {
      count: 0,
      loading: false,
      page: 1,
      error: null,
      allIds: [],
    },
    invoice: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
    payment: {
      byId: {},
      loading: false,
      error: null,
      allIds: [],
    },
    invoiceItem: {
      byId: {},
      loading: false,
      error: null,
    },
    planned_payment_event: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
    returnPayment: {
      loading: false,
      error: null,
    },
    configuration: {
      result: null,
      loading: false,
      error: null,
      updating: false,
    },
    finalize: {
      loading: false,
      error: null,
    },
    generateXml: {
      loading: false,
      error: null,
    },
    generateXmlBulk: {
      loading: false,
      error: null,
    },
    invoiceInfo: {
      loading: false,
      error: null,
      data: null,
    },
    quickbooks: {
      loading: false,
      error: null,
    },
    applyBalance: {
      error: null,
      loading: false,
    },
    applyGiftCard: {
      error: null,
      loading: false,
    },
    fiskalySignEsInvoice: {
      result: null,
      loading: false,
      error: null,
    },
    errorSpecific: null,
    loadingSpecific: false,
    editEstablishmentBillingGroup: {
      loading: false,
      error: null,
    },
    fiskalyOnboarding: {
      loading: false,
      error: null,
      isOnboarded: null,
      requirements: [],
      agreementUrl: null,
      lastGeneratedAgreementUrl: null,
      isLoadingLastGeneratedAgreementUrl: false,
      signedAgreementFile: null,
      isLoadingSignedAgreement: false,
      isUploadingSignedAgreement: false,
    },
  },
);

export default handleActions<Immutable.Immutable<InvoiceState>, any>(
  {
    [checkInvoiceInfoActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['invoiceInfo', 'loading'], payload);
    },
    [checkInvoiceInfoActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['invoiceInfo', 'error'], payload);
    },
    [checkInvoiceInfoActions.success.toString()]: (
      state,
      { payload }: { payload: InvoiceInfoSerializer },
    ) => {
      return state.setIn(['invoiceInfo', 'data'], payload);
    },
    [checkInvoiceInfoActions.reset.toString()]: (state) => {
      return state.setIn(['invoiceInfo', 'data'], null);
    },
    [listInvoiceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['list', 'loading'], payload);
    },
    [listInvoiceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['list', 'error'], payload);
    },
    [listInvoiceActions.reset.toString()]: (state) => {
      return state.setIn(['list', 'allIds'], []);
    },
    [listInvoiceActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: PaginatedResponse<InvoiceV1Serializer> | InvoiceV1Serializer[];
      },
    ) => {
      return state
        .merge(
          {
            byId: ('results' in payload ? payload.results : payload).reduce<
              PayloadReduceTypeUuid<InvoiceV1Serializer>
            >(
              (acc, v) => ({
                ...acc,
                [v.uuid]: v,
              }),
              {},
            ),
          },
          { deep: true },
        )
        .setIn(
          ['list', 'allIds'],
          ('results' in payload ? payload.results : payload).map(
            (inv: InvoiceV1Serializer) => inv.uuid,
          ),
        )
        .setIn(['list', 'count'], 'count' in payload ? payload.count : 0)
        .setIn(['list', 'page'], 'page' in payload ? payload.page : 0);
    },
    [listPaymentActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['payment', 'loading'], payload);
    },
    [listPaymentActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['payment', 'error'], payload);
    },
    [listPaymentActions.success.toString()]: (
      state,
      { payload }: { payload: PaymentItem[] },
    ) => {
      return state
        .setIn(
          ['payment', 'allIds'],
          payload.map((p) => p.id),
        )
        .merge(
          {
            payment: {
              byId: payload.reduce<PayloadReduceTypeUuid<PaymentItem>>(
                (acc, v) => ({ ...acc, [v.id]: v }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [listInvoiceItemActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['invoiceItem', 'loading'], payload);
    },
    [listInvoiceItemActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['invoiceItem', 'error'], payload);
    },
    [listInvoiceItemActions.success.toString()]: (
      state,
      { payload }: { payload: InvoiceItem[] },
    ) => {
      return state.merge(
        {
          invoiceItem: {
            byId: payload.reduce<PayloadReduceTypeIdStr<InvoiceItem>>(
              (acc, v) => ({
                ...acc,
                [v.id]: v,
              }),
              {},
            ),
          },
        },
        { deep: true },
      );
    },
    [generateInvoiceXmlBulkActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['generateXmlBulk', 'loading'], payload);
    },
    [generateInvoiceXmlBulkActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['generateXmlBulk', 'error'], payload);
    },
    [returnPaymentActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['returnPayment', 'loading'], payload);
    },
    [returnPaymentActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['returnPayment', 'error'], payload);
    },
    [invoiceConfigurationDetailActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['configuration', 'loading'], payload);
    },
    [invoiceConfigurationDetailActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['configuration', 'error'], payload);
    },
    [invoiceConfigurationDetailActions.success.toString()]: (
      state,
      { payload }: { payload: InvoiceConfigurationSerializer },
    ) => {
      return state.setIn(['configuration', 'result'], payload);
    },
    [invoiceConfigurationPatchActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['configuration', 'updating'], payload);
    },

    [finalizeInvoiceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['finalize', 'loading'], payload);
    },
    [finalizeInvoiceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['finalize', 'error'], payload);
    },
    [finalizeInvoiceActions.success.toString()]: (
      state,
      { payload }: { payload: InvoiceV1Serializer },
    ) => {
      return state.setIn(['byId', payload.uuid], payload);
    },
    [generateInvoiceXmlActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['finalize', 'loading'], payload);
    },
    [generateInvoiceXmlActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['finalize', 'error'], payload);
    },
    [generateInvoiceXmlActions.success.toString()]: (
      state,
      { payload }: { payload: InvoiceV1Serializer },
    ) => {
      return state.setIn(['byId', payload.uuid], payload);
    },

    [quickInvoiceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [quickInvoiceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },

    [retrieveInvoiceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [retrieveInvoiceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [retrieveInvoiceActions.success.toString()]: (
      state,
      { payload }: { payload: InvoiceV1Serializer },
    ) => {
      return state.setIn(['byId', payload.uuid], payload);
    },
    [updatePaymentMethodActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['updatePaymentMethod', 'loading'], payload);
    },
    [updatePaymentMethodActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['updatePaymentMethod', 'error'], payload);
    },
    [updatePaymentMethodActions.success.toString()]: (
      state,
      { payload }: { payload: PaymentItem },
    ) => {
      return state.setIn(['payment', 'byId', payload.id], payload);
    },
    [createOrUpdateInvoiceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [createOrUpdateInvoiceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [createOrUpdateInvoiceActions.success.toString()]: (
      state,
      { payload }: { payload: InvoiceV1Serializer },
    ) => {
      return state.setIn(['byId', payload.uuid], payload);
    },
    [editCustomFooterActions.success.toString()]: (
      state,
      { payload }: { payload: InvoiceDetailsSerializer },
    ) => {
      return state.setIn(['byId', payload.uuid], payload);
    },
    [editBillingEstablishmentActions.success.toString()]: (
      state,
      { payload }: { payload: InvoiceV1Serializer },
    ) => {
      return state.setIn(['byId', payload.uuid], payload);
    },
    [editEstablishmentBillingGroupActions.success.toString()]: (
      state,
      { payload }: { payload: InvoiceV1Serializer },
    ) => {
      return state.setIn(['byId', payload.uuid], payload);
    },
    [editEstablishmentBillingGroupActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['editEstablishmentBillingGroup', 'error'], payload);
    },
    [editEstablishmentBillingGroupActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['editEstablishmentBillingGroup', 'loading'], payload);
    },
    [listPlannedPaymentEventActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['planned_payment_event', 'loading'], payload);
    },
    [cancelPlannedPaymentEventActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['planned_payment_event', 'loading'], payload);
    },
    [enablePlannedPaymentEventActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['planned_payment_event', 'loading'], payload);
    },
    [enablePlannedPaymentEventActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['planned_payment_event', 'error'], payload);
    },
    [enablePlannedPaymentEventActions.success.toString()]: (
      state,
      { payload }: { payload: PlannedPaymentEventSerializer },
    ) => {
      return state.setIn(
        ['planned_payment_event', 'byId', payload.id],
        payload,
      );
    },
    [changePaymentMethodAndRegisterPlannedPaymentEventActions.isLoading.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(['planned_payment_event', 'loading'], payload);
      },
    [changePaymentMethodAndRegisterPlannedPaymentEventActions.error.toString()]:
      (state, { payload }: { payload: Error | null }) => {
        return state.setIn(['planned_payment_event', 'error'], payload);
      },
    [changePaymentMethodAndRegisterPlannedPaymentEventActions.success.toString()]:
      (state, { payload }: { payload: PlannedPaymentEventSerializer }) => {
        return state.setIn(
          ['planned_payment_event', 'byId', payload.id],
          payload,
        );
      },
    [registerNowPlannedPaymentEventActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['planned_payment_event', 'loading'], payload);
    },
    [registerNowPlannedPaymentEventActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['planned_payment_event', 'error'], payload);
    },
    [registerNowPlannedPaymentEventActions.success.toString()]: (
      state,
      { payload }: { payload: PlannedPaymentEventSerializer },
    ) => {
      return state.setIn(
        ['planned_payment_event', 'byId', payload.id],
        payload,
      );
    },
    [cancelPlannedPaymentEventActions.success.toString()]: (
      state,
      { payload }: { payload: PlannedPaymentEventSerializer },
    ) => {
      return state.setIn(
        ['planned_payment_event', 'byId', payload.id],
        payload,
      );
    },
    [listPlannedPaymentEventActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['planned_payment_event', 'error'], payload);
    },
    [listPlannedPaymentEventActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload:
          | PaginatedResponse<PlannedPaymentEventSerializer>
          | PlannedPaymentEventSerializer[];
      },
    ) => {
      return state
        .merge(
          {
            planned_payment_event: {
              byId: ('results' in payload ? payload.results : payload).reduce<
                PayloadReduceTypeIdNbr<PlannedPaymentEventSerializer>
              >(
                (acc, v) => ({
                  ...acc,
                  [v.id]: v,
                }),
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['planned_payment_event', 'allIds'],
          ('results' in payload ? payload.results : payload).map(
            (ppe: PlannedPaymentEventSerializer) => ppe.id,
          ),
        )
        .setIn(
          ['planned_payment_event', 'count'],
          'count' in payload ? payload.count : 0,
        )
        .setIn(
          ['planned_payment_event', 'page'],
          'page' in payload ? payload.page : 0,
        );
    },
    [schedulePaymentActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['planned_payment_event', 'loading'], payload);
    },
    [schedulePaymentActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['planned_payment_event', 'error'], payload);
    },
    [schedulePaymentActions.success.toString()]: (
      state,
      { payload }: { payload: PlannedPaymentEventSerializer[] },
    ) => {
      return state.merge(
        {
          planned_payment_event: {
            byId: payload.reduce<
              PayloadReduceTypeIdNbr<PlannedPaymentEventSerializer>
            >((acc, v) => ({ ...acc, [v.id]: v }), {}),
          },
        },
        { deep: true },
      );
    },
    [sendInvoiceToQuickbooksActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['quickbooks', 'loading'], payload);
    },
    [sendInvoiceToQuickbooksActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['quickbooks', 'error'], payload);
    },
    [applyBalanceToInvoiceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['applyBalance', 'loading'], payload);
    },
    [applyBalanceToInvoiceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['applyBalance', 'error'], payload);
    },
    [applyGiftcardOnInvoiceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['applyGiftCard', 'loading'], payload);
    },
    [applyGiftcardOnInvoiceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['applyGiftCard', 'error'], payload);
    },
    [checkFiskalyOnboardingStatusActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['fiskalyOnboarding', 'loading'], payload);
    },
    [checkFiskalyOnboardingStatusActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['fiskalyOnboarding', 'error'], payload);
    },
    [checkFiskalyOnboardingStatusActions.success.toString()]: (
      state,
      { payload }: { payload: { is_onboarded: boolean } },
    ) => {
      return state.setIn(
        ['fiskalyOnboarding', 'isOnboarded'],
        payload.is_onboarded,
      );
    },
    [getFiskalyOnboardingRequirementsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['fiskalyOnboarding', 'loading'], payload);
    },
    [getFiskalyOnboardingRequirementsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['fiskalyOnboarding', 'error'], payload);
    },
    [getFiskalyOnboardingRequirementsActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: { requirements: FiskalyOnboardingRequirement[] } },
    ) => {
      return state.setIn(
        ['fiskalyOnboarding', 'requirements'],
        payload.requirements,
      );
    },
    [onboardFiskalyCompanyActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['fiskalyOnboarding', 'loading'], payload);
    },
    [onboardFiskalyCompanyActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['fiskalyOnboarding', 'error'], payload);
    },
    [onboardFiskalyCompanyActions.success.toString()]: (
      state,
      { payload }: { payload: { agreement_url: string } },
    ) => {
      return state
        .setIn(['fiskalyOnboarding', 'agreementUrl'], payload.agreement_url)
        .setIn(
          ['fiskalyOnboarding', 'lastGeneratedAgreementUrl'],
          payload.agreement_url,
        );
    },
    [getLastGeneratedAgreementUrlActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['fiskalyOnboarding', 'isLoadingLastGeneratedAgreementUrl'],
        payload,
      );
    },
    [getLastGeneratedAgreementUrlActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['fiskalyOnboarding', 'error'], payload);
    },
    [getLastGeneratedAgreementUrlActions.success.toString()]: (
      state,
      { payload }: { payload: { agreement_url: string } },
    ) => {
      return state
        .setIn(
          ['fiskalyOnboarding', 'lastGeneratedAgreementUrl'],
          payload.agreement_url,
        )
        .setIn(['fiskalyOnboarding', 'agreementUrl'], payload.agreement_url);
    },
    [getLastUploadedSignedAgreementActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['fiskalyOnboarding', 'isLoadingSignedAgreement'],
        payload,
      );
    },
    [getLastUploadedSignedAgreementActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['fiskalyOnboarding', 'error'], payload);
    },
    [getLastUploadedSignedAgreementActions.success.toString()]: (
      state,
      { payload }: { payload: { signed_agreement_url: string } | null },
    ) => {
      return state.setIn(
        ['fiskalyOnboarding', 'signedAgreementFile'],
        payload?.signed_agreement_url || null,
      );
    },
    [uploadSignedAgreementActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['fiskalyOnboarding', 'isUploadingSignedAgreement'],
        payload,
      );
    },
    [uploadSignedAgreementActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['fiskalyOnboarding', 'error'], payload);
    },
    [uploadSignedAgreementActions.success.toString()]: (
      state,
      { payload }: { payload: { file: string } },
    ) => {
      return state.setIn(
        ['fiskalyOnboarding', 'signedAgreementFile'],
        payload.file,
      );
    },
    [fetchFiskalySignEsInvoiceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['fiskalySignEsInvoice', 'loading'], payload);
    },
    [fetchFiskalySignEsInvoiceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['fiskalySignEsInvoice', 'error'], payload);
    },
    [fetchFiskalySignEsInvoiceActions.success.toString()]: (
      state,
      { payload }: { payload: FiskalySignEsInvoiceDetails },
    ) => {
      return state.setIn(['fiskalySignEsInvoice', 'result'], payload);
    },
    [manuallySendInvoiceToSignEsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['fiskalySignEsInvoice', 'loading'], payload);
    },
    [manuallySendInvoiceToSignEsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['fiskalySignEsInvoice', 'error'], payload);
    },
    [manuallySendInvoiceToSignEsActions.success.toString()]: (
      state,
      { payload }: { payload: FiskalySignEsInvoiceDetails },
    ) => {
      return state.setIn(['fiskalySignEsInvoice', 'result'], payload);
    },
  },
  initialState,
);
