import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import { withFormik, FormikProps, useFormikContext, Form } from 'formik';

import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
// @ts-expect-error
import { TextField, SwitchField } from '#components/forms';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

import type { Cadence } from '#libs/sequential_marketing/types';
import type { OptionCallback } from '../../../../state/types';

export type ComponentProps = {
  onCancel: () => void;
  open: boolean;
  loading: boolean;
  initial?: Cadence;
  displayParametersSection?: boolean;
};

export type FormProps = {
  initial?: Cadence;
  onSubmit: (data: Values, options: OptionCallback) => void;
};

export type Values = {
  id?: number;
  name: string;
  is_multiple_visit_allowed?: boolean;
};

type FormikValues = FormikProps<Values>;

export const CadenceCreateAndUpdateForm: React.FC<ComponentProps> = React.memo(
  ({ open, onCancel, loading, initial, displayParametersSection }) => {
    const { t } = useTranslation('marketing');
    const classes = useStyles();
    const {
      isSubmitting,
      isValid,
      handleSubmit,
    }: FormikValues & { handleSubmit: () => void } = useFormikContext();

    const title = useMemo(() => {
      if (!displayParametersSection) {
        return initial?.id && initial?.name
          ? t('audience.form.formTitle.updateNameTitle')
          : t('audience.form.formTitle.createTitle');
      }
      return t('audience.form.formTitle.updateTitle');
    }, [initial, t, displayParametersSection]);

    const submitButtonText = useMemo(
      () =>
        initial?.id && initial?.name
          ? t('cadence.form.updateSubmit')
          : t('cadence.form.submit'),
      [initial, t],
    );

    return (
      <GenericResponsiveDialog maxWidth="sm" open={open}>
        {loading && <LinearProgress />}
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Form>
            <TextField
              fullWidth
              required
              label={t('audience.form.audienceNameLabel')}
              name="name"
              variant="outlined"
            />
            {displayParametersSection && (
              <div className={classes.parametersSection}>
                <div className={classes.parametersTitleContainer}>
                  <SettingsIcon />
                  <Typography className={classes.parametersTitle} variant="h6">
                    {t('audience.form.cadenceParameters')}
                  </Typography>
                </div>
                <SwitchField
                  helperText={t('audience.form.multipleVisit.helperText')}
                  label={t(
                    'audience.form.multipleVisit.isMultipleVisitAllowedLabel',
                  )}
                  name="is_multiple_visit_allowed"
                />
              </div>
            )}
            <DialogActions>
              <Button onClick={onCancel}>{t('cadence.form.cancel')} </Button>

              <Button
                color="primary"
                disabled={isSubmitting || !isValid || loading}
                onClick={handleSubmit}
                variant="contained"
              >
                {isSubmitting ? <CircularProgress /> : submitButtonText}
              </Button>
            </DialogActions>
          </Form>
        </DialogContent>
      </GenericResponsiveDialog>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  parametersSection: {
    paddingTop: theme.spacing(2),
  },
  parametersTitleContainer: {
    display: 'flex',
    flexdirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
  },
  parametersTitle: {
    '&:first-letter': {
      textTransform: 'capitalize',
    },
  },
}));
const CadenceCreationSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  name: Yup.string().required(),
});

const formikFormWrapper = withFormik<ComponentProps & FormProps, Values>({
  mapPropsToValues: ({
    initial,
    displayParametersSection,
  }: ComponentProps & FormProps) => {
    if (initial) {
      return {
        id: initial.id,
        name: initial.name,
        ...(displayParametersSection
          ? { is_multiple_visit_allowed: initial.is_multiple_visit_allowed }
          : {}),
      };
    }
    return {
      id: null,
      name: '',
      ...(displayParametersSection ? { is_multiple_visit_allowed: false } : {}),
    };
  },
  enableReinitialize: true,
  validationSchema: CadenceCreationSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting, resetForm }) => {
    onSubmit(values, {
      onSuccess: () => {
        setSubmitting(false);
        resetForm();
      },
      onError: () => setSubmitting(false),
    });
  },
});
export default React.memo(formikFormWrapper(CadenceCreateAndUpdateForm));
