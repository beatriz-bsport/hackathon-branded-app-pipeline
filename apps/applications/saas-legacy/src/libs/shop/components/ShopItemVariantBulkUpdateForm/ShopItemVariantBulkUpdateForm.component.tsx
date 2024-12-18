import React, { useCallback, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import {
  FastField,
  FieldArray,
  FieldInputProps,
  FormikErrors,
  FormikProps,
  useFormikContext,
} from 'formik';
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

import PriceInput from '#src/components/input/PriceInput.component';

import { useShopDetailTabsModalPrompt } from '#src/hocs/shop-modal-prompt.hoc';

import type {
  ShopItemVariantBulkUpdateFormRow,
  ShopItemVariantBulkUpdateFormValues,
} from './types';
import type { ShopItemBarcodeUnicity } from '#src/libs/shop/types';
import type { OptionCallback } from '#src/state/types';

import { SHOP_VARIANT_BULK_UPDATE_FORM_COVER_CHIP_MAX_WIDTH } from '#src/libs/shop/constants';

type OwnFieldArrayRenderProps = {
  form: FormikProps<ShopItemVariantBulkUpdateFormValues>;
};

type Props = {
  checkBarcodeUnicity: (
    barcode: string,
    options?: OptionCallback<ShopItemBarcodeUnicity>,
  ) => void;
};

const ShopItemVariantBulkUpdateForm: React.FC<Props> = ({
  checkBarcodeUnicity,
}) => {
  const { t } = useTranslation('shop');

  const emptyFn = () => {};

  const classes = useStyles();

  const { values, errors, dirty, initialValues, resetForm, submitForm } =
    useFormikContext<ShopItemVariantBulkUpdateFormValues>();

  const {
    setIsVariantFormDirty,
    setHandleLeaveWithoutSaving,
    setHandleSaveAndLeave,
  } = useShopDetailTabsModalPrompt();

  useEffect(() => {
    setIsVariantFormDirty(dirty);
    setHandleLeaveWithoutSaving(() => () => resetForm());
    setHandleSaveAndLeave(() => () => submitForm());

    return () => {
      setIsVariantFormDirty(false);
    };
  }, [
    dirty,
    setHandleLeaveWithoutSaving,
    setHandleSaveAndLeave,
    setIsVariantFormDirty,
    resetForm,
    submitForm,
  ]);

  const handleCheckBarcodeUnicity = useCallback(
    (initialBarcode: string) => (event: React.FocusEvent<HTMLInputElement>) => {
      const target = event.target;
      if (target.value && target.value !== initialBarcode) {
        checkBarcodeUnicity(target.value);
      }
    },
    [checkBarcodeUnicity],
  );

  return (
    <TableBody>
      <FieldArray name="variants">
        {({
          form: { setFieldValue, setFieldTouched },
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
                        {typeof values.variants?.[index]?.cover !== 'object' ||
                        values.variants?.[index]?.cover === null ? (
                          <Button
                            color="primary"
                            component="span"
                            size="small"
                            startIcon={<PhotoLibraryIcon />}
                            variant="outlined"
                          >
                            {t('shopItemDetail.table.variants.upload')}
                          </Button>
                        ) : (
                          <Tooltip title={field.value?.name ?? ''}>
                            <Chip
                              clickable
                              color="primary"
                              deleteIcon={<EditIcon />}
                              label={field.value?.name ?? ''}
                              onDelete={emptyFn}
                              size="small"
                              style={{
                                maxWidth:
                                  SHOP_VARIANT_BULK_UPDATE_FORM_COVER_CHIP_MAX_WIDTH,
                              }}
                              variant="outlined"
                            />
                          </Tooltip>
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
                    <PriceInput
                      {...field}
                      error={
                        !!(
                          errors.variants?.[
                            index
                          ] as FormikErrors<ShopItemVariantBulkUpdateFormRow>
                        )?.price
                      }
                    />
                  )}
                </FastField>
              </TableCell>
              <TableCell>
                <FastField
                  key={index.toString()}
                  name={`variants.${index}.supplierPrice`}
                >
                  {({ field }: { field: FieldInputProps<number> }) => (
                    <PriceInput
                      {...field}
                      error={
                        !!(
                          errors.variants?.[
                            index
                          ] as FormikErrors<ShopItemVariantBulkUpdateFormRow>
                        )?.supplierPrice
                      }
                    />
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
                    <TextField
                      {...field}
                      onBlur={handleCheckBarcodeUnicity(
                        initialValues.variants[index].barcode,
                      )}
                    />
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
