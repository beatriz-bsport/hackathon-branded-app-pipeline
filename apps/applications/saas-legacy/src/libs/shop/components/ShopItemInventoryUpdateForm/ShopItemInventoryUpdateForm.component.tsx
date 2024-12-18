import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, useFormikContext } from 'formik';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import { useShopDetailTabsModalPrompt } from '#src/hocs/shop-modal-prompt.hoc';

import { SHOP_TABLE_ERROR_CONTAINER_HEIGHT } from '#src/libs/shop/constants';
import type { ShopItemInventoryFormValues } from '#src/libs/shop/components/ShopItemInventoryUpdateForm/types';

import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

const ShopItemInventoryUpdateForm: React.FC = () => {
  const { t } = useTranslation('shop');

  const {
    values,
    errors,
    isValid,
    dirty,
    handleChange,
    resetForm,
    submitForm,
  } = useFormikContext<ShopItemInventoryFormValues>();

  const classes = useStyles();

  const {
    setIsInventoryFormDirty,
    setHandleLeaveWithoutSaving,
    setHandleSaveAndLeave,
  } = useShopDetailTabsModalPrompt();

  useEffect(() => {
    setIsInventoryFormDirty(dirty);
    setHandleLeaveWithoutSaving(() => () => resetForm());
    setHandleSaveAndLeave(() => () => submitForm());

    return () => {
      setIsInventoryFormDirty(false);
    };
  }, [
    dirty,
    setHandleLeaveWithoutSaving,
    setHandleSaveAndLeave,
    setIsInventoryFormDirty,
    resetForm,
    submitForm,
  ]);

  return (
    <Form noValidate>
      <TableContainer className={classes.tableContainer}>
        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="product.shopReworked.allowed_actions.editInventory"
        >
          <div className={classes.tableActionContainer}>
            {!isValid && (
              <Alert className={classes.tableErrorContainer} severity="error">
                {t('shopItemDetail.table.inventory.formError')}
              </Alert>
            )}

            <Button
              color="primary"
              disabled={!isValid || !dirty}
              type="submit"
              variant="contained"
            >
              {t('shopItemDetail.table.inventory.action.update')}
            </Button>
          </div>
        </ObjectLevelPermissionWrapper>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {t('shopItemDetail.table.inventory.currentStock')}
              </TableCell>
              <ObjectLevelPermissionWrapper
                forcedBehavior="hidden"
                requiredPermission="product.shopReworked.allowed_actions.editInventory"
              >
                <TableCell>
                  {t('shopItemDetail.table.inventory.stockAdjustment')}
                </TableCell>
              </ObjectLevelPermissionWrapper>
              <TableCell>
                {t('shopItemDetail.table.inventory.totalSales')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{values.currentStock}</TableCell>
              <ObjectLevelPermissionWrapper
                forcedBehavior="hidden"
                requiredPermission="product.shopReworked.allowed_actions.editInventory"
              >
                <TableCell>
                  <TextField
                    error={!!errors.stockAdjustment}
                    name="stockAdjustment"
                    onChange={handleChange}
                    placeholder="0"
                    value={values.stockAdjustment}
                  />
                </TableCell>
              </ObjectLevelPermissionWrapper>
              <TableCell>{values.totalSales}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Form>
  );
};

const useStyles = makeStyles((theme) => ({
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableContainer: {
    paddingBottom: theme.spacing(2),
  },
  tableErrorContainer: {
    height: SHOP_TABLE_ERROR_CONTAINER_HEIGHT,
    alignItems: 'center',
  },
  tableActionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
    gap: theme.spacing(1),
  },
}));

export default React.memo(ShopItemInventoryUpdateForm);
