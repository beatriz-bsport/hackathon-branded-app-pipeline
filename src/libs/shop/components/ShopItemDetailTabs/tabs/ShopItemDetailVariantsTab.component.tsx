import React, { useCallback } from 'react';

import { makeStyles, useTheme, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import TabPanel from '@material-ui/lab/TabPanel';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import ShopItemDetailVariantList from '#src/libs/shop/components/ShopItemDetailVariantList';
import ShopItemDetailVariantListMobile from '#src/libs/shop/components/ShopItemDetailVariantListMobile';

import type { ShopItem, ShopItemBarcodeUnicity } from '#src/libs/shop/types';
import type { ShopItemVariantBulkUpdateFormValues } from '#src/libs/shop/components/ShopItemVariantBulkUpdateForm/types';

import { SHOP_ITEM_VARIANTS_PAGE_SIZE } from '#src/libs/shop/constants';
import { ShopItemDetailTab } from '#src/libs/shop/components/ShopItemDetail/constants';
import type { OptionCallback } from '../../../../../state/types';

type Props = {
  companyId?: number;
  isDeletingVariant?: boolean;
  shopItemVariantList: ShopItem[];
  page: number;
  count: number;
  isVariantEditMode?: boolean;
  isSupplierPriceHidden?: boolean;
  handleOpenBarcodeModal: (barcode: string) => void;
  handleOpenVariantDrawer: () => void;
  onDeleteShopItemVariant: (id: number) => void;
  updateShopItemVariantBulk: (data: FormData, options?: OptionCallback) => void;
  setIsVariantEditMode: (value: boolean) => void;
  setQueryParam: (queryParam: string) => (value: string) => void;
  checkBarcodeUnicity: (
    barcode: string,
    options?: OptionCallback<ShopItemBarcodeUnicity>,
  ) => void;
  getShopItemBarcodeListUnicity: (barcodeList: string[]) => boolean;
};

const ShopItemDetailVariantsTab: React.FC<Props> = ({
  companyId,
  shopItemVariantList,
  isDeletingVariant,
  page,
  count,
  isVariantEditMode,
  isSupplierPriceHidden,
  handleOpenBarcodeModal,
  handleOpenVariantDrawer,
  onDeleteShopItemVariant,
  updateShopItemVariantBulk,
  setIsVariantEditMode,
  setQueryParam,
  checkBarcodeUnicity,
  getShopItemBarcodeListUnicity,
}) => {
  const { t } = useTranslation(['shop', 'common']);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();

  const handleEnableEditMode = useCallback(() => {
    setIsVariantEditMode(true);
  }, [setIsVariantEditMode]);

  const handleDisableEditMode = useCallback(() => {
    setIsVariantEditMode(false);
  }, [setIsVariantEditMode]);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent, pageNumber: number) => {
      setQueryParam('page')(`${pageNumber}`);
    },
    [setQueryParam],
  );

  const handleShowBarcode = useCallback(
    (barcode: string) => handleOpenBarcodeModal(barcode),
    [handleOpenBarcodeModal],
  );

  const handleSubmit = useCallback(
    (values: ShopItemVariantBulkUpdateFormValues) => {
      const formData = new FormData();

      for (let index = 0; index < values.variants.length; index += 1) {
        const variantValues = values.variants[index];
        /**
         * When a variant has no image, cover will always be null
         * If we did change the image in the form the type is an instance of File
         * If the variant already has an image uploaded type will be a string
         */
        if (
          variantValues.cover instanceof File &&
          variantValues.cover !== null
        ) {
          formData.append(`covers[${index}]`, variantValues.cover);
        }

        formData.append(
          `variants_data[${index}]`,
          JSON.stringify({
            id: variantValues.id,
            marketplace_enabled: variantValues.marketplaceEnabled,
            price: variantValues.price,
            barcode: variantValues.barcode,
            stock_keeping_unit: variantValues.stockKeepingUnit,
            supplier_price: variantValues.supplierPrice,
          }),
        );
      }
      updateShopItemVariantBulk(formData, {
        onSuccess: () => handleDisableEditMode(),
      });
    },
    [handleDisableEditMode, updateShopItemVariantBulk],
  );

  if (shopItemVariantList?.length === 0) {
    return (
      <TabPanel
        className={classes.tabPanelContainer}
        value={ShopItemDetailTab.VARIANTS}
      >
        <div className={classes.tabPanelEmptyContainer}>
          <Typography>
            {t('shop:shopItemDetail.table.variants.placeholder')}
          </Typography>
          <Button
            color="primary"
            onClick={handleOpenVariantDrawer}
            startIcon={<AddIcon />}
            variant="outlined"
          >
            {t('shop:shopItemDetail.table.variants.action.add')}
          </Button>
        </div>
      </TabPanel>
    );
  }

  return (
    <TabPanel
      className={classes.tabPanelContainer}
      value={ShopItemDetailTab.VARIANTS}
    >
      {isMobile ? (
        <ShopItemDetailVariantListMobile
          isSupplierPriceHidden={isSupplierPriceHidden}
          shopItemVariantList={shopItemVariantList}
        />
      ) : (
        <ShopItemDetailVariantList
          checkBarcodeUnicity={checkBarcodeUnicity}
          companyId={companyId}
          getShopItemBarcodeListUnicity={getShopItemBarcodeListUnicity}
          handleDisableEditMode={handleDisableEditMode}
          handleEnableEditMode={handleEnableEditMode}
          handleOpenVariantDrawer={handleOpenVariantDrawer}
          handleShowBarcode={handleShowBarcode}
          handleSubmit={handleSubmit}
          isDeletingVariant={isDeletingVariant}
          isSupplierPriceHidden={isSupplierPriceHidden}
          isVariantEditMode={isVariantEditMode}
          onDeleteShopItemVariant={onDeleteShopItemVariant}
          shopItemVariantList={shopItemVariantList}
        />
      )}

      <Pagination
        className={classes.justifyCenter}
        count={Math.ceil(count / SHOP_ITEM_VARIANTS_PAGE_SIZE)}
        onChange={handlePageChange}
        page={page}
      />
    </TabPanel>
  );
};

const useStyles = makeStyles((theme) => ({
  tabPanelEmptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  tabPanelContainer: {
    padding: theme.spacing(2),
  },
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default React.memo(ShopItemDetailVariantsTab);
