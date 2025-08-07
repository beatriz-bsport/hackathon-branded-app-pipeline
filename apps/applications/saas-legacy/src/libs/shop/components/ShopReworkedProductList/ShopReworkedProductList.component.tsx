import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import ShopItemDeleteConfirmDialog from '#src/libs/shop/components/ShopItemDeleteConfirmDialog.component';
import ShopItemFormReworked from '#src/libs/shop/components/ShopItemFormReworked';

import type {
  ShopItem,
  ShopItemCreate,
  ShopSupplier,
  SubShop,
  ShopItemBarcodeUnicity,
  ShopItemFilterParams,
} from '#src/libs/shop/types';
import type { ShopListSubshopFormValues } from '#src/libs/shop/components/ShopListSubshopForm/types';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import type { Tag, TagGroupAPI } from '#src/libs/tag/types';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';

import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_WEBSHOP_REWORKED } from '#src/libs/shop/components/ShopReworkedProductList/constants';
import type { OptionCallback } from '#src/state/types';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LanguageIcon from '@material-ui/icons/Language';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ShopListSubshopForm from '#src/libs/shop/components/ShopListSubshopForm';
// @ts-expect-error
import ShopItemListItem from '#src/libs/shop/components/ShopItemListItem.component';
// @ts-expect-error
import SubShopList from '#src/pages/shop/SubShopList.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

type Props = {
  isLoading?: boolean;
  subshopList: SubShop[];
  supplierList: ShopSupplier[];
  provincialTax: number;
  tagList: Tag<TagGroupAPI>[];
  retrieveShopItemUsedInCombo: (id: number) => void;
  getIsShopItemUsedInCombo: (id: number) => boolean;
  goToShopItem: (
    id: number,
    params: Pick<ShopItemFilterParams, 'establishment_billing_group'>,
  ) => void;
  createShopItem: (
    values: ShopItemCreate,
    subshopId: number,
    options: OptionCallback<ShopItem>,
  ) => void;
  deleteShopItem: (id: number) => void;
  duplicateShopItem: (id: number, suffix: string) => void;
  createSubshop: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubShop>,
  ) => void;
  updateSubshop: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubShop>,
  ) => void;
  deleteSubshop: (id: number, options?: OptionCallback<number>) => void;
  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
  checkBarcodeUnicity: (
    barcode: string,
    companyIds?: number[],
    options?: OptionCallback<ShopItemBarcodeUnicity>,
  ) => void;
  getShopItemBarcodeUnicity: (barcode: string) => boolean;
  establishmentBillingGroup: number | null;
  isMultiLocationWebshopEnabled: boolean;
};

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

const ShopReworkedProductList: React.FC<Props> = ({
  isLoading,
  subshopList,
  supplierList,
  provincialTax,
  tagList,
  retrieveShopItemUsedInCombo,
  getIsShopItemUsedInCombo,
  goToShopItem,
  createShopItem,
  deleteShopItem,
  duplicateShopItem,
  createSubshop,
  updateSubshop,
  deleteSubshop,
  bookkeepingAccounts,
  bookkeepingAccountById,
  checkBarcodeUnicity,
  getShopItemBarcodeUnicity,
  establishmentBillingGroup,
  isMultiLocationWebshopEnabled,
}) => {
  const { t } = useTranslation(['shop', 'translation', 'common']);

  const [isItemCreationDrawerOpen, setIsItemCreationDrawerOpen] =
    useState(false);

  const [selectedSubshopId, setSelectedSubshopId] = useState<number | null>(
    null,
  );

  const [shopItemToDelete, setShopItemToDelete] = useState<ShopItem | null>(
    null,
  );

  const [showSubshopForm, setShowSubshopForm] = useState(false);

  const classes = useStyles();

  // --------------------------------------ACTIONS ON SHOP ITEM--------------------------------------

  const handleCloseItemCreationDrawer = useCallback(() => {
    setIsItemCreationDrawerOpen(false);
    setSelectedSubshopId(null);
  }, []);

  const handleCancelDeleteShopItem = useCallback(
    () => setShopItemToDelete(null),
    [],
  );

  const handleDeleteShopItem = useCallback(() => {
    deleteShopItem(shopItemToDelete?.id);
    setShopItemToDelete(null);
  }, [deleteShopItem, shopItemToDelete?.id]);

  const handleCreateShopItem = useCallback(
    (values: ShopItemCreate) => {
      createShopItem(values, selectedSubshopId, {
        onSuccess: () => handleCloseItemCreationDrawer(),
      });
    },
    [createShopItem, handleCloseItemCreationDrawer, selectedSubshopId],
  );

  const handleOpenDeleteShopItemDialog = useCallback(
    (shopItem: ShopItem) => () => {
      retrieveShopItemUsedInCombo(shopItem.id);
      setShopItemToDelete(shopItem);
    },
    [retrieveShopItemUsedInCombo],
  );

  const handleGoToShopItem = useCallback(
    (shopItemId: number) => () => {
      const params = {
        ...(!!establishmentBillingGroup && isMultiLocationWebshopEnabled
          ? { establishment_billing_group: establishmentBillingGroup }
          : {}),
      };
      goToShopItem(shopItemId, params);
    },
    [goToShopItem, establishmentBillingGroup, isMultiLocationWebshopEnabled],
  );

  const handleOpenShopItemCreationDrawer = useCallback(
    (subshopId: number) => () => {
      setSelectedSubshopId(subshopId);
      setIsItemCreationDrawerOpen(true);
    },
    [setSelectedSubshopId, setIsItemCreationDrawerOpen],
  );

  const handleDuplicateShopItem = useCallback(
    (subshopId: number) => () => {
      duplicateShopItem(subshopId, t('translation:common.copySuffix'));
    },
    [duplicateShopItem, t],
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
              <ObjectLevelPermissionWrapper
                forcedBehavior="hidden"
                requiredPermission="product.shopReworked.allowed_actions.delete"
              >
                <IconButton onClick={handleOpenDeleteShopItemDialog(shopItem)}>
                  <DeleteIcon />
                </IconButton>
              </ObjectLevelPermissionWrapper>
            </ListItemSecondaryAction>
          ),
        };
      }),
    [handleGoToShopItem, handleOpenDeleteShopItemDialog],
  );

  // --------------------------------------ACTIONS ON SUBSHOP--------------------------------------

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

  return (
    <div className={classes.container}>
      {isLoading && <LinearProgress />}
      <ObjectSearchComponent
        additionalParams={
          FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_WEBSHOP_REWORKED
        }
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
                      {!shopItem.shop_item_template && (
                        <>
                          {shopItem.is_standalone_item && (
                            <ObjectLevelPermissionWrapper
                              forcedBehavior="hidden"
                              requiredPermission="product.shopReworked.allowed_actions.create"
                            >
                              <Tooltip title={t('common:duplicate')}>
                                <IconButton
                                  onClick={handleDuplicateShopItem(shopItem.id)}
                                >
                                  <FileCopyIcon />
                                </IconButton>
                              </Tooltip>
                            </ObjectLevelPermissionWrapper>
                          )}
                          <ObjectLevelPermissionWrapper
                            forcedBehavior="hidden"
                            requiredPermission="product.shopReworked.allowed_actions.delete"
                          >
                            <IconButton
                              onClick={handleOpenDeleteShopItemDialog(shopItem)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ObjectLevelPermissionWrapper>
                        </>
                      )}
                    </ListItemSecondaryAction>
                  }
                  onClick={handleGoToShopItem(shopItem.id)}
                  shopitem={shopItem}
                />
              ))}
              {!subshop?.sub_shop_template && (
                <ObjectLevelPermissionWrapper
                  forcedBehavior="hidden"
                  requiredPermission="product.shopReworked.allowed_actions.create"
                >
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
                </ObjectLevelPermissionWrapper>
              )}
            </List>
          </Paper>
        </SubShopList>
      ))}

      <ObjectLevelPermissionWrapper
        forcedBehavior="hidden"
        requiredPermission="product.shopReworked.allowed_actions.create"
      >
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
      </ObjectLevelPermissionWrapper>

      <GenericResponsiveDrawer
        onClose={handleCloseItemCreationDrawer}
        open={selectedSubshopId && isItemCreationDrawerOpen}
        title={t('shopitem.form.title')}
        trackingObjectIdentifier={SegmentAnalyticsFormObjectIdentifier.ShopItem}
      >
        <ShopItemFormReworked
          bookkeepingAccountById={bookkeepingAccountById}
          bookkeepingAccounts={bookkeepingAccounts}
          checkBarcodeUnicity={checkBarcodeUnicity}
          getShopItemBarcodeUnicity={getShopItemBarcodeUnicity}
          isLoading={isLoading}
          onCancel={handleCloseItemCreationDrawer}
          onCreateSubmit={handleCreateShopItem}
          provincialTax={provincialTax}
          supplierList={supplierList}
          tagList={tagList}
        />
      </GenericResponsiveDrawer>

      <ShopItemDeleteConfirmDialog
        isUsedInCombo={getIsShopItemUsedInCombo(shopItemToDelete?.id)}
        onCancel={handleCancelDeleteShopItem}
        onSubmit={handleDeleteShopItem}
        open={!!shopItemToDelete}
        shopItemName={shopItemToDelete?.name}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
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

export default React.memo(ShopReworkedProductList);
