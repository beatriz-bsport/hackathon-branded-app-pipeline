import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ShopItemInventoryBulkUpdateForm from '#libs/shop/components/ShopItemInventoryBulkUpdateForm';

import shopItemInventoryBulkFormValidationSchema from '#libs/shop/components/ShopItemInventoryBulkUpdateForm/shopItemInventoryBulkFormValidationSchema';

import type { ShopItemInventoryBulkUpdateFormValues } from '#libs/shop/components/ShopItemInventoryBulkUpdateForm/types';
import type { ShopItemVariant } from '#libs/shop/types';

type Props = {
  shopItemVariantList: ShopItemVariant[];
  isUpdatingVariant?: boolean;
  handleSubmit: (
    values: ShopItemInventoryBulkUpdateFormValues,
    { resetForm }: FormikHelpers<ShopItemInventoryBulkUpdateFormValues>,
  ) => void;
};

const ShopItemDetailInventoryList: React.FC<Props> = ({
  shopItemVariantList,
  isUpdatingVariant,
  handleSubmit,
}) => {
  const { t } = useTranslation('shop');

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

  return (
    <Formik
      enableReinitialize
      validateOnChange
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={shopItemInventoryBulkFormValidationSchema}
    >
      {({
        errors,
        isValid,
      }: FormikProps<ShopItemInventoryBulkUpdateFormValues>) => (
        <Form noValidate>
          <TableContainer className={classes.tableContainer}>
            <div className={classes.tableActionContainer}>
              {!!errors.variants && (
                <Alert className={classes.tableErrorContainer} severity="error">
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

              <ShopItemInventoryBulkUpdateForm />
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
}));

export default React.memo(ShopItemDetailInventoryList);
