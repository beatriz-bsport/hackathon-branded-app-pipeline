import React from 'react';
import { useTranslation } from 'react-i18next';
import { withFormik, FormikProps, ErrorMessage } from 'formik';
import { makeStyles } from '@material-ui/core';

import * as Yup from 'yup';

import ModalConfirm from '#src/components/ModalConfirm.component';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { REPORT_NAME_MAX_LENGTH } from '#src/libs/reporting/common/constants';
import { useCheckIsNameAlreadyUsed } from '#src/libs/reporting/v2/hooks';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';

type Props = {
  categoryName: ReportCategoryEnum;
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
  categoryName,
  errors,
  handleCancel,
  handleSubmit,
  open,
  values,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();
  const handleMessageRendering = React.useCallback(
    (message: string) => (
      <Typography color="error" variant="body2">
        {t(message)}
      </Typography>
    ),
    [t],
  );

  const { isNameChecking, handleOnChange } = useCheckIsNameAlreadyUsed(
    'reportName',
    categoryName,
  );

  const handleConfirm = React.useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <ModalConfirm
      disableConfirm={!!errors?.reportName || isNameChecking}
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
      open={open}
      options={{ title: t('reportCreateModal.title') }}
    >
      <div className={classes.modalContent}>
        <div>
          <TextField
            fullWidth
            required
            error={!!errors?.reportName}
            label={t('reportCreateModal.inputLabel')}
            name="reportName"
            onChange={handleOnChange}
            value={values.reportName}
            variant="outlined"
          />
          <ErrorMessage name="reportName" render={handleMessageRendering} />
        </div>
        <Typography variant="body1">
          {t('reportCreateModal.content')}
        </Typography>
      </div>
    </ModalConfirm>
  );
};

const useStyles = makeStyles((theme) => ({
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

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
