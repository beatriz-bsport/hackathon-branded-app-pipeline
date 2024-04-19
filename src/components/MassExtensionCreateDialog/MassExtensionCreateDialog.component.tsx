import React, { useCallback } from 'react';

import { Formik } from 'formik';
import moment from 'moment-timezone';
import LinearProgress from '@material-ui/core/LinearProgress';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import MassExtensionCreateForm from './MassExtensionCreateForm.component';

import MassExtensionCreateFormValidationSchema from './MassExtensionCreateFormValidationSchema';

import type {
  MassExtensionCreateFormValues,
  GenericExtensionCreationPayload,
} from './types';

const initialValues: MassExtensionCreateFormValues = {
  minEndingDate: moment().startOf('month').format('YYYY-MM-DD'),
  maxEndingDate: moment().endOf('month').format('YYYY-MM-DD'),
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
