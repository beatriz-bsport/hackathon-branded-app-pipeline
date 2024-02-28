import React from 'react';

import {
  FastField,
  FieldArray,
  FieldInputProps,
  FormikErrors,
  FormikHelpers,
  FormikState,
  useFormikContext,
} from 'formik';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import type {
  ShopItemInventoryBulkUpdateFormRow,
  ShopItemInventoryBulkUpdateFormValues,
} from './types';

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

const ShopItemInventoryBulkUpdateForm: React.FC<Props> = ({
  isUpdatingVariant,
}) => {
  const { errors } = useFormikContext<ShopItemInventoryBulkUpdateFormValues>();
  const classes = useStyles();

  return (
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
                        disabled={isUpdatingVariant}
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
  );
};

const useStyles = makeStyles(() => ({
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default React.memo(ShopItemInventoryBulkUpdateForm);
