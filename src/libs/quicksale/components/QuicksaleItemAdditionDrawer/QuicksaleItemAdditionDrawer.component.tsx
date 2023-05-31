import React from 'react';
import { useTranslation } from 'react-i18next';
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
import Fuse, { FuseOptions } from 'fuse.js';
import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import FormSection from '#components/forms/FormSection';
// @ts-expect-error
import FuzeSearch from '#components/FuzeSearch.component';
import {
  QuicksaleCardInfo,
  QuicksaleItemsByItemIdentifierByCategory,
} from '../../types';
import { QuicksaleItemColor } from '../../constants';
import ColorPicker from '../ColorPicker';
import ListItem, { SimpleItemListAction } from './AdditionDrawerListItem';
import QuicksaleItemGroupAdditionDrawer from './QuicksaleItemGroupAdditionDrawer';
import useStyle from './hook';

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

function isNotQuicksaleCardInfoList<T extends Object[]>(
  object: T,
): object is Exclude<T, QuicksaleCardInfo[]> {
  return object.length > 0 && 'item' in object[0];
}

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
    // retrieving all the QuicksaleCardInfo items in a list
    () =>
      Object.values(availableItems)
        .map(
          (itemsByBuyableItemIdentifier) =>
            itemsByBuyableItemIdentifier.itemsByCategory,
        )
        .flat()
        .map((itemCategory) => itemCategory.items)
        .flat()
        .filter((item) => !selectedItems.includes(item)),
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
      open={open}
      onClose={onDrawerClose}
      title={t('itemList.additionDrawer.title')}
      subtitle={t('itemList.additionDrawer.simpleObjectsSubtitle')}
      withoutPadding
      customClasses={{
        header: classes.drawerHeader,
        content: classes.drawerContainer,
        titleTypography: classes.drawerTitleTypography,
      }}
    >
      <div>
        <FormSection
          sectionTitle={t('itemList.additionDrawer.objectsAddition')}
          sectionIcon={AddToPhotos}
          sectionIconStyle="primary"
          sectionIconContainerStyle={classes.formSectionIconContainer}
          spacing={3}
        >
          <div ref={searchBarRef}>
            <FuzeSearch
              variant="outlined"
              searchText={searchText}
              clearSearch={clearSearch}
              changeSearch={onSearchTextChange}
              items={searchItems}
              placeholder={t('itemList.additionDrawer.search')}
              searchFields={['title']}
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
                  item={item}
                  dispatch={dispatch}
                  displayBin
                />
              ))}

            {selectedItems.length > PAGE_SIZE && (
              <Pagination
                page={pageNumber}
                count={Math.ceil(selectedItems.length / PAGE_SIZE)}
                onChange={handleChangePage}
                className={classes.pagination}
              />
            )}
          </div>

          <Button
            color="primary"
            className={classes.objectGroupButton}
            onClick={openObjectGroupDrawer}
            startIcon={<Add />}
          >
            {t('itemList.additionDrawer.objectGroupsSubtitle')}
          </Button>
        </FormSection>

        <FormSection
          sectionTitle={t('itemList.additionDrawer.tilesColor')}
          sectionIcon={ColorLens}
          sectionIconStyle="primary"
          sectionIconContainerStyle={classes.formSectionIconContainer}
          spacing={3}
        >
          <ColorPicker
            colorChoices={Object.values(QuicksaleItemColor)}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
        </FormSection>
      </div>

      <DialogActions className={classes.dialogActions}>
        <Button onClick={onDrawerClose}>
          {t('itemList.additionDrawer.cancel')}
        </Button>
        <Button
          onClick={addSelectedItems}
          disabled={selectedItems.length === 0}
          color="primary"
          variant="contained"
        >
          {t('itemList.additionDrawer.add')}
        </Button>
      </DialogActions>

      <Popper
        className={classes.popper}
        open={searchText !== ''}
        anchorEl={searchBarRef.current}
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
                item={result}
                dispatch={dispatch}
                onSelectCallback={clearSearch}
                clickToSelect
                noDivider={index === searchResults.length - 1}
              />
            ))
          ) : (
            <Alert
              variant="filled"
              severity="info"
              className={classes.noResultAlert}
            >
              <Typography variant="body1">
                {t('itemList.additionDrawer.noResult')}
              </Typography>
            </Alert>
          )}
        </Paper>
      </Popper>

      <QuicksaleItemGroupAdditionDrawer
        open={isObjectGroupDrawerOpen}
        onClose={closeObjectGroupDrawer}
        availableItems={availableItems}
        addToSelectedItems={addToSelectedItems}
      />
    </GenericResponsiveDrawer>
  );
};

export default React.memo(QuicksaleItemAdditionDrawer);
