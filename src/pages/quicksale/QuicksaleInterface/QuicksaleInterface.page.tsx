import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { compose } from 'recompose';
import { push as pushAction } from 'connected-react-router';
import { useTranslation } from 'react-i18next';

// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { TranslationProps } from '#components/DialogWithBigIcon/DialogWithBigIcon.component';

import {
  fetchOpenQuicksaleBaskets as fetchOpenQuicksaleBasketsAction,
  createQuicksaleBasket as createQuicksaleBasketAction,
  addItemToBasket as addItemToBasketAction,
  removeItemFromBasket as removeItemFromBasketAction,
  dropQuicksaleBasket as dropQuicksaleBasketAction,
  updateQuicksaleBasketMember as updateQuicksaleBasketMemberAction,
} from '#libs/checkout/actions';
import { getBasketList } from '#libs/checkout/selectors';
import type { Basket } from '#libs/checkout/types';

import { getMemberListData } from '#libs/member/selectors';
import {
  fetchMemberBulk,
  search,
  createOrUpdateMember,
} from '#libs/member/actions';
import type { Member } from '#libs/member/types';

import { getSavedPaymentMethodList } from '#libs/payment/selectors';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '#libs/payment/actions';

import { retrievePOSMember } from '#libs/company/actions';

import { getLoading, getSectionList } from '#libs/quicksale/selectors';
import { fetchQuicksaleConfiguration as fetchQuicksaleConfigurationAction } from '#libs/quicksale/actions';
import { getQuicksaleCardInfoFromQuicksaleItem } from '#libs/quicksale/utils';
import MemberSearchDialog from '#libs/member/components/MemberSearchDialog';
import QuicksaleDialogs from '#libs/quicksale/components/QuicksaleDialogs.component';
import type { QuicksaleCardInfo } from '#libs/quicksale/types';

import { getPaymentPackById } from '#libs/payment-packs/selectors';

import { _getPrivatePassData } from '#libs/private-service/selectors/private-pass';

import { getPaymenComboDataDict } from '#libs/payment-combo/selectors';
import { fetchPaymentComboList as fetchPaymentComboListAction } from '#libs/payment-combo/actions';

import { getAllShopItemData } from '#libs/shop/selectors';
import { fetchShopItemAsManager } from '#libs/shop/actions/shopitem';

import {
  getGiftcardBackgroundImageList,
  getGiftcardData,
} from '#libs/giftcard/selectors';
import { fetchGiftcardBackgroundImageList as fetchGiftcardBackgroundImageListAction } from '#libs/giftcard/actions';

// @ts-expect-error
import { getContractsById } from '#libs/subscription/selectors';
import {
  fetchContractList as fetchSubscriptionListAction,
  registerContractBackground as registerContractBackgroundAction,
} from '#libs/subscription/actions';
import SubscriptionContractRegister from '#libs/subscription/components/SubscriptionContractRegister.component';
import type { Contract } from '#libs/subscription/types';

import withDatatypeDynamicData from '#libs/datatype-filtering/dynamic-data-hoc';
import type { DynamicFilterDataType } from '#libs/datatype-filtering/types';

import { getCompanyCountry, getStripeRegion } from '#libs/theme/selectors';

import { getAvailableEstablishmentList } from '#libs/establishment/selectors';
import { fetchEstablishments as fetchEstablishmentsAction } from '#libs/establishment/actions';

import { getStripeReaders } from '#libs/terminal/selectors';
import { fetchStripeReaders as fetchStripeReadersAction } from '#libs/terminal/actions';

import {
  displayBackgroundDialog as displayBackgroundDialogAction,
  deletebackgroundDialog as deletebackgroundDialogAction,
} from '#libs/background-dialog/actions';

import { fetchAllTags as fetchAllTagsAction } from '#libs/tag/actions';
import { getTagsDict } from '#libs/tag/selectors';

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
  establishmentList,
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
  fetchEstablishments,
  fetchGiftcardBackgroundImageList,
  fetchAllTags,
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
    fetchEstablishments();
    fetchAllTags();
  }, [
    fetchOpenQuicksaleBaskets,
    fetchMembers,
    fetchPOSMember,
    theme.company,
    fetchQuicksaleConfiguration,
    handleGetDynamicDataForFilters,
    fetchPaymentComboList,
    fetchShopItemList,
    fetchEstablishments,
    fetchAllTags,
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

  return (
    <>
      <QuicksaleInterfaceComponent
        theme={theme}
        quicksaleStaffFullName={quicksaleStaffFullName}
        signOut={signOut}
        basketList={basketList}
        memberById={memberById}
        currentBasket={currentBasket}
        setCurrentBasket={setCurrentBasket}
        addBasket={createQuicksaleBasket}
        sectionList={sectionList}
        loading={loading}
        currentSection={currentSection}
        onSectionClick={onSectionClick}
        itemCardInfoList={itemCardInfoList}
        goBackToSectionList={goBackToSectionList}
        availableSearchItemsInWholeConfig={availableSearchItemsInWholeConfig}
        addItemToBasket={addItemToBasket}
        removeItemFromBasket={removeItemFromBasket}
        dropQuicksaleBasket={dropQuicksaleBasket}
        openMemberAuthenticationModal={openMemberAuthenticationModal}
        giftcardById={giftcardById}
        giftcardBackgroundImageList={giftcardBackgroundImageList}
        pendingItemToAdd={pendingItemToAdd}
        onItemClick={onItemClick}
        showGiftcardFormModal={showGiftcardFormModal}
        closeGiftcardFormModal={closeGiftcardFormModal}
        addToBasket={addToBasket}
        fetchGiftcardBackgroundImageList={fetchGiftcardBackgroundImageList}
      />

      <MemberSearchDialog
        open={showMemberAuthenticationModal}
        onClose={closeMemberModal}
        preSelectedMemberId={
          currentBasket && !memberById[currentBasket.member]?.is_pos
            ? currentBasket.member
            : null
        }
        onMemberChoose={onMemberAuthenticate}
        companyCountry={companyCountry}
        searchMembers={searchMembers}
        createMember={createMember}
        isAuthenticatingForContract={!!contractToSubscribe}
      />

      {!!stripeRegion && !!companyCountry ? (
        <SubscriptionContractRegister
          open={showSubscriptionContractModal}
          onClose={closeSubscriptionContractModal}
          member={memberToSubscribe}
          contract={contractToSubscribe}
          requestSetupIntentSecret={requestSetupIntentSecret}
          enabledPaymentMethods={enabledPaymentMethods ?? []}
          savedPaymentMethodList={savedPaymentMethodList ?? []}
          refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
          waiver={theme.waiver}
          generalTermsAndConditions={theme.general_terms_and_conditions}
          establishments={establishmentList ?? []}
          enableMultiLocalization={theme.enable_multi_localization}
          stripeReaders={stripeReaders ?? []}
          onlinePaymentEnabled={theme.online_payment_enabled}
          companyId={theme.company}
          onSuccess={closeSubscriptionContractModal}
          registerContractBackground={registerContract}
          withContractTermsCheckbox
        />
      ) : null}

      <QuicksaleDialogs
        showWarningRemovedItemsModal={showWarningRemovedItemsModal}
        closeWarningRemovedItemsModal={closeWarningRemovedItemsModal}
        showOutOfStockModal={showOutOfStockModal}
        closeOutOfStockModal={closeOutOfStockModal}
        addItemAnyway={addOutOfStockShopItemAnyway}
        showAuthenticatedMemberRestrictionModal={
          showAuthenticatedMemberRestrictionModal
        }
        closeAuthenticatedMemberRestrictionModal={
          closeAuthenticatedMemberRestrictionModal
        }
        showUnauthenticatedMemberRestrictionModal={
          showUnauthenticatedMemberRestrictionModal
        }
        closeUnauthenticatedMemberRestrictionModal={
          closeUnauthenticatedMemberRestrictionModal
        }
        memberRestrictionSubTexts={memberRestrictionSubTexts}
        openAuthenticationModal={openMemberAuthenticationModal}
      />
    </>
  );
};

const connector = connect(
  (state: RootState) => ({
    theme: state.theme.theme,
    memberById: getMemberListData(state),
    quicksaleStaffFullName: state.auth.name,
    baskets: getBasketList(state),
    sectionList: getSectionList(state),
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
    paymentComboById: getPaymenComboDataDict(state),
    // @ts-expect-error
    shopItemById: getAllShopItemData(state),
    giftcardById: getGiftcardData(state),
    contractById: getContractsById(state),
    savedPaymentMethodList: getSavedPaymentMethodList(state),
    establishmentList: getAvailableEstablishmentList(state),
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
    fetchEstablishments: fetchEstablishmentsAction,
    fetchGiftcardBackgroundImageList: fetchGiftcardBackgroundImageListAction,
    fetchAllTags: fetchAllTagsAction,
  },
);

export default compose(
  routerParamsToProps({ sectionId: 'sectionId' }),
  connector,
  withDatatypeDynamicData,
  React.memo,
)(QuicksaleInterface);
