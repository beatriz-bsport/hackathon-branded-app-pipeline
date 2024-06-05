import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import TabPanel from '@material-ui/lab/TabPanel';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LanguageIcon from '@material-ui/icons/Language';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';

// @ts-expect-error
import ShopItemListItem from '#src/libs/shop/components/ShopItemListItem.component';
// @ts-expect-error
import SubShopList from '#pages/shop/SubShopList.component';

import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';

import type { ShopListSubshopFormValues } from '#src/libs/shop/components/ShopListSubshopForm/types';
import {
  ShopListTab,
  SEARCH_BAR_PAGE_ADDITIONAL_PARAMS,
} from '#src/libs/shop/components/ShopListTabs/constants';
import type { OptionCallback } from '#src/state/types';

type ShopItemOption = {
  label: string;
  onClick: (id: number) => void;
  additionalActions: any;
  shopitem: ShopItem;
  value: number;
};

const Option: React.FC<OptionPropsWithData<ShopItemOption>> = (props) => (
  <ShopItemListItem divider {...props.data} />
);

import ShopListSubshopForm from '#src/libs/shop/components/ShopListSubshopForm';

import type { ShopItem, SubShop } from '#src/libs/shop/types';

type Props = {
  subshopList: SubShop[];
  goToShopItem: (id: number) => void;
  openItemCreationDrawer: () => void;
  setSelectedSubshopId: (id: number) => void;
  duplicateShopItem: (id: number, suffix: string) => void;
  setShopItemToDelete: (shopItem: ShopItem) => void;
  createSubshop: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubShop>,
  ) => void;
  updateSubshop: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubShop>,
  ) => void;
  deleteSubshop: (id: number, options?: OptionCallback<number>) => void;
};

const ShopListProductsTab: React.FC<Props> = ({
  subshopList,
  goToShopItem,
  openItemCreationDrawer,
  setSelectedSubshopId,
  duplicateShopItem,
  setShopItemToDelete,
  createSubshop,
  updateSubshop,
  deleteSubshop,
}) => {
  const { t } = useTranslation(['shop', 'translation', 'common']);

  const [showSubshopForm, setShowSubshopForm] = useState(false);

  const classes = useStyles();

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

  const handleShowSubshopForm = useCallback(() => setShowSubshopForm(true), []);

  const handleHideSubshopForm = useCallback(
    () => setShowSubshopForm(false),
    [],
  );

  const handleSubshopSubmit = useCallback(
    (values: ShopListSubshopFormValues) => {
      if (values.id) {
        updateSubshop(values, { onSuccess: handleHideSubshopForm });
      } else {
        createSubshop(values, { onSuccess: handleHideSubshopForm });
      }
    },
    [updateSubshop, createSubshop, handleHideSubshopForm],
  );

  const handleSubshopDelete = useCallback(
    (id: number) => () => deleteSubshop(id),
    [deleteSubshop],
  );

  const shopItemOptionsFormatter = React.useCallback(
    (shopItems: ShopItem[]): ShopItemOption[] =>
      shopItems.map((shopItem) => {
        return {
          label: shopItem.name,
          onClick: handleGoToShopItem(shopItem.id),
          shopitem: shopItem,
          value: shopItem.id,
          additionalActions: (
            <ListItemSecondaryAction>
              <IconButton disableRipple>
                {shopItem.marketplace_enabled ? (
                  <LanguageIcon color="secondary" />
                ) : (
                  <VisibilityOffIcon />
                )}
              </IconButton>
              <IconButton onClick={handleOpenDeleteShopItemDialog(shopItem)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          ),
        };
      }),
    [handleGoToShopItem, handleOpenDeleteShopItemDialog],
  );

  return (
    <TabPanel className={classes.contentContainer} value={ShopListTab.PRODUCTS}>
      <ObjectSearchComponent
        additionalParams={SEARCH_BAR_PAGE_ADDITIONAL_PARAMS}
        components={{
          Option,
        }}
        optionsFormatter={shopItemOptionsFormatter}
        placeholder={t('search')}
        searchedObjectType="shop_item"
        variant="underlined"
      />

      {subshopList.map((subshop) => (
        <SubShopList
          key={subshop.id}
          createOrUpdateSubShop={handleSubshopSubmit}
          onDelete={handleSubshopDelete(subshop.id)}
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

      {showSubshopForm ? (
        <ShopListSubshopForm
          onCancel={handleHideSubshopForm}
          onSubmit={handleSubshopSubmit}
        />
      ) : (
        <div className={classes.title}>
          <ButtonBase onClick={handleShowSubshopForm}>
            <Grid container alignItems="center" direction="row">
              <Grid item>
                <Typography className={classes.sectionTitle} variant="h5">
                  {`+ ${t('shopList.tab.products.subshopForm.title')}`}
                </Typography>
              </Grid>
            </Grid>
          </ButtonBase>
          <Divider />
        </div>
      )}
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
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
}));

export default React.memo(ShopListProductsTab);
