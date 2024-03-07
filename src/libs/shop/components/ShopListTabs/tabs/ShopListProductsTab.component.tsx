import React, { useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Fuse, { FuseOptions } from 'fuse.js';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import TabPanel from '@material-ui/lab/TabPanel';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LanguageIcon from '@material-ui/icons/Language';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

// @ts-ignore eslint-disable-next-line import/no-unresolved
import FuzeSearch from '#components/FuzeSearch.component';
// @ts-ignore eslint-disable-next-line import/no-unresolved
import ShopItemListItem from '#libs/shop/components/ShopItemListItem.component';
// @ts-ignore eslint-disable-next-line import/no-unresolved
import SubShopList from '#pages/shop/SubShopList.component';

import type { ShopItem, SubShop } from '#libs/shop/types';

// @ts-expect-error
// eslint-disable-next-line
import { ShopListTab } from '#libs/shop/components/ShopListTabs/constants';

type Props = {
  subshopList: SubShop[];
  goToShopItem: (id: number) => void;
  openItemCreationDrawer: () => void;
  setSelectedSubshopId: (id: number) => void;
  duplicateShopItem: (id: number, suffix: string) => void;
  setShopItemToDelete: (shopItem: ShopItem) => void;
};

const ShopListProductsTab: React.FC<Props> = ({
  subshopList,
  goToShopItem,
  openItemCreationDrawer,
  setSelectedSubshopId,
  duplicateShopItem,
  setShopItemToDelete,
}) => {
  const { t } = useTranslation(['shop', 'translation', 'common']);

  const [searchText, setSearchText] = useState<string>('');

  const [searchResult, setSearchResult] = useState<ShopItem[] | []>([]);

  const classes = useStyles();

  const handleClearSearch = useCallback(() => {
    setSearchText('');
    setSearchResult([]);
  }, []);

  const handleChangeSearch = useCallback(
    (fuse: Fuse<ShopItem, FuseOptions<ShopItem>>) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const fuseSearchResult = fuse.search(value) as ShopItem[];
        setSearchText(value);
        setSearchResult(fuseSearchResult);
      },
    [],
  );

  const handleOpenDeleteShopItemDialog = useCallback(
    (shopItem: ShopItem) => () => {
      setShopItemToDelete(shopItem);
    },
    [setShopItemToDelete],
  );

  const handleGoToShopItem = useCallback(
    (shopItemId: number) => () => {
      goToShopItem(shopItemId);
    },
    [goToShopItem],
  );

  const handleOpenShopItemCreationDrawer = useCallback(
    (subshopId: number) => () => {
      setSelectedSubshopId(subshopId);
      openItemCreationDrawer();
    },
    [openItemCreationDrawer, setSelectedSubshopId],
  );

  const handleDuplicateShopItem = useCallback(
    (subshopId: number) => () => {
      duplicateShopItem(subshopId, t('translation:common.copySuffix'));
    },
    [duplicateShopItem, t],
  );

  const fuzeSearchItems = useMemo(
    () =>
      subshopList
        .map((subshop) => subshop.shopItems)
        .reduce(
          (shopItemList, shopItems) => shopItemList.concat(shopItems),
          [],
        ),
    [subshopList],
  );

  const hasSearchResults = searchResult.length > 0 && searchText !== '';

  return (
    <TabPanel className={classes.contentContainer} value={ShopListTab.PRODUCTS}>
      <FuzeSearch
        changeSearch={handleChangeSearch}
        clearSearch={handleClearSearch}
        items={fuzeSearchItems}
        placeholder={t('search')}
        searchFields={['name', 'description']}
        searchText={searchText}
      />

      <Paper
        className={
          hasSearchResults
            ? classes.searchPaperDisplayed
            : classes.searchPaperHidden
        }
      >
        <Collapse in={hasSearchResults}>
          {searchResult.map((shopItem) => (
            <ShopItemListItem
              key={shopItem.id}
              additionalActions={
                <ListItemSecondaryAction>
                  <IconButton disableRipple>
                    {shopItem.marketplace_enabled ? (
                      <LanguageIcon color="secondary" />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={handleOpenDeleteShopItemDialog(shopItem)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              }
              onClick={handleGoToShopItem(shopItem.id)}
              shopitem={shopItem}
            />
          ))}
        </Collapse>
      </Paper>

      {subshopList.map((subshop) => (
        <SubShopList
          key={subshop.id}
          createOrUpdateSubShop={() => {}}
          onDelete={() => {}}
          subShop={subshop}
        >
          <Paper>
            <List dense disablePadding>
              {subshop.shopItems.map((shopItem) => (
                <ShopItemListItem
                  key={shopItem.id}
                  additionalActions={
                    <ListItemSecondaryAction>
                      <IconButton disableRipple>
                        {shopItem.marketplace_enabled ? (
                          <Tooltip
                            aria-label="info"
                            title={t('translation:languageToolTip')}
                          >
                            <IconButton>
                              <LanguageIcon color="secondary" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip
                            aria-label="info"
                            title={t('translation:visibilityOfIconToolTip')}
                          >
                            <IconButton>
                              <VisibilityOffIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </IconButton>
                      <Tooltip title={t('common:duplicate')}>
                        <IconButton
                          onClick={handleDuplicateShopItem(shopItem.id)}
                        >
                          <FileCopyIcon />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        onClick={handleOpenDeleteShopItemDialog(shopItem)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  }
                  onClick={handleGoToShopItem(shopItem.id)}
                  shopitem={shopItem}
                />
              ))}
              <ListItem
                button
                onClick={handleOpenShopItemCreationDrawer(subshop.id)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AddIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={t('translation:form.shop.item.create')}
                />
              </ListItem>
            </List>
          </Paper>
        </SubShopList>
      ))}
    </TabPanel>
  );
};

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderTop: 0,
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderTop: 0,
    borderBottom: 0,
  },
}));

export default React.memo(ShopListProductsTab);
