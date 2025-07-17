import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Search from '@material-ui/icons/Search';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items.js';
import clsx from 'clsx';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import FormSection from '#src/components/forms/FormSection';
import Selector from '#src/components/Selector/MaterialUISelector.component';
import {
  QuicksaleCardInfo,
  QuicksaleItemsByItemIdentifierByCategory,
} from '#src/libs/quicksale/types';
import ListItem, { SimpleItemListAction } from '../AdditionDrawerListItem';
import useParentDrawerStyle from '../styles';
import useStyle from './styles';

type ItemListAction =
  | SimpleItemListAction
  | { type: 'RESET' }
  | { type: 'SELECT_ALL'; payload: Array<QuicksaleCardInfo> };

const reducer = (state: Array<QuicksaleCardInfo>, action: ItemListAction) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return [...state, action.payload];
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.payload.id);
    case 'RESET':
      return [];
    case 'SELECT_ALL':
      return [...state, ...action.payload];
    default:
      return state;
  }
};

type Props = {
  open: boolean;
  availableItems: QuicksaleItemsByItemIdentifierByCategory;
  onClose: () => void;
  addToSelectedItems: (items: Array<QuicksaleCardInfo>) => void;
};

const PAGE_SIZE = 10;

const QuicksaleItemAdditionDrawer: React.FC<Props> = ({
  open,
  availableItems,
  onClose,
  addToSelectedItems,
}) => {
  const classes = useStyle();

  const parentDrawerClasses = useParentDrawerStyle();

  const { t } = useTranslation(['quicksale']);

  const [pageNumber, setPageNumber] = React.useState(1);

  const handleChangePage = React.useCallback(
    (_: React.ChangeEvent<unknown> | null, page: number = 1) =>
      setPageNumber(page),
    [],
  );

  // ========== Handling of the item type ========== //
  // (Quicksale MVP): Only allow 'Product' (webshop items) as the selectable type
  const availableItemTypes = React.useMemo(
    () => [
      /*{
        label: t('objectCard.subtitle.paymentPack'),
        value: QuicksaleBasketItem.PaymentPackIdentifier,
      },
      {
        label: t('objectCard.subtitle.privatePass'),
        value: QuicksaleBasketItem.PrivatePassIdentifier,
      },*/
      {
        label: t('objectCard.subtitle.shopProduct'),
        value: QuicksaleBasketItem.ShopItemIdentifier,
      },
      /*{
        label: t('objectCard.subtitle.paymentCombo'),
        value: QuicksaleBasketItem.PaymentComboIdentifier,
      },
      {
        label: t('objectCard.subtitle.subscription'),
        value: QuicksaleBasketItem.SubscriptionIdentifier,
      },
      {
        label: t('objectCard.subtitle.giftcard'),
        value: QuicksaleBasketItem.GiftcardIdentifier,
      },*/
    ],
    [t],
  );

  // (Quicksale MVP): Always select the only available type (webshop items)
  const [selectedItemType, setSelectedItemType] = React.useState<{
    label: string;
    value: QuicksaleBasketItem;
  }>(availableItemTypes[0]);

  // (Quicksale MVP): Item type selector is disabled
  /*const onItemTypeChange = React.useCallback(
    (itemType: { label: string; value: QuicksaleBasketItem }) => {
      setSelectedItemType(itemType);
      setSelectedCategory(null);
    },
    [],
  );*/

  // ========== Handling of the category selector ========== //
  const availableCategories = React.useMemo(
    () =>
      selectedItemType
        ? availableItems[selectedItemType.value].itemsByCategory.map(
            (category) => ({
              label: category.id
                ? category.name
                : t('itemList.additionDrawer.withoutCategory'),
              value: category.id ?? -1,
            }),
          )
        : [],
    [availableItems, selectedItemType, t],
  );

  const [selectedCategory, setSelectedCategory] = React.useState<{
    label: string;
    value: number;
  } | null>(null);

  const onCategoryChange = React.useCallback(
    (category: { label: string; value: number }) => {
      setSelectedCategory(category);
    },
    [],
  );

  // ========== Items to display ========== //
  const selectableItems = React.useMemo(() => {
    if (!selectedItemType) return [];
    const categoriesRelatedToBuyableItem =
      availableItems[selectedItemType.value];
    if (!selectedCategory)
      return categoriesRelatedToBuyableItem.itemsByCategory
        .map((category) => category.items)
        .flat();
    return (
      categoriesRelatedToBuyableItem.itemsByCategory.find(
        (category) =>
          category.id ===
          (selectedCategory.value !== -1 ? selectedCategory.value : null),
      )?.items ?? []
    );
  }, [availableItems, selectedCategory, selectedItemType]);

  // ========== Handling of the selected items ========== //
  const [selectedItems, dispatch] = React.useReducer(reducer, []);

  const unselectAll = React.useCallback(() => dispatch({ type: 'RESET' }), []);

  const selectAll = React.useCallback(
    () => dispatch({ type: 'SELECT_ALL', payload: selectableItems }),
    [selectableItems],
  );

  // ========== Handling reset on close ========== //
  const resetAndClose = React.useCallback(() => {
    setSelectedItemType(availableItemTypes[0]);
    setSelectedCategory(null);
    unselectAll();
    onClose();
  }, [availableItemTypes, onClose, unselectAll]);

  // ========== Handling of the submit button ========== //
  const addSelectedItemsToItemsToAdd = React.useCallback(
    // on the item list, only the subscriptions can have a recurrence, so we
    // remove the recurrence from the selected items that aren't subscriptions
    () => {
      addToSelectedItems(selectedItems);
      resetAndClose();
    },
    [addToSelectedItems, resetAndClose, selectedItems],
  );

  return (
    <GenericResponsiveDrawer
      withoutPadding
      customClasses={{
        drawer: classes.drawer,
        header: parentDrawerClasses.drawerHeader,
        content: parentDrawerClasses.drawerContainer,
        titleTypography: parentDrawerClasses.drawerTitleTypography,
      }}
      onClose={resetAndClose}
      open={open}
      subtitle={t('itemList.additionDrawer.objectGroupsSubtitle')}
      title={t('itemList.additionDrawer.title')}
    >
      <div>
        <FormSection
          sectionIcon={Search}
          sectionIconContainerStyle={
            parentDrawerClasses.formSectionIconContainer
          }
          sectionIconStyle="primary"
          sectionTitle={t('itemList.additionDrawer.category')}
          spacing={3}
        >
          <div className={classes.selectorsContainer}>
            <Selector
              isDisabled
              isSearchable={false}
              // (Quicksale MVP) This selector is disabled because we only allow one item type
              /*onChange={onItemTypeChange}*/
              options={availableItemTypes}
              placeholder={t('itemList.additionDrawer.objectType')}
              value={selectedItemType}
            />

            <Selector
              blurOnSelect
              isClearable
              isDisabled={
                !selectedItemType ||
                !availableItems[selectedItemType.value].hasCategories
              }
              isSearchable={false}
              onChange={onCategoryChange}
              options={availableCategories}
              placeholder={t('itemList.additionDrawer.category')}
              value={selectedCategory}
            />
          </div>

          {!!selectedItemType &&
            (selectableItems.length > 0 ? (
              <>
                <div className={classes.selectAndUnselectContainer}>
                  <Button
                    className={classes.selectAndUnselectButton}
                    color="primary"
                    onClick={selectAll}
                  >
                    {t('itemList.additionDrawer.selectAll')}
                  </Button>
                  <Button
                    className={classes.selectAndUnselectButton}
                    onClick={unselectAll}
                  >
                    {t('itemList.additionDrawer.unselectAll')}
                  </Button>
                </div>

                <div>
                  {selectableItems
                    .slice(
                      (pageNumber - 1) * PAGE_SIZE,
                      Math.min(selectableItems.length, pageNumber * PAGE_SIZE),
                    )
                    .map((item) => (
                      <ListItem
                        key={item.id}
                        clickToSelect
                        checked={selectedItems.includes(item)}
                        dispatch={dispatch}
                        item={item}
                      />
                    ))}

                  {selectableItems.length > PAGE_SIZE && (
                    <Pagination
                      className={parentDrawerClasses.pagination}
                      count={Math.ceil(selectableItems.length / PAGE_SIZE)}
                      onChange={handleChangePage}
                      page={pageNumber}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className={classes.noResultAlertContainer}>
                <Alert
                  className={clsx(
                    parentDrawerClasses.noResultAlert,
                    parentDrawerClasses.pagination,
                  )}
                  severity="info"
                  variant="filled"
                >
                  <Typography variant="body1">
                    {t('itemList.additionDrawer.noResult')}
                  </Typography>
                </Alert>
              </div>
            ))}
        </FormSection>
      </div>

      <DialogActions className={parentDrawerClasses.dialogActions}>
        <Button onClick={onClose}>{t('itemList.additionDrawer.cancel')}</Button>
        <Button
          color="primary"
          disabled={selectedItems.length === 0}
          onClick={addSelectedItemsToItemsToAdd}
          variant="contained"
        >
          {t('itemList.additionDrawer.add')}
        </Button>
      </DialogActions>
    </GenericResponsiveDrawer>
  );
};

export default React.memo(QuicksaleItemAdditionDrawer);
