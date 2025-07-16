import React from 'react';
import { useTranslation } from 'react-i18next';
import Fuse, { FuseOptions } from 'fuse.js';

import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import DialogActions from '@material-ui/core/DialogActions';
import AddToPhotos from '@material-ui/icons/AddToPhotos';
import Add from '@material-ui/icons/Add';
import ColorLens from '@material-ui/icons/ColorLens';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';

import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items.js';

import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import FormSection from '#src/components/forms/FormSection';
import FuzeSearch from '#src/components/FuzeSearch.component';
import { QuicksaleItemColor } from '../../constants';
import ColorPicker from '../ColorPicker';
import ListItem, { SimpleItemListAction } from './AdditionDrawerListItem';
import QuicksaleItemGroupAdditionDrawer from './QuicksaleItemGroupAdditionDrawer';
import useStyle from './styles';
import { isNotQuicksaleCardInfoList } from '../../utils';
import type {
  QuicksaleCardInfo,
  QuicksaleItemsByItemIdentifierByCategory,
} from '../../types';

type ItemListAction =
  | SimpleItemListAction
  | { type: 'ADD_MANY_ITEMS'; payload: Array<QuicksaleCardInfo> }
  | { type: 'RESET_ITEMS' };

const reducer = (state: Array<QuicksaleCardInfo>, action: ItemListAction) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return [action.payload, ...state];
    case 'ADD_MANY_ITEMS':
      return Array.from(new Set([...action.payload, ...state]));
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.payload.id);
    case 'RESET_ITEMS':
      return [];
    default:
      return state;
  }
};

type Props = {
  open: boolean;
  availableItems: QuicksaleItemsByItemIdentifierByCategory;
  onClose: () => void;
  addItems: (items: Array<QuicksaleCardInfo>) => void;
};

const PAGE_SIZE = 10;

const QuicksaleItemAdditionDrawer: React.FC<Props> = ({
  open,
  availableItems,
  onClose,
  addItems,
}) => {
  const classes = useStyle();

  const { t } = useTranslation(['quicksale']);

  const [pageNumber, setPageNumber] = React.useState(1);

  const handleChangePage = React.useCallback(
    (_: React.ChangeEvent<unknown> | null, page: number = 1) =>
      setPageNumber(page),
    [],
  );

  // ========== Handling of the search bar ========== //
  const [searchText, setSearchText] = React.useState('');

  const [searchResults, setSearchResults] = React.useState<
    Array<QuicksaleCardInfo>
  >([]);

  const clearSearch = React.useCallback(() => {
    setSearchText('');
    setSearchResults([]);
  }, []);

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

  const [selectedItems, dispatch] = React.useReducer(reducer, []);

  const onDrawerClose = React.useCallback(() => {
    dispatch({ type: 'RESET_ITEMS' });
    setSelectedColor(QuicksaleItemColor.Gray);
    onClose();
  }, [onClose]);

  const searchItems = React.useMemo(
    // (Quicksale MVP): Only include webshop items in the selectable list
    () => {
      const shopItemKey = QuicksaleBasketItem.ShopItemIdentifier;
      const shopItemsByCategory =
        availableItems[shopItemKey]?.itemsByCategory ?? [];
      return shopItemsByCategory
        .map((itemCategory) => itemCategory.items)
        .flat()
        .filter((item) => !selectedItems.includes(item));
    },
    [availableItems, selectedItems],
  );

  const searchBarRef = React.useRef(null);

  // ========== Handling of the objects group drawer ========== //
  const [isObjectGroupDrawerOpen, setIsObjectGroupDrawerOpen] =
    React.useState(false);

  const openObjectGroupDrawer = React.useCallback(() => {
    setIsObjectGroupDrawerOpen(true);
  }, []);

  const closeObjectGroupDrawer = React.useCallback(() => {
    setIsObjectGroupDrawerOpen(false);
  }, []);

  const addToSelectedItems = React.useCallback(
    (itemList: Array<QuicksaleCardInfo>) =>
      dispatch({ type: 'ADD_MANY_ITEMS', payload: itemList }),
    [],
  );

  // ========== Handling of the color selector ========== //
  const [selectedColor, setSelectedColor] = React.useState<string>(
    QuicksaleItemColor.Gray,
  );

  // ========== Handling of the submit button ========== //
  const addSelectedItems = React.useCallback(
    // on the item list, only the subscriptions can have a recurrence, so we
    // remove the recurrence from the selected items that aren't subscriptions
    () => {
      addItems(
        selectedItems.map((item) => ({
          ...item,
          color: selectedColor as QuicksaleItemColor,
          ...(item.recurrence &&
          item.id.split(' ')[0] !==
            QuicksaleBasketItem.SubscriptionIdentifier.toString()
            ? { recurrence: '' }
            : {}),
        })),
      );
      onDrawerClose();
    },
    [addItems, onDrawerClose, selectedColor, selectedItems],
  );

  return (
    <GenericResponsiveDrawer
      withoutPadding
      customClasses={{
        header: classes.drawerHeader,
        content: classes.drawerContainer,
        titleTypography: classes.drawerTitleTypography,
      }}
      onClose={onDrawerClose}
      open={open}
      subtitle={t('itemList.additionDrawer.simpleObjectsSubtitle')}
      title={t('itemList.additionDrawer.title')}
    >
      <div>
        <FormSection
          sectionIcon={AddToPhotos}
          sectionIconContainerStyle={classes.formSectionIconContainer}
          sectionIconStyle="primary"
          sectionTitle={t('itemList.additionDrawer.objectsAddition')}
          spacing={3}
        >
          <div ref={searchBarRef}>
            <FuzeSearch
              changeSearch={onSearchTextChange}
              clearSearch={clearSearch}
              items={searchItems}
              placeholder={t('itemList.additionDrawer.search')}
              searchFields={['title']}
              searchText={searchText}
              variant="outlined"
            />
          </div>

          <div>
            {selectedItems
              .slice(
                (pageNumber - 1) * PAGE_SIZE,
                Math.min(selectedItems.length, pageNumber * PAGE_SIZE),
              )
              .map((item) => (
                <ListItem
                  key={`selected ${item.id}`}
                  displayBin
                  dispatch={dispatch}
                  item={item}
                />
              ))}

            {selectedItems.length > PAGE_SIZE && (
              <Pagination
                className={classes.pagination}
                count={Math.ceil(selectedItems.length / PAGE_SIZE)}
                onChange={handleChangePage}
                page={pageNumber}
              />
            )}
          </div>

          <Button
            className={classes.objectGroupButton}
            color="primary"
            onClick={openObjectGroupDrawer}
            startIcon={<Add />}
          >
            {t('itemList.additionDrawer.objectGroupsSubtitle')}
          </Button>
        </FormSection>

        <FormSection
          sectionIcon={ColorLens}
          sectionIconContainerStyle={classes.formSectionIconContainer}
          sectionIconStyle="primary"
          sectionTitle={t('itemList.additionDrawer.tilesColor')}
          spacing={3}
        >
          <ColorPicker
            colorChoices={Object.values(QuicksaleItemColor)}
            onColorChange={setSelectedColor}
            selectedColor={selectedColor}
          />
        </FormSection>
      </div>

      <DialogActions className={classes.dialogActions}>
        <Button onClick={onDrawerClose}>
          {t('itemList.additionDrawer.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={selectedItems.length === 0}
          onClick={addSelectedItems}
          variant="contained"
        >
          {t('itemList.additionDrawer.add')}
        </Button>
      </DialogActions>

      <Popper
        anchorEl={searchBarRef.current}
        className={classes.popper}
        open={searchText !== ''}
        placement="bottom-start"
        style={{
          width: searchBarRef.current ? searchBarRef.current.clientWidth : 0,
        }}
      >
        <Paper className={classes.resultListContainer}>
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <ListItem
                key={`search ${result.id}`}
                clickToSelect
                dispatch={dispatch}
                item={result}
                noDivider={index === searchResults.length - 1}
                onSelectCallback={clearSearch}
              />
            ))
          ) : (
            <Alert
              className={classes.noResultAlert}
              severity="info"
              variant="filled"
            >
              <Typography variant="body1">
                {t('itemList.additionDrawer.noResult')}
              </Typography>
            </Alert>
          )}
        </Paper>
      </Popper>

      <QuicksaleItemGroupAdditionDrawer
        addToSelectedItems={addToSelectedItems}
        availableItems={availableItems}
        onClose={closeObjectGroupDrawer}
        open={isObjectGroupDrawerOpen}
      />
    </GenericResponsiveDrawer>
  );
};

export default React.memo(QuicksaleItemAdditionDrawer);
