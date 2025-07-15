import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { compose } from 'recompose';
import { push as pushAction } from 'connected-react-router';
import { useTranslation } from 'react-i18next';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { TranslationProps } from '#src/components/DialogWithBigIcon/DialogWithBigIcon.component';

import {
  fetchOpenQuicksaleBaskets as fetchOpenQuicksaleBasketsAction,
  createQuicksaleBasket as createQuicksaleBasketAction,
  addItemToBasket as addItemToBasketAction,
  removeItemFromBasket as removeItemFromBasketAction,
  dropQuicksaleBasket as dropQuicksaleBasketAction,
  updateQuicksaleBasketMember as updateQuicksaleBasketMemberAction,
} from '#src/libs/checkout/actions';
import { getOpenBasketList } from '#src/libs/checkout/selectors';
import type { Basket } from '#src/libs/checkout/types';

import { getMemberListData } from '#src/libs/member/selectors';
import {
  fetchMemberBulk,
  search,
  createOrUpdateMember,
} from '#src/libs/member/actions';
import type { Member } from '#src/libs/member/types';

import { getSavedPaymentMethodList } from '#src/libs/payment/selectors';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '#src/libs/payment/actions';

import { retrievePOSMember } from '#src/libs/company/actions';

import {
  getLoading,
  getActiveSectionList,
} from '#src/libs/quicksale/selectors';
import { fetchQuicksaleConfiguration as fetchQuicksaleConfigurationAction } from '#src/libs/quicksale/actions';
import { getQuicksaleCardInfoFromQuicksaleItem } from '#src/libs/quicksale/utils';
import MemberSearchDialog from '#src/libs/member/components/MemberSearchDialog';
import QuicksaleDialogs from '#src/libs/quicksale/components/QuicksaleDialogs.component';
import type { QuicksaleCardInfo } from '#src/libs/quicksale/types';

import { getPaymentPackById } from '#src/libs/payment-packs/selectors';

import { _getPrivatePassData } from '#src/libs/private-service/selectors/private-pass';

import { getPaymentComboDataDict } from '#src/libs/payment-combo/selectors';
import { fetchPaymentComboList as fetchPaymentComboListAction } from '#src/libs/payment-combo/actions';

import { getAllShopItemData } from '#src/libs/shop/selectors';
import { fetchShopItemAsManager } from '#src/libs/shop/actions/shopitem';

import {
  getGiftcardBackgroundImageList,
  getGiftcardData,
} from '#src/libs/giftcard/selectors';
import { fetchGiftcardBackgroundImageList as fetchGiftcardBackgroundImageListAction } from '#src/libs/giftcard/actions';

import { getContractsById } from '#src/libs/subscription/selectors';
import {
  fetchContractList as fetchSubscriptionListAction,
  registerContractBackground as registerContractBackgroundAction,
} from '#src/libs/subscription/actions';
import SubscriptionContractRegister from '#src/libs/subscription/components/SubscriptionContractRegister.component';
import type { Contract } from '#src/libs/subscription/types';

import withDatatypeDynamicData from '#src/libs/datatype-filtering/dynamic-data-hoc';
import type { DynamicFilterDataType } from '#src/libs/datatype-filtering/types';

import { getCompanyCountry, getStripeRegion } from '#src/libs/theme/selectors';

import { getEnabledEstablishmentBillingGroups } from '#src/libs/establishment/selectors';
import { fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction } from '#src/libs/establishment/actions';

import { getStripeReaders } from '#src/libs/terminal/selectors';
import { fetchStripeReaders as fetchStripeReadersAction } from '#src/libs/terminal/actions';

import {
  displayBackgroundDialog as displayBackgroundDialogAction,
  deletebackgroundDialog as deletebackgroundDialogAction,
} from '#src/libs/background-dialog/actions';

import { fetchAllTags as fetchAllTagsAction } from '#src/libs/tag/actions';
import { getTagsDict } from '#src/libs/tag/selectors';

import type { RootState } from '../../../reducers';
import QuicksaleInterfaceComponent from './QuicksaleInterface.component';
import useMemberAuthentication from './hooks/useMemberAuthentication';
import useAdditionToBasket from './hooks/useAdditionToBasket';
import useSubscriptionHandler from './hooks/useSubscriptionHandler';

type Props = {
  sectionId: string;
  handleGetDynamicDataForFilters: (datatype: DynamicFilterDataType) => any[];
} & ConnectedProps<typeof connector>;

const QuicksaleInterface: React.FC<Props> = ({
  sectionId,
  handleGetDynamicDataForFilters,
  theme,
  memberById,
  quicksaleStaffFullName,
  baskets,
  sectionList,
  loading,
  paymentPackById,
  privatePassById,
  paymentComboById,
  shopItemById,
  giftcardById,
  contractById,
  savedPaymentMethodList,
  establishmentBillingGroups,
  stripeReaders,
  giftcardBackgroundImageList,
  tagsById,
  push,
  fetchOpenQuicksaleBaskets,
  createQuicksaleBasket,
  fetchMembers,
  fetchPOSMember,
  fetchQuicksaleConfiguration,
  fetchPaymentComboList,
  fetchShopItemList,
  fetchSubscriptionList,
  addItemToBasket,
  removeItemFromBasket,
  dropQuicksaleBasket,
  updateQuicksaleBasketMember,
  searchMembers,
  createMemberAction,
  fetchPaymentMethodList,
  displayBackgroundDialog,
  deletebackgroundDialog,
  registerContractBackground,
  fetchStripeReaders,
  fetchGiftcardBackgroundImageList,
  fetchAllTags,
  fetchAllEstablishmentBillingGroup,
}) => {
  const { t } = useTranslation('quicksale');

  const [currentBasket, setCurrentBasket] = React.useState<Basket>(null);

  // This state keeps in memory the item the staff is trying to add
  // while displaying some optional warning modals
  const [pendingItemToAdd, setPendingItemToAdd] =
    React.useState<QuicksaleCardInfo | null>(null);

  // used to store a member for a subscription even when there is no current basket
  const [memberToSubscribe, setMemberToSubscribe] =
    React.useState<Member | null>(null);

  const [contractToSubscribe, setContractToSubscribe] =
    React.useState<Contract | null>(null);

  // ========== States for the dialogs ==========
  const [showMemberAuthenticationModal, setShowMemberAuthenticationModal] =
    React.useState(false);

  const [showWarningRemovedItemsModal, setShowWarningRemovedItemsModal] =
    React.useState(false);

  const [showSubscriptionContractModal, setShowSubscriptionContractModal] =
    React.useState(false);

  const [showGiftcardFormModal, setShowGiftcardFormModal] =
    React.useState(false);

  const [showOutOfStockModal, setShowOutOfStockModal] = React.useState(false);

  const [
    showAuthenticatedMemberRestrictionModal,
    setShowAuthenticatedMemberRestrictionModal,
  ] = React.useState(false);

  const [
    showUnauthenticatedMemberRestrictionModal,
    setShowUnauthenticatedMemberRestrictionModal,
  ] = React.useState(false);

  const [memberRestrictionSubTexts, setMemberRestrictionSubTexts] =
    React.useState<TranslationProps[][]>([]);

  const openMemberAuthenticationModal = React.useCallback(() => {
    setShowUnauthenticatedMemberRestrictionModal(false);
    setShowMemberAuthenticationModal(true);
  }, []);

  const closeMemberModal = React.useCallback(() => {
    setShowMemberAuthenticationModal(false);
  }, []);

  const closeWarningRemovedItemsModal = React.useCallback(() => {
    setShowWarningRemovedItemsModal(false);
  }, []);

  const closeSubscriptionContractModal = React.useCallback(() => {
    setShowSubscriptionContractModal(false);
    setContractToSubscribe(null);
  }, []);

  const closeGiftcardFormModal = React.useCallback(() => {
    setShowGiftcardFormModal(false);
    setPendingItemToAdd(null);
  }, []);

  const closeOutOfStockModal = React.useCallback(() => {
    setShowOutOfStockModal(false);
    setPendingItemToAdd(null);
  }, []);

  const closeAuthenticatedMemberRestrictionModal = React.useCallback(() => {
    setShowAuthenticatedMemberRestrictionModal(false);
    setMemberRestrictionSubTexts([]);
    setPendingItemToAdd(null);
  }, []);

  const closeUnauthenticatedMemberRestrictionModal = React.useCallback(() => {
    setShowUnauthenticatedMemberRestrictionModal(false);
    setMemberRestrictionSubTexts([]);
    setPendingItemToAdd(null);
  }, []);

  // ========== Build current section's variables ==========
  const currentSection = React.useMemo(
    () =>
      sectionList?.find((section) => section.section_id === sectionId) || null,
    [sectionId, sectionList],
  );

  const itemCardInfoList = React.useMemo(
    () =>
      (currentSection?.items ?? []).reduce((accumulator, item) => {
        const itemCardInfo = getQuicksaleCardInfoFromQuicksaleItem(
          item,
          paymentPackById,
          privatePassById,
          paymentComboById,
          shopItemById,
          contractById,
          giftcardById,
          t,
          currentSection,
          currentBasket,
          memberById,
        );

        if (!itemCardInfo) return accumulator;
        return [...accumulator, itemCardInfo];
      }, []),
    [
      currentSection,
      paymentPackById,
      privatePassById,
      paymentComboById,
      shopItemById,
      contractById,
      giftcardById,
      t,
      currentBasket,
      memberById,
    ],
  );

  const goBackToSectionList = React.useCallback(
    () => push('/quicksale/'),
    [push],
  );
  // =====================================================

  // ========== Run all fetches ==========
  React.useEffect(() => {
    fetchPOSMember(theme.company);
    fetchOpenQuicksaleBaskets({
      onSuccess: (data) => {
        if (data.length)
          fetchMembers({ id__in: data.map((basket) => basket.member) });
      },
    });
    fetchQuicksaleConfiguration();
    handleGetDynamicDataForFilters('payment_pack');
    handleGetDynamicDataForFilters('payment_pack_category');
    handleGetDynamicDataForFilters('private_pass');
    handleGetDynamicDataForFilters('private_pass_category');
    fetchPaymentComboList();
    fetchShopItemList();
    handleGetDynamicDataForFilters('subshop');
    handleGetDynamicDataForFilters('giftcard');
    fetchAllTags();
    if (theme.enable_multi_localization) {
      fetchAllEstablishmentBillingGroup({ params: { company: theme.company } });
    }
  }, [
    fetchOpenQuicksaleBaskets,
    fetchMembers,
    fetchPOSMember,
    theme,
    fetchQuicksaleConfiguration,
    handleGetDynamicDataForFilters,
    fetchPaymentComboList,
    fetchShopItemList,
    fetchAllTags,
    fetchAllEstablishmentBillingGroup,
  ]);
  // =====================================

  const signOut = React.useCallback(() => push('/login/signout'), [push]);

  const onSectionClick = React.useCallback(
    (id: string) => push(`/quicksale/${id}/`),
    [push],
  );

  // ========== Build available search items ==========
  const availableSearchItemsInWholeConfig = React.useMemo(
    () =>
      sectionList
        ?.map((section) =>
          section.items.map((item) =>
            getQuicksaleCardInfoFromQuicksaleItem(
              item,
              paymentPackById,
              privatePassById,
              paymentComboById,
              shopItemById,
              contractById,
              giftcardById,
              t,
              section,
              currentBasket,
              memberById,
            ),
          ),
        )
        .flat()
        .filter((item) => !!item),
    [
      sectionList,
      paymentPackById,
      privatePassById,
      paymentComboById,
      shopItemById,
      contractById,
      giftcardById,
      t,
      currentBasket,
      memberById,
    ],
  );
  // ==================================================

  // In redux, there is an immutable object so we need to convert it here
  const basketList = React.useMemo(
    () =>
      baskets.asMutable().map((basket) => ({
        ...basket,
        available_payment_methods: basket.available_payment_methods.asMutable(),
        prepaid_lines: basket.prepaid_lines.asMutable(),
        checkout_items: basket.checkout_items
          .asMutable()
          .map((checkoutItem) => ({
            ...checkoutItem,
            sub_items: checkoutItem?.sub_items?.asMutable(),
            extra_data: {
              offers_data: checkoutItem?.extra_data?.offers_data?.asMutable(),
            },
          })),
      })),
    [baskets],
  );

  // ========== Functions to add items to the basket ==========

  const { onItemClick, addOutOfStockShopItemAnyway, addToBasket } =
    useAdditionToBasket(
      setCurrentBasket,
      setPendingItemToAdd,
      setShowGiftcardFormModal,
      setShowAuthenticatedMemberRestrictionModal,
      setShowUnauthenticatedMemberRestrictionModal,
      setMemberRestrictionSubTexts,
      setMemberToSubscribe,
      addItemToBasket,
      setContractToSubscribe,
      setShowSubscriptionContractModal,
      openMemberAuthenticationModal,
      setShowOutOfStockModal,
      createQuicksaleBasket,
      closeOutOfStockModal,
      currentBasket,
      paymentPackById,
      privatePassById,
      paymentComboById,
      shopItemById,
      contractById,
      giftcardById,
      memberById,
      tagsById,
      pendingItemToAdd,
    );

  // ========== Member authentication handlers ==========

  const { createMember, onMemberAuthenticate } = useMemberAuthentication(
    createMemberAction,
    setMemberToSubscribe,
    setShowSubscriptionContractModal,
    closeMemberModal,
    fetchMembers,
    updateQuicksaleBasketMember,
    setCurrentBasket,
    setShowWarningRemovedItemsModal,
    onItemClick,
    setPendingItemToAdd,
    contractToSubscribe,
    currentBasket,
    pendingItemToAdd,
    memberById,
  );

  // =====================================================

  // ========== Handlers for contract's subscription ==========

  const stripeRegion = getStripeRegion();

  const companyCountry = getCompanyCountry();

  const {
    enabledPaymentMethods,
    requestSetupIntentSecret,
    refreshSavedPaymentMethodList,
    registerContract,
  } = useSubscriptionHandler(
    theme.currency,
    companyCountry,
    stripeRegion,
    fetchPaymentMethodList,
    registerContractBackground,
    closeSubscriptionContractModal,
    displayBackgroundDialog,
    deletebackgroundDialog,
    fetchSubscriptionList,
    fetchStripeReaders,
    memberToSubscribe,
  );

  // ========================================================

  const goToPaymentPage = React.useCallback(() => {
    if (currentBasket) push(`/quicksale/checkout/${currentBasket.id}/`);
  }, [currentBasket, push]);

  return (
    <>
      <QuicksaleInterfaceComponent
        addBasket={createQuicksaleBasket}
        addItemToBasket={addItemToBasket}
        addToBasket={addToBasket}
        availableSearchItemsInWholeConfig={availableSearchItemsInWholeConfig}
        basketList={basketList}
        closeGiftcardFormModal={closeGiftcardFormModal}
        currentBasket={currentBasket}
        currentSection={currentSection}
        dropQuicksaleBasket={dropQuicksaleBasket}
        fetchGiftcardBackgroundImageList={fetchGiftcardBackgroundImageList}
        giftcardBackgroundImageList={giftcardBackgroundImageList}
        giftcardById={giftcardById}
        goBackToSectionList={goBackToSectionList}
        goToPaymentPage={goToPaymentPage}
        itemCardInfoList={itemCardInfoList}
        loading={loading}
        memberById={memberById}
        onItemClick={onItemClick}
        onSectionClick={onSectionClick}
        openMemberAuthenticationModal={openMemberAuthenticationModal}
        pendingItemToAdd={pendingItemToAdd}
        quicksaleStaffFullName={quicksaleStaffFullName}
        removeItemFromBasket={removeItemFromBasket}
        sectionList={sectionList}
        setCurrentBasket={setCurrentBasket}
        showGiftcardFormModal={showGiftcardFormModal}
        signOut={signOut}
        theme={theme}
      />

      <MemberSearchDialog
        companyCountry={companyCountry}
        createMember={createMember}
        isAuthenticationRequired={!!contractToSubscribe}
        onClose={closeMemberModal}
        onMemberChoose={onMemberAuthenticate}
        open={showMemberAuthenticationModal}
        preSelectedMemberId={
          currentBasket && !memberById[currentBasket.member]?.is_pos
            ? currentBasket.member
            : null
        }
        searchMembers={searchMembers}
      />

      {!!stripeRegion && !!companyCountry ? (
        <SubscriptionContractRegister
          withContractTermsCheckbox
          cardBillingDetailsMandatory={theme.force_billing_details_on_cards}
          companyId={theme.company}
          contract={contractToSubscribe}
          enabledPaymentMethods={enabledPaymentMethods ?? []}
          enableMultiLocalization={theme.enable_multi_localization}
          establishmentBillingGroups={establishmentBillingGroups ?? []}
          generalTermsAndConditions={theme.general_terms_and_conditions}
          member={memberToSubscribe}
          onClose={closeSubscriptionContractModal}
          onlinePaymentEnabled={theme.online_payment_enabled}
          onSuccess={closeSubscriptionContractModal}
          open={showSubscriptionContractModal}
          refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
          registerContractBackground={registerContract}
          requestSetupIntentSecret={requestSetupIntentSecret}
          savedPaymentMethodList={savedPaymentMethodList ?? []}
          stripeReaders={stripeReaders ?? []}
          waiver={theme.waiver}
        />
      ) : null}

      <QuicksaleDialogs
        addItemAnyway={addOutOfStockShopItemAnyway}
        closeAuthenticatedMemberRestrictionModal={
          closeAuthenticatedMemberRestrictionModal
        }
        closeOutOfStockModal={closeOutOfStockModal}
        closeUnauthenticatedMemberRestrictionModal={
          closeUnauthenticatedMemberRestrictionModal
        }
        closeWarningRemovedItemsModal={closeWarningRemovedItemsModal}
        memberRestrictionSubTexts={memberRestrictionSubTexts}
        openAuthenticationModal={openMemberAuthenticationModal}
        showAuthenticatedMemberRestrictionModal={
          showAuthenticatedMemberRestrictionModal
        }
        showOutOfStockModal={showOutOfStockModal}
        showUnauthenticatedMemberRestrictionModal={
          showUnauthenticatedMemberRestrictionModal
        }
        showWarningRemovedItemsModal={showWarningRemovedItemsModal}
      />
    </>
  );
};

const connector = connect(
  (state: RootState) => ({
    theme: state.theme.theme,
    memberById: getMemberListData(state),
    quicksaleStaffFullName: state.auth.name,
    baskets: getOpenBasketList(state),
    sectionList: getActiveSectionList(state),
    loading:
      getLoading(state) ||
      state.paymentPack.loading ||
      state.privateService.privatePass.loading ||
      state.paymentCombo.loading ||
      state.shop.shopItem.bulk.loading ||
      state.giftcard.giftcard.loading ||
      state.subscription.contract.loading,
    paymentPackById: getPaymentPackById(state),
    privatePassById: _getPrivatePassData(state),
    paymentComboById: getPaymentComboDataDict(state),
    // @ts-expect-error
    shopItemById: getAllShopItemData(state),
    giftcardById: getGiftcardData(state),
    // @ts-expect-error
    contractById: getContractsById(state),
    savedPaymentMethodList: getSavedPaymentMethodList(state),
    establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
    stripeReaders: getStripeReaders(state),
    giftcardBackgroundImageList: getGiftcardBackgroundImageList(state),
    tagsById: getTagsDict(state),
  }),
  {
    fetchOpenQuicksaleBaskets: fetchOpenQuicksaleBasketsAction,
    createQuicksaleBasket: createQuicksaleBasketAction,
    fetchMembers: fetchMemberBulk,
    push: pushAction,
    fetchPOSMember: retrievePOSMember,
    fetchQuicksaleConfiguration: fetchQuicksaleConfigurationAction,
    fetchPaymentComboList: fetchPaymentComboListAction,
    fetchShopItemList: fetchShopItemAsManager,
    fetchSubscriptionList: fetchSubscriptionListAction,
    addItemToBasket: addItemToBasketAction,
    removeItemFromBasket: removeItemFromBasketAction,
    dropQuicksaleBasket: dropQuicksaleBasketAction,
    updateQuicksaleBasketMember: updateQuicksaleBasketMemberAction,
    searchMembers: search,
    createMemberAction: createOrUpdateMember,
    fetchPaymentMethodList: fetchPaymentMethodListAction,
    displayBackgroundDialog: displayBackgroundDialogAction,
    deletebackgroundDialog: deletebackgroundDialogAction,
    registerContractBackground: registerContractBackgroundAction,
    fetchStripeReaders: fetchStripeReadersAction,
    fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
    fetchGiftcardBackgroundImageList: fetchGiftcardBackgroundImageListAction,
    fetchAllTags: fetchAllTagsAction,
  },
);

export default compose(
  routerParamsToProps({ sectionId: 'sectionId:string' }),
  connector,
  withDatatypeDynamicData,
  React.memo,
)(QuicksaleInterface);
