import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { push } from 'connected-react-router';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme, useMediaQuery } from '@material-ui/core';

import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items.js';
import {
  QuicksaleCardInfo,
  QuicksaleItem,
  QuicksaleItemsByItemIdentifierByCategory,
  QuicksaleSection,
} from '#src/libs/quicksale/types';
import { QuicksaleItemColor } from '#src/libs/quicksale/constants';
import {
  getAvailableItemsByItemIdentifierByCategory,
  getLoading,
  getSectionList,
  getUpdateLoading,
} from '#src/libs/quicksale/selectors';
import ColorPicker from '#src/libs/quicksale/components/ColorPicker';
import {
  fetchQuicksaleConfiguration as fetchQuicksaleConfigurationAction,
  updateQuicksaleConfiguration,
} from '#src/libs/quicksale/actions';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import {
  BuyableItemAndIdentifier,
  getBuyableItemFromIdentifierAndId,
  getCardInfoFromBuyableItem,
} from '#src/libs/quicksale/utils';
import { getPaymentPackById } from '#src/libs/payment-packs/selectors';
import { _getPrivatePassData } from '#src/libs/private-service/selectors/private-pass';
import { getPaymentComboDataDict } from '#src/libs/payment-combo/selectors';
import { fetchPaymentComboList as fetchPaymentComboListAction } from '#src/libs/payment-combo/actions';
import { getStandaloneAndBaseShopItemById } from '#src/libs/shop/selectors';
import {
  fetchShopItemBaseList as fetchShopItemBaseListAction,
  fetchShopItemStandaloneList as fetchShopItemStandaloneListAction,
} from '#src/libs/shop/actions/shopItemReworked';
import { getGiftcardData } from '#src/libs/giftcard/selectors';
import { getContractsById } from '#src/libs/subscription/selectors';
import { fetchContractList as fetchSubscriptionListAction } from '#src/libs/subscription/actions';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import PromptOnPageLeave from '#src/components/Prompt';
import QuicksaleBreadcrumbs from '#src/libs/quicksale/components/QuicksaleBreadcrumbs';
import QuicksaleConfigurationItemList, {
  QuicksaleItemListHeader,
} from '#src/libs/quicksale/components/QuicksaleConfigurationItemList';
import QuicksaleItemAdditionDrawer from '#src/libs/quicksale/components/QuicksaleItemAdditionDrawer';
import withDatatypeDynamicData from '#src/libs/datatype-filtering/dynamic-data-hoc';
import { DynamicFilterDataType } from '#src/libs/datatype-filtering/types';
import useGlobalStyles from './cardListHook';
import { RootState } from '#src/reducers';

type ReducerAction =
  | { type: 'SET_ITEMS' | 'ADD_MANY_ITEMS'; payload: Array<QuicksaleCardInfo> }
  | {
      type: 'EDIT_ITEM_COLOR';
      payload: {
        itemId: string;
        value: QuicksaleItemColor;
      };
    }
  | {
      type: 'DELETE_ITEM';
      payload: { itemId: string };
    }
  | {
      type: 'REORDER_ITEMS';
      payload: { draggedItemIndex: number; dropzoneIndex: number };
    };

type OwnProps = {
  sectionList: Array<QuicksaleSection>;
  sectionId: string;
  handleGetDynamicDataForFilters: (datatype: DynamicFilterDataType) => any[];
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const QuicksaleItemList: React.FC<Props> = (props) => {
  const { t } = useTranslation(['quicksale']);

  const classes = useGlobalStyles();
  const localClasses = useStyles();

  const {
    sectionList,
    sectionId,
    fetchQuicksaleConfiguration,
    saveConfiguration,
    pushRouter,
    handleGetDynamicDataForFilters,
    fetchPaymentComboList,
    fetchShopItemBaseList,
    fetchShopItemStandaloneList,
    fetchSubscriptionList,
    loading,
    updateLoading,
    availableItemsByItemIdentifierByCategory,
  } = props;

  const currentSection = React.useMemo(
    () => sectionList.find((section) => section.section_id === sectionId),
    [sectionId, sectionList],
  );

  // ==================== Helper alert 'see more' ====================
  const [showFullHelperAlert, setShowFullHelperAlert] = React.useState(false);
  const toggleShowFullHelperAlert = React.useCallback(
    () =>
      setShowFullHelperAlert(
        (prevShowFullHelperAlert) => !prevShowFullHelperAlert,
      ),
    [],
  );
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  const [isSaveNeeded, setIsSaveNeeded] = React.useState(false);

  const reducer = React.useCallback(
    (
      state: Array<QuicksaleCardInfo>,
      action: ReducerAction,
    ): Array<QuicksaleCardInfo> => {
      switch (action.type) {
        case 'SET_ITEMS':
          return isSaveNeeded ? state : action.payload;
        case 'ADD_MANY_ITEMS':
          return Array.from(new Set([...state, ...action.payload]));
        case 'EDIT_ITEM_COLOR':
          return state.map((item) => {
            if (item.id === action.payload.itemId)
              return {
                ...item,
                color: action.payload.value,
              };
            return item;
          });
        case 'DELETE_ITEM':
          return state.filter((item) => item.id !== action.payload.itemId);
        case 'REORDER_ITEMS': {
          const { draggedItemIndex, dropzoneIndex } = action.payload;

          // Simple array reordering logic
          const newItemList = [...state];
          const [movedItem] = newItemList.splice(draggedItemIndex, 1);
          newItemList.splice(dropzoneIndex, 0, movedItem);

          return newItemList;
        }

        default:
          return state;
      }
    },
    [isSaveNeeded],
  );

  const [unsavedItemList, dispatch] = React.useReducer(reducer, []);

  const availableItemsFromBackendConfig = React.useRef<Array<QuicksaleItem>>(
    [],
  );

  // ============= componentDidUpdate =============

  // Set items in reducer when currentSection.items changes
  React.useEffect(() => {
    availableItemsFromBackendConfig.current = [];

    const itemListToQuicksaleCardInfoList = (
      currentSection?.items ?? []
    ).reduce((accumulator: QuicksaleCardInfo[], item) => {
      const buyableItem = getBuyableItemFromIdentifierAndId(
        item.buyable_item_identifier,
        item.object_id,
        props.paymentPackById,
        props.privatePassById,
        props.paymentComboById,
        props.shopItemById,
        props.subscriptionById,
        props.giftcardById,
      );
      if (buyableItem === undefined) return accumulator;

      availableItemsFromBackendConfig.current.push(item);
      return [
        ...accumulator,
        getCardInfoFromBuyableItem(
          {
            buyableItemIdentifier: item.buyable_item_identifier,
            buyableItem,
          } as BuyableItemAndIdentifier,
          t,
          item.color,
          currentSection?.section_id ?? '',
        ),
      ];
    }, []);
    dispatch({ type: 'SET_ITEMS', payload: itemListToQuicksaleCardInfoList });
  }, [
    currentSection?.items,
    currentSection?.section_id,
    props.giftcardById,
    props.paymentComboById,
    props.paymentPackById,
    props.privatePassById,
    props.shopItemById,
    props.subscriptionById,
    t,
  ]);

  // Set isSaveNeeded when unsavedItemList changes
  React.useEffect(() => {
    setIsSaveNeeded(
      unsavedItemList.length > 0 &&
        !isEqual(
          // unsavedItemList is a list of QuicksaleCardInfo and need to be
          // reconverted to a list of QuicksaleItem
          unsavedItemList.map((item) => {
            const [buyableItemIdentifier, objectId] = item.id.split(' ');
            return {
              buyable_item_identifier: Number(buyableItemIdentifier),
              object_id: Number(objectId),
              color: item.color,
            };
          }),
          availableItemsFromBackendConfig.current ?? [],
        ),
    );
  }, [unsavedItemList]);

  // =================================================

  const onItemColorChange = React.useCallback(
    (itemId: string, color: string) => {
      dispatch({
        type: 'EDIT_ITEM_COLOR',
        payload: { itemId, value: color as QuicksaleItemColor },
      });
    },
    [],
  );

  const onItemDelete = React.useCallback((itemId: string) => {
    dispatch({
      type: 'DELETE_ITEM',
      payload: { itemId },
    });
  }, []);

  const onItemReorder = React.useCallback(
    (draggedItemIndex: number, dropzoneIndex: number) => () => {
      dispatch({
        type: 'REORDER_ITEMS',
        payload: { draggedItemIndex, dropzoneIndex },
      });
    },
    [],
  );

  // ==================== Item addition management ====================
  const [showItemAdditionDrawer, setShowItemAdditionDrawer] =
    React.useState(false);

  const openItemAdditionDrawer = React.useCallback(
    () => setShowItemAdditionDrawer(true),
    [],
  );

  const closeItemAdditionDrawer = React.useCallback(
    () => setShowItemAdditionDrawer(false),
    [],
  );

  const addManyItems = React.useCallback(
    (itemsToAdd: Array<QuicksaleCardInfo>) => {
      dispatch({ type: 'ADD_MANY_ITEMS', payload: itemsToAdd });
    },
    [],
  );

  // Computation of the available items for the drawer.
  // The items are stored as PaymentPacks, PrivatePasses, ...
  // and need to be converted to QuicksaleCardInfo to make code
  // easier in the drawer component
  const availableItems = React.useMemo(() => {
    const result: QuicksaleItemsByItemIdentifierByCategory = {
      [QuicksaleBasketItem.PaymentPackIdentifier]: {
        hasCategories: false,
        itemsByCategory: [],
      },
      [QuicksaleBasketItem.PrivatePassIdentifier]: {
        hasCategories: false,
        itemsByCategory: [],
      },
      [QuicksaleBasketItem.PaymentComboIdentifier]: {
        hasCategories: false,
        itemsByCategory: [],
      },
      [QuicksaleBasketItem.ShopItemIdentifier]: {
        hasCategories: false,
        itemsByCategory: [],
      },
      [QuicksaleBasketItem.GiftcardIdentifier]: {
        hasCategories: false,
        itemsByCategory: [],
      },
      [QuicksaleBasketItem.SubscriptionIdentifier]: {
        hasCategories: false,
        itemsByCategory: [],
      },
    };

    (
      Object.keys(result) as Array<unknown> as Array<QuicksaleBasketItem>
    ).forEach((buyableItemIdentifier) => {
      result[buyableItemIdentifier] = {
        hasCategories:
          availableItemsByItemIdentifierByCategory[buyableItemIdentifier]
            .hasCategories,
        itemsByCategory: availableItemsByItemIdentifierByCategory[
          buyableItemIdentifier
        ].itemsByCategory.map((category) => ({
          id: category.id,
          name: category.name,
          items: category.items
            .map((item) =>
              getCardInfoFromBuyableItem(
                // @ts-expect-error because getCardInfoFromBuyableItem expects
                // a specific type for each buyableItemIdentifier and TS doesn't see
                // that it's working here
                {
                  buyableItemIdentifier: Number(buyableItemIdentifier),
                  buyableItem: item,
                },
                t,
                '',
                currentSection?.section_id ?? '',
              ),
            )
            .filter(
              (item) =>
                !unsavedItemList.some(
                  (unsavedItem) => unsavedItem.id === item.id,
                ),
            ),
        })),
      };
    });
    return result;
  }, [
    availableItemsByItemIdentifierByCategory,
    currentSection?.section_id,
    t,
    unsavedItemList,
  ]);

  // ==================== Color management ====================
  const [itemWhoseColorIsEdited, setItemWhoseColorIsEdited] =
    React.useState('');

  const relatedItem = React.useMemo(
    () => unsavedItemList.find((item) => item.id === itemWhoseColorIsEdited),
    [itemWhoseColorIsEdited, unsavedItemList],
  );

  const openColorModal = React.useCallback(
    (itemId: string) => setItemWhoseColorIsEdited(itemId),
    [],
  );

  const closeColorModal = React.useCallback(
    () => setItemWhoseColorIsEdited(''),
    [],
  );

  const onColorSelect = React.useCallback(
    (color: string) => {
      onItemColorChange(itemWhoseColorIsEdited, color);
      closeColorModal();
    },
    [closeColorModal, itemWhoseColorIsEdited, onItemColorChange],
  );

  const availableColors = React.useMemo(
    () => Object.values(QuicksaleItemColor),
    [],
  );

  // ==================== componentDidMount ====================
  // Redirect to configuration main page if section not found
  React.useEffect(() => {
    if (!loading && sectionList?.length > 0 && currentSection === undefined)
      pushRouter('/settings/quicksale');
  }, [currentSection, loading, pushRouter, sectionList]);

  // Fetch configuration and objects
  React.useEffect(() => {
    fetchQuicksaleConfiguration();
    handleGetDynamicDataForFilters('payment_pack');
    handleGetDynamicDataForFilters('payment_pack_category');
    handleGetDynamicDataForFilters('private_pass');
    handleGetDynamicDataForFilters('private_pass_category');
    fetchPaymentComboList();
    handleGetDynamicDataForFilters('subshop');
    handleGetDynamicDataForFilters('giftcard');
    fetchSubscriptionList();
    fetchShopItemBaseList();
    fetchShopItemStandaloneList();
  }, [
    fetchPaymentComboList,
    fetchQuicksaleConfiguration,
    fetchShopItemBaseList,
    fetchShopItemStandaloneList,
    fetchSubscriptionList,
    handleGetDynamicDataForFilters,
  ]);

  // ============================================================

  // ==================== Save configuration ====================
  const saveQuicksaleConfiguration = React.useCallback(() => {
    const currentSectionItemList = unsavedItemList.map(
      (item): QuicksaleItem => {
        const [buyableItemIdentifier, objectId] = item.id.split(' ');
        return {
          buyable_item_identifier: Number(
            buyableItemIdentifier,
          ) as QuicksaleBasketItem,
          object_id: Number(objectId),
          color: item.color as QuicksaleItemColor,
          // TODO: variant_ids: item.variant_ids || null,
        };
      },
    );
    saveConfiguration(
      sectionList.map((section) => {
        if (section.section_id === sectionId) {
          return {
            ...section,
            items: currentSectionItemList,
          };
        }
        return section;
      }),
    );

    setIsSaveNeeded(false);
  }, [saveConfiguration, sectionId, sectionList, unsavedItemList]);

  const onGoBackClick = React.useCallback(() => {
    pushRouter('/settings/quicksale');
  }, [pushRouter]);

  return (
    <>
      <div className={classes.sectionListContainer}>
        <div className={classes.pageHeader}>
          <Typography className={classes.mediumBold} variant="h6">
            {t('cardListPage.preview')}
          </Typography>
          <Button
            color="primary"
            disabled={!isSaveNeeded || updateLoading}
            onClick={saveQuicksaleConfiguration}
            variant="contained"
          >
            {updateLoading ? (
              <CircularProgress size={24} />
            ) : (
              <>{t('cardListPage.save')}</>
            )}
          </Button>
        </div>

        <div className={localClasses.pageBody}>
          <Alert className={localClasses.alertInfo} severity="info">
            {!isMobile || showFullHelperAlert ? (
              <>{t('cardListPage.possibleActionsFull')}</>
            ) : (
              <>
                {t('cardListPage.possibleActionsShort')}
                <Button onClick={toggleShowFullHelperAlert}>
                  {t('cardListPage.seeMore')}
                </Button>
              </>
            )}
            {(!isMobile || showFullHelperAlert) && (
              <>
                <ul className={classes.actionList}>
                  <li>{t('cardListPage.editColor')}</li>
                  <li>{t('cardListPage.moveTile')}</li>
                  <li>{t('cardListPage.deleteTile')}</li>
                </ul>
                {t('cardListPage.addItems')}
              </>
            )}
            {isMobile && showFullHelperAlert && (
              <Button onClick={toggleShowFullHelperAlert}>
                {t('cardListPage.seeLess')}
              </Button>
            )}
          </Alert>

          <div className={localClasses.itemListContainer}>
            <QuicksaleItemListHeader
              goBack={onGoBackClick}
              sectionIcon={currentSection?.section_icon ?? ''}
              sectionName={currentSection?.section_name ?? ''}
            />
            {currentSection && (
              <div className={localClasses.breadcrumbsContainer}>
                <QuicksaleBreadcrumbs
                  categoryLabel={currentSection.section_name}
                  homeLabel={t('interface.home')}
                  onHomeClick={onGoBackClick}
                />
              </div>
            )}
            <QuicksaleConfigurationItemList
              deleteItem={onItemDelete}
              itemList={unsavedItemList}
              loading={loading}
              onItemReorder={onItemReorder}
              openAddItemDrawer={openItemAdditionDrawer}
              openColorModal={openColorModal}
            />
          </div>
        </div>
      </div>

      <GenericResponsiveDialog
        maxWidth="sm"
        onClose={closeColorModal}
        open={itemWhoseColorIsEdited !== ''}
      >
        <DialogTitle disableTypography className={classes.colorModalTitle}>
          <Typography variant="h6">
            {t('cardListPage.categoryModalTitle')}
          </Typography>
          <IconButton
            className={classes.colorModalCloseButton}
            onClick={closeColorModal}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {t('cardListPage.categoryModalSubtitle')}
          </Typography>
          <ColorPicker
            className={classes.colorPicker}
            colorChoices={availableColors}
            onColorChange={onColorSelect}
            selectedColor={relatedItem?.color ?? ''}
          />
        </DialogContent>
      </GenericResponsiveDialog>

      <PromptOnPageLeave
        description={t('pageLeavePrompt.description')}
        leaveWithoutSavingText={t('pageLeavePrompt.discard')}
        leaveWithSavingText={t('pageLeavePrompt.save')}
        onLeaveWithSaving={saveQuicksaleConfiguration}
        openPromptOnPageLeave={isSaveNeeded}
        title={t('pageLeavePrompt.title')}
      />

      <QuicksaleItemAdditionDrawer
        addItems={addManyItems}
        availableItems={availableItems}
        onClose={closeItemAdditionDrawer}
        open={showItemAdditionDrawer}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  pageBody: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    flex: 'auto',
    [theme.breakpoints.down(1600)]: {
      flexDirection: 'column',
    },
  },
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up(1600)]: {
      order: 2,
      maxWidth: '25%',
    },
    height: 'fit-content',
  },
  itemListContainer: {
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: theme.spacing(2),
  },
  breadcrumbsContainer: {
    paddingLeft: theme.spacing(1.5),
  },
}));

const connector = connect(
  (state: RootState) => ({
    // @ts-expect-error
    sectionList: getSectionList(state),
    loading:
      getLoading(state) ||
      state.paymentPack.loading ||
      state.privateService.privatePass.loading ||
      state.paymentCombo.loading ||
      state.shop.shopItem.bulk.loading ||
      state.giftcard.giftcard.loading ||
      state.subscription.contract.loading,
    updateLoading: getUpdateLoading(state),
    paymentPackById: getPaymentPackById(state),
    privatePassById: _getPrivatePassData(state),
    paymentComboById: getPaymentComboDataDict(state),
    shopItemById: getStandaloneAndBaseShopItemById(state),
    giftcardById: getGiftcardData(state),
    // @ts-expect-error
    subscriptionById: getContractsById(state),
    availableItemsByItemIdentifierByCategory:
      // @ts-expect-error
      getAvailableItemsByItemIdentifierByCategory(state),
  }),
  {
    fetchQuicksaleConfiguration: fetchQuicksaleConfigurationAction,
    saveConfiguration: updateQuicksaleConfiguration,
    pushRouter: push,
    fetchPaymentComboList: fetchPaymentComboListAction,
    fetchSubscriptionList: fetchSubscriptionListAction,
    fetchShopItemBaseList: fetchShopItemBaseListAction,
    fetchShopItemStandaloneList: fetchShopItemStandaloneListAction,
  },
);

export default compose(
  routerParamsToProps({ sectionId: 'sectionId:string' }),
  connector,
  withDatatypeDynamicData,
  React.memo,
)(QuicksaleItemList);
