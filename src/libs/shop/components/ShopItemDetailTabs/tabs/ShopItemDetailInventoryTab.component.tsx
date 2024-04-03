import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TabPanel from '@material-ui/lab/TabPanel';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import ShopItemInventoryBulkUpdateForm from '#libs/shop/components/ShopItemInventoryBulkUpdateForm';

import shopItemInventoryBulkFormValidationSchema from '#libs/shop/components/ShopItemInventoryBulkUpdateForm/shopItemInventoryBulkFormValidationSchema';

import type { ProvisionBulkCreate, ShopItemVariant } from '#libs/shop/types';
import type { ShopItemInventoryBulkUpdateFormValues } from '#libs/shop/components/ShopItemInventoryBulkUpdateForm/types';
import type { OptionCallback } from '../../../../../state/types';

import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';
import { SHOP_ITEM_VARIANTS_PAGE_SIZE } from '#libs/shop/constants';

type Props = {
  shopItemVariantList: ShopItemVariant[];
  page: number;
  count: number;
  isUpdatingVariant?: boolean;
  handleOpenVariantDrawer: () => void;
  fetchShopItemVariantList: (page: number) => void;
  createShopItemProvisionBulk: (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => void;
};

const ShopItemDetailInventoryTab: React.FC<Props> = ({
  shopItemVariantList,
  page,
  count,
  isUpdatingVariant,
  handleOpenVariantDrawer,
  fetchShopItemVariantList,
  createShopItemProvisionBulk,
}) => {
  const { t } = useTranslation('shop');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();

  const initialValues = useMemo(
    () => ({
      variants: (shopItemVariantList ?? []).map((shopItemVariant) => ({
        id: shopItemVariant.id,
        color: shopItemVariant.color,
        size: shopItemVariant.size,
        currentStock: shopItemVariant.current_stock ?? 0,
        stockAdjustment: null,
        totalSales: shopItemVariant.total_sales ?? 0,
      })),
    }),
    [shopItemVariantList],
  );

  const handlePageChange = useCallback(
    (_: React.ChangeEvent, pageNumber: number) => {
      fetchShopItemVariantList(pageNumber);
    },
    [fetchShopItemVariantList],
  );

  const handleOnSubmit = useCallback(
    (
      values: ShopItemInventoryBulkUpdateFormValues,
      { resetForm }: FormikHelpers<ShopItemInventoryBulkUpdateFormValues>,
    ) => {
      const payload = [];

      for (let i = 0; i < values.variants.length; i += 1) {
        const variant = values.variants[i];
        if (variant.stockAdjustment) {
          payload.push({
            shop_item: variant.id,
            qty: parseInt(variant.stockAdjustment, 10),
          });
        }
      }

      createShopItemProvisionBulk(payload, {
        onSuccess: () => resetForm(),
      });
    },
    [createShopItemProvisionBulk],
  );

  if (shopItemVariantList?.length === 0) {
    return (
      <TabPanel
        className={classes.tabPanelContainer}
        value={ShopItemDetailTab.INVENTORY}
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
      value={ShopItemDetailTab.INVENTORY}
    >
      <Formik
        enableReinitialize
        validateOnChange
        initialValues={initialValues}
        onSubmit={handleOnSubmit}
        validationSchema={shopItemInventoryBulkFormValidationSchema}
      >
        {({
          errors,
          isValid,
        }: FormikProps<ShopItemInventoryBulkUpdateFormValues>) => (
          <Form noValidate>
            <TableContainer className={classes.tableContainer}>
              {!isMobile && (
                <div className={classes.tableActionContainer}>
                  {!!errors.variants && (
                    <Alert
                      className={classes.tableErrorContainer}
                      severity="error"
                    >
                      {t('shopItemDetail.table.inventory.formError')}
                    </Alert>
                  )}

                  <Button
                    color="primary"
                    disabled={isUpdatingVariant || !isValid}
                    type="submit"
                    variant="contained"
                  >
                    {t('shopItemDetail.table.inventory.action.update')}
                  </Button>
                </div>
              )}

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t('shopItemDetail.table.inventory.variants')}
                    </TableCell>
                    <TableCell>
                      {t('shopItemDetail.table.inventory.currentStock')}
                    </TableCell>
                    <TableCell>
                      {t('shopItemDetail.table.inventory.stockAdjustment')}
                    </TableCell>
                    <TableCell>
                      {t('shopItemDetail.table.inventory.totalSales')}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <ShopItemInventoryBulkUpdateForm
                  isUpdatingVariant={isUpdatingVariant}
                />
              </Table>
            </TableContainer>
          </Form>
        )}
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
  tableErrorContainer: {
    height: 36,
    alignItems: 'center',
  },
  tableActionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
    gap: theme.spacing(1),
  },
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default React.memo(ShopItemDetailInventoryTab);
