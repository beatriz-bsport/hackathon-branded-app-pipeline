import React from 'react';
import { useTranslation } from 'react-i18next';
import { withFormik, FormikProps, ErrorMessage } from 'formik';

import * as Yup from 'yup';

import ModalConfirm from '#src/components/ModalConfirm.component';
// @ts-expect-error js file
import { TextField } from '#src/components/forms';
import Typography from '@material-ui/core/Typography/Typography';
import { REPORT_NAME_MAX_LENGTH } from '#src/libs/reporting/common/constants';

type Props = {
  handleCancel: () => void;
  open: boolean;
};

type InitialValues = { reportName: string };

type FormikHOCProps = {
  onSubmit: (name: string) => void;
};

const ReportDetailCreateModalSchema = Yup.object().shape({
  reportName: Yup.string()
    .required('reportCreateModal.error')
    .max(REPORT_NAME_MAX_LENGTH, 'reportCreateModal.maxLength'),
});

const ReportDetailCreateModal: React.FC<Props & FormikProps<InitialValues>> = ({
  handleCancel,
  handleSubmit,
  open,
  errors,
}) => {
  const { t } = useTranslation('reporting');

  const handleMessageRendering = React.useCallback(
    (message: string) => (
      <Typography color="error" variant="body2">
        {t(message)}
      </Typography>
    ),
    [t],
  );

  const handleConfirm = React.useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <ModalConfirm
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
      open={open}
      options={{ title: t('reportCreateModal.title') }}
    >
      <TextField
        fullWidth
        required
        error={!!errors?.reportName}
        label={t('reportCreateModal.inputLabel')}
        name="reportName"
        variant="outlined"
      />
      <ErrorMessage name="reportName" render={handleMessageRendering} />
      <Typography variant="body1">{t('reportCreateModal.content')}</Typography>
    </ModalConfirm>
  );
};

const ReportCreateModalHOC = withFormik<Props & FormikHOCProps, InitialValues>({
  mapPropsToValues: () => {
    return { reportName: '' };
  },
  validationSchema: ReportDetailCreateModalSchema,
  handleSubmit: (values, { props: { onSubmit } }) => {
    onSubmit(values.reportName);
  },
});

export default ReportCreateModalHOC(React.memo(ReportDetailCreateModal));
