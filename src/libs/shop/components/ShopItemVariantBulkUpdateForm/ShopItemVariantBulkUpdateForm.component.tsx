import React from 'react';

import { useTranslation } from 'react-i18next';
import { FastField, FieldArray, FieldInputProps, FormikProps } from 'formik';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import EditIcon from '@material-ui/icons/Edit';

import PriceInput from '#components/input/PriceInput.component';

import type { ShopItemVariantBulkUpdateFormValues } from './types';

type OwnFieldArrayRenderProps = {
  form: FormikProps<ShopItemVariantBulkUpdateFormValues>;
};

const ShopItemVariantBulkUpdateForm: React.FC = () => {
  const { t } = useTranslation('shop');

  const emptyFn = () => {};

  const classes = useStyles();

  return (
    <TableBody>
      <FieldArray name="variants">
        {({
          form: { setFieldValue, setFieldTouched, values },
        }: OwnFieldArrayRenderProps) =>
          (values?.variants ?? []).map((row, index: number) => (
            <TableRow key={row.id}>
              <TableCell>
                <FastField
                  key={index.toString()}
                  name={`variants.${index}.cover`}
                >
                  {({ field }: { field: FieldInputProps<File> }) => (
                    <>
                      <input
                        accept="image/*"
                        id={`variant-cover-input-${index}`}
                        name={`variants.${index}.cover`}
                        onChange={(event) => {
                          if (!event.target?.files?.[0]) return;
                          setFieldValue(
                            `variants.${index}.cover`,
                            event.target.files[0],
                          );
                          setFieldTouched(`variants.${index}.cover`, true);
                        }}
                        style={{ display: 'none' }}
                        type="file"
                      />
                      <label htmlFor={`variant-cover-input-${index}`}>
                        {typeof values.variants?.[index]?.cover !== 'string' ? (
                          <Tooltip title={field.value?.name ?? ''}>
                            <Chip
                              clickable
                              color="primary"
                              deleteIcon={<EditIcon />}
                              label={field.value?.name ?? ''}
                              onDelete={emptyFn}
                              size="small"
                              style={{ maxWidth: '95px' }}
                              variant="outlined"
                            />
                          </Tooltip>
                        ) : (
                          <Button
                            color="primary"
                            component="span"
                            size="small"
                            startIcon={<PhotoLibraryIcon />}
                            variant="outlined"
                          >
                            {t('shopItemDetail.table.variants.upload')}
                          </Button>
                        )}
                      </label>
                    </>
                  )}
                </FastField>
              </TableCell>
              <TableCell>
                <div className={classes.flexColumn}>
                  {!!row.color && <span>{row.color}</span>}
                  {!!row.size && <span>{row.size}</span>}
                </div>
              </TableCell>
              <TableCell>
                <FastField
                  key={index.toString()}
                  name={`variants.${index}.price`}
                >
                  {({ field }: { field: FieldInputProps<number> }) => (
                    <PriceInput {...field} />
                  )}
                </FastField>
              </TableCell>
              <TableCell>
                <FastField
                  key={index.toString()}
                  name={`variants.${index}.supplierPrice`}
                >
                  {({ field }: { field: FieldInputProps<number> }) => (
                    <PriceInput {...field} />
                  )}
                </FastField>
              </TableCell>
              <TableCell>
                <FastField
                  key={index.toString()}
                  name={`variants.${index}.stockKeepingUnit`}
                >
                  {({ field }: { field: FieldInputProps<string> }) => (
                    <TextField {...field} />
                  )}
                </FastField>
              </TableCell>
              <TableCell>
                <FastField
                  key={index.toString()}
                  name={`variants.${index}.barcode`}
                >
                  {({ field }: { field: FieldInputProps<string> }) => (
                    <TextField {...field} />
                  )}
                </FastField>
              </TableCell>
              <TableCell>
                <FastField
                  key={index.toString()}
                  name={`variants.${index}.marketplaceEnabled`}
                >
                  {({ field }: { field: FieldInputProps<boolean> }) => (
                    <Checkbox {...field} checked={field.value} />
                  )}
                </FastField>
              </TableCell>
              <TableCell />
            </TableRow>
          ))
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

export default React.memo(ShopItemVariantBulkUpdateForm);
