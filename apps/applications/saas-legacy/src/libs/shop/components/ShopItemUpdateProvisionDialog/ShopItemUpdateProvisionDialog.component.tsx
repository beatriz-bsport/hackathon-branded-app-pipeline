import React from 'react';

import * as Yup from 'yup';
import { Formik } from 'formik';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import ShopItemUpdateProvisionForm from './ShopItemUpdateProvisionForm.component';

import type { ShopItemUpdateProvisionFormValues } from './types';

const initialValues: ShopItemUpdateProvisionFormValues = {
  quantity: null,
};

const ShopItemUpdateProvisionFormSchema = Yup.object({
  quantity: Yup.number()
    .typeError('shop:provision.form.quantityError')
    .notOneOf([0], 'shop:provision.form.quantityError'),
});

type Props = {
  isOpen?: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: { quantity: number | null }) => void;
};

const ShopItemUpdateProvisionDialog: React.FC<Props> = ({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}) => {
  return (
    <GenericResponsiveDialog maxWidth="sm" onClose={onClose} open={isOpen}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={ShopItemUpdateProvisionFormSchema}
      >
        <ShopItemUpdateProvisionForm isLoading={isLoading} onClose={onClose} />
      </Formik>
    </GenericResponsiveDialog>
  );
};

export default React.memo(ShopItemUpdateProvisionDialog);
