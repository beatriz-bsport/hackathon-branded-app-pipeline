import React from 'react';
import Fuse, { FuseOptions } from 'fuse.js';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';

import type { Theme } from '#libs/theme/types';

import QuicksaleAppBar from '#libs/quicksale/components/QuicksaleAppBar';
import QuicksaleBasketListBar from '#libs/quicksale/components/QuicksaleBasketListBar';
import { QuicksaleItemListHeader } from '#libs/quicksale/components/QuicksaleConfigurationItemList';
import QuicksaleInterfaceSearchBar from '#libs/quicksale/components/QuicksaleInterfaceSearchBar';
import {
  getIdsFromQuicksaleCardInfoId,
  isNotQuicksaleCardInfoList,
} from '#libs/quicksale/utils';
import QuicksaleBasketPanel from '#libs/quicksale/components/QuicksaleBasketPanel';
import QuicksaleDialogs from '#libs/quicksale/components/QuicksaleDialogs.component';
import type {
  QuicksaleCardInfo,
  QuicksaleSection,
} from '#libs/quicksale/types';

import type {
  Basket,
  CheckoutItemData,
  OnRemoveCheckoutItemData,
} from '#libs/checkout/types';

import type { Member } from '#libs/member/types';

import type { OptionCallback } from '../../../state/types';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

import type { Giftcard, GiftcardBackgroundImage } from '#libs/giftcard/types';

import useStyles from './hooks/styles';
import QuicksaleTileList from './QuicksaleTileList.component';
import GiftcardForm from './GiftcardForm.component';

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
  onSectionClick?: (sectionId: string) => void;
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
  giftcardById: { [key: number]: Giftcard };
  giftcardBackgroundImageList: GiftcardBackgroundImage[];
  pendingItemToAdd: QuicksaleCardInfo | null;
  onItemClick: (item: QuicksaleCardInfo) => void;
  showGiftcardFormModal: boolean;
  closeGiftcardFormModal: () => void;
  addToBasket: (checkoutItemData: CheckoutItemData) => void;
  fetchGiftcardBackgroundImageList: (
    companyId: number,
    options?: OptionCallback<GiftcardBackgroundImage>,
  ) => void;
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
  onSectionClick,
  itemCardInfoList,
  availableSearchItemsInWholeConfig,
  goBackToSectionList,
  addItemToBasket,
  removeItemFromBasket,
  dropQuicksaleBasket,
  openMemberAuthenticationModal,
  giftcardById,
  giftcardBackgroundImageList,
  pendingItemToAdd,
  onItemClick,
  showGiftcardFormModal,
  closeGiftcardFormModal,
  addToBasket,
  fetchGiftcardBackgroundImageList,
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
      <Grid item xs={9} className={classes.leftContainer}>
        <QuicksaleAppBar
          theme={theme}
          staffFullName={quicksaleStaffFullName}
          onSignOut={onSignOut}
        />

        <QuicksaleBasketListBar
          basketList={basketList}
          memberById={memberById}
          selectedBasket={currentBasket}
          onBasketClick={setCurrentBasket}
          onBasketAdd={onBasketAdd}
        />

        <div
          className={classNames({
            [classes.searchBarWithResults]: showResultsOnPage,
            [classes.searchBarWithCategoryName]:
              !showResultsOnPage && currentSection,
          })}
        >
          {showResultsOnPage && (
            <Button
              color="default"
              variant="outlined"
              startIcon={<ArrowBack />}
              className={classes.goBackButton}
              onClick={clearSearch}
            >
              <Typography variant="subtitle2">
                {t('interface.goBack')}
              </Typography>
            </Button>
          )}
          {!showResultsOnPage && currentSection && (
            <QuicksaleItemListHeader
              sectionIcon={currentSection.section_icon}
              sectionName={currentSection.section_name}
              goBack={goBackToSectionList}
              customClasses={{ itemListHeader: classes.itemListHeader }}
            />
          )}
          <div
            className={classNames(classes.widthFull, {
              [classes.width300px]: !showResultsOnPage && currentSection,
            })}
          >
            <QuicksaleInterfaceSearchBar
              searchText={searchText}
              clearSearch={clearSearch}
              onSearchTextChange={onSearchTextChange}
              searchItems={
                (!currentSection || showResultsOnPage
                  ? availableSearchItemsInWholeConfig
                  : itemCardInfoList) ?? []
              }
              searchResults={searchResults}
              onItemClick={onItemClick}
              onSearchIconClick={onSearchIconClick}
              openPopper={
                searchText !== '' &&
                !showResultsOnPage &&
                searchResults.length > 0
              }
            />
          </div>
        </div>

        <QuicksaleTileList
          sectionList={sectionList}
          itemCardInfoList={itemCardInfoList}
          searchResults={searchResults}
          showResults={showResultsOnPage}
          currentSection={currentSection}
          searchText={searchText}
          onSectionClick={onSectionClick}
          onItemClick={onItemClick}
          loading={loading}
        />
      </Grid>

      <Grid item xs={3} className={classes.rightContainer}>
        <QuicksaleBasketPanel
          basket={currentBasket}
          member={memberById[currentBasket?.member]}
          isExcludingTax={theme.is_tax_excluded_in_marketplace}
          addToBasket={addToBasket}
          removeFromBasket={removeFromBasket}
          closeBasket={onDeleteBasketClick}
          openChangeMemberModal={openMemberAuthenticationModal}
          onPaymentClick={goToPaymentPage}
        />
      </Grid>

      <QuicksaleDialogs
        showStillOpenBasketsModal={showStillOpenBasketsModal}
        closeStillOpenBasketsModal={closeStillOpenBasketsModal}
        showDeleteWarningModal={showDeleteWarningModal}
        closeDeleteWarningModal={closeDeleteWarningModal}
        dropBasket={dropBasket}
        blockActions={blockActions}
      />

      <GenericResponsiveDialog
        open={showGiftcardFormModal}
        onClose={closeGiftcardFormModal}
      >
        <DialogTitle disableTypography className={classes.giftcardDialogTitle}>
          <IconButton
            onClick={closeGiftcardFormModal}
            className={classes.giftcardDialogCloseButton}
          >
            <Close className={classes.giftcardDialogCloseIcon} />
          </IconButton>
        </DialogTitle>

        <GiftcardForm
          company={theme.company}
          giftcard={
            giftcardById[
              Number(getIdsFromQuicksaleCardInfoId(pendingItemToAdd)?.[1])
            ] ?? null
          }
          cover={theme.cover}
          giftcardBackgroundImageList={giftcardBackgroundImageList}
          pendingItemToAdd={pendingItemToAdd}
          currentBasket={currentBasket}
          setCurrentBasket={setCurrentBasket}
          addItemToBasket={addItemToBasket}
          showGiftcardFormModal={showGiftcardFormModal}
          closeGiftcardFormModal={closeGiftcardFormModal}
          fetchGiftcardBackgroundImageList={fetchGiftcardBackgroundImageList}
        />
      </GenericResponsiveDialog>
    </Grid>
  );
};

export default React.memo(QuicksaleInterface);
