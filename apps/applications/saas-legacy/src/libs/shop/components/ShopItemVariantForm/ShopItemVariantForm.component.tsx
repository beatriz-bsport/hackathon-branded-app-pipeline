import React, { useCallback, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import type { OptionsType } from 'react-select/lib/types';

import type {
  ShopItemVariantAttributes,
  ShopItemVariantCombination,
} from '#src/libs/shop/types';
import {
  generateShopitemColorSizeCombinationList,
  getDuplicateVariantCombinationList,
} from '#src/libs/shop/utils';
import ShopItemFormVariantStep from '../ShopItemFormReworked/ShopItemFormVariantStep.component';

import type { ShopItemVariantFormValues } from './types';
import {
  GenerateBarcodesForVariantsEnum,
  ShopItemVariantOption,
} from '#src/libs/shop/components/ShopItemFormReworked/types';

import { shopItemVariantFormValidationSchema } from './shopItemVariantFormValidationSchema';

type Props = {
  variantCombinationList: ShopItemVariantCombination[];
  onSubmit: (formData: ShopItemVariantAttributes) => void;
  onCancel: () => void;
};

/**
 * Dedicated form to create variants based on a base item
 * @prop `onSubmit` Action to perform when the form has been submitted with parsed values
 * @prop `onCancel` Action to perform when cancel button has been clicked
 */
const ShopItemVariantForm: React.FC<Props> = ({
  variantCombinationList,
  onSubmit,
  onCancel,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('shop');

  const initialValues: ShopItemVariantFormValues = useMemo(
    () => ({
      colors: [],
      sizes: [],
      generateBarcodesForVariants:
        GenerateBarcodesForVariantsEnum.GENERATE_NEW_BARCODES,
    }),
    [],
  );

  const handleOnSubmit = useCallback(
    (values: ShopItemVariantFormValues) => {
      if (values.colors.length === 0 && values.sizes.length === 0) {
        return;
      }
      onSubmit({
        colors: values.colors.map((option) => option.value),
        sizes: values.sizes.map((option) => option.value),
        generate_barcodes_for_variants:
          values.generateBarcodesForVariants ===
          GenerateBarcodesForVariantsEnum.GENERATE_NEW_BARCODES,
      });
    },
    [onSubmit],
  );

  const getVariantFormVariantData = useCallback(
    (
      colors: OptionsType<ShopItemVariantOption>,
      sizes: OptionsType<ShopItemVariantOption>,
    ) => {
      const shopItemVariantCombinationList =
        generateShopitemColorSizeCombinationList(
          (colors ?? []).map((color) => color.value),
          (sizes ?? []).map((size) => size.value),
        );
      const duplicatedCombinationList = getDuplicateVariantCombinationList(
        shopItemVariantCombinationList,
        variantCombinationList,
      );

      return {
        submitLabel: shopItemVariantCombinationList.length
          ? t('addVariantCount', {
              count:
                shopItemVariantCombinationList.length -
                duplicatedCombinationList.length,
            })
          : '',
        duplicatedCount: duplicatedCombinationList.length,
      };
    },
    [t, variantCombinationList],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      validationSchema={shopItemVariantFormValidationSchema}
    >
      {({ values }) => (
        <Form noValidate className={classes.form}>
          <ShopItemFormVariantStep
            isSubmitDisabled={
              (values.colors ?? []).length === 0 &&
              (values.sizes ?? []).length === 0
            }
            onCancel={onCancel}
            submitLabel={
              getVariantFormVariantData(values.colors, values.sizes).submitLabel
            }
            warningMessage={
              getVariantFormVariantData(values.colors, values.sizes)
                .duplicatedCount && t('duplicateVariantWarning')
            }
          />
        </Form>
      )}
    </Formik>
  );
};

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}));

export default React.memo(ShopItemVariantForm);
