import React, { useCallback, useMemo } from 'react';

import { Formik, Form } from 'formik';
import { useTheme, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import { CustomChip } from '#src/components/chip/CustomChip.component';
import ShopItemVariantBulkUpdateForm from '#src/libs/shop/components/ShopItemVariantBulkUpdateForm';
import shopItemVariantBulkFormValidationSchema from '#src/libs/shop/components/ShopItemVariantBulkUpdateForm/shopItemVariantBulkUpdateFormValidationSchema';

import type {
  ShopItemBarcodeUnicity,
  ShopItemTemplate,
} from '#src/libs/shop/types';
import type {
  ShopItemVariantBulkUpdateFormRow,
  ShopItemVariantBulkUpdateFormValues,
} from '#src/libs/shop/components/ShopItemVariantBulkUpdateForm/types';
import type { OptionCallback } from '#src/state/types';

import { SHOP_TABLE_ERROR_CONTAINER_HEIGHT } from '#src/libs/shop/constants';

type Props = {
  handleDisableEditMode: () => void;
  handleEnableEditMode: () => void;
  handleOpenVariantDrawer: () => void;
  handleShowBarcode: (barcode: string) => void;
  handleSubmit: (values: ShopItemVariantBulkUpdateFormValues) => void;
  isDeletingVariant?: boolean;
  isVariantEditMode?: boolean;
  onDeleteShopItemTemplateVariant: (id: number) => void;
  variantList: ShopItemTemplate[];
  checkBarcodeUnicity: (
    barcode: string,
    options?: OptionCallback<ShopItemBarcodeUnicity>,
  ) => void;
  getShopItemBarcodeListUnicity: (barcodeList: string[]) => boolean;
};

type TableRowItemProps = {
  item: ShopItemTemplate;
  isDeletingVariant?: boolean;
  onShowBarcode: (barcode: string) => void;
  onDeleteShopItemTemplateVariant: (id: number) => void;
};

const TableRowItem: React.FC<TableRowItemProps> = React.memo(
  ({
    item,
    isDeletingVariant,
    onShowBarcode,
    onDeleteShopItemTemplateVariant,
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
      onDeleteShopItemTemplateVariant(item.id);
      handleCloseExtraActionMenu();
    }, [onDeleteShopItemTemplateVariant, item.id, handleCloseExtraActionMenu]);

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
        <TableCell>
          {getCurrencyDisplayWithPrice(item.supplier_price)}
        </TableCell>
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

const FranchiseShopItemTemplateDetailVariantList: React.FC<Props> = ({
  handleDisableEditMode,
  handleEnableEditMode,
  handleOpenVariantDrawer,
  handleShowBarcode,
  handleSubmit,
  isDeletingVariant,
  isVariantEditMode,
  onDeleteShopItemTemplateVariant,
  variantList,
  checkBarcodeUnicity,
  getShopItemBarcodeListUnicity,
}) => {
  const { t } = useTranslation('shop');

  const classes = useStyles();

  const initialValues = useMemo(
    () => ({
      variants: variantList.map((variant) => ({
        id: variant.id,
        cover: variant.cover,
        color: variant.color,
        size: variant.size,
        price: parseFloat(variant.price),
        supplierPrice: parseFloat(variant.supplier_price),
        stockKeepingUnit: variant.stock_keeping_unit,
        barcode: variant.barcode,
        marketplaceEnabled: variant.marketplace_enabled,
      })),
    }),
    [variantList],
  );

  const getShowBarcodeUnicityWarning = useCallback(
    (variants: ShopItemVariantBulkUpdateFormRow[]) =>
      getShopItemBarcodeListUnicity(
        variants.map((variant) => variant.barcode),
      ) === false,
    [getShopItemBarcodeListUnicity],
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onReset={handleDisableEditMode}
      onSubmit={handleSubmit}
      validationSchema={shopItemVariantBulkFormValidationSchema}
    >
      {({ isValid, isSubmitting, errors, values }) => (
        <Form noValidate>
          <TableContainer className={classes.tableContainer}>
            {isVariantEditMode && (
              <>
                <div className={classes.tableEditActions}>
                  <Button color="secondary" type="reset" variant="outlined">
                    {t('common:cancel')}
                  </Button>
                  <Button
                    color="primary"
                    disabled={!isValid || isSubmitting}
                    type="submit"
                    variant="contained"
                  >
                    {t('common:saveChanges')}
                  </Button>
                </div>
                <div className={classes.formAlerts}>
                  {!isValid && errors.variants?.length > 0 && (
                    <Alert
                      className={classes.tableAlertContainer}
                      severity="error"
                    >
                      {t('shop:shopItemDetail.table.variants.formError.price')}
                    </Alert>
                  )}
                  {getShowBarcodeUnicityWarning(values.variants) && (
                    <Alert
                      className={classes.tableAlertContainer}
                      severity="warning"
                    >
                      {t(
                        'shop:shopItemDetail.table.variants.formWarning.barcode',
                      )}
                    </Alert>
                  )}
                </div>
              </>
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
                <ShopItemVariantBulkUpdateForm
                  checkBarcodeUnicity={checkBarcodeUnicity}
                />
              ) : (
                <TableBody>
                  {variantList.map((row) => (
                    <TableRowItem
                      key={row.id}
                      isDeletingVariant={isDeletingVariant}
                      item={row}
                      onDeleteShopItemTemplateVariant={
                        onDeleteShopItemTemplateVariant
                      }
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
  tableAlertContainer: {
    height: SHOP_TABLE_ERROR_CONTAINER_HEIGHT,
    alignItems: 'center',
  },
  formAlerts: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    alignItems: 'flex-end',
  },
}));

export default React.memo(FranchiseShopItemTemplateDetailVariantList);
