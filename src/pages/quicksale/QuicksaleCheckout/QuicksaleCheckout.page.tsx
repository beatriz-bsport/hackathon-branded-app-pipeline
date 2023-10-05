import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { compose } from 'recompose';
import {
  push as pushAction,
  replace as replaceAction,
} from 'connected-react-router';

import ALL_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';

// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';

import { RootState } from '../../../reducers';

import {
  fetchBasket as fetchBasketAction,
  updateQuicksaleBasketMember as updateQuicksaleBasketMemberAction,
  attachCoupon as attachCouponAction,
  removeItemFromBasket as removeItemFromBasketAction,
  patchCurrentBasket as patchCurrentBasketAction,
  assignInstalmentPayment as assignInstalmentPaymentAction,
  createOrRefreshInternalAccountPrepaidLine as createOrRefreshInternalAccountPrepaidLineAction,
} from '#libs/checkout/actions';
import { getBasket } from '#libs/checkout/selectors';

import {
  updatePaymentGroupPriceCts,
  detachPaymentMethod as detachPaymentMethodAction,
} from '#libs/payment/actions';
import { checkItemsBasket as checkItemsBasketAPI } from '#libs/payment/api';

import { fetchPaymentList as fetchPaymentListAction } from '#libs/invoice/actions';
import { getPaymentList } from '#libs/invoice/selectors';

import { fetchInstalmentPaymentByBasket as fetchInstalmentPaymentByBasketAction } from '#libs/instalment-payment-configuration/actions';

import { getMemberListData } from '#libs/member/selectors';
import {
  createOrUpdateMember,
  fetchMemberBulk,
  search,
} from '#libs/member/actions';
import MemberSearchDialog from '#libs/member/components/MemberSearchDialog';
import { MemberMap } from '#libs/member/utils';

import { snackbarWarning } from '#libs/snackbar/actions';

import QuicksaleDialogs from '#libs/quicksale/components/QuicksaleDialogs.component';

import { getCompanyCountry } from '#libs/theme/selectors';

import type { OptionCallback } from '../../../state/types';
// @ts-expect-error
import { mapFormData } from '../../form.utils';
import QuicksaleCheckout from './QuicksaleCheckout.component';
import type { PaymentGroup } from '#libs/payment/types';
import type { Basket, BasketAddress } from '#libs/checkout/types';
import { QuicksaleDeliveryType } from '#libs/quicksale/constants';
import { getFeatureList as getFeatureListAction } from '#libs/company/actions';
import { fetchStripeReaders as fetchStripeReadersAction } from '#libs/terminal/actions';
import { getStripeReaders } from '#libs/terminal/selectors';
import { useQuicksalePayments, useModals } from './hooks';
import { getInstalmentForBasketList } from '#libs/instalment-payment-configuration/selectors';

type Props = {
  basketId: string;
} & ConnectedProps<typeof connector>;

const QuicksalePayment: React.FC<Props> = ({
  basketId,
  basket,
  memberById,
  theme,
  quicksaleStaffFullName,
  paymentList,
  stripeReaders,
  detachPaymentMethodLoading,
  instalmentPaymentConfigurationList,
  fetchBasket,
  fetchMembers,
  push,
  replace,
  searchMembers,
  createMemberAction,
  updateQuicksaleBasketMember,
  updatePaymentGroupPrice,
  fetchPaymentList,
  attachCoupon,
  removeItemFromBasket,
  getFeatureList,
  fetchStripeReaders,
  detachPaymentMethod,
  snackbarErrorMsg,
  fetchInstalmentPaymentByBasket,
  assignInstalmentPayment,
  createOrRefreshInternalAccountPrepaidLine,
}) => {
  const goBack = React.useCallback(() => {
    push('/quicksale/');
  }, [push]);

  const [loading, setLoading] = React.useState(true);

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
  } = useQuicksalePayments({ basketId, setLoading, theme });

  const member = memberById[basket?.member];

  const {
    showCannotSignOutModal,
    showMemberAuthenticationModal,
    showWarningRemovedItemsModal,
    setShowWarningRemovedItemsModal,
    showPaymentSuccessModal,
    setShowPaymentSuccessModal,
    showAnonymousPaymentSuccessModal,
    showPartialPaymentSuccesModal,
    setShowAnonymousPaymentSuccessModal,
    openCannotSignOutModal,
    closeCannotSignOutModal,
    openMemberModal,
    closeMemberModal,
    closeWarningRemovedItemsModal,
    closeAnonymousPaymentSuccessModal,
    setShowPartialPaymentSuccesModal,
    someObjectsRequireAuthentication,
    setSomeObjectsRequireAuthentication,
  } = useModals({ goBack, basket, member });

  // ===========================================

  const [basketAddress, setBasketAddress] = React.useState<BasketAddress>(null);

  const [deliveryType, setDeliveryType] = React.useState<QuicksaleDeliveryType>(
    QuicksaleDeliveryType.HomeDelivery,
  );

  // ========== Run initial fetches ==========

  // Fetch basket and associated member
  React.useEffect(() => {
    fetchBasket(basketId, {
      onSuccess: (fetchedBasket) => {
        fetchMembers({ id__in: [fetchedBasket.member] });
        if (fetchedBasket.invoice)
          fetchPaymentList({
            invoice__uuid: fetchedBasket.invoice,
            page: 1,
            page_size: 100,
          });
      },
    });
  }, [basketId, fetchBasket, fetchMembers, fetchPaymentList]);

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

  // =========================================

  // ========== Member authentication handlers ==========

  const createMember = React.useCallback(
    (data: any, options: OptionCallback) => {
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
      callback?.();
      if (member?.is_pos) setShowAnonymousPaymentSuccessModal(true);
      else if (
        basket &&
        paymentGroupPriceCts / 100 !==
          basket.total_price_cts / 100 - alreadyPaidAmount
      )
        setShowPartialPaymentSuccesModal(true);
      else setShowPaymentSuccessModal(true);
    },
    [
      alreadyPaidAmount,
      basket,
      member?.is_pos,
      paymentGroupPriceCts,
      setShowAnonymousPaymentSuccessModal,
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

  const addCoupon = React.useCallback(
    (code: string, options?: OptionCallback<Basket>) => {
      setLoading(true);
      attachCoupon(basketId, code, options);
    },
    [attachCoupon, basketId],
  );

  const removePaymentMethod = React.useCallback(
    (paymentMethodId: string, options: OptionCallback) => {
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
        if (error.response?.status === 499 && error.response?.data) {
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

  const useInternalAccount = React.useCallback(
    (amount: number, options?: OptionCallback<Basket>) => {
      createOrRefreshInternalAccountPrepaidLine(basketId, amount, options);
    },
    [basketId, createOrRefreshInternalAccountPrepaidLine],
  );

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
        attachCoupon={addCoupon}
        availablePaymentMethods={availablePaymentMethods}
        basket={basket}
        basketAddress={basketAddress}
        checkItemsBasket={checkItemsBasket}
        clientSecret={clientSecret}
        deliveryType={deliveryType}
        detachPaymentMethodLoading={detachPaymentMethodLoading}
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
        removePaymentMethod={removePaymentMethod}
        selectedPaymentMethod={paymentMethod}
        setBasketAddress={setBasketAddress}
        setDeliveryType={setDeliveryType}
        setIsProcessing={setIsProcessing}
        setLoading={setLoading}
        setSelectedPaymentMethod={setPaymentMethod}
        stripeReaders={stripeReaders}
        theme={theme}
        useInternalAccount={useInternalAccount}
      />

      <QuicksaleDialogs
        closeAnonymousPaymentSuccessModal={closeAnonymousPaymentSuccessModal}
        closePartialPaymentSuccesModal={closePaymentSuccessModal}
        closePaymentSuccessModal={closePaymentSuccessModal}
        closeStillOpenBasketsModal={closeCannotSignOutModal}
        closeWarningRemovedItemsModal={closeWarningRemovedItemsModal}
        showAnonymousPaymentSuccessModal={showAnonymousPaymentSuccessModal}
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
    paymentList: getPaymentList(state),
    featureList: state.company.feature.data,
    stripeReaders: getStripeReaders(state),
    detachPaymentMethodLoading:
      state.paymentBackend.detachPaymentMethod.loading,
    instalmentPaymentConfigurationList: getInstalmentForBasketList(state),
  }),
  {
    fetchBasket: fetchBasketAction,
    fetchMembers: fetchMemberBulk,
    push: pushAction,
    replace: replaceAction,
    searchMembers: search,
    createMemberAction: createOrUpdateMember,
    updateQuicksaleBasketMember: updateQuicksaleBasketMemberAction,
    updatePaymentGroupPrice: updatePaymentGroupPriceCts,
    fetchPaymentList: fetchPaymentListAction,
    attachCoupon: attachCouponAction,
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
  routerParamsToProps({ basketId: 'basketId' }),
  connector,
  React.memo,
)(QuicksalePayment);
