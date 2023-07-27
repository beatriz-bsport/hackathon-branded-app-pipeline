import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { compose } from 'recompose';
import { push as pushAction } from 'connected-react-router';

import {
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_BASKET,
} from '@bsport/common/lib/master-data/payment-group';

// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';

import { RootState } from '../../../reducers';

import {
  fetchBasket as fetchBasketAction,
  updateQuicksaleBasketMember as updateQuicksaleBasketMemberAction,
  attachCoupon as attachCouponAction,
  removeItemFromBasket as removeItemFromBasketAction,
  patchCurrentBasket as patchCurrentBasketAction,
} from '#libs/checkout/actions';
import { getBasket } from '#libs/checkout/selectors';

import { updatePaymentGroupPriceCts } from '#libs/payment/actions';

import { fetchPaymentList as fetchPaymentListAction } from '#libs/invoice/actions';
import { getPaymentList } from '#libs/invoice/selectors';

import { requestClientSecret as requestClientSecretAPI } from '../../../libs/invoice/api';

import { getMemberListData } from '#libs/member/selectors';
import {
  createOrUpdateMember,
  fetchMemberBulk,
  search,
} from '#libs/member/actions';
import MemberSearchDialog from '#libs/member/components/MemberSearchDialog';
import { MemberMap } from '#libs/member/utils';

import QuicksaleDialogs from '#libs/quicksale/components/QuicksaleDialogs.component';

import { getCompanyCountry } from '#libs/theme/selectors';

import { OptionCallback } from '../../../state/types';
// @ts-expect-error
import { mapFormData } from '../../form.utils';
import QuicksaleCheckout from './QuicksaleCheckout.component';
import { PaymentGroup } from '#libs/payment/types';
import { Basket, BasketAddress } from '#libs/checkout/types';
import {
  QuicksaleDeliveryType,
  QuicksalePaymentMethod,
} from '#libs/quicksale/constants';
import { hasUpsell } from '#libs/platform-billing/utils';
import { UPSELL_IDENTIFIER_STRIPE_TERMINAL } from '#libs/platform-billing/upsell-identifiers';
import { getFeatureList as getFeatureListAction } from '#libs/company/actions';
import { fetchStripeReaders as fetchStripeReadersAction } from '#libs/terminal/actions';
import { getStripeReaders } from '#libs/terminal/selectors';

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
  featureList,
  stripeReaders,
  fetchBasket,
  fetchMembers,
  push,
  searchMembers,
  createMemberAction,
  updateQuicksaleBasketMember,
  updatePaymentGroupPrice,
  fetchPaymentList,
  attachCoupon,
  removeItemFromBasket,
  getFeatureList,
  fetchStripeReaders,
}) => {
  const goBack = React.useCallback(() => {
    push('/quicksale/');
  }, [push]);

  // ========== Client secret and payment info ==========
  const [clientSecret, setClientSecret] = React.useState<string>(null);

  const [isProcessing, setIsProcessing] = React.useState(false);

  const [paymentGroupId, setPaymentGroupId] = React.useState<number>(null);

  const [paymentGroupPriceCts, setPaymentGroupPriceCts] =
    React.useState<number>(null);

  const [paymentEngine, setPaymentEngine] = React.useState<number | null>(null);

  const [selectedPaymentMethod, changeSelectedPaymentMethod] =
    React.useState<QuicksalePaymentMethod>(null);

  // Change payment engine accordingly with the selected payment method
  const setSelectedPaymentMethod = React.useCallback(
    (newPaymentMethod: QuicksalePaymentMethod) => {
      changeSelectedPaymentMethod(newPaymentMethod);
      if (
        newPaymentMethod === QuicksalePaymentMethod.Manual &&
        paymentEngine !== PAYMENT_ENGINE_BSPORT
      ) {
        setPaymentEngine(PAYMENT_ENGINE_BSPORT);
      } else if (
        newPaymentMethod !== QuicksalePaymentMethod.Manual &&
        paymentEngine !== PAYMENT_ENGINE_STRIPE
      )
        setPaymentEngine(PAYMENT_ENGINE_STRIPE);
    },
    [paymentEngine],
  );

  const availablePaymentMethods: QuicksalePaymentMethod[] = React.useMemo(
    () => [
      ...(hasUpsell(featureList, UPSELL_IDENTIFIER_STRIPE_TERMINAL)
        ? [QuicksalePaymentMethod.StripeTerminal]
        : []),
      QuicksalePaymentMethod.Manual,
      QuicksalePaymentMethod.CreditCard,
      QuicksalePaymentMethod.Sepa,
    ],
    [featureList],
  );

  React.useEffect(() => {
    if (theme?.online_payment_enabled) setPaymentEngine(PAYMENT_ENGINE_STRIPE);
    else setPaymentEngine(PAYMENT_ENGINE_BSPORT);
  }, [theme?.online_payment_enabled]);

  React.useEffect(() => {
    if (featureList) changeSelectedPaymentMethod(availablePaymentMethods[0]);
  }, [availablePaymentMethods, featureList]);

  // ========== States for the modals ==========

  const [showCannotSignOutModal, setShowCannotSignOutModal] =
    React.useState(false);

  const [showMemberAuthenticationModal, setShowMemberAuthenticationModal] =
    React.useState(false);

  const [showWarningRemovedItemsModal, setShowWarningRemovedItemsModal] =
    React.useState(false);

  const [showPaymentSuccessModal, setShowPaymentSuccessModal] =
    React.useState(false);

  const [
    showAnonymousPaymentSuccessModal,
    setShowAnonymousPaymentSuccessModal,
  ] = React.useState(false);

  const openCannotSignOutModal = React.useCallback(() => {
    setShowCannotSignOutModal(true);
  }, []);

  const closeCannotSignOutModal = React.useCallback(() => {
    setShowCannotSignOutModal(false);
  }, []);

  const openMemberModal = React.useCallback(() => {
    setShowMemberAuthenticationModal(true);
  }, []);

  const closeMemberModal = React.useCallback(() => {
    setShowMemberAuthenticationModal(false);
  }, []);

  const closeWarningRemovedItemsModal = React.useCallback(() => {
    setShowWarningRemovedItemsModal(false);
  }, []);

  const closeAnonymousPaymentSuccessModal = React.useCallback(() => {
    setShowAnonymousPaymentSuccessModal(false);
    goBack();
  }, [goBack]);

  // ===========================================

  const [loading, setLoading] = React.useState(true);

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

  // Fetch client secret and payment group id
  const fetchOrRefreshPaymentGroup = React.useCallback(
    (
      currentPaymentEngine: number | null,
      currentPaymentMethod: QuicksalePaymentMethod | null,
    ) => {
      if (currentPaymentEngine !== null) {
        setLoading(true);
        requestClientSecretAPI(
          currentPaymentEngine,
          PAYMENT_INTENT_TYPE_BASKET,
          {
            basket: basketId,
            is_physical_payment_intent:
              currentPaymentMethod === QuicksalePaymentMethod.StripeTerminal,
          },
        )
          .then(({ data }) => {
            setClientSecret(data.client_secret);
            setPaymentGroupId(data.payment_group);
            setPaymentGroupPriceCts(data.price_cts);
            setLoading(false);
          })
          .catch((err) => console.error(err));
      }
    },
    [basketId],
  );

  React.useEffect(() => {
    fetchOrRefreshPaymentGroup(paymentEngine, selectedPaymentMethod);
  }, [fetchOrRefreshPaymentGroup, paymentEngine, selectedPaymentMethod]);

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

  const member = memberById[basket?.member];

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
            if (updateData.has_removed_incompatible_items)
              setShowWarningRemovedItemsModal(true);
          }
        },
      });
    },
    [
      basket,
      closeMemberModal,
      fetchMembers,
      memberById,
      updateQuicksaleBasketMember,
    ],
  );

  // =====================================================

  // ========== Payment validation ==========

  const closePaymentSuccessModal = React.useCallback(() => {
    setShowPaymentSuccessModal(false);
    if (
      basket &&
      paymentGroupPriceCts === basket.total_price_cts / 100 - alreadyPaidAmount
    )
      goBack();
  }, [alreadyPaidAmount, basket, goBack, paymentGroupPriceCts]);

  const onPaymentSuccess = React.useCallback(() => {
    if (member?.is_pos) setShowAnonymousPaymentSuccessModal(true);
    else setShowPaymentSuccessModal(true);
  }, [member?.is_pos]);

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
    [paymentGroupId, updatePaymentGroupPrice],
  );

  const removeCoupon = React.useCallback(
    (data: { checkout_item: string; quantity: number }) => {
      setLoading(true);
      removeItemFromBasket(basketId, data, {
        onSuccess: () =>
          fetchOrRefreshPaymentGroup(paymentEngine, selectedPaymentMethod),
      });
    },
    [
      basketId,
      fetchOrRefreshPaymentGroup,
      paymentEngine,
      removeItemFromBasket,
      selectedPaymentMethod,
    ],
  );

  const addCoupon = React.useCallback(
    (code: string, options?: OptionCallback<Basket>) => {
      setLoading(true);
      attachCoupon(basketId, code, {
        onSuccess: (newBasket) => {
          fetchOrRefreshPaymentGroup(paymentEngine, selectedPaymentMethod);
          options?.onSuccess?.(newBasket);
        },
        onError: options?.onError,
      });
    },
    [
      attachCoupon,
      basketId,
      fetchOrRefreshPaymentGroup,
      paymentEngine,
      selectedPaymentMethod,
    ],
  );

  const companyCountry = getCompanyCountry();

  return (
    <>
      <QuicksaleCheckout
        theme={theme}
        quicksaleStaffFullName={quicksaleStaffFullName}
        onSignOut={openCannotSignOutModal}
        goBack={goBack}
        basket={basket}
        member={member}
        openMemberAuthenticationModal={openMemberModal}
        editPaymentGroupPrice={editPaymentGroupPrice}
        paymentGroup={paymentGroupId}
        paymentGroupPriceCts={paymentGroupPriceCts}
        alreadyPaidAmount={alreadyPaidAmount}
        loading={loading}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        removeCoupon={removeCoupon}
        attachCoupon={addCoupon}
        basketAddress={basketAddress}
        setBasketAddress={setBasketAddress}
        deliveryType={deliveryType}
        setDeliveryType={setDeliveryType}
        availablePaymentMethods={availablePaymentMethods}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        stripeReaders={stripeReaders}
        clientSecret={clientSecret}
        onPaymentSuccess={onPaymentSuccess}
      />

      <QuicksaleDialogs
        showStillOpenBasketsModal={showCannotSignOutModal}
        closeStillOpenBasketsModal={closeCannotSignOutModal}
        showWarningRemovedItemsModal={showWarningRemovedItemsModal}
        closeWarningRemovedItemsModal={closeWarningRemovedItemsModal}
        showPaymentSuccessModal={showPaymentSuccessModal}
        closePaymentSuccessModal={closePaymentSuccessModal}
        showAnonymousPaymentSuccessModal={showAnonymousPaymentSuccessModal}
        closeAnonymousPaymentSuccessModal={closeAnonymousPaymentSuccessModal}
      />

      <MemberSearchDialog
        open={showMemberAuthenticationModal}
        onClose={closeMemberModal}
        preSelectedMemberId={basket && !member?.is_pos ? basket.member : null}
        onMemberChoose={onMemberAuthenticate}
        companyCountry={companyCountry}
        searchMembers={searchMembers}
        createMember={createMember}
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
  }),
  {
    fetchBasket: fetchBasketAction,
    fetchMembers: fetchMemberBulk,
    push: pushAction,
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
  },
);

export default compose(
  routerParamsToProps({ basketId: 'basketId' }),
  connector,
  React.memo,
)(QuicksalePayment);
