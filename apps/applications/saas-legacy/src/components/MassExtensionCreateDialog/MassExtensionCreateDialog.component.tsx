import React, { useCallback } from 'react';
import { DateTime } from 'luxon';
import { Formik } from 'formik';

import LinearProgress from '@material-ui/core/LinearProgress';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import MassExtensionCreateForm from './MassExtensionCreateForm.component';
import MassExtensionCreateFormValidationSchema from './MassExtensionCreateFormValidationSchema';

import type {
  MassExtensionCreateFormValues,
  GenericExtensionCreationPayload,
} from './types';

const initialValues: MassExtensionCreateFormValues = {
  minEndingDate: DateTime.now().startOf('month').toISODate(),
  maxEndingDate: DateTime.now().endOf('month').toISODate(),
  nbDays: 1,
  note: '',
};

type Props = {
  open?: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: GenericExtensionCreationPayload) => void;
};

/** A generic dialog handling the creation of mass extension */
const MassExtensionCreateDialog: React.FC<Props> = ({
  open,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = useCallback(
    (values: MassExtensionCreateFormValues) => {
      onSubmit({
        max_ending_date: values.maxEndingDate,
        min_ending_date: values.minEndingDate,
        nb_days: values.nbDays,
        note: values.note,
      });
    },
    [onSubmit],
  );

  return (
    <GenericResponsiveDialog maxWidth="sm" onClose={onClose} open={open}>
      {isLoading && <LinearProgress />}
      <Formik<MassExtensionCreateFormValues>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={MassExtensionCreateFormValidationSchema}
      >
        <MassExtensionCreateForm isLoading={isLoading} onClose={onClose} />
      </Formik>
    </GenericResponsiveDialog>
  );
};

export default React.memo(MassExtensionCreateDialog);
