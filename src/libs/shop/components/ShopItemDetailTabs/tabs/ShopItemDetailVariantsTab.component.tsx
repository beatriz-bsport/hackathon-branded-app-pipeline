import React, { useCallback } from 'react';

import CopyToClipboard from 'react-copy-to-clipboard';
import { Form, Formik } from 'formik';
import { makeStyles, useTheme, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Pagination from '@material-ui/lab/Pagination';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TabPanel from '@material-ui/lab/TabPanel';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import { CustomChip } from '#components/chip/CustomChip.component';
import ShopItemVariantBulkUpdateForm from '#libs/shop/components/ShopItemVariantBulkUpdateForm';

import type { ShopItemVariant } from '#libs/shop/types';
import type { OptionCallback } from '../../../../../state/types';
import type { ShopItemVariantBulkUpdateFormValues } from '#libs/shop/components/ShopItemVariantBulkUpdateForm/types';

import { SHOP_ITEM_VARIANTS_PAGE_SIZE } from '#libs/shop/constants';
import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';

type Props = {
  companyId?: number;
  isDeletingVariant?: boolean;
  shopItemVariantList: ShopItemVariant[];
  page: number;
  count: number;
  isVariantEditMode?: boolean;
  handleOpenBarcodeModal: (barcode: string) => void;
  handleOpenVariantDrawer: () => void;
  onDeleteShopItemVariant: (id: number) => void;
  updateShopItemVariantBulk: (data: FormData, options?: OptionCallback) => void;
  fetchShopItemVariantList: (page: number) => void;
  setIsVariantEditMode: (value: boolean) => void;
};

type TableRowItemProps = {
  companyId?: number;
  item: ShopItemVariant;
  isDeletingVariant?: boolean;
  onShowBarcode: (barcode: string) => void;
  onDeleteShopItemVariant: (id: number) => void;
};

const TableRowItem: React.FC<TableRowItemProps> = ({
  companyId,
  item,
  isDeletingVariant,
  onShowBarcode,
  onDeleteShopItemVariant,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(['shop', 'common']);

  const [menuAnchorElement, setMenuAnchorElement] =
    React.useState<null | HTMLElement>(null);

  const handleOpenExtraActionMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget;
      setMenuAnchorElement(target);
    },
    [],
  );

  const handleCloseExtraActionMenu = useCallback(() => {
    setMenuAnchorElement(null);
  }, []);

  const onShowVariantBarcode = useCallback(() => {
    onShowBarcode(item.barcode);
    handleCloseExtraActionMenu();
  }, [onShowBarcode, item.barcode, handleCloseExtraActionMenu]);

  const onDeleteVariant = useCallback(() => {
    onDeleteShopItemVariant(item.id);
    handleCloseExtraActionMenu();
  }, [onDeleteShopItemVariant, item.id, handleCloseExtraActionMenu]);

  return (
    <TableRow key={item.id}>
      <TableCell>
        <CardMedia
          className={classes.variantImage}
          component="img"
          image={item.cover}
        />
      </TableCell>
      <TableCell>
        <div className={classes.flexColumn}>
          {item.color && <span>{item.color}</span>}
          {item.size && <span>{item.size}</span>}
        </div>
      </TableCell>
      <TableCell>{getCurrencyDisplayWithPrice(item.price)}</TableCell>
      <TableCell>{getCurrencyDisplayWithPrice(item.supplier_price)}</TableCell>
      <TableCell>{item.stock_keeping_unit}</TableCell>
      <TableCell>{item.barcode}</TableCell>
      <TableCell>
        {item.marketplace_enabled ? (
          <CustomChip
            displayedValue={t('common:yes')}
            icon="CheckCircle"
            iconColor={theme.palette.success.main}
            mainColor={theme.palette.success.main}
          />
        ) : (
          <CustomChip
            displayedValue={t('common:no')}
            icon="Cancel"
            iconColor={theme.palette.error.main}
            mainColor={theme.palette.error.main}
          />
        )}
      </TableCell>
      <TableCell>
        <IconButton color="secondary" onClick={handleOpenExtraActionMenu}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={menuAnchorElement}
          id="shop-item-details-extra-actions-menu"
          onClose={handleCloseExtraActionMenu}
          open={!!menuAnchorElement}
        >
          <CopyToClipboard
            text={`${window.location.origin}/customer/payment/shop-item/${item.id}/?membership=${companyId}`}
          >
            <MenuItem onClick={handleCloseExtraActionMenu}>
              <ListItemIcon>
                <LinkIcon fontSize="small" />
              </ListItemIcon>

              <Typography variant="inherit">
                {t('shopItemDetail.copyPaymentPageLink')}
              </Typography>
            </MenuItem>
          </CopyToClipboard>
          <MenuItem disabled={!item.barcode} onClick={onShowVariantBarcode}>
            <ListItemIcon>
              <RemoveRedEyeIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">
              {t('shopItemDetail.viewBarcode')}
            </Typography>
          </MenuItem>
          <MenuItem disabled={isDeletingVariant} onClick={onDeleteVariant}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">
              {t('shopItemDetail.deleteVariant')}
            </Typography>
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

const ShopItemDetailVariantsTab: React.FC<Props> = ({
  companyId,
  shopItemVariantList,
  isDeletingVariant,
  page,
  count,
  isVariantEditMode,
  handleOpenBarcodeModal,
  handleOpenVariantDrawer,
  onDeleteShopItemVariant,
  updateShopItemVariantBulk,
  fetchShopItemVariantList,
  setIsVariantEditMode,
}) => {
  const { t } = useTranslation(['shop', 'common']);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();

  const getInitialValues = useCallback(
    () => ({
      variants: shopItemVariantList.map((shopItemVariant) => ({
        id: shopItemVariant.id,
        cover: shopItemVariant.cover,
        color: shopItemVariant.color,
        size: shopItemVariant.size,
        price: parseFloat(shopItemVariant.price),
        supplierPrice: parseFloat(shopItemVariant.supplier_price),
        stockKeepingUnit: shopItemVariant.stock_keeping_unit,
        barcode: shopItemVariant.barcode,
        marketplaceEnabled: shopItemVariant.marketplace_enabled,
      })),
    }),
    [shopItemVariantList],
  );

  const handleEnableEditMode = useCallback(() => {
    setIsVariantEditMode(true);
  }, [setIsVariantEditMode]);

  const handleDisableEditMode = useCallback(() => {
    setIsVariantEditMode(false);
  }, [setIsVariantEditMode]);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent, pageNumber: number) => {
      fetchShopItemVariantList(pageNumber);
    },
    [fetchShopItemVariantList],
  );

  const handleShowBarcode = useCallback(
    (barcode: string) => {
      handleOpenBarcodeModal(barcode);
    },
    [handleOpenBarcodeModal],
  );

  const handleSubmit = useCallback(
    (values: ShopItemVariantBulkUpdateFormValues) => {
      const formData = new FormData();

      for (let index = 0; index < values.variants.length; index += 1) {
        const variantValues = values.variants[index];
        if (typeof variantValues.cover !== 'string') {
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
      <Formik
        enableReinitialize
        initialValues={getInitialValues()}
        onReset={handleDisableEditMode}
        onSubmit={handleSubmit}
      >
        <Form noValidate>
          <TableContainer className={classes.tableContainer}>
            {isVariantEditMode && (
              <div className={classes.tableEditActions}>
                <Button color="secondary" type="reset" variant="outlined">
                  {t('common:cancel')}
                </Button>
                <Button color="primary" type="submit" variant="contained">
                  {t('common:saveChanges')}
                </Button>
              </div>
            )}
            {!isMobile && !isVariantEditMode && (
              <div className={classes.tableEditActions}>
                <Button
                  color="secondary"
                  onClick={handleOpenVariantDrawer}
                  variant="outlined"
                >
                  {t('shop:shopItemDetail.table.variants.action.add')}
                </Button>
                <Button
                  color="primary"
                  onClick={handleEnableEditMode}
                  variant="contained"
                >
                  {t('shop:shopItemDetail.table.variants.action.edit')}
                </Button>
              </div>
            )}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {t('shopItemDetail.table.variants.image')}
                  </TableCell>
                  <TableCell>
                    {t('shopItemDetail.table.variants.colorAndSize')}
                  </TableCell>
                  <TableCell>
                    {t('shopItemDetail.table.variants.price')}
                  </TableCell>
                  <TableCell>
                    {t('shopItemDetail.table.variants.supplierPrice')}
                  </TableCell>
                  <TableCell>
                    {t('shopItemDetail.table.variants.sku')}
                  </TableCell>
                  <TableCell>
                    {t('shopItemDetail.table.variants.barcode')}
                  </TableCell>
                  <TableCell>
                    {t('shopItemDetail.table.variants.availableOnline')}
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableHead>

              {isVariantEditMode ? (
                <ShopItemVariantBulkUpdateForm />
              ) : (
                <TableBody>
                  {shopItemVariantList.map((row) => (
                    <TableRowItem
                      key={row.id}
                      companyId={companyId}
                      isDeletingVariant={isDeletingVariant}
                      item={row}
                      onDeleteShopItemVariant={onDeleteShopItemVariant}
                      onShowBarcode={handleShowBarcode}
                    />
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Form>
      </Formik>

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
  tableContainer: {
    paddingBottom: theme.spacing(2),
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableEditActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
    gap: theme.spacing(1),
  },
  variantImage: {
    width: 48,
  },
  availableChipContainer: {
    color: theme.palette.success.dark,
    background: theme.palette.success.light,
  },
  notAvailableChipContainer: {
    color: theme.palette.error.dark,
    background: theme.palette.error.light,
  },
  tablePagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default React.memo(ShopItemDetailVariantsTab);
