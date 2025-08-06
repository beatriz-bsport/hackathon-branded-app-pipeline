import React from 'react';
import Fuse, { FuseOptions } from 'fuse.js';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';

import type { Theme } from '#src/libs/theme/types';

import QuicksaleAppBar from '#src/libs/quicksale/components/QuicksaleAppBar';
import QuicksaleBasketListBar from '#src/libs/quicksale/components/QuicksaleBasketListBar';
import { QuicksaleItemListHeader } from '#src/libs/quicksale/components/QuicksaleConfigurationItemList';
import QuicksaleInterfaceSearchBar from '#src/libs/quicksale/components/QuicksaleInterfaceSearchBar';
import {
  // getIdsFromQuicksaleCardInfoId,
  isNotQuicksaleCardInfoList,
} from '#src/libs/quicksale/utils';
import QuicksaleBasketPanel from '#src/libs/quicksale/components/QuicksaleBasketPanel';
import QuicksaleBreadcrumbs from '#src/libs/quicksale/components/QuicksaleBreadcrumbs';
import QuicksaleDialogs from '#src/libs/quicksale/components/QuicksaleDialogs.component';
import type {
  QuicksaleCardInfo,
  QuicksaleSection,
} from '#src/libs/quicksale/types';

import type {
  Basket,
  CheckoutItemData,
  OnRemoveCheckoutItemData,
} from '#src/libs/checkout/types';

import type { Member } from '#src/libs/member/types';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

// import type {
//   Giftcard,
//   GiftcardBackgroundImage,
// } from '#src/libs/giftcard/types';
import type { OptionCallback } from '../../../state/types';

import useStyles from './hooks/styles';
import QuicksaleTileList from './QuicksaleTileList.component';
import type { ShopItem } from '#src/libs/shop/types';
// import GiftcardForm from './GiftcardForm.component';

type Props = {
  theme: Theme;
  quicksaleStaffFullName: string;
  signOut: () => void;
  basketList: Basket[];
  memberById: { [memberId: number]: Member };
  currentBasket?: Basket;
  setCurrentBasket: (basket: Basket) => void;
  addBasket: (options?: OptionCallback<Basket>) => void;
  sectionList?: QuicksaleSection[];
  loading?: boolean;
  currentSection?: QuicksaleSection;
  currentVariantItem: ShopItem | null;
  onItemClick: (item: QuicksaleCardInfo) => void;
  onSectionClick: (sectionId: string) => void;
  onVariantItemClick: (itemId: string) => void;
  itemCardInfoList?: QuicksaleCardInfo[];
  availableSearchItemsInWholeConfig?: QuicksaleCardInfo[];
  goBackToSectionList?: () => void;
  addItemToBasket: (
    basketId: string,
    checkoutItem: CheckoutItemData,
    options?: OptionCallback<Basket>,
  ) => void;
  removeItemFromBasket: (
    basketId: string,
    data: {
      checkout_item: string;
      quantity: number;
    },
    options: OptionCallback<Basket>,
  ) => void;
  dropQuicksaleBasket: (
    basketId: string,
    options?: OptionCallback<{ dropped: boolean }>,
  ) => void;
  openMemberAuthenticationModal: () => void;
  // giftcardById: { [key: number]: Giftcard };
  // giftcardBackgroundImageList: GiftcardBackgroundImage[];
  pendingItemToAdd: QuicksaleCardInfo | null;
  showGiftcardFormModal: boolean;
  staffEstablishmentBillingGroup?: { id: number; name: string };
  closeGiftcardFormModal: () => void;
  addToBasket: (checkoutItemData: CheckoutItemData) => void;
  // fetchGiftcardBackgroundImageList: (
  //   companyId: number,
  //   options?: OptionCallback<GiftcardBackgroundImage>,
  // ) => void;
  goToPaymentPage: () => void;
};

const QuicksaleInterface: React.FC<Props> = ({
  theme,
  quicksaleStaffFullName,
  signOut,
  basketList,
  memberById,
  currentBasket,
  setCurrentBasket,
  addBasket,
  sectionList,
  loading,
  currentSection,
  currentVariantItem,
  onItemClick,
  onSectionClick,
  onVariantItemClick,
  itemCardInfoList,
  availableSearchItemsInWholeConfig,
  goBackToSectionList,
  // addItemToBasket,
  removeItemFromBasket,
  dropQuicksaleBasket,
  openMemberAuthenticationModal,
  // giftcardById,
  // giftcardBackgroundImageList,
  // pendingItemToAdd,
  showGiftcardFormModal,
  closeGiftcardFormModal,
  addToBasket,
  staffEstablishmentBillingGroup,
  // fetchGiftcardBackgroundImageList,
  goToPaymentPage,
}) => {
  const { t } = useTranslation('quicksale');

  // ========== States for the modals ==========

  const [showStillOpenBasketsModal, setShowStillOpenBasketsModal] =
    React.useState(false);

  const [showDeleteWarningModal, setShowDeleteWarningModal] =
    React.useState(false);

  // ===========================================

  // ========== Handlers ==========

  const onSignOut = React.useCallback(() => {
    if (basketList.length) setShowStillOpenBasketsModal(true);
    else signOut();
  }, [basketList.length, signOut]);

  const closeStillOpenBasketsModal = React.useCallback(
    () => setShowStillOpenBasketsModal(false),
    [],
  );

  const onBasketAdd = React.useCallback(
    () =>
      addBasket({
        onSuccess: (basket) => setCurrentBasket(basket),
      }),
    [addBasket, setCurrentBasket],
  );

  const closeDeleteWarningModal = React.useCallback(() => {
    setShowDeleteWarningModal(false);
  }, []);

  // ============================

  // ========== Handling of the search bar ==========

  const [searchText, setSearchText] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<QuicksaleCardInfo[]>(
    [],
  );

  const [showResultsOnPage, setShowResultsOnPage] = React.useState(false);

  const onSearchTextChange = React.useCallback(
    (fuse: Fuse<QuicksaleCardInfo, FuseOptions<QuicksaleCardInfo>>) =>
      (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearchText(ev.target.value);
        const results = fuse.search(ev.target.value);
        if (isNotQuicksaleCardInfoList(results))
          setSearchResults(results.map((result) => result.item));
        else setSearchResults(results);
      },
    [],
  );

  const clearSearch = React.useCallback(() => {
    setSearchText('');
    setSearchResults([]);
    setShowResultsOnPage(false);
  }, []);

  const onSearchIconClick = React.useCallback(() => {
    setShowResultsOnPage(true);
  }, []);

  // ================================================

  // ========== Handling of deletions ==========

  const removeFromBasket = React.useCallback(
    (removeData: OnRemoveCheckoutItemData) => {
      if (currentBasket) {
        removeItemFromBasket(currentBasket.id, removeData, {
          onSuccess: (basket) => setCurrentBasket(basket),
        });
      }
    },
    [currentBasket, removeItemFromBasket, setCurrentBasket],
  );

  const dropBasket = React.useCallback(() => {
    dropQuicksaleBasket(currentBasket?.id, {
      onSuccess: ({ dropped }) => {
        if (dropped) setCurrentBasket(null);
      },
    });
    setShowDeleteWarningModal(false);
  }, [currentBasket?.id, dropQuicksaleBasket, setCurrentBasket]);

  const onDeleteBasketClick = React.useCallback(() => {
    if (currentBasket?.checkout_items.length) setShowDeleteWarningModal(true);
    else dropBasket();
  }, [currentBasket, dropBasket]);

  // ============================================

  const blockActions =
    currentBasket && currentBasket.invoice && !currentBasket.is_fully_paid;

  const classes = useStyles();

  return (
    <Grid container>
      <Grid item className={classes.leftContainer} xs={9}>
        <QuicksaleAppBar
          onSignOut={onSignOut}
          staffEstablishmentBillingGroupName={
            staffEstablishmentBillingGroup?.name || ''
          }
          staffFullName={quicksaleStaffFullName}
          theme={theme}
        />

        <QuicksaleBasketListBar
          basketList={basketList}
          memberById={memberById}
          onBasketAdd={onBasketAdd}
          onBasketClick={setCurrentBasket}
          selectedBasket={currentBasket}
        />

        <div
          className={clsx({
            [classes.searchBarWithResults]: showResultsOnPage,
            [classes.searchBarWithCategoryName]:
              !showResultsOnPage && currentSection,
          })}
        >
          {showResultsOnPage && (
            <Button
              className={classes.goBackButton}
              color="default"
              onClick={clearSearch}
              startIcon={<ArrowBack />}
              variant="outlined"
            >
              <Typography variant="subtitle2">
                {t('interface.goBack')}
              </Typography>
            </Button>
          )}
          {!showResultsOnPage && currentSection && (
            <QuicksaleItemListHeader
              customClasses={{ itemListHeader: classes.itemListHeader }}
              goBack={goBackToSectionList}
              sectionIcon={currentSection.section_icon}
              sectionName={currentSection.section_name}
            />
          )}
          <div
            className={clsx(classes.widthFull, {
              [classes.width300px]: !showResultsOnPage && currentSection,
            })}
          >
            <QuicksaleInterfaceSearchBar
              clearSearch={clearSearch}
              onItemClick={onItemClick}
              onSearchIconClick={onSearchIconClick}
              onSearchTextChange={onSearchTextChange}
              openPopper={
                searchText !== '' &&
                !showResultsOnPage &&
                searchResults.length > 0
              }
              searchItems={
                (!currentSection || showResultsOnPage
                  ? availableSearchItemsInWholeConfig
                  : itemCardInfoList) ?? []
              }
              searchResults={searchResults}
              searchText={searchText}
            />
          </div>
        </div>

        {currentSection && (
          <QuicksaleBreadcrumbs
            homeLabel={t('interface.home')}
            onHomeClick={goBackToSectionList}
            onSectionClick={
              currentVariantItem
                ? () => onSectionClick(currentSection.section_id)
                : undefined
            }
            section={currentSection}
            variantItemLabel={currentVariantItem?.name}
          />
        )}

        <QuicksaleTileList
          currentSection={currentSection}
          currentVariantItem={currentVariantItem}
          establishmentBillingGroupId={staffEstablishmentBillingGroup?.id}
          isExcludingTax={theme.is_tax_excluded_in_marketplace}
          itemCardInfoList={itemCardInfoList}
          loading={loading}
          onItemClick={onItemClick}
          onSectionClick={onSectionClick}
          onVariantItemClick={onVariantItemClick}
          searchResults={searchResults}
          searchText={searchText}
          sectionList={sectionList}
          showResults={showResultsOnPage}
        />
      </Grid>

      <Grid item className={classes.rightContainer} xs={3}>
        <QuicksaleBasketPanel
          addToBasket={addToBasket}
          basket={currentBasket}
          closeBasket={onDeleteBasketClick}
          isExcludingTax={theme.is_tax_excluded_in_marketplace}
          member={memberById[currentBasket?.member]}
          onPaymentClick={goToPaymentPage}
          openChangeMemberModal={openMemberAuthenticationModal}
          removeFromBasket={removeFromBasket}
        />
      </Grid>

      <QuicksaleDialogs
        blockActions={blockActions}
        closeDeleteWarningModal={closeDeleteWarningModal}
        closeStillOpenBasketsModal={closeStillOpenBasketsModal}
        dropBasket={dropBasket}
        showDeleteWarningModal={showDeleteWarningModal}
        showStillOpenBasketsModal={showStillOpenBasketsModal}
      />

      <GenericResponsiveDialog
        onClose={closeGiftcardFormModal}
        open={showGiftcardFormModal}
      >
        <DialogTitle disableTypography className={classes.giftcardDialogTitle}>
          <IconButton
            className={classes.giftcardDialogCloseButton}
            onClick={closeGiftcardFormModal}
          >
            <Close className={classes.giftcardDialogCloseIcon} />
          </IconButton>
        </DialogTitle>

        {/*  <GiftcardForm
          addItemToBasket={addItemToBasket}
          closeGiftcardFormModal={closeGiftcardFormModal}
          company={theme.company}
          cover={theme.cover}
          currentBasket={currentBasket}
          fetchGiftcardBackgroundImageList={fetchGiftcardBackgroundImageList}
          giftcard={
            giftcardById[
              Number(getIdsFromQuicksaleCardInfoId(pendingItemToAdd)?.[1])
            ] ?? null
          }
          giftcardBackgroundImageList={giftcardBackgroundImageList}
          pendingItemToAdd={pendingItemToAdd}
          setCurrentBasket={setCurrentBasket}
          showGiftcardFormModal={showGiftcardFormModal}
        />  */}
      </GenericResponsiveDialog>
    </Grid>
  );
};

export default React.memo(QuicksaleInterface);
