import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import {
  push as pushAction,
  replace as replaceAction,
} from 'connected-react-router';

import { PAYMENT_INTENT_STATUS_SUCCESS } from '@bsport/common/lib/master-data/payment-group.js';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import { getPaymentGroupStatus as getPaymentGroupStatusAPI } from '#src/libs/payment/api';
import {
  assignInstalmentPayment as assignInstalmentPaymentAction,
  createOrRefreshInternalAccountPrepaidLine as createOrRefreshInternalAccountPrepaidLineAction,
  fetchBasket as fetchBasketAction,
  patchCurrentBasket as patchCurrentBasketAction,
  removeItemFromBasket as removeItemFromBasketAction,
  updateQuicksaleBasketMember as updateQuicksaleBasketMemberAction,
} from '#src/libs/checkout/actions';
import { getBasket } from '#src/libs/checkout/selectors';

import {
  detachPaymentMethod as detachPaymentMethodAction,
  fetchPaymentGroup as fetchPaymentGroupAction,
  updatePaymentGroupPriceCts,
} from '#src/libs/payment/actions';

import {
  fetchPaymentList as fetchPaymentListAction,
  getInvoiceReceiptUrl as getInvoiceReceiptUrlAction,
} from '#src/libs/invoice/actions';
import { getPaymentList } from '#src/libs/invoice/selectors';

import { fetchInstalmentPaymentByBasket as fetchInstalmentPaymentByBasketAction } from '#src/libs/instalment-payment-configuration/actions';

import { getMemberListData } from '#src/libs/member/selectors';
import {
  createOrUpdateMember,
  fetchMemberBulk,
  search,
} from '#src/libs/member/actions';
import MemberSearchDialog from '#src/libs/member/components/MemberSearchDialog';
import { MemberMap } from '#src/libs/member/utils';

import { snackbarWarning } from '#src/libs/snackbar/actions';

import QuicksaleDialogs from '#src/libs/quicksale/components/QuicksaleDialogs.component';

import { getUserRoleByIdentity } from '#src/libs/role/selectors';
import { getStaffEstablishmentBillingGroup } from '#src/libs/role/utils';
import { fetchCompanyUserRoles as fetchCompanyUserRolesAction } from '#src/libs/role/actions';

import { getCompanyCountry } from '#src/libs/theme/selectors';

import { getEnabledEstablishmentBillingGroups } from '#src/libs/establishment/selectors';
import { fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction } from '#src/libs/establishment/actions';

import { getFeatureList as getFeatureListAction } from '#src/libs/company/actions';
import { fetchStripeReaders as fetchStripeReadersAction } from '#src/libs/terminal/actions';
import { getStripeReaders } from '#src/libs/terminal/selectors';
import { getInstalmentForBasketList } from '#src/libs/instalment-payment-configuration/selectors';

// @ts-expect-error
import { mapFormData } from '#src/pages/form.utils';
import QuicksaleCheckout from './QuicksaleCheckout.component';
import {
  useFetchPaymentGroupWithRetry,
  useModals,
  useQuicksalePayments,
} from './hooks';

import { QuicksaleDeliveryType } from '#src/libs/quicksale/constants';
import type { Basket, BasketAddress } from '#src/libs/checkout/types';
import type { MemberFormData } from '#src/libs/member/types';
import type { PaymentGroup } from '#src/libs/payment/types';
import type { RootState } from '#src/reducers';
import type { OptionCallback } from '#src/state/types';

const NEXT_PAYMENT_INTENT_STATUS_CHECK_SECONDS = 1.5;

type Props = {
  basketId: string;
} & ConnectedProps<typeof connector>;

const QuicksalePayment: React.FC<Props> = ({
  basketId,
  basket,
  memberById,
  theme,
  quicksaleStaffFullName,
  userRole,
  paymentList,
  stripeReaders,
  instalmentPaymentConfigurationList,
  fetchBasket,
  fetchMembers,
  fetchCompanyUserRoles,
  fetchPaymentGroup,
  fetchAllEstablishmentBillingGroup,
  getInvoiceReceiptUrl,
  establishmentBillingGroups,
  push,
  replace,
  searchMembers,
  createMemberAction,
  updateQuicksaleBasketMember,
  updatePaymentGroupPrice,
  fetchPaymentList,
  // (Quicksale MVP): Hide Coupon
  // attachCoupon,
  removeItemFromBasket,
  getFeatureList,
  fetchStripeReaders,
  fetchInstalmentPaymentByBasket,
  assignInstalmentPayment,
  createOrRefreshInternalAccountPrepaidLine,
  // detachPaymentMethod,
  // detachPaymentMethodLoading,
  snackbarErrorMsg,
}) => {
  const goBack = React.useCallback(() => {
    push('/quicksale/');
  }, [push]);

  const [loading, setLoading] = React.useState(true);
  const [qrCodeValue, setQrCodeValue] = React.useState('');

  const {
    clientSecret,
    isProcessing,
    setIsProcessing,
    paymentGroupId,
    paymentGroupPriceCts,
    setPaymentGroupPriceCts,
    paymentMethod,
    availablePaymentMethods,
    setPaymentMethod,
  } = useQuicksalePayments({ basket, setLoading });

  const member = memberById[basket?.member];

  const {
    showCannotSignOutModal,
    showMemberAuthenticationModal,
    showWarningRemovedItemsModal,
    setShowWarningRemovedItemsModal,
    showPaymentSuccessModal,
    setShowPaymentSuccessModal,
    showPartialPaymentSuccesModal,
    setShowPartialPaymentSuccesModal,
    openCannotSignOutModal,
    closeCannotSignOutModal,
    openMemberModal,
    closeMemberModal,
    closeWarningRemovedItemsModal,
    someObjectsRequireAuthentication,
    setSomeObjectsRequireAuthentication,
  } = useModals({ goBack, basket, member });

  const fetchPaymentGroupWithRetry = useFetchPaymentGroupWithRetry({
    paymentGroupId,
    fetchPaymentGroup,
    getInvoiceReceiptUrl,
    setQrCodeValue,
    snackbarErrorMsg,
  });

  // ===========================================

  const [basketAddress, setBasketAddress] = React.useState<BasketAddress>(null);

  const [deliveryType, setDeliveryType] = React.useState<QuicksaleDeliveryType>(
    QuicksaleDeliveryType.HomeDelivery,
  );

  // ========== Run initial fetches ==========

  // Fetch basket and associated member
  React.useEffect(() => {
    if (theme.enable_multi_localization) {
      fetchAllEstablishmentBillingGroup({ params: { company: theme.company } });
      fetchCompanyUserRoles();
    }
    fetchBasket(basketId, {
      onSuccess: (fetchedBasket) => {
        if (!fetchedBasket) return;

        fetchMembers({ id__in: [fetchedBasket.member] });

        if (fetchedBasket.invoice) {
          fetchPaymentList({
            invoice__uuid: fetchedBasket.invoice,
            page: 1,
            page_size: 100,
          });
        }

        if (fetchedBasket.is_finalized) {
          setShowPaymentSuccessModal(true);
        }
      },
      onError: () => push('/quicksale/'),
    });
  }, [
    basketId,
    fetchAllEstablishmentBillingGroup,
    fetchBasket,
    fetchCompanyUserRoles,
    fetchMembers,
    fetchPaymentList,
    setShowPaymentSuccessModal,
    theme.company,
    theme.enable_multi_localization,
  ]);

  React.useEffect(() => {
    fetchInstalmentPaymentByBasket(basketId);
  }, [
    basket?.total_price,
    basket?.total_price_prepaid_lines_cts,
    fetchInstalmentPaymentByBasket,
    basketId,
    basket?.instalment_payment,
  ]);

  const alreadyPaidAmount = React.useMemo(
    () =>
      paymentList
        ?.filter((paymentItem) => paymentItem.invoice === basket?.invoice)
        ?.reduce(
          (acc, paymentItem) => acc + parseFloat(paymentItem.price),
          0,
        ) ?? 0,
    [paymentList, basket?.invoice],
  );

  // Fetch stripe readers for terminal payment
  React.useEffect(() => {
    if (theme.online_payment_enabled) fetchStripeReaders();
  }, [fetchStripeReaders, theme.online_payment_enabled]);

  // Fetch features list
  React.useEffect(() => {
    getFeatureList();
  }, [getFeatureList]);

  // Fetch paymentGroup and receipt URL to set the QR code rendered in the payment success modal
  React.useEffect(() => {
    if (showPaymentSuccessModal && paymentGroupId) {
      fetchPaymentGroupWithRetry();
    }
  }, [showPaymentSuccessModal, paymentGroupId, fetchPaymentGroupWithRetry]);

  // =========================================

  // ========== Member authentication handlers ==========

  const createMember = React.useCallback(
    (data: MemberFormData, options: OptionCallback) => {
      const memberData = data;
      if (!memberData.birthday) delete memberData.birthday;

      const formData = mapFormData(memberData, MemberMap);
      createMemberAction(null, formData, options);
    },
    [createMemberAction],
  );

  // The authentication of a member is used either to assign the current basket
  // to a member, or to subscribe a member to a contract.
  const onMemberAuthenticate = React.useCallback(
    (memberId: number | null) => {
      if (!memberId || !basket) return;

      if (!memberById[memberId]) {
        fetchMembers({ id__in: [memberId] }, {});
      }

      updateQuicksaleBasketMember(basket.id, memberId, {
        onSuccess: (updateData) => {
          if (updateData.updated_member) {
            closeMemberModal();
            setSomeObjectsRequireAuthentication(false);
            replace(`/quicksale/checkout/${updateData.new_basket.id}/`);
            if (updateData.has_removed_incompatible_items)
              setShowWarningRemovedItemsModal(true);
          }
        },
      });
    },
    [
      basket,
      memberById,
      updateQuicksaleBasketMember,
      fetchMembers,
      closeMemberModal,
      setSomeObjectsRequireAuthentication,
      replace,
      setShowWarningRemovedItemsModal,
    ],
  );

  // =====================================================

  // ========== Payment validation ==========

  const closePaymentSuccessModal = React.useCallback(() => {
    setIsProcessing(false);
    setLoading(false);
    goBack();
    setShowPartialPaymentSuccesModal(false);
    setShowPaymentSuccessModal(false);
  }, [
    goBack,
    setIsProcessing,
    setShowPartialPaymentSuccesModal,
    setShowPaymentSuccessModal,
  ]);

  const onPaymentSuccess = React.useCallback(
    (callback?: () => void) => {
      getPaymentGroupStatusAPI(paymentGroupId)
        .then((body) => {
          if (body.data >= PAYMENT_INTENT_STATUS_SUCCESS) {
            setTimeout(() => {
              callback?.();
              if (
                !member?.is_pos &&
                basket &&
                paymentGroupPriceCts / 100 !==
                  basket.total_price_cts / 100 - alreadyPaidAmount
              )
                setShowPartialPaymentSuccesModal(true);
              else setShowPaymentSuccessModal(true);
            }, 2000);
          } else {
            setTimeout(
              onPaymentSuccess,
              NEXT_PAYMENT_INTENT_STATUS_CHECK_SECONDS * 1000,
            );
          }
        })
        .catch(console.error);
    },
    [
      alreadyPaidAmount,
      basket,
      paymentGroupId,
      member?.is_pos,
      paymentGroupPriceCts,
      setShowPartialPaymentSuccesModal,
      setShowPaymentSuccessModal,
    ],
  );

  // ========================================

  const editPaymentGroupPrice = React.useCallback(
    (price: number, options?: OptionCallback<PaymentGroup>) => {
      setLoading(true);
      updatePaymentGroupPrice(paymentGroupId, price * 100, {
        onSuccess: (paymentGroup) => {
          setPaymentGroupPriceCts(paymentGroup.price_cts);
          setLoading(false);
          options?.onSuccess?.(paymentGroup);
        },
        onError: options?.onError,
      });
    },
    [paymentGroupId, updatePaymentGroupPrice, setPaymentGroupPriceCts],
  );

  const removeCoupon = React.useCallback(
    (data: { checkout_item: string; quantity: number }) => {
      setLoading(true);
      removeItemFromBasket(basketId, data);
    },
    [basketId, removeItemFromBasket],
  );

  // (Quicksale MVP): Hide Coupon
  /*const addCoupon = React.useCallback(
    (code: string, options?: OptionCallback<Basket>) => {
      setLoading(true);
      attachCoupon(basketId, code, options);
    },
    [attachCoupon, basketId],
  );*/

  /*const removePaymentMethod = React.useCallback(
    (paymentMethodId: string, options: OptionCallback<unknown, number>) => {
      detachPaymentMethod(
        {
          payment_method_id: paymentMethodId,
          member: basket?.member,
        },
        options,
      );
    },
    [basket?.member, detachPaymentMethod],
  );

  const checkItemsBasket = React.useCallback(
    async (id: string) => {
      try {
        await checkItemsBasketAPI(id);
      } catch (error) {
        if (isErrorWithCustomCode(error) && error.response.data) {
          error.response.data.forEach((exc: { error_code: number }) => {
            const { error_code } = exc;
            if (ALL_ERROR_CODES.includes(error_code)) {
              snackbarErrorMsg(`canNotBuyErrorCode.${error_code}`);
            } else {
              snackbarErrorMsg('canNotBuyErrorCode.generic');
            }
          });
          fetchBasket(basketId);
          return false;
        }
      }
      return true;
    },
    [basketId, fetchBasket, snackbarErrorMsg],
  );*/

  const staffEstablishmentBillingGroup = getStaffEstablishmentBillingGroup(
    userRole,
    establishmentBillingGroups,
  );

  const companyCountry = getCompanyCountry();

  // ========== Instalment payments ==========
  const instalmentPaymentConfigurationListForCurrentBasket = React.useMemo(
    () =>
      instalmentPaymentConfigurationList.filter(
        (instalmentPayment) => instalmentPayment.basketId === basketId,
      ),
    [basketId, instalmentPaymentConfigurationList],
  );

  const onSelectInstalmentPayment = React.useCallback(
    (instalment_payment: number, options?: OptionCallback<Basket>) => {
      assignInstalmentPayment(basketId, instalment_payment, options);
    },
    [assignInstalmentPayment, basketId],
  );

  // =========================================

  // ========== Internal account ==========

  // (Quicksale MVP): CreditCard and Sepa payment methods disabled
  // const useInternalAccount = React.useCallback(
  //   (amount: number, options?: OptionCallback<Basket>) => {
  //     createOrRefreshInternalAccountPrepaidLine(basketId, amount, options);
  //   },
  //   [basketId, createOrRefreshInternalAccountPrepaidLine],
  // );

  const removeInternalAccountPrepaidLine = React.useCallback(
    (options?: OptionCallback<Basket>) => {
      createOrRefreshInternalAccountPrepaidLine(basketId, 0, options);
    },
    [basketId, createOrRefreshInternalAccountPrepaidLine],
  );

  return (
    <>
      <QuicksaleCheckout
        alreadyPaidAmount={alreadyPaidAmount}
        // (Quicksale MVP): Hide Coupon
        // attachCoupon={addCoupon}
        availablePaymentMethods={availablePaymentMethods}
        basket={basket}
        basketAddress={basketAddress}
        clientSecret={clientSecret}
        deliveryType={deliveryType}
        editPaymentGroupPrice={editPaymentGroupPrice}
        goBack={goBack}
        instalmentPaymentConfigurationList={
          instalmentPaymentConfigurationListForCurrentBasket
        }
        isProcessing={isProcessing}
        loading={loading}
        member={member}
        onPaymentSuccess={onPaymentSuccess}
        onSelectInstalmentPayment={onSelectInstalmentPayment}
        onSignOut={openCannotSignOutModal}
        openMemberAuthenticationModal={openMemberModal}
        paymentGroup={paymentGroupId}
        paymentGroupPriceCts={paymentGroupPriceCts}
        quicksaleStaffFullName={quicksaleStaffFullName}
        removeCoupon={removeCoupon}
        removeInternalAccountPrepaidLine={removeInternalAccountPrepaidLine}
        selectedPaymentMethod={paymentMethod}
        setBasketAddress={setBasketAddress}
        setDeliveryType={setDeliveryType}
        setIsProcessing={setIsProcessing}
        setLoading={setLoading}
        setSelectedPaymentMethod={setPaymentMethod}
        staffEstablishmentBillingGroupName={
          staffEstablishmentBillingGroup?.name || ''
        }
        stripeReaders={stripeReaders}
        theme={theme}
        // (Quicksale MVP): Internal account disabled
        // useInternalAccount={useInternalAccount}
        // (Quicksale MVP): CreditCard and Sepa payment methods disabled
        /* checkItemsBasket={checkItemsBasket}
        detachPaymentMethodLoading={detachPaymentMethodLoading}
        removePaymentMethod={removePaymentMethod} */
      />

      <QuicksaleDialogs
        closePartialPaymentSuccesModal={closePaymentSuccessModal}
        closePaymentSuccessModal={closePaymentSuccessModal}
        closeStillOpenBasketsModal={closeCannotSignOutModal}
        closeWarningRemovedItemsModal={closeWarningRemovedItemsModal}
        qrCodeValue={qrCodeValue}
        showPartialPaymentSuccesModal={showPartialPaymentSuccesModal}
        showPaymentSuccessModal={showPaymentSuccessModal}
        showStillOpenBasketsModal={showCannotSignOutModal}
        showWarningRemovedItemsModal={showWarningRemovedItemsModal}
      />

      <MemberSearchDialog
        companyCountry={companyCountry}
        createMember={createMember}
        isAuthenticationRequired={someObjectsRequireAuthentication}
        onClose={closeMemberModal}
        onMemberChoose={onMemberAuthenticate}
        open={showMemberAuthenticationModal}
        preSelectedMemberId={basket && !member?.is_pos ? basket.member : null}
        searchMembers={searchMembers}
      />
    </>
  );
};

const connector = connect(
  (state: RootState, { basketId }: { basketId: string }) => ({
    basket: getBasket(state, basketId),
    memberById: getMemberListData(state),
    theme: state.theme.theme,
    quicksaleStaffFullName: state.auth.name,
    userRole: getUserRoleByIdentity(state),
    paymentList: getPaymentList(state),
    featureList: state.company.feature.data,
    stripeReaders: getStripeReaders(state),
    detachPaymentMethodLoading:
      state.paymentBackend.detachPaymentMethod.loading,
    instalmentPaymentConfigurationList: getInstalmentForBasketList(state),
    establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
  }),
  {
    fetchBasket: fetchBasketAction,
    fetchMembers: fetchMemberBulk,
    fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
    fetchCompanyUserRoles: fetchCompanyUserRolesAction,
    push: pushAction,
    replace: replaceAction,
    searchMembers: search,
    createMemberAction: createOrUpdateMember,
    updateQuicksaleBasketMember: updateQuicksaleBasketMemberAction,
    updatePaymentGroupPrice: updatePaymentGroupPriceCts,
    fetchPaymentList: fetchPaymentListAction,
    fetchPaymentGroup: fetchPaymentGroupAction,
    getInvoiceReceiptUrl: getInvoiceReceiptUrlAction,
    // (Quicksale MVP): Hide Coupon
    // attachCoupon: attachCouponAction,
    removeItemFromBasket: removeItemFromBasketAction,
    patchCurrentBasket: patchCurrentBasketAction,
    getFeatureList: getFeatureListAction,
    fetchStripeReaders: fetchStripeReadersAction,
    detachPaymentMethod: detachPaymentMethodAction,
    snackbarErrorMsg: snackbarWarning,
    fetchInstalmentPaymentByBasket: fetchInstalmentPaymentByBasketAction,
    assignInstalmentPayment: assignInstalmentPaymentAction,
    createOrRefreshInternalAccountPrepaidLine:
      createOrRefreshInternalAccountPrepaidLineAction,
  },
);

export default compose(
  routerParamsToProps({ basketId: 'basketId:string' }),
  connector,
  React.memo,
)(QuicksalePayment);
