import React, { useEffect, useCallback, useState } from 'react';

/* GENERAL */

import { push as routerPush } from 'connected-react-router';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

/* APIS */

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#src/libs/payment/api';

/* ACTIONS */

import { snackbarWarning, snackbarSuccess } from '#src/libs/snackbar/actions';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  detachPaymentMethod as detachPaymentMethodAction,
} from '#src/libs/payment/actions';
import {
  fetchInvoiceList as fetchInvoiceListAction,
  applyBalanceToUnpaid as applyBalanceToUnpaidAction,
  applyGiftcardOnInvoice as applyGiftcardOnInvoiceAction,
} from '#src/libs/invoice/actions';
import {
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '#src/libs/establishment/actions';
import {
  adjustCreditWithoutPaymentNote as adjustCreditWithoutPaymentNoteAction,
  fetchMember as fetchMemberAction,
  fetchMemberBulkById as fetchMemberBulkByIdAction,
} from '#src/libs/member/actions';
import {
  fetchConsumerGiftcardReceivedList as fetchConsumerGiftcardReceivedListAction,
  fetchGiftcardBulk as fetchGiftcardBulkAction,
} from '#src/libs/giftcard/actions';

/* SELECTORS */

import { getStripeReaders } from '#src/libs/terminal/selectors';
import {
  getAvailableEstablishmentList,
  getEnabledEstablishmentBillingGroups,
} from '#src/libs/establishment/selectors';
import themeSelectors, { getStripeRegion } from '#src/libs/theme/selectors';
import { getMemberDetail } from '#src/libs/member/selectors';
import {
  getConsumerGiftcardReceivedList,
  onlyUsable,
  withGiftcard,
  withReceiver,
  withSender,
} from '#src/libs/giftcard/selectors';
import { withInvoiceItem, getInvoiceList } from '#src/libs/invoice/selectors';

/* TYPES */

import type { OptionCallback } from '#src/state/types';
import type { RootState } from '#src/reducers';
import type { ConsumerGiftcard } from '#src/libs/giftcard/types';

/* UTILS */

import { getBackofficeBillingPlanEnabledPaymentMethods } from '#src/libs/payment/utils';

/* COMPONENTS */

import MemberBillingProblemCard from '#src/libs/member/components/MemberBillingProblemCard.component';
import PaymentModal from '#src/libs/payment/components/PaymentModal.component';
import AddPaymentMethod from '#src/libs/payment/components/AddPaymentMethod.component';

type OwnProps = {
  memberId: number;
  onPaymentSuccess?: () => void;
};

/*
 * REDUX CONNECT
 */

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  companyCountry: state.theme.theme.locale.split('_')[1],
  companyId: state.theme.theme.company,
  companyTheme: themeSelectors.getTheme(state),
  consumerGiftcardList: withSender(
    withReceiver(onlyUsable(withGiftcard(getConsumerGiftcardReceivedList))),
  )(state),
  detachPaymentMethodLoading: state.paymentBackend.detachPaymentMethod.loading,
  establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
  establishmentList: getAvailableEstablishmentList(state),
  invoiceLoading: state.invoice.list.loading,
  member: getMemberDetail(state, props.memberId),
  memberLoading: state.member.loading,
  onlinePaymentEnabled: state.theme.theme.online_payment_enabled,
  payment_method_available_manager:
    state.theme.theme.payment_method_available_manager,
  stripeReaders: getStripeReaders(state),
  unpaidInvoiceList: withInvoiceItem(getInvoiceList)(state),
});

const mapDispatchToProps = {
  adjustCreditWithoutPaymentNote: adjustCreditWithoutPaymentNoteAction,
  applyBalanceToUnpaid: applyBalanceToUnpaidAction,
  applyGiftcardOnInvoice: applyGiftcardOnInvoiceAction,
  detachPaymentMethod: detachPaymentMethodAction,
  fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
  fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
  fetchConsumerGiftcardReceivedList: fetchConsumerGiftcardReceivedListAction,
  fetchEstablishments: fetchEstablishmentsAction,
  fetchGiftcardBulk: fetchGiftcardBulkAction,
  fetchInvoiceList: fetchInvoiceListAction,
  fetchMember: fetchMemberAction,
  fetchMemberBulkById: fetchMemberBulkByIdAction,
  fetchPaymentMethodList: fetchPaymentMethodListAction,
  push: routerPush,
  snackbarErrorMsg: snackbarWarning,
  snackbarSuccessMsg: snackbarSuccess,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConnectProps = ConnectedProps<typeof connector>;
type Props = OwnProps & ConnectProps;

/*
 * HOOKS
 */

const useBillingProblemHandlers = ({
  adjustCreditWithoutPaymentNote,
  applyBalanceToUnpaid,
  applyGiftcardOnInvoice,
  detachPaymentMethod,
  fetchConsumerGiftcardReceivedList,
  fetchGiftcardBulk,
  fetchInvoiceList,
  fetchMember,
  fetchMemberBulkById,
  fetchPaymentMethodList,
  memberId,
  onPaymentSuccess,
  push,
}: Partial<ConnectProps & OwnProps>) => {
  const handleFetchMemberPaymentMethod = useCallback(() => {
    fetchPaymentMethodList({ member: memberId });
  }, [fetchPaymentMethodList, memberId]);

  const handleDetachMemberPaymentMethod = useCallback(
    (pm_id: string, options: OptionCallback<unknown, number>) => {
      detachPaymentMethod(
        { member: memberId, payment_method_id: pm_id },
        {
          ...options,
          onSuccess: () => {
            handleFetchMemberPaymentMethod();
            options?.onSuccess?.();
          },
        },
      );
    },
    [detachPaymentMethod, handleFetchMemberPaymentMethod, memberId],
  );

  const handleFetchMemberInvoiceListUnpaid = useCallback(() => {
    fetchInvoiceList({
      is_v2: true,
      is_draft: false,
      unpaid: true,
      member: memberId,
    });
  }, [fetchInvoiceList, memberId]);

  const handleFetchConsumerGiftcardReceivedList = useCallback(
    (options?: OptionCallback) => {
      fetchConsumerGiftcardReceivedList(
        memberId,
        {
          page: 1,
          page_size: 100,
          active: true,
          reverted: false,
          has_amount_left: true,
          in_timeframe: true,
        },
        {
          onSuccess: (_consumerGiftcardList: ConsumerGiftcard[]) => {
            fetchGiftcardBulk(_consumerGiftcardList.map((cg) => cg.giftcard));
            fetchMemberBulkById([
              ..._consumerGiftcardList.map((cg) => cg.src_member),
              ..._consumerGiftcardList.map((cg) => cg.dst_member),
            ]);
            options?.onSuccess?.();
          },
          onError: () => {
            options?.onError?.();
          },
        },
      );
    },
    [
      fetchConsumerGiftcardReceivedList,
      fetchGiftcardBulk,
      fetchMemberBulkById,
      memberId,
    ],
  );

  const handleApplyGiftcardOnInvoice = useCallback(
    (
      invoice_uuid: string,
      consumerGiftCardId: number,
      amount: number,
      options?: OptionCallback,
    ) => {
      applyGiftcardOnInvoice(invoice_uuid, consumerGiftCardId, amount, {
        onSuccess: () => {
          options?.onSuccess?.();
          onPaymentSuccess?.();
        },
        onError: () => {
          options?.onError?.();
          onPaymentSuccess?.();
        },
      });
    },

    [applyGiftcardOnInvoice, onPaymentSuccess],
  );

  const handleApplyBalanceToUnpaidInvoices = useCallback(() => {
    applyBalanceToUnpaid(memberId, {
      onSuccess: () => {
        onPaymentSuccess?.();
      },
    });
  }, [applyBalanceToUnpaid, memberId, onPaymentSuccess]);

  const handleAdjustCreditWithoutPaymentNote = useCallback(
    (amount: number) => {
      adjustCreditWithoutPaymentNote(memberId, amount, {
        onSuccess: () => {
          onPaymentSuccess?.();
        },
      });
    },
    [adjustCreditWithoutPaymentNote, memberId, onPaymentSuccess],
  );

  const handleFetchInitialData = useCallback(() => {
    if (memberId) {
      fetchMember(memberId);
      handleFetchMemberInvoiceListUnpaid();
      handleFetchConsumerGiftcardReceivedList();
    }
  }, [
    fetchMember,
    handleFetchConsumerGiftcardReceivedList,
    handleFetchMemberInvoiceListUnpaid,
    memberId,
  ]);

  const handleGoToInvoice = useCallback(
    (invoiceUuid: string) => {
      push(`/invoice/${invoiceUuid}`);
    },
    [push],
  );

  return {
    handleAdjustCreditWithoutPaymentNote,
    handleApplyBalanceToUnpaidInvoices,
    handleApplyGiftcardOnInvoice,
    handleDetachMemberPaymentMethod,
    handleFetchConsumerGiftcardReceivedList,
    handleFetchInitialData,
    handleFetchMemberInvoiceListUnpaid,
    handleFetchMemberPaymentMethod,
    handleGoToInvoice,
  };
};

const usePaymentDialogState = ({ companyTheme }: Partial<ConnectProps>) => {
  const [paymentMethodType, setPaymentMethodType] = useState<
    'sepa_debit' | 'card' | 'bacs_debit'
  >(companyTheme.currency === 'eur' ? 'sepa_debit' : 'card');

  const [isAddPaymentMethodDialogOpen, setIsAddPaymentMethodDialogOpen] =
    useState(false);

  const handleChangePaymentMethodType = useCallback(
    (value) => {
      setPaymentMethodType(value);
    },
    [setPaymentMethodType],
  );

  const handleCloseAddPaymentMethodDialog = useCallback(() => {
    setIsAddPaymentMethodDialogOpen(false);
  }, [setIsAddPaymentMethodDialogOpen]);

  return {
    paymentMethodType,
    isAddPaymentMethodDialogOpen,
    handleCloseAddPaymentMethodDialog,
    handleChangePaymentMethodType,
  };
};

/*
 * COMPONENT
 */

const ConnectedBillingProblemCard: React.FC<Props> = React.memo(
  ({
    adjustCreditWithoutPaymentNote,
    applyBalanceToUnpaid,
    applyGiftcardOnInvoice,
    companyCountry,
    companyId,
    companyTheme,
    consumerGiftcardList,
    detachPaymentMethod,
    detachPaymentMethodLoading,
    establishmentBillingGroups,
    establishmentList,
    fetchAllEstablishmentBillingGroup,
    fetchAllEstablishmentGroup,
    fetchConsumerGiftcardReceivedList,
    fetchEstablishments,
    fetchGiftcardBulk,
    fetchInvoiceList,
    fetchMember,
    fetchMemberBulkById,
    fetchPaymentMethodList,
    invoiceLoading,
    member,
    memberId,
    memberLoading,
    onlinePaymentEnabled,
    onPaymentSuccess,
    payment_method_available_manager,
    push,
    snackbarErrorMsg,
    snackbarSuccessMsg,
    stripeReaders,
    unpaidInvoiceList,
  }) => {
    const stripeRegion = getStripeRegion();

    const requestSetupIntentSecret = useCallback(
      () => requestSetupIntentSecretAPI(memberId, null),
      [memberId],
    );

    const {
      handleAdjustCreditWithoutPaymentNote,
      handleApplyBalanceToUnpaidInvoices,
      handleApplyGiftcardOnInvoice,
      handleDetachMemberPaymentMethod,
      handleFetchInitialData,
      handleFetchMemberInvoiceListUnpaid,
      handleFetchMemberPaymentMethod,
      handleGoToInvoice,
    } = useBillingProblemHandlers({
      adjustCreditWithoutPaymentNote,
      applyBalanceToUnpaid,
      applyGiftcardOnInvoice,
      companyId,
      companyTheme,
      detachPaymentMethod,
      fetchAllEstablishmentBillingGroup,
      fetchAllEstablishmentGroup,
      fetchConsumerGiftcardReceivedList,
      fetchEstablishments,
      fetchGiftcardBulk,
      fetchInvoiceList,
      fetchMember,
      fetchMemberBulkById,
      fetchPaymentMethodList,
      memberId,
      onPaymentSuccess,
      push,
    });

    const {
      paymentMethodType,
      isAddPaymentMethodDialogOpen,
      handleCloseAddPaymentMethodDialog,
      handleChangePaymentMethodType,
    } = usePaymentDialogState({ companyTheme });

    useEffect(() => {
      handleFetchInitialData();
    }, [memberId, handleFetchInitialData]);

    const memberAccountBalanceIsPositiveOrNull =
      member?.credit_account_balance >= 0;

    const memberHasNoUnpaidInvoice = Array.isArray(unpaidInvoiceList)
      ? unpaidInvoiceList.length === 0
      : unpaidInvoiceList === null;

    if (
      !member ||
      memberLoading ||
      (memberAccountBalanceIsPositiveOrNull && memberHasNoUnpaidInvoice)
    ) {
      return null;
    }

    return (
      <>
        <MemberBillingProblemCard
          hidePositiveBalanceForManager
          adjustCreditWithoutPaymentNote={handleAdjustCreditWithoutPaymentNote}
          applyBalanceToInvoice={handleApplyBalanceToUnpaidInvoices}
          applyGiftcardOnInvoice={handleApplyGiftcardOnInvoice}
          asConsumer={false}
          availablePaymentMethodList={payment_method_available_manager}
          balance={member?.credit_account_balance}
          cardBillingDetailsMandatory={
            companyTheme.force_billing_details_on_cards
          }
          companyId={companyId}
          consumerGiftcardList={consumerGiftcardList}
          detachPaymentMethod={handleDetachMemberPaymentMethod}
          detachPaymentMethodLoading={detachPaymentMethodLoading}
          enableMultiLocalization={companyTheme.enable_multi_localization}
          establishmentBillingGroups={establishmentBillingGroups}
          establishments={establishmentList}
          fetchInvoiceListUnpaid={handleFetchMemberInvoiceListUnpaid}
          forceOnlyInternal={onlinePaymentEnabled === false}
          goToInvoice={handleGoToInvoice}
          invoiceLoading={invoiceLoading}
          member={member}
          memberId={memberId}
          memberLoading={!member}
          onlinePaymentEnabled={onlinePaymentEnabled}
          onPaymentSuccess={onPaymentSuccess}
          paperVariant="outlined"
          snackbarErrorMsg={snackbarErrorMsg}
          snackbarSuccessMsg={snackbarSuccessMsg}
          stripePaymentElementConfig={{
            isDefaultForRegion: companyTheme.is_default_for_region,
            stripeId: companyTheme.stripe_id,
          }}
          stripeReaders={stripeReaders || []}
          unpaidInvoiceList={unpaidInvoiceList}
        />
        {!!memberId && !!companyCountry && !!stripeRegion && (
          <PaymentModal isOpen={isAddPaymentMethodDialogOpen}>
            <AddPaymentMethod
              addViaTerminal
              cardBillingDetailsMandatory={
                companyTheme.force_billing_details_on_cards
              }
              companyId={companyTheme.company}
              disabled={false}
              enabledPaymentMethods={getBackofficeBillingPlanEnabledPaymentMethods(
                {
                  currency: companyTheme.currency,
                  companyCountry,
                  stripeRegion,
                },
              )}
              onCancel={handleCloseAddPaymentMethodDialog}
              onChange={handleChangePaymentMethodType}
              paymentMethodType={paymentMethodType}
              refreshSavedPaymentMethodList={handleFetchMemberPaymentMethod}
              requestSetupIntentSecret={requestSetupIntentSecret}
              sepaDefaultEmail={member ? member.email : ''}
              sepaDefaultName={member ? member.name : ''}
              stripeReaders={stripeReaders || []}
            />
          </PaymentModal>
        )}
      </>
    );
  },
);

export default compose<Props, OwnProps>(connector)(ConnectedBillingProblemCard);
