import React, { useCallback, useMemo } from 'react';

import { Formik, Form } from 'formik';
import { useTheme, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import CopyToClipboard from 'react-copy-to-clipboard';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import { CustomChip } from '#src/components/chip/CustomChip.component';
import ShopItemVariantBulkUpdateForm from '#src/libs/shop/components/ShopItemVariantBulkUpdateForm';
import shopItemVariantBulkUpdateFormValidationSchema from '#src/libs/shop/components/ShopItemVariantBulkUpdateForm/shopItemVariantBulkUpdateFormValidationSchema';

import type { ShopItem } from '#src/libs/shop/types';
import type { ShopItemVariantBulkUpdateFormValues } from '#src/libs/shop/components/ShopItemVariantBulkUpdateForm/types';

import Config from '../../../../config';
import { SHOP_TABLE_ERROR_CONTAINER_HEIGHT } from '#src/libs/shop/constants';

type Props = {
  companyId: number;
  handleDisableEditMode: () => void;
  handleEnableEditMode: () => void;
  handleOpenVariantDrawer: () => void;
  handleShowBarcode: (barcode: string) => void;
  handleSubmit: (values: ShopItemVariantBulkUpdateFormValues) => void;
  isDeletingVariant?: boolean;
  isVariantEditMode?: boolean;
  onDeleteShopItemVariant: (id: number) => void;
  shopItemVariantList: ShopItem[];
  isSupplierPriceHidden?: boolean;
};

type TableRowItemProps = Pick<
  Props,
  | 'onDeleteShopItemVariant'
  | 'isSupplierPriceHidden'
  | 'isDeletingVariant'
  | 'companyId'
> & {
  item: ShopItem;
  onShowBarcode: (barcode: string) => void;
};

const TableRowItem: React.FC<TableRowItemProps> = React.memo(
  ({
    companyId,
    item,
    isDeletingVariant,
    isSupplierPriceHidden,
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

    const shopItemPaymentPageLink = `${Config.PUBLIC_URL}/customer/payment/shop-item/${item.id}/?membership=${companyId}`;

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
        {!isSupplierPriceHidden && (
          <TableCell>
            {getCurrencyDisplayWithPrice(item.supplier_price)}
          </TableCell>
        )}
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
            <CopyToClipboard text={shopItemPaymentPageLink}>
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
  },
);

const ShopItemDetailVariantList: React.FC<Props> = ({
  companyId,
  handleDisableEditMode,
  handleEnableEditMode,
  handleOpenVariantDrawer,
  handleShowBarcode,
  handleSubmit,
  isDeletingVariant,
  isVariantEditMode,
  onDeleteShopItemVariant,
  shopItemVariantList,
  isSupplierPriceHidden,
}) => {
  const { t } = useTranslation(['common', 'shop']);

  const classes = useStyles();

  const initialValues = useMemo(
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

  return (
    <Formik<ShopItemVariantBulkUpdateFormValues>
      enableReinitialize
      initialValues={initialValues}
      onReset={handleDisableEditMode}
      onSubmit={handleSubmit}
      validationSchema={shopItemVariantBulkUpdateFormValidationSchema}
    >
      {({ errors }) => (
        <Form noValidate>
          <TableContainer className={classes.tableContainer}>
            {isVariantEditMode && (
              <div className={classes.tableEditActions}>
                {errors.variants?.length > 0 && (
                  <Alert
                    className={classes.tableErrorContainer}
                    severity="error"
                  >
                    {t('shop:shopItemDetail.table.variants.formError')}
                  </Alert>
                )}

                <Button color="secondary" type="reset" variant="outlined">
                  {t('common:cancel')}
                </Button>
                <Button color="primary" type="submit" variant="contained">
                  {t('common:saveChanges')}
                </Button>
              </div>
            )}
            {!isVariantEditMode && (
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
                    {t('shop:shopItemDetail.table.variants.image')}
                  </TableCell>
                  <TableCell>
                    {t('shop:shopItemDetail.table.variants.colorAndSize')}
                  </TableCell>
                  <TableCell>
                    {t('shop:shopItemDetail.table.variants.price')}
                  </TableCell>
                  {!isSupplierPriceHidden && (
                    <TableCell>
                      {t('shop:shopItemDetail.table.variants.supplierPrice')}
                    </TableCell>
                  )}
                  <TableCell>
                    {t('shop:shopItemDetail.table.variants.sku')}
                  </TableCell>
                  <TableCell>
                    {t('shop:shopItemDetail.table.variants.barcode')}
                  </TableCell>
                  <TableCell>
                    {t('shop:shopItemDetail.table.variants.availableOnline')}
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
                      isSupplierPriceHidden={isSupplierPriceHidden}
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
      )}
    </Formik>
  );
};

const useStyles = makeStyles((theme) => ({
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
  tableErrorContainer: {
    height: SHOP_TABLE_ERROR_CONTAINER_HEIGHT,
    alignItems: 'center',
  },
}));

export default React.memo(ShopItemDetailVariantList);
