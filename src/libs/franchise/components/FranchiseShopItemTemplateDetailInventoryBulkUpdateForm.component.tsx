import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FastField,
  FieldArray,
  FieldInputProps,
  Form,
  FormikErrors,
  FormikHelpers,
  FormikState,
  useFormikContext,
} from 'formik';
import useTheme from '@material-ui/core/styles/useTheme';
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

import { CustomChip } from '#src/components/chip/CustomChip.component';

import { useShopDetailTabsModalPrompt } from '#hocs/shop-modal-prompt.hoc';

type ShopItemInventoryBulkUpdateFormRow = {
  id: number;
  color: string;
  size: string;
  currentStock: number;
  companyName: string;
  stockAdjustment: string;
  totalSales: number;
};

type ShopItemInventoryBulkUpdateFormValues = {
  variants: ShopItemInventoryBulkUpdateFormRow[];
};

type ShopItemBulkFieldArray = {
  form: Pick<
    FormikState<ShopItemInventoryBulkUpdateFormValues>,
    'values' | 'errors'
  > &
    Pick<
      FormikHelpers<ShopItemInventoryBulkUpdateFormValues>,
      'setFieldValue' | 'setFieldTouched'
    >;
};

type Props = {
  isUpdatingVariant?: boolean;
};

const FranchiseShopItemTemplateDetailInventoryBulkForm: React.FC<Props> = ({
  isUpdatingVariant,
}) => {
  const theme = useTheme();

  const { t } = useTranslation('shop');

  const { isValid, errors, dirty, resetForm, submitForm } =
    useFormikContext<ShopItemInventoryBulkUpdateFormValues>();

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
        <div className={classes.tableActionContainer}>
          {!!errors.variants && (
            <Alert className={classes.tableErrorContainer} severity="error">
              {t('shopItemDetail.table.inventory.formError')}
            </Alert>
          )}

          <Button
            color="primary"
            disabled={isUpdatingVariant || !isValid || !dirty}
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
                {t('shopItemDetail.table.inventory.companyName')}
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
          <TableBody>
            <FieldArray name="variants">
              {({
                form: {
                  values: { variants },
                },
              }: ShopItemBulkFieldArray) =>
                (variants ?? []).map(
                  (row: ShopItemInventoryBulkUpdateFormRow, index: number) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className={classes.flexColumn}>
                          {!!row.color && <span>{row.color}</span>}
                          {!!row.size && <span>{row.size}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <CustomChip
                          displayedValue={row.companyName}
                          mainColor={theme.palette.text.primary}
                        />
                      </TableCell>
                      <TableCell>
                        <FastField
                          key={index.toString()}
                          name={`variants.${index}.currentStock`}
                        >
                          {({ field }: { field: FieldInputProps<number> }) =>
                            field.value
                          }
                        </FastField>
                      </TableCell>
                      <TableCell>
                        <FastField
                          key={index.toString()}
                          name={`variants.${index}.stockAdjustment`}
                        >
                          {({ field }: { field: FieldInputProps<number> }) => (
                            <TextField
                              {...field}
                              error={
                                !!(
                                  errors.variants as FormikErrors<ShopItemInventoryBulkUpdateFormRow>[]
                                )?.[index]?.stockAdjustment
                              }
                              placeholder="0"
                            />
                          )}
                        </FastField>
                      </TableCell>
                      <TableCell>
                        <FastField
                          key={index.toString()}
                          name={`variants[${index}]totalSales`}
                        >
                          {({ field }: { field: FieldInputProps<number> }) =>
                            field.value
                          }
                        </FastField>
                      </TableCell>
                    </TableRow>
                  ),
                )
              }
            </FieldArray>
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

export default React.memo(FranchiseShopItemTemplateDetailInventoryBulkForm);
