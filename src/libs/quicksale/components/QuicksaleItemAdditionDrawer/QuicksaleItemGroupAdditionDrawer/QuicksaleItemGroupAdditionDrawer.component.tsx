import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Search from '@material-ui/icons/Search';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';
import classNames from 'classnames';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import FormSection from '#components/forms/FormSection';
import {
  QuicksaleCardInfo,
  QuicksaleItemsByItemIdentifierByCategory,
} from '../../../types';
import Selector from '#components/Selector/MaterialUISelector.component';
import ListItem, { SimpleItemListAction } from '../AdditionDrawerListItem';
import useParentDrawerStyle from '../hook';
import useStyle from './hook';

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
  const availableItemTypes = React.useMemo(
    () => [
      {
        label: t('objectCard.subtitle.paymentPack'),
        value: QuicksaleBasketItem.PaymentPackIdentifier,
      },
      {
        label: t('objectCard.subtitle.privatePass'),
        value: QuicksaleBasketItem.PrivatePassIdentifier,
      },
      {
        label: t('objectCard.subtitle.shopProduct'),
        value: QuicksaleBasketItem.ShopItemIdentifier,
      },
      {
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
      },
    ],
    [t],
  );

  const [selectedItemType, setSelectedItemType] = React.useState<{
    label: string;
    value: QuicksaleBasketItem;
  }>(null);

  const onItemTypeChange = React.useCallback(
    (itemType: { label: string; value: QuicksaleBasketItem }) => {
      setSelectedItemType(itemType);
      setSelectedCategory(null);
    },
    [],
  );

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
  }>(null);

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
    setSelectedItemType(null);
    setSelectedCategory(null);
    unselectAll();
    onClose();
  }, [onClose, unselectAll]);

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
      open={open}
      onClose={resetAndClose}
      title={t('itemList.additionDrawer.title')}
      subtitle={t('itemList.additionDrawer.objectGroupsSubtitle')}
      withoutPadding
      customClasses={{
        drawer: classes.drawer,
        header: parentDrawerClasses.drawerHeader,
        content: parentDrawerClasses.drawerContainer,
        titleTypography: parentDrawerClasses.drawerTitleTypography,
      }}
    >
      <div>
        <FormSection
          sectionTitle={t('itemList.additionDrawer.category')}
          sectionIcon={Search}
          sectionIconStyle="primary"
          sectionIconContainerStyle={
            parentDrawerClasses.formSectionIconContainer
          }
          spacing={3}
        >
          <div className={classes.selectorsContainer}>
            <Selector
              options={availableItemTypes}
              value={selectedItemType}
              onChange={onItemTypeChange}
              placeholder={t('itemList.additionDrawer.objectType')}
              isSearchable={false}
            />

            <Selector
              options={availableCategories}
              value={selectedCategory}
              onChange={onCategoryChange}
              placeholder={t('itemList.additionDrawer.category')}
              isDisabled={
                !selectedItemType ||
                !availableItems[selectedItemType.value].hasCategories
              }
              isClearable
              isSearchable={false}
              blurOnSelect
            />
          </div>

          {!!selectedItemType &&
            (selectableItems.length > 0 ? (
              <>
                <div className={classes.selectAndUnselectContainer}>
                  <Button
                    onClick={selectAll}
                    color="primary"
                    className={classes.selectAndUnselectButton}
                  >
                    {t('itemList.additionDrawer.selectAll')}
                  </Button>
                  <Button
                    onClick={unselectAll}
                    className={classes.selectAndUnselectButton}
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
                        item={item}
                        checked={selectedItems.includes(item)}
                        dispatch={dispatch}
                        clickToSelect
                      />
                    ))}

                  {selectableItems.length > PAGE_SIZE && (
                    <Pagination
                      page={pageNumber}
                      count={Math.ceil(selectableItems.length / PAGE_SIZE)}
                      onChange={handleChangePage}
                      className={parentDrawerClasses.pagination}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className={classes.noResultAlertContainer}>
                <Alert
                  variant="filled"
                  severity="info"
                  className={classNames(
                    parentDrawerClasses.noResultAlert,
                    parentDrawerClasses.pagination,
                  )}
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
          onClick={addSelectedItemsToItemsToAdd}
          disabled={selectedItems.length === 0}
          color="primary"
          variant="contained"
        >
          {t('itemList.additionDrawer.add')}
        </Button>
      </DialogActions>
    </GenericResponsiveDrawer>
  );
};

export default React.memo(QuicksaleItemAdditionDrawer);
