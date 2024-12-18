import React, { useCallback } from 'react';

import { Formik } from 'formik';
import LinearProgress from '@material-ui/core/LinearProgress';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import type { ConsumerPaymentPackExtensionCreate } from '#src/libs/consumer-payment-pack/types';
import type { PrivateConsumerPassExtensionCreate } from '#src/libs/private-service/types';
import type { Common } from '#src/libs/types';
import type { ConsumerExtensionCreateFormValues } from './types';
import ConsumerExtensionCreateForm from './ConsumerExtensionCreateForm.component';

import ConsumerExtensionCreateFormValidationSchema from './ConsumerExtensionCreateFormValidationSchema';
import { EXTENSION_OPTIONS } from './constants';

const initialValues: ConsumerExtensionCreateFormValues = {
  extensionOption: EXTENSION_OPTIONS[0].value,
  nbDays: 1,
  note: '',
};

type GenericExtensionCreationPayload = Common<
  ConsumerPaymentPackExtensionCreate,
  PrivateConsumerPassExtensionCreate
>;

type Props = {
  open?: boolean;
  isLoading?: boolean;
  /** The consumer payment pack or consumer private pass ending date */
  passEndingDate?: string;
  timezone: string;
  onClose: () => void;
  onSubmit: (values: GenericExtensionCreationPayload) => void;
};

/** A generic dialog handling the creation of consumer extension */
const ConsumerExtensionCreateDialog: React.FC<Props> = ({
  open,
  isLoading,
  passEndingDate,
  timezone,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = useCallback(
    (values: ConsumerExtensionCreateFormValues) => {
      onSubmit({
        nb_days: values.nbDays,
        note: values.note,
      });
    },
    [onSubmit],
  );

  return (
    <GenericResponsiveDialog maxWidth="sm" onClose={onClose} open={open}>
      {isLoading && <LinearProgress />}
      <Formik<ConsumerExtensionCreateFormValues>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ConsumerExtensionCreateFormValidationSchema}
      >
        <ConsumerExtensionCreateForm
          isLoading={isLoading}
          onClose={onClose}
          passEndingDate={passEndingDate}
          timezone={timezone}
        />
      </Formik>
    </GenericResponsiveDialog>
  );
};

export default React.memo(ConsumerExtensionCreateDialog);
