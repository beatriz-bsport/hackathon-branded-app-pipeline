import { useFormikContext, withFormik } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DialogTitle } from '@material-ui/core';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import type { Establishment } from '#src/libs/establishment/types';
import { PartnershipIdentifier } from '#src/libs/partnership/types';
import FormDialogContent from './components/FormContent.component';
import SuccessDialogContent from './components/SuccessContent.component';
import { PartnershipConfigurationValidationSchema } from './validationSchema';

type Props = {
  partnershipIdentifier: PartnershipIdentifier;
  establishmentIdsLinked: number[];
  establishments: Establishment[];
  externalId?: string;
  isCreation: boolean;
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
};

export type FormValues = {
  externalId?: string;
  establishmentIds: number[];
};

type HOCProps = Props & FormValues;

const MyClubsConfigurationDialog: React.FC<Props> = ({
  partnershipIdentifier,
  establishmentIdsLinked,
  establishments,
  externalId,
  isCreation,
  isLoading = false,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation('partnership');
  const { values, resetForm } = useFormikContext<FormValues>();

  const isCreateSuccess = useMemo(
    () => isCreation && !!externalId,
    [isCreation, externalId],
  );

  const title = useMemo(
    () =>
      isCreation
        ? t('myclubs.configuration.dialog.title.creation')
        : t('myclubs.configuration.dialog.title.edition'),
    [isCreation, t],
  );

  const handleCloseDialog = React.useCallback(() => {
    onClose();

    /** When the dialog closes, MUI applies a 300ms fade-out transition.
     * To prevent resetting the data before the dialog fully disappears,
     * we add a 300ms timeout for the data reset.
     * This ensures a smooth visual experience. */
    setTimeout(resetForm, 300);
  }, [onClose, resetForm]);

  const handleSubmitForm = React.useCallback(() => {
    onSubmit(values);
  }, [onSubmit, values]);

  return (
    <GenericResponsiveDialog
      maxWidth="sm"
      onClose={handleCloseDialog}
      open={isOpen}
    >
      <DialogTitle>{title}</DialogTitle>
      {isCreateSuccess ? (
        <SuccessDialogContent
          externalId={externalId!}
          onClose={handleCloseDialog}
          partnershipIdentifier={partnershipIdentifier}
        />
      ) : (
        <FormDialogContent
          establishmentIdsLinked={establishmentIdsLinked}
          establishments={establishments}
          isCreation={isCreation}
          isLoading={isLoading}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitForm}
          partnershipIdentifier={partnershipIdentifier}
        />
      )}
    </GenericResponsiveDialog>
  );
};

const withFormikWrapper = withFormik<HOCProps, FormValues>({
  enableReinitialize: true,
  validateOnMount: true,
  validationSchema: PartnershipConfigurationValidationSchema,
  mapPropsToValues: ({ establishmentIds }) => ({
    externalId: '',
    establishmentIds: establishmentIds || [],
  }),
  handleSubmit: (_values, { setSubmitting }) => {
    setSubmitting(false);
  },
});

export default React.memo(withFormikWrapper(MyClubsConfigurationDialog));
