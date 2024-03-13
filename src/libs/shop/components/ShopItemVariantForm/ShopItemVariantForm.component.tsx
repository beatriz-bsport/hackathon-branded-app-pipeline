import React, { useCallback, useState } from 'react';
import { Formik, Form } from 'formik';

import ShopItemFormVariantStep from '../ShopItemFormReworked/ShopItemFormVariantStep.component';

import type { ShopItemVariantAttributes } from '#libs/shop/types';
import type { ShopItemVariantFormValues } from './types';

import { shopItemVariantFormValidationSchema } from './shopItemVariantFormValidationSchema';

type Props = {
  onSubmit: (formData: ShopItemVariantAttributes) => void;
  onCancel: () => void;
};

/**
 * Dedicated form to create variants based on a base item
 * @prop `onSubmit` Action to perform when the form has been submitted with parsed values
 * @prop `onCancel` Action to perform when cancel button has been clicked
 */
const ShopItemVariantForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [initialValues] = useState<ShopItemVariantFormValues>({
    colors: [],
    sizes: [],
  });

  const handleOnSubmit = useCallback(
    (values: ShopItemVariantFormValues) => {
      if (values.colors.length === 0 && values.sizes.length === 0) {
        return;
      }
      onSubmit({
        colors: values.colors.map((option) => option.value),
        sizes: values.sizes.map((option) => option.value),
      });
    },
    [onSubmit],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      validationSchema={shopItemVariantFormValidationSchema}
    >
      <Form noValidate>
        <ShopItemFormVariantStep onCancel={onCancel} />
      </Form>
    </Formik>
  );
};

export default React.memo(ShopItemVariantForm);
